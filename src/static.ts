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
  FileSource,
  MetadataEditApi,
  MetaScryPluginApi,
  ContextlessMetadataEditApiMethods
} from "./api";
import { ParseFilePathFromSource } from "./utilities";
import { TFile } from "obsidian";

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
   * Access to the Metaedit Api
   * (Write access)
   */
  static get MetadataEditApi(): MetadataEditApi {
    const plugin = InternalStaticMetadataScrierPluginContainer.Instance;

    return {
      ...InternalStaticMetadataScrierPluginContainer.BaseMetadataEditApi,
      setAllFrontmatter: (key, source) =>
        OpdMetadataEditLibrary.updateFrontmatter(key, InternalStaticMetadataScrierPluginContainer._parseSource(source), plugin),
      getFieldFromTFile: (key, source, inline) =>
        getFieldFromTFile(key, InternalStaticMetadataScrierPluginContainer._parseSource(source), plugin, inline),
      doesFieldExistInTFile: (key, source, inline) =>
        doesFieldExistInTFile(key, InternalStaticMetadataScrierPluginContainer._parseSource(source), plugin, inline),
      insertFieldInTFile: (key, value, source, inline) =>
        insertFieldInTFile(key, value, InternalStaticMetadataScrierPluginContainer._parseSource(source), plugin, inline),
      updateFieldInTFile: (key, value, source, inline) =>
        updateFieldInTFile(key, value, InternalStaticMetadataScrierPluginContainer._parseSource(source), plugin, inline),
      updateOrInsertFieldInTFile: (key, value, source, inline) =>
        updateOrInsertFieldInTFile(key, value, InternalStaticMetadataScrierPluginContainer._parseSource(source), plugin, inline),
      deleteFieldInTFile: (key, source, inline) =>
        deleteFieldInTFile(key, InternalStaticMetadataScrierPluginContainer._parseSource(source), plugin, inline)
    };
  }

  static _parseSource = (source: FileSource | undefined): TFile =>
    InternalStaticMetadataScrierPluginContainer.Instance.Api.file(typeof source === "object"
      ? ParseFilePathFromSource(source) || InternalStaticMetadataScrierPluginContainer.Instance.Api.Current.pathex
      : source || InternalStaticMetadataScrierPluginContainer.Instance.Api.Current.pathex) as TFile;

  /**
   * Access to the Dataview Api
   * (Read access and Data display)
   */
  static get DataviewApi(): DataviewApi {
    return getAPI() as DataviewApi;
  }

  /**
   * The base methods for MetadataEditApi and CurrentNoteMetadataEditApi
   */
  static get BaseMetadataEditApi() : ContextlessMetadataEditApiMethods {
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
    }
  }
}
