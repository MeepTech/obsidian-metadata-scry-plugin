import { MetaScryPluginApi } from "./plugin";
import { MetadataSources } from "./fetching/sources";
import { MetaScryApi } from "./fetching/scrier";
import { ThenDoCallback } from "./datas";

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
   * @param path Array of keys, or dot seperated propery key."
   * @param onObject The object containing the desired key
   *
   * @returns true if the property exists, false if not.
   */
  ContainsDeepProperty(path: string | Array<string>, onObject: any): boolean;

  /**
   * Get a deep property in an object, null if not found.
   *
   * @param path Array of keys, or dot seperated propery key."
   * @param fromObject The object containing the desired key
   *
   * @returns The found deep property, or null if not found.
   */
  GetDeepProperty(path: string | Array<string>, fromObject: any): any | undefined;

  /**
   * Get a deep property in an object, null if not found.
   *
   * @param path Array of keys, or dot seperated propery key."
   * @param fromObject The object containing the desired key
   * @param thenDo A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
   *
   * @returns if the property exists.
   */
  TryToGetDeepProperty(path: string | Array<string>, fromObject: any, thenDo?: ThenDoCallback): boolean;

  /**
   * Set a deep property in an object, even if it doesn't exist.
   *
   * @param path Array of keys, or dot seperated propery key.
   * @param value The value to set, or a function to update the current value and return it.
   * @param onObject The object containing the desired key
   * @param valueFunctionIsNotTheValueAndIsUsedToFetchTheValue If this is true, and the value passed in is a function, this will execute that function with no parameters to try to get the value. (defautls to true)
   */
  SetDeepProperty(path: string | Array<string>, value: any, onObject: any, valueFunctionIsNotTheValueAndIsUsedToFetchTheValue?: true | boolean): void;
}
