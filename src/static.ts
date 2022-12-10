import { DataviewApi, getAPI } from "obsidian-dataview";
import {
  getFieldFromTFile,
  doesFieldExistInTFile,
  insertFieldInTFile,
  updateFieldInTFile,
  updateOrInsertFieldInTFile,
  deleteFieldInTFile
} from "@opd-libs/opd-metadata-lib/lib/API";
import { Internal as OpdMetadataEditLibrary } from "@opd-libs/opd-metadata-lib/lib/Internal";
import {
  MetaEditApi,
  ContextlessMetadataEditApiMethods
} from "./types/editing/editor";
import { AppWithPlugins, MetaScryPluginApi } from "./types/plugin";
import { MetaScryPluginSettings } from "./types/settings";
import {
  ContainsDeepProperty,
  GetDeepProperty,
  IsFunction,
  IsObject,
  ParsePathFromNoteSource,
  Path,
  SetDeepProperty,
  Splay,
  TryToGetDeepProperty
} from "./utilities";
import { TFile } from "obsidian";
import { NotesSource } from "./types/fetching/sources";
import { MetaBindPlugin } from "./types/_external_sources/meta-bind";
import { Keys } from "./constants";
import { ReactMarkdownComponents } from "./components/markdown";
import { ReactSectionComponents } from "./components/sections";
import { MetadataScrier } from "./fetching/scrier";
import { MetaScryApi } from "./types/fetching/scrier";
import { MetaScry } from "./types/static";

/**
 * Static container for the current meta-scry plugin instance.
 * For Internal use. The name is dumb so you don't want to use it anyway.
 * 
 * Internal Static Metadata Scrier Plugin Container
 *
 * @internal
 */
export class InternalStaticMetadataScrierPluginContainer {
  static _api: MetaScryApi;
  static _plugin?: MetaScryPluginApi;
  static _defaultSettings?: MetaScryPluginSettings;
  static _static: MetaScry;

  /**
   * The key for the plugin.
   */
  static get Key(): string {
    return Keys.MetadataScrierPluginKey;
  }

  /**
   * The current instance of the Metadata Scry Plugin.
   */
  static get Plugin(): MetaScryPluginApi {
    return InternalStaticMetadataScrierPluginContainer._plugin!;
  }

  /**
   * The current instance of the Static Metadata Scry Api.
   */
  static get Static(): MetaScry {
    return InternalStaticMetadataScrierPluginContainer._static;
  }

  /**
   * The current instance of the MetadataScryApi api
   */
  static get Api(): MetaScryApi {
    return InternalStaticMetadataScrierPluginContainer._api;
  }

  /**
   * The current settings instance.
   */
  static get Settings(): MetaScryPluginSettings {
    return InternalStaticMetadataScrierPluginContainer.Plugin?.settings
      || InternalStaticMetadataScrierPluginContainer._defaultSettings!;
  }

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
  static get MetaBindApi(): MetaBindPlugin {
    return (app as AppWithPlugins)
      .plugins
      .plugins
    [Keys.MetaBindWithApiPluginKey]!;
  }

  /**
   * Access to the Metaedit Api
   * (Write access)
   */
  static get MetadataEditApi(): MetaEditApi {
    const plugin = InternalStaticMetadataScrierPluginContainer.Plugin;

    // TODO: encapsulate this in a class for efficiency
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
      getFieldFromTFile: (key, source, options) =>
        getFieldFromTFile(
          key,
          InternalStaticMetadataScrierPluginContainer._parseSource(source),
          plugin,
          options?.inline
        ),
      doesFieldExistInTFile: (key, source, options) =>
        doesFieldExistInTFile(
          key,
          InternalStaticMetadataScrierPluginContainer._parseSource(source),
          plugin,
          options?.inline
        ),
      async insertFieldInTFile(key, value, source, options) {
        const file = InternalStaticMetadataScrierPluginContainer._parseSource(source);

        if (IsFunction(value)) {
          value = value();
        }

        await insertFieldInTFile(
          key,
          value,
          file,
          plugin,
          options?.inline
        );

        return options?.inline ? value : this.getMetadataFromFileCache(file, plugin);
      },
      async updateFieldInTFile(key, value, source, options) {
        const file = InternalStaticMetadataScrierPluginContainer._parseSource(source);

        if (IsFunction(value)) {
          value = value(this.getFieldFromTFile(key, source, options));
        }

        await updateFieldInTFile(
          key,
          value,
          file,
          plugin,
          options?.inline
        );

        return options?.inline
          ? value
          : this.getMetadataFromFileCache(file, plugin);
      },
      async updateOrInsertFieldInTFile(key, value, source, options) {
        const file = InternalStaticMetadataScrierPluginContainer._parseSource(source);

        if (IsFunction(value)) {
          if (this.doesFieldExistInTFile(key, source, options)) {
            value = value(this.getFieldFromTFile(key, source, options));
          } else {
            value = value();
          }
        }

        await updateOrInsertFieldInTFile(
          key,
          value,
          file,
          plugin,
          options?.inline
        );

        return options?.inline
          ? value
          : this.getMetadataFromFileCache(file, plugin);
      },
      async deleteFieldInTFile(key, source, options) {
        const file = InternalStaticMetadataScrierPluginContainer._parseSource(source);

        await deleteFieldInTFile(
          key,
          file,
          plugin,
          options?.inline
        );

        return options?.inline
          ? undefined
          : this.getMetadataFromFileCache(file, plugin);
      }
    };
  }

  static _parseSource = (source: NotesSource | undefined): TFile =>
    InternalStaticMetadataScrierPluginContainer.Api.file(IsObject(source)
      ? ParsePathFromNoteSource(source as object) || InternalStaticMetadataScrierPluginContainer.Api.Current.pathex
      : source || InternalStaticMetadataScrierPluginContainer.Api.Current.pathex) as TFile;

  /**
   * The base methods for MetadataEditApi and CurrentNoteMetadataEditApi
   */
  static get BaseMetadataEditApiMethods(): ContextlessMetadataEditApiMethods {
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

  static InitalizeStaticApi({
    includeReactComponents = true,
    plugin,
    defaultSettings
  }: {
    includeReactComponents?: boolean;
    plugin?: MetaScryPluginApi;
    defaultSettings?: MetaScryPluginSettings;
  } = {}): MetaScry {
    InternalStaticMetadataScrierPluginContainer._plugin = plugin || (app as AppWithPlugins).plugins.plugins["meta-scry"];
    InternalStaticMetadataScrierPluginContainer._defaultSettings = defaultSettings;
    InternalStaticMetadataScrierPluginContainer._api = new MetadataScrier();

    const apiFunctionsAndPlugin = {
      Api: InternalStaticMetadataScrierPluginContainer._api,
      Plugin: plugin,
      Path,
      Splay,
      ContainsDeepProperty,
      TryToGetDeepProperty,
      SetDeepProperty,
      GetDeepProperty,
      DefaultSources: InternalStaticMetadataScrierPluginContainer._api.defaultSources
    };
    const staticApi: MetaScry
      // if we have react, we want to add the components to the api.
      = includeReactComponents
        ? {
          ...apiFunctionsAndPlugin,
          ...ReactSectionComponents,
          ...ReactMarkdownComponents,
          Components: {
            ...ReactSectionComponents.Components,
            ...ReactMarkdownComponents.Components
          },
          SectionComponents: ReactSectionComponents.Components,
          MarkdownComponents: ReactMarkdownComponents.Components,
          DefaultSources: MetadataScrier.DefaultSources
        } : apiFunctionsAndPlugin;

    InternalStaticMetadataScrierPluginContainer._static = staticApi;

    return InternalStaticMetadataScrierPluginContainer._static;
  }

  static ClearApi(): void {
    InternalStaticMetadataScrierPluginContainer._api = undefined!;
    InternalStaticMetadataScrierPluginContainer._defaultSettings = undefined!;
    InternalStaticMetadataScrierPluginContainer._plugin = undefined!;
    InternalStaticMetadataScrierPluginContainer._static = undefined!;
  }
}
