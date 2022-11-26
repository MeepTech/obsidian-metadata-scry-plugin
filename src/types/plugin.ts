import {
  App,
  Plugin
} from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import {
    CopyToHtmlPluginKey,
    DataviewPluginKey,
    MetaBindWithApiPluginKey,
  MetadataScrierPluginKey, ReactComponentsPluginKey} from "../constants";
import { CopyToHtmlPlugin } from "./external/copy-to-html";
import { MetaBindPlugin } from "./external/meta-bind";
import { MetaScryApi } from "./scrier";

/**
 * Enum for the kebab splay settings options
 */
export enum SplayKebabCasePropertiesOption {
  /**
   * Only use original keys
   */
  Disabled = 0,
  /**
   * Splits into only lower camel case
   */
  Lowercase = 1,
  /**
   * Splits only into upper camel case
   */
  CamelCase = 2,
  /**
   * Split into loweCamel and Upper/UntouchedCamelCase
   */
  LowerAndCamelCase = 3
}

/**
 * Internalish Extension to the App with the plugins because it's missing for some reason
 */
export type AppWithPlugins = {
  plugins: {
    enabledPlugins: Set<string>;	
    disablePlugin(key: string): void;
    plugins: {
      [MetadataScrierPluginKey]?: MetaScryPluginApi;
      [ReactComponentsPluginKey]?: Plugin;
      // TODO: remove this plugin field when all of these are moved to npm packages:      
      [MetaBindWithApiPluginKey]?: MetaBindPlugin;
      // TODO: remove this plugin field when all of these are moved to npm packages:      
      [CopyToHtmlPluginKey]?: CopyToHtmlPlugin;
    };
  };
} & App;

/**
 * Interface for the plugin itself
 */
export type MetaScryPluginApi = {

  /**
   * Get the current instance of the MetaScryApi object.
   *
   * @alias {@link MetadataScrier.Api}
   * @alias {@link MetaScryPluginApi.api}
   * @alias {@link MetadataScrierPlugin.Instance}
   * @alias {@link global#scry}
   */
  get Api(): MetaScryApi;

  /**
   * Get the current instance of the MetaScryApi object.
   *
   * @alias {@link MetadataScrier.Api}
   * @alias {@link MetaScryPluginApi.Api}
   * @alias {@link MetadataScrierPlugin.Instance}
   * @alias {@link global#scry}
   */
  get api(): MetaScryApi;

  /**
   * The key for this plugin.
   *
   * @alias {@link MetadataScrierPluginKey}
   * @alias {@link MetadataScrierPlugin.Key}
   */
  get key(): string;

  /**
   * The settings for the api.
   * Call saveSettings if you want to update this
   */
  get settings(): MetaScryPluginSettings;

  /**
   * Call after updating the settings object to re-load the api
   */
  updateSettings(newSettings: MetaScryPluginSettings): void;

  /**
   * Get a global value if it exists.
   *
   * @param {string} key
   *
   * @alias {@link MetaScryApi.globals}
   *
   * @see {@link tryToSetExtraGlobal}
   */
  tryToGetExtraGlobal(key: string): any | undefined;

  /**
   * Set a global value (or remove it)
   *
   * @param {string} key
   * @param {any} setValue (optional) the value to set. Will remove the value if nothing is passed in.
   *
   * @alias {@link MetaScryApi.globals}
   *
   * @see {@link tryToGetExtraGlobal}
   */
  tryToSetExtraGlobal(key: string, setValue?: any): boolean;
} & Plugin;

/**
 * Interface for the plugin settings
 */
export interface MetaScryPluginSettings {
  /**
  * A comma seperated list of the global property keys for the global 'cache' variable
   */
  globalCacheNames: string;

  /**
   * A comma seperated list of the global property keys for the global 'meta' variable
   */
  globalMetaScryExtraNames: string;

  /**
   * A comma seperated list of he global property keys for the global 'path' function
   */
  globalPathFunctionNames: string;

  /**
   * A comma seperated list of the global property keys for the global 'my'/CurrentFileMetaScryApi variable
   */
  globalCurrentFilePropertyNames: string;

  /**
   * Option to enable or disable the scry and Scry global api variables
   */
  defineScryGlobalVariables: boolean;

  /**
   * if hasprop, getprop, and setprop should be added to all objects
   */
  defineObjectPropertyHelperFunctions: boolean;

  /**
   * if array helper functions like aggegateBy should be added to all arrays
   */
  defineArrayHelperFunctions: boolean;

  /**
   * if kebab-case properties should be splayed, and how.
   */
  splayKebabCaseProperties: SplayKebabCasePropertiesOption;

  /**
   * If frontmatter should be splayed even if DV isn't used to fetch.
   */
  splayFrontmatterWithoutDataview: boolean;

  /**
   * Path for prototype data files
   */
  prototypesPath: string;

  /**
   * Path for value data files
   */
  valuesPath: string;
}

