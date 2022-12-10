import { InputFieldMarkdownRenderChildType } from "./_external_sources/meta-bind";

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
  splayKebabCaseProperties: SplayKebabCasePropertiesOptions;

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

export enum PropertyNamingConventions {
  /**
   * cleaned input key is included in output
   */
  Cleaned = 1,

  /**
   * untouched input key is included in output
   */
  Uncleaned = 2,

  /**
   * (Cleaned) lowercase version of the key is returned
   */
  LowerCase = 4,

  /**
   * (Cleaned) lowerCamelCase version of the key is returned
   */
  LowerCamelCase = 8,

  /**
   * (Cleaned) DowerCamelCase version of the key is returned.
   * This maintains whatever the fist key is, upper or lower case.
   */
  DefaultCamelCase = 16,

  /**
   * (Cleaned) kebab-case (w/ all lowercase) version of the key is returned
   */
  KebabCase = 32,

  /**
   * Default (All) options
   */
  All = Cleaned | Uncleaned | LowerCase | LowerCamelCase | DefaultCamelCase | KebabCase
}

/**
 * Enum for the kebab splay settings options
 */
export enum SplayKebabCasePropertiesOptions {

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
 * Settings used for the Binding Api
 */
export type BindSettings = {
  templateName?: string;
  renderMode?: InputFieldMarkdownRenderChildType | 'inline' | 'block' | 'div' | 'span',
  recurseFrontmatterFields?: boolean,
  returnAbstractField?: boolean,
  callOnLoad?: true | boolean
} & Object

/**
 * Passed into any update functions to modify what they do.
 */
export interface FrontmatterUpdateSettings extends MetadataEditorSettings {
   /**
   * set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   */
  toValuesFile?: false | boolean | string;
  /**
   * set this to true if the path is a data prototype file path and you want to set to said data prototype file.You can also pass in the path here instead.
   */
  prototype?: false | string | boolean;
}

/**
 * Settings for the metadata editor api functions
 */
export interface MetadataEditorSettings {
  /**
   * (Not Yet Implemented) if this is for an inline dataview field.
   *
   * // TODO: update the inline variable descriptions when functionality is added to opd-metadata-lib.
   */
  inline?: false | boolean
}

/**
 * Settings passable into any of the data fetcher methods.
 */
export interface DataFetcherSettings {
  /**
   * Flatten the record results, bringing all results up to the root Record as opposed to returning just a tree.
   */
  flatten?: false | boolean;
}

export interface PromisedDataFetcherSettings extends DataFetcherSettings {
  /**
   * Flattens all promises into a single promise, and wraps the result list in it.
   *
   * // TODO: implement
   */
  asASinglePromise?: boolean; 
}