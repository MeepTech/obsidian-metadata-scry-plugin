import { CachedMetadata, TFile, TFolder } from 'obsidian';
import { CurrentMetadata } from "./current";
import { NoteSections } from './sections';
import { PluginContainer, CachedFileMetadata, CurrentApi, DvData, FileData, Frontmatter, MetaData, MetadataApi, MetadataPlugin, MetadataSources, Sections, SplayKebabCasePropertiesOption } from './api';
//TODO: test: import dv = require("../../dataview/main.js");

/**
 * Access and edit metadata about a file from multiple sources.
 */
export class Metadata implements MetadataApi {
  private static _caches: any = {};
  private _plugin: MetadataPlugin;
  private _kebabPropSplayer: (base: any, topLevelPropertiesToIgnore: Array<string> | null) => object;
  private _lowerCaseSplayer: (base: any) => object;

  //#region Initalization
  
  constructor(plugin: MetadataPlugin) {
    this._plugin = plugin;
    this._initializeKebabPropSplayer();
    this._initializePropLowercaseSplayer();
  }

  /**
   * set the splay function for kebab case
   */
  private _initializeKebabPropSplayer() {
    this._kebabPropSplayer = (() => {
      switch (this.plugin.settings.splayKebabCaseProperties) {
        case SplayKebabCasePropertiesOption.Lowercase:
          return (base, topLevelPropertiesToIgnore) => Metadata._recurseOnAllObjectProperties(base, Metadata._splayKebabToLowercase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.CamelCase:
          return (base, topLevelPropertiesToIgnore) => Metadata._recurseOnAllObjectProperties(base, Metadata._splayKebabToLowerCamelcase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.LowerAndCamelCase:
          return (base, topLevelPropertiesToIgnore) => Metadata._recurseOnAllObjectProperties(base, Metadata._splayKebabToLowerAndLowerCamelcase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.Disabled:
        default:
          return base => base;
      }
    })();
  }

  /**
   * set the frontmatter only splay function
   */
  private _initializePropLowercaseSplayer() {
    this._lowerCaseSplayer = this.plugin.settings.splayFrontmatterWithoutDataview
      ? base => Metadata._recurseOnAllObjectProperties(base, Metadata._splayToLowerCase)
      : base => base;
  }

  /**
   * Used to recurse splaying
   */
  private static _recurseOnAllObjectProperties(value: any, fn: (key: string, value: any, data: any | object) => any | object, topLevelPropertiesToIgnore: Array<string> | null = null): any {
    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        return value.map(i => this._recurseOnAllObjectProperties(i, fn));
      } else {
        const data: any = {};
        for (const key of Object.keys(value)) {
          if (topLevelPropertiesToIgnore && topLevelPropertiesToIgnore.contains(key)) {
            data[key] = value[key];
          } else {
            fn(key, this._recurseOnAllObjectProperties(value[key], fn), data);
          }
        }

        return data;
      }
    } else {
      return value;
    }
  }

  private static _splayKebabToLowercase(key: string, value: any, data: any | object): any | object {
    if (key.includes("-")) {
      data[key.replace(/-/g, "").toLowerCase()] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerCamelcase(key: string, value: any, data: any | object): any | object {
    if (key.includes("-")) {
      data[key
        .toLowerCase()
        .split('-')
        .map((part, i) => i !== 0 ? part.charAt(0).toUpperCase() + part.substring(1) : part)
        .join('')] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerAndLowerCamelcase(key: string, value: any, data: any | object): any | object {
    if (key.includes("-")) {
      const lowerKey = key.toLowerCase();
      data[lowerKey.replace(/-/g, "")] = value;
      data[lowerKey
        .split('-')
        .map((part, i) => i !== 0 ? part.charAt(0).toUpperCase() + part.substring(1) : part)
        .join('')] = value;
    }

    data[key] = value;
  }

  private static _splayToLowerCase(key: string, value: any, data: any | object): any | object {
    data[key] = value;
    data[key.toLowerCase()] = value;
  }

  //#endregion
  
  //#region Static Api Access

  /**
   * The instance of the Metadata class
   */
  static get Api(): MetadataApi {
    return PluginContainer.Instance.api;
  }

  /**
   * Access to the Dataview Api
   * (Read access and Data display)
   */
  static get DataviewApi() : any {
    return (app as any)
      .plugins
      .plugins
      .dataview
      .api;
  }

  /**
   * Access to the Metaedit Api
   * (Write access)
   * TODO: can we set these to their specific types?
   */
  static get MetaeditApi() : any {
    return (app as any)
      .plugins
      .plugins
      .metaedit
      .api;
  }

  /**
   * The default sources to pull Metadata values from for a file.
   */
  static get DefaultSources(): MetadataSources {
    return {
      /**
       * The 'file' field containing metadata about the file itself
       */
      FileInfo: true,
      /**
       * The Frontmatter (YAML at the top of a note)
       */
      Frontmatter: true,
      /**
       * Inline Dataview data fields
       */
      DataviewInline: true,
      /**
       * Cached values from the Metadata.Cache in a single field named 'cache'.
       */
      Cache: true,
      /**
       * Sections from the Metadata Cache
       */
      Sections: true
    };
  }

  /**
   * Get the plugin that runs this api
   */
  get Plugin(): MetadataPlugin {
    // @ts-expect-error: app.plugin is not mapped.
    return this.plugin || app.plugins.plugins["metadata-api"];
  }

  /**
   * Get the plugin that runs this api
   */
  get plugin(): MetadataPlugin {
    // @ts-expect-error: app.plugin is not mapped.
    return this._plugin || app.plugins.plugins["metadata-api"];
  }
  
  //#endregion

  //#region Current File Properties

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Current(): CurrentApi {
    return this.current;
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get current(): CurrentApi {
    return new CurrentMetadata(this);
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Data(): MetaData {
    return this.Current.Data;
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get data(): MetaData {
    return this.Current.Data;
  }

  //#endregion
   
  //#region Metadata Fetchers

  /**
   * Used to fetch the "Obsidian Metadata File Cache" object from the obsidian api
   * 
   * @param {object|string} file The file object(with a path property) or the full file path
   *
   * @returns The cached file metadata object if it exists.
   */
  omfc(file: string | TFile | null = null): CachedFileMetadata | null {
    const path = (Metadata.ParseFileName(file) || this.Current.Path) + ".md";
    const fileObject = app.vault.getAbstractFileByPath(path);

    if (!(fileObject instanceof TFile)) {
      throw `Note Not Found: ${path}`;
    }

    const result = (app.metadataCache.getFileCache(fileObject) as CachedFileMetadata) || null;
    if (result !== null) {
      result.path = path;
    }
    
    return result;
  }

  /**
   * Get just the frontmatter for the given file.
   *
   * @param {object|string} file The file object(with a path property) or the full file path
   *
   * @returns Just the frontmatter for the file.
   */
  frontmatter(file: string | TFile | null = null): Frontmatter {
    const fileCache : CachedMetadata | null = this.omfc(file);
    return (fileCache && fileCache.frontmatter)
      ? this._lowerCaseSplayer(this._kebabPropSplayer(fileCache?.frontmatter, null))
      : {};
  }

  /**
   * Get just the sections for the given file.
   *
   * @param {object|string} file The file object(with a path property) or the full file path
   *
   * @returns Just the sections under their headings for the file.
   */
  sections(file: string | TFile | null = null): Sections {
    const fileCache = this.omfc(file);
    return new NoteSections(fileCache?.path, fileCache?.headings);
  }

  /**
   * Get the dataview api values for the given file; Inline, frontmatter, and the file value.
   *
   * @param {object|string} file The file object(with a path property) or the full file path
   *
   * @returns Just the dataview)+frontmatter) values for the file.
   */
  dv(file: string | TFile | null = null): DvData {
    return this._kebabPropSplayer(Metadata
      .DataviewApi
      .page(file ? Metadata.ParseFileName(file) : this.Current.Path), ["file"]) as DvData;
  }

  /**
   * Get just the cache data for a file.
   *
   * @param {object|string} file The file or filename to fetch for.
   *
   * @returns The cache data only for the requested file
   */
  cache(file: string | TFile | null = null): Cache {
    const fileName = Metadata.ParseFileName(file) || this.Current.Path;
    Metadata._caches[fileName] = Metadata._caches[fileName] || {};

    return Metadata._caches[fileName];
  }

  /**
   * Get the desired prototypes
   *
   * @param {string} prototypePath The path to the prototype file desired.
   *
   * @returns An object containing the prototypes in the givne file
   */
  prototypes(prototypePath: string): Frontmatter {
    return this.frontmatter(Metadata.BuildPrototypeFileFullPath(prototypePath));
  }

  /**
   * Get the desired data from value storage
   *
   * @param {string} prototypePath The path to the desired data file.
   *
   * @returns An object containing the frontmatter stored in the given file
   */
  values(dataPath: string): Frontmatter {
    return this.frontmatter(Metadata.BuildDataFileFullPath(dataPath));
  }

  /**
   * Get the Metadata for a given file using the supplied sources.
   *
   * @param {*} file The name of the file or the file object with a path
   * @param {bool|object} sources The sources to get metadata from. Defaults to all.
   *
   * @returns The requested metadata
   */
  get(file: string | TFile | null = null, sources: MetadataSources | boolean = Metadata.DefaultSources): MetaData {
    const fileName = file ? Metadata.ParseFileName(file) : this.Current.Path;
    let values: any = {};

    if (sources === true) {
      values = this._kebabPropSplayer(Metadata
        .DataviewApi
        .page(fileName), ["file"]) || {};
    } else {
      if (sources === false) {
        return {};
      }

      // if we need dv sources
      if (sources.DataviewInline || sources.FileInfo) {
        values = this._kebabPropSplayer(Metadata
          .DataviewApi
          .page(fileName), ["file"]) || {};

        // remove file metadata?
        if (!sources.FileInfo) {
          delete values.file;
        }

        // remove dv inline?
        let frontmatter: object = null!;
        if (!sources.DataviewInline) {
          frontmatter = this.frontmatter(fileName);
          Object.keys(values).forEach(prop => {
            // if it's not a frontmatter prop or the 'file' metadata prop
            if (!frontmatter.hasOwnProperty(prop) && prop != "file") {
              delete values[prop];
            }
          });
        }

        // remove frontmatter?
        if (!sources.Frontmatter) {
          frontmatter = frontmatter || this.frontmatter(fileName);
          Object.keys(frontmatter).forEach(prop => {
            delete values[prop];
          });
        }
      } // just the frontmatter/cache?
      else if (sources.Frontmatter) {
        values = this.frontmatter(fileName);
      }
    }

    // add cache?
    if (sources === true || sources.Cache) {
      values["cache"] = this.cache(fileName);
    }

    return values;
  }

  //#endregion

  //#region Metadata Modifiers

  /**
   * Patch individual properties of the frontmatter metadata.
   *
   * @param {object|string} file The name of the file or the file object with a path
   * @param {*|object} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to patch said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to patch said data prototype file. You can also pass in the path here instead.
   *
   * @returns The updated Metadata.
   */
  patch(file: string | TFile | null, frontmatterData: any, propertyName: string | null = null, toValuesFile: boolean | string = false, prototype: string | boolean = false): void {
    if (prototype && toValuesFile) {
      throw "Cannot patch toValuesFile and prototype at the same time.";
    }

    const { update } = Metadata.MetaeditApi;
    const fileName = Metadata._parseFileNameFromDataFileFileOrPrototype(toValuesFile, file, prototype);

    if (propertyName != null) {
      update(propertyName, frontmatterData, fileName);
    } else {
      Object.keys(frontmatterData).forEach(propertyName => update(propertyName, frontmatterData[propertyName], fileName));
    }
  }

  /**
   * Replace the existing frontmatter of a file with entirely new data, clearing out all old data in the process.
   *
   * @param {object|string} file The name of the file or the file object with a path
   * @param {object} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   *
   * @returns The updated Metadata
   */
  set(file: string | TFile | null, frontmatterData: any, toValuesFile: boolean | string = false, prototype: string | boolean = false): void {
    if (prototype && toValuesFile) {
      throw "Cannot patch toValuesFile and prototype at the same time.";
    }

    const { update } = Metadata.MetaeditApi;
    const fileName = Metadata._parseFileNameFromDataFileFileOrPrototype(toValuesFile, file, prototype);

    this.clear(fileName);
    Object.keys(frontmatterData).forEach(propertyName => update(propertyName, frontmatterData[propertyName], fileName));
  }

  /**
   * Used to clear values from metadata.
   *
   * @param {object|string} file The file to clear properties for. defaults to the current file.
   * @param {string|array} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
   */
  clear(file: string | TFile | null = null, frontmatterProperties: string | Array<string> | object | null = null, toValuesFile: boolean | string = false, prototype: string | boolean = false) : void {
    if (prototype && toValuesFile) {
      throw "Cannot patch toValuesFile and prototype at the same time.";
    }

    const fileName = Metadata._parseFileNameFromDataFileFileOrPrototype(toValuesFile, file, prototype);
    let propsToClear = [];

    if (typeof frontmatterProperties === "string") {
      propsToClear.push(frontmatterProperties);
    } else if (typeof frontmatterProperties === 'object') {
      if (frontmatterProperties === null) {
        propsToClear = Object.keys(this.frontmatter(fileName));
      } else if (Array.isArray(frontmatterProperties)) {
        propsToClear = frontmatterProperties;
      } else {
        propsToClear = Object.keys(frontmatterProperties);
      }
    }

    throw "not implemented";
  }

  //#endregion
  
  //#region Utilities
  
  //#region Object Deep Property Utilities
  
  /**
   * Find a deep property in an object.
   *
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {object} onObject The object containing the desired key
   *
   * @returns true if the property exists, false if not.
   */
  static ContainsDeepProperty(propertyPath: string | Array<string>, onObject: any): boolean {
    const keys = (typeof (propertyPath) == "string")
      ? propertyPath
        .split('.')
      : propertyPath;

    let parent = onObject;
    for (const currentKey of keys) {
      if (typeof parent !== "object") {
        return false;
      }

      if (!parent.hasOwnProperty(currentKey)) {
        return false;
      }

      parent = parent[currentKey];
    }

    return true;
  }

  /**
   * Get a deep property in an object, null if not found.
   *
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {{onTrue:function(object), onFalse:function()}|function(object)|[function(object), function()]} thenDo A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
   * @param {object} fromObject The object containing the desired key
   *
   * @returns if the property exists.
   */
  static TryToGetDeepProperty(propertyPath: string | Array<string>, thenDo: any, fromObject: any): boolean {
    const keys = (typeof (propertyPath) == "string")
      ? propertyPath
        .split('.')
      : propertyPath;

    let parent = fromObject;
    for (const currentKey of keys) {
      if (typeof parent !== "object" || !parent.hasOwnProperty(currentKey)) {
        if (thenDo && thenDo.onFalse) {
          thenDo.onFalse();
        }
        return false;
      }

      parent = parent[currentKey];
    }

    if (thenDo) {
      const then = thenDo.onTrue || thenDo;
      if (then) {
        return then(parent);
      }
    }

    return true;
  }

  /**
   * Get a deep property in an object, null if not found.
   *
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {object} fromObject The object containing the desired key
   *
   * @returns The found deep property, or null if not found.
   */
  static GetDeepProperty(propertyPath: string | Array<string>, fromObject: any): any | null {
    return (typeof (propertyPath) == "string"
      ? propertyPath
        .split('.')
      : propertyPath)
      .reduce((t, p) => t?.[p], fromObject);
  }

  /**
   * Set a deep property in an object, even if it doesn't exist.
   *
   * @param {string|[string]} propertyPath Array of keys, or dot seperated propery key.
   * @param {object|function(object)} value The value to set, or a function to update the current value and return it.
   * @param {object} fromObject The object containing the desired key
   *
   * @returns The found deep property, or null if not found.
   */
  static SetDeepProperty(propertyPath: string | Array<string>, value: any, onObject: any): void {
    const keys = (typeof (propertyPath) == "string")
      ? propertyPath
        .split('.')
      : propertyPath;

    let parent = onObject;
    let currentKey;
    for (currentKey of keys) {
      if (typeof parent !== "object") {
        throw `Property: ${currentKey}, in Path: ${propertyPath}, is not an object. Child property values cannot be set!`;
      }

      // if this parent doesn't have the property we want, add it as an empty object for now.
      if (!parent.hasOwnProperty(currentKey)) {
        parent[currentKey] = {};
      }

      // if this isn't the last one, set it as parent.
      if (currentKey != keys[keys.length - 1]) {
        parent = parent[currentKey];
      }
    }

    if (!currentKey) {
      throw "No Final Key Provided!?";
    }

    if (typeof value === "function") {
      parent[currentKey] = value(parent[currentKey]);
    } else {
      parent[currentKey] = value;
    }
  }

  //#endregion

  //#region Filename Utilities

  /**
   * Turn a relative path into a full path
   *
   * @param relativePath The relative path to map to
   * @param extension The extension to add. Defaults to no extension (false/empty). If true is passed in .md will be added.
   * @param rootFolder (Optional) The root folder path the relative path is relative too. Defaults to the current note's folder
   *
   * @returns The full file path.
   */
  path(relativePath: string | null = null, extension: string | boolean = "", rootFolder: string | null = null) : string {
    if (!relativePath) {
      return this._addExtension(this.current.path, extension);
    }

    const [fileName, ...folders] = relativePath.split("/").reverse();

    let absolutePath = fileName;
    let currentFolder: TFolder = rootFolder
      ? (app.vault.getAbstractFileByPath(rootFolder) as TFolder)
      : this.Current.Note.parent;

    for (var folder of folders.reverse()) {
      if (folder === "..") {
        currentFolder = currentFolder.parent;
      } else if (folder === ".") {
        continue;
      } else {
        absolutePath = folder + "/" + absolutePath;
      }
    }

    if (currentFolder.path !== "/") {
      return this._addExtension(currentFolder.path + "/" + absolutePath, extension);
    } else {
      return this._addExtension(absolutePath, extension);
    }
  }

  private _addExtension(path: string, extension: string | boolean): string {
    if (extension) {
      if (typeof extension !== "string") {
        return path + ".md";
      } else {
        return path + "." + extension;
      }
    } else {
      return path;
    }
  }

  /**
   * Get a file path string based on a file path string or file object.
   *
   * @param {object|string} file The file object (with a path property) or file name
   *
   * @returns The file path
   */
  static ParseFileName(file: string | TFile | FileData | null): string | null {
    let fileName = file || null;
    if (typeof file === "object" && file !== null) {
      fileName = file.path.split('.').slice(0, -1).join('.');
    }

    //@ts-expect-error: Accounted For.
    return fileName;
  }

  /**
   * Get the full path of a data file from it's data path.
   *
   * @param dataPath The path after the value set in settings for the path to data value files.
   *
   * @returns the full path from the root of the vault.
   */
  static BuildDataFileFullPath(dataPath: string) {
    // @ts-expect-error: app.plugin is not mapped.
    return app.plugins.plugins["metadata-api"].settings.dataFilesPath + dataPath;
  }

  /**
   * Get the full path of a prototype file from it's data path.
   *
   * @param prototypePath The path after the value set in settings for the path to data prototypes files.
   *
   * @returns the full path from the root of the vault.
   */
  static BuildPrototypeFileFullPath(prototypePath: string) {
    // @ts-expect-error: app.plugin is not mapped.
    return app.plugins.plugins["metadata-api"].settings.prototypesPath + prototypePath;
  }

  private static _parseFileNameFromDataFileFileOrPrototype(toValuesFile: string | boolean, file: string | TFile | null, prototype: string | boolean) {
    return toValuesFile
      ? file
        ? Metadata.BuildDataFileFullPath(Metadata.ParseFileName(file)!)
        : (typeof toValuesFile === "string"
          ? Metadata.BuildDataFileFullPath(toValuesFile)
          : Metadata.BuildDataFileFullPath(Metadata.Api.Current.Path))
      : prototype
        ? file
          ? Metadata.BuildPrototypeFileFullPath(Metadata.ParseFileName(file)!)
          : (typeof prototype === "string"
            ? Metadata.BuildPrototypeFileFullPath(prototype)
            : Metadata.BuildPrototypeFileFullPath(Metadata.Api.Current.Path))
        : Metadata.ParseFileName(file) || Metadata.Api.Current.Path;
  }

  //#endregion

  //#endregion
}