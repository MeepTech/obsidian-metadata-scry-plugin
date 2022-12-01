import { MetaScryPluginApi } from "./plugin";
import { MetadataSources } from "./fetching/sources";
import { MetaScryApi } from "./fetching/scrier";

/**
 * A container for access to the whole Api and other features like components and utilities too.
 */

export interface MetaScry {

  /**
   * React components and other special functions are stored under this as a namespace
   */
  readonly [key: string | number | symbol]: any;

  /**
   * You can access all built-in react components from this property.
   */
  readonly Components?: Record<string, React.Component | React.FC>;

  /**
   * React components specific to Sections and the Section Api
   */
  readonly SectionComponents?: Record<string, React.Component | React.FC>;

  /**
   * The Api Itself
   */
  readonly Api: MetaScryApi;

  /**
   * The currently active plugin.
   */
  readonly Plugin?: MetaScryPluginApi;

  /**
   * Default Metadata Sources
   */
  readonly DefaultSources: MetadataSources;

  /**
   * Turn a relative path into a full path
   *
   * @param relativePath The relative path to map to. Will preform immediate search if it starts with ?.
   * @param extension The extension to add. Defaults to no extension (false/empty). If true is passed in .md will be added.
   * @param rootFolder (Optional) The root folder path the relative path is relative too. Defaults to the current note's folder
   *
   * @returns The full file path.
   */
  Path(relativePath?: string, extension?: string | boolean, rootFolder?: string): string;

  /**
   * Find a deep property in an object.
   *
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {object} onObject The object containing the desired key
   *
   * @returns true if the property exists, false if not.
   */
  ContainsDeepProperty(propertyPath: string | Array<string>, onObject: any): boolean;

  /**
   * Get a deep property in an object, null if not found.
   *
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {object} fromObject The object containing the desired key
   *
   * @returns The found deep property, or null if not found.
   */
  GetDeepProperty(propertyPath: string | Array<string>, fromObject: any): any | null;

  /**
   * Get a deep property in an object, null if not found.
   *
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {{onTrue:function(object), onFalse:function()}|function(object)|[function(object), function()]} thenDo A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
   * @param {object} fromObject The object containing the desired key
   *
   * @returns if the property exists.
   */
  TryToGetDeepProperty(propertyPath: string | Array<string>, thenDo: any, fromObject: any): boolean;

  /**
   * Set a deep property in an object, even if it doesn't exist.
   *
   * @param {string|[string]} propertyPath Array of keys, or dot seperated propery key.
   * @param {object|function(object)} value The value to set, or a function to update the current value and return it.
   * @param {object} fromObject The object containing the desired key
   *
   * @returns The found deep property, or null if not found.
   */
  SetDeepProperty(propertyPath: string | Array<string>, value: any, onObject: any): void;
}
