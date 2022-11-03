import { TAbstractFile, TFile, TFolder } from 'obsidian';
import { CurrentMetadata } from "./current";
import { NoteSections } from './sections';
import { PluginContainer, CachedFileMetadata, CurrentApi, DvData, FileSource, Frontmatter, MetaData, MetadataApi, MetadataPlugin, MetadataSources, Sections, SplayKebabCasePropertiesOption, FileItem } from './api';
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

  private _initializePropLowercaseSplayer() {
    this._lowerCaseSplayer = this.plugin.settings.splayFrontmatterWithoutDataview
      ? base => Metadata._recurseOnAllObjectProperties(base, Metadata._splayToLowerCase)
      : base => base;
  }

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
        .map((part, i) => (i !== 0 && part) ? part.charAt(0).toUpperCase() + part.substring(1) : part)
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
        .map((part, i) => (i !== 0 && part) ? part.charAt(0).toUpperCase() + part.substring(1) : part)
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
   * // TODO: can we set these to their specific types?
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
   * // TODO: can we set these to their specific types?
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

  get Plugin(): MetadataPlugin {
    // @ts-expect-error: app.plugin is not mapped.
    return this._plugin ??= app.plugins.plugins["metadata-api"];
  }

  get plugin(): MetadataPlugin {
    // @ts-expect-error: app.plugin is not mapped.
    return this._plugin ??= app.plugins.plugins["metadata-api"];
  }
  
  //#endregion

  //#region Current File Properties

  get Current(): CurrentApi {
    return this.current;
  }

  get current(): CurrentApi {
    return new CurrentMetadata(this);
  }

  get Data(): MetaData {
    return this.Current.Data;
  }

  get data(): MetaData {
    return this.Current.Data;
  }

  //#endregion
   
  //#region Metadata Fetchers

  vault(file: FileSource = null): TFile | TFolder | TAbstractFile | null {
    if (file instanceof TAbstractFile) {
      return file;
    }

    const path = (Metadata.ParseFilePathFromSource(file) || this.Current.Path);
    return app.vault.getAbstractFileByPath(path)
      ?? app.vault.getAbstractFileByPath(path + ".md");
  }

  omfc(file: FileSource = null): CachedFileMetadata | CachedFileMetadata[] | null {
    const fileObject = this.vault(file);

    if (!(fileObject instanceof TFile)) {
      if (fileObject instanceof TFolder) {
        return (fileObject as TFolder).children.map(
          sub => this.omfc(sub)!
        ).flat();
      } else {
        throw `Note or Folder Not Found: ${fileObject?.path}`;
      }
    }

    const result = (app.metadataCache.getFileCache(fileObject) as CachedFileMetadata) || null;
    if (result !== null) {
      result.path = fileObject.path;
    }
    
    return result;
  }

  frontmatter(file: FileSource = null): Frontmatter | Frontmatter[] | null {
    const fileCache = this.omfc(file);

    if (Array.isArray(fileCache)) {
      return fileCache.map(f => this.frontmatter(f.path) as Frontmatter);
    } else {
      return (fileCache && fileCache.frontmatter)
        ? this._lowerCaseSplayer(this._kebabPropSplayer(fileCache?.frontmatter, null))
        : null;
    }
  }

  sections(file: FileSource = null): Sections | Sections[] | null {
    const fileCache = this.omfc(file);

    if (Array.isArray(fileCache)) {
      return fileCache.map(f => this.sections(f.path) as Sections);
    } else if (!fileCache) {
      return null;
    } else {
      return new NoteSections(fileCache?.path, fileCache?.headings);
    }
  }

  dv(file: FileSource = null): DvData | DvData[] | null {
    const paths = Metadata
      .DataviewApi
      .pagePaths(file ? Metadata.ParseFilePathFromSource(file) : this.Current.Path);

    if (paths.length > 1) {
      return paths.map((p: string) => this.dv(p));
    } else if (!paths.length) {
      return null;
    } else {
      const result = Metadata
        .DataviewApi
        .page(paths[0]);
    
      return this._kebabPropSplayer(result, ["file"]) as DvData;
    }
  }

  cache(file: FileSource = null): Cache | Cache[] | null {
    const fileObject = this.vault(file);
    if (fileObject === null) {
      return null;
    } else if (fileObject instanceof TFolder) {
      return fileObject.children.map(f => this.cache(f) as (Cache | Cache[])).flat();
    } else {
      Metadata._caches[fileObject.path] = Metadata._caches[fileObject.path] || {};

      return Metadata._caches[fileObject.path];
    }
  }

  prototypes(prototypePath: string): Frontmatter | Frontmatter[] | null {
    return this.frontmatter(Metadata.BuildPrototypeFileFullPath(prototypePath));
  }

  values(dataPath: string): Frontmatter | Frontmatter[] | null {
    return this.frontmatter(Metadata.BuildDataFileFullPath(dataPath));
  }

  get(file: FileSource = null, sources: MetadataSources | boolean = Metadata.DefaultSources): MetaData | MetaData[] | null {
    if (file instanceof TFolder) {
      return file.children.map(c => this.get(c, sources)).flat();
    }

    const fileName = file
      ? (Metadata.ParseFilePathFromSource(file)
        ?? this.current.path)
      : this.Current.Path;

    if (fileName?.endsWith("/")) {
      const folderName = fileName.substring(0, -1);
      const fileObject = this.vault(folderName);

      if (fileObject instanceof TFolder) {
        return fileObject.children.map(c => this.get(c, sources)).flat();
      } else {
        throw "Expected folder because of trailing slash(/): '" + fileName + "'.";
      }
    } else {
      const fileObject = this.vault(fileName);

      if (fileObject instanceof TFolder) {
        return fileObject.children.map(c => this.get(c, sources)).flat();
      }
    }

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
        } else {
          values["File"] = values.file;
        }

        // remove dv inline?
        let frontmatter: Frontmatter = null!;
        if (!sources.DataviewInline) {
          frontmatter = this.frontmatter(fileName) as Frontmatter;
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
      values["Cache"] = this.cache(fileName);
    }

    // add sections?
    if (sources === true || sources.Sections) {
      if (sources === true || sources.FileInfo) {
        values.file.sections = this.sections(fileName);
        values.file.Sections = this.sections(fileName);
      } else {
        values.file = {};
        values.file.sections = this.sections(fileName);
        values.file.Sections = this.sections(fileName);
      }
    }

    return values;
  }

  //#endregion

  //#region Metadata Modifiers

  patch(file: FileItem, frontmatterData: Record<string, any> | any, propertyName: string | null = null, toValuesFile: boolean | string = false, prototype: string | boolean = false): void {
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

  set(file: FileItem, frontmatterData: any, toValuesFile: boolean | string = false, prototype: string | boolean = false): void {
    if (prototype && toValuesFile) {
      throw "Cannot patch toValuesFile and prototype at the same time.";
    }

    const { update } = Metadata.MetaeditApi;
    const fileName = Metadata._parseFileNameFromDataFileFileOrPrototype(toValuesFile, file, prototype);

    this.clear(fileName);
    Object.keys(frontmatterData).forEach(propertyName => update(propertyName, frontmatterData[propertyName], fileName));
  }

  clear(file: FileItem = null, frontmatterProperties: string | Array<string> | Record<string, any> | null = null, toValuesFile: boolean | string = false, prototype: string | boolean = false) : void {
    if (prototype && toValuesFile) {
      throw "Cannot patch toValuesFile and prototype at the same time.";
    }

    const fileName = Metadata._parseFileNameFromDataFileFileOrPrototype(toValuesFile, file, prototype);
    let propsToClear = [];

    if (typeof frontmatterProperties === "string") {
      propsToClear.push(frontmatterProperties);
    } else if (typeof frontmatterProperties === 'object') {
      if (frontmatterProperties === null) {
        propsToClear = Object.keys(this.frontmatter(fileName) as Frontmatter);
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

  path(relativePath: string | null = null, extension: string | boolean = "", rootFolder: string | null = null) : string {
    return Metadata._addExtension(Metadata._findPath(relativePath, extension, rootFolder), extension);
  }

  /**
   * Turn a relative path into a full path
   *
   * @param relativePath The relative path to map to. Will preform immediate search if it starts with ?.
   * @param extension The extension to add. Defaults to no extension (false/empty). If true is passed in .md will be added.
   * @param rootFolder (Optional) The root folder path the relative path is relative too. Defaults to the current note's folder
   *
   * @returns The full file path.
   */
  static Path(relativePath: string | null = null, extension: string | boolean = "", rootFolder: string | null = null): string {
    return (Metadata.Api.path(relativePath, extension, rootFolder));
  }

  /**
   * Get a file path string based on a file path string or file object.
   *
   * @param {FileSource} file The file object (with a path property) or file name
   *
   * @returns The file path
   */
  static ParseFilePathFromSource(file: FileSource): string | null {
    let fileName = file || null;
    if (typeof file === "object" && file !== null) {
      fileName = file.path;
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

  private static _parseFileNameFromDataFileFileOrPrototype(toValuesFile: string | boolean, file: FileSource, prototype: string | boolean) {
    return toValuesFile
      ? file
        ? Metadata.BuildDataFileFullPath(Metadata.ParseFilePathFromSource(file)!)
        : (typeof toValuesFile === "string"
          ? Metadata.BuildDataFileFullPath(toValuesFile)
          : Metadata.BuildDataFileFullPath(Metadata.Api.Current.Path))
      : prototype
        ? file
          ? Metadata.BuildPrototypeFileFullPath(Metadata.ParseFilePathFromSource(file)!)
          : (typeof prototype === "string"
            ? Metadata.BuildPrototypeFileFullPath(prototype)
            : Metadata.BuildPrototypeFileFullPath(Metadata.Api.Current.Path))
        : Metadata.ParseFilePathFromSource(file) || Metadata.Api.Current.Path;
  }
  
  private static _findPath(relativePath: string | null = null, extension: string | boolean = "", rootFolder: string | null = null) : string {
    if (!relativePath) {
      return Metadata.Api.current.path
    }
    
    let currentFolder: TFolder = rootFolder
      ? (app.vault.getAbstractFileByPath(rootFolder) as TFolder)
      : Metadata.Api.Current.Note.parent;
    
    if (!currentFolder) {
      throw `Root Folder Not Found: ${currentFolder}.`;
    }

    if (relativePath.startsWith("?")) {
      const foundFile = app.metadataCache.getFirstLinkpathDest(Metadata._addExtension(relativePath.substring(1), extension), currentFolder.path);
      if (foundFile) {
        return foundFile.path.substring(0, foundFile.path.length - foundFile.extension.length - 1);
      }
    }

    const [fileName, ...folders] = relativePath.split("/").reverse();
    let absolutePath = fileName;

    if (folders && folders.length) {
      for (var folder of folders.reverse()) {
        if (folder === "..") {
          currentFolder = currentFolder.parent;
        } else if (folder === ".") {
          continue;
        } else {
          absolutePath = folder + (absolutePath ? "/" + absolutePath : "");
        }
      }
    } else {
      const foundFile = app.metadataCache.getFirstLinkpathDest(Metadata._addExtension(relativePath, extension), currentFolder.path);
      if (foundFile) {
        return foundFile.path.substring(0, foundFile.path.length - foundFile.extension.length - 1);
      }
    }

    if (currentFolder.path !== "/") {
      return currentFolder.path + (absolutePath ? "/" + absolutePath : "");
    } else {
      return absolutePath;
    }
  }

  private static _addExtension(path: string, extension: string | boolean): string {
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

  //#endregion

  //#endregion
}