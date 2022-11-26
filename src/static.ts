import { DataviewApi, getAPI } from "obsidian-dataview";
import {
  getFieldFromTFile,
  doesFieldExistInTFile,
  insertFieldInTFile,
  updateFieldInTFile,
  updateOrInsertFieldInTFile,
  deleteFieldInTFile
} from "@opd-libs/opd-metadata-lib/lib/API";
import {Internal as OpdMetadataEditLibrary} from "@opd-libs/opd-metadata-lib/lib/Internal";
import {
  MetadataEditApi,
  ContextlessMetadataEditApiMethods
} from "./types/editor";
import { AppWithPlugins, MetaScryPluginApi } from "./types/plugin";
import { IsFunction, IsObject, ParseFilePathFromSource } from "./utilities";
import { TFile } from "obsidian";
import { NotesSource } from "./types/sources";
import { MetaBindPlugin } from "./types/external/meta-bind";
import { MetaBindWithApiPluginKey } from "./constants";

/**
 * Static container for the current meta-scry plugin instance.
 * For Internal use. The name is dumb so you don't want to use it anyway.
 * 
 * Internal Static Metadata Scrier Plugin Container
 */

export class InternalStaticMetadataScrierPluginContainer {

  /**
   * The current instance of the Metadata Scry Api Plugin.
   */
  static Instance: MetaScryPluginApi;

  /**
   * Access to the Dataview Api
   * (Read access and Data display)
   */
  static get DataviewApi(): DataviewApi {
    return getAPI() as DataviewApi;
  }

  /**
   * Access to the Meta-Bind Api
   * (Binding of Input Fields)
   */
  static get MetaBindApi() : MetaBindPlugin {
    return (app as AppWithPlugins)
      .plugins
      .plugins
      [MetaBindWithApiPluginKey]!;
  }

  /**
   * Access to the Metaedit Api
   * (Write access)
   */
  static get MetadataEditApi(): MetadataEditApi {
    const plugin = InternalStaticMetadataScrierPluginContainer.Instance;

    return {
      ...InternalStaticMetadataScrierPluginContainer.BaseMetadataEditApiMethods,
      setAllFrontmatter: async (value, source) => {
        await OpdMetadataEditLibrary.updateFrontmatter(
          value,
          InternalStaticMetadataScrierPluginContainer._parseSource(source),
          plugin
        );

        return value;
      },
      getFieldFromTFile: (key, source, inline) => 
        getFieldFromTFile(
          key,
          InternalStaticMetadataScrierPluginContainer._parseSource(source),
          plugin,
          inline
        ),
      doesFieldExistInTFile: (key, source, inline) =>
        doesFieldExistInTFile(
          key,
          InternalStaticMetadataScrierPluginContainer._parseSource(source),
          plugin,
          inline
        ),
      async insertFieldInTFile(key, value, source, inline) {
        const file = InternalStaticMetadataScrierPluginContainer._parseSource(source);

        if (IsFunction(value)) {
          value = value();
        }

        await insertFieldInTFile(
          key,
          value,
          file,
          plugin,
          inline
        );

        return inline ? value : this.getMetadataFromFileCache(file, plugin);
      },
      async updateFieldInTFile(key, value, source, inline) {
        const file = InternalStaticMetadataScrierPluginContainer._parseSource(source);

        if (IsFunction(value)) {
          value = value(this.getFieldFromTFile(key, source, inline));
        }

        await updateFieldInTFile(
          key,
          value,
          file,
          plugin,
          inline
        );

        return inline
          ? value
          : this.getMetadataFromFileCache(file, plugin);
      },
      async updateOrInsertFieldInTFile(key, value, source, inline){
        const file = InternalStaticMetadataScrierPluginContainer._parseSource(source);

        if (IsFunction(value)) {
          if (this.doesFieldExistInTFile(key, source, inline)) {
            value = value(this.getFieldFromTFile(key, source, inline));
          } else {
            value = value();
          }
        }

        await updateOrInsertFieldInTFile(
          key,
          value,
          file,
          plugin,
          inline
        );

        return inline
          ? value
          : this.getMetadataFromFileCache(file, plugin);
      },
      async deleteFieldInTFile(key, source, inline) {
        const file = InternalStaticMetadataScrierPluginContainer._parseSource(source);

        await deleteFieldInTFile(
          key,
          file,
          plugin,
          inline
        );

        return inline
          ? undefined
          : this.getMetadataFromFileCache(file, plugin);
      }
    };
  }

  static _parseSource = (source: NotesSource | undefined): TFile =>
    InternalStaticMetadataScrierPluginContainer.Instance.Api.file(IsObject(source)
      ? ParseFilePathFromSource(source as object) || InternalStaticMetadataScrierPluginContainer.Instance.Api.Current.pathex
      : source || InternalStaticMetadataScrierPluginContainer.Instance.Api.Current.pathex) as TFile;

  /**
   * The base methods for MetadataEditApi and CurrentNoteMetadataEditApi
   */
  static get BaseMetadataEditApiMethods() : ContextlessMetadataEditApiMethods {
    return {
      getMetadataFromFileCache: OpdMetadataEditLibrary.getMetadataFromFileCache,
      getMetadataFromFileContent: OpdMetadataEditLibrary.getMetaDataFromFileContent,
      getMetadataFromYaml: OpdMetadataEditLibrary.getMetaDataFromYAML,
      removeFrontmatterFromFileContent: OpdMetadataEditLibrary.removeFrontmatter,
      hasField: OpdMetadataEditLibrary.hasField,
      getField: OpdMetadataEditLibrary.getField,
      deleteField: OpdMetadataEditLibrary.deleteField,
      updateField: OpdMetadataEditLibrary.updateField,
      insertField: OpdMetadataEditLibrary.insertField,
      updateOrInsertField: OpdMetadataEditLibrary.updateOrInsertField
    } as ContextlessMetadataEditApiMethods;
  }
}
