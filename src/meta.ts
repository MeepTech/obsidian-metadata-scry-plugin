import {
  TAbstractFile,
  TFile,
  TFolder
} from 'obsidian';
import {
  DataArray,
  DataviewApi
} from "obsidian-dataview";

import {
  CachedFileMetadata,
  CurrentNoteMetaScryApi,
  DvData,
  FileSource,
  Frontmatter,
  Metadata,
  MetaScryApi,
  MetaScryPluginApi,
  MetadataSources,
  Sections,
  SplayKebabCasePropertiesOption,
  FileItem,
  FrontmatterUpdateOptions,
  FileData,
  MetadataEditApi
} from './api';
import {
  KebabCaseWordSeperatorCharacter,
  ExtensionFilePathSeperatorCharacter,
  DefaultMarkdownFileExtension,
  FileMetadataPropertyLowercaseKey,
  FileMetadataPropertyUppercaseKey,
  FolderPathSeperatorCharacter,
  CacheMetadataPropertyLowercaseKey,
  CacheMetadataPropertyCapitalizedKey,
  SectionsMetadataPropertyCapitalizedKey,
  SectionsMetadataPropertyLowercaseKey,
  ParentFolderPathSelector,
  CurrentFolderPathSelector,
  IsObject,
  IsArray,
  IsString,
  IsFunction,
  StaticMetaScryPluginContainer
} from './constants';
import { CurrentNoteScrier } from "./current";
import { NoteSections } from './sections';

/**
 * Access and edit metadata about a file from multiple sources.
 */
export class MetadataScrier implements MetaScryApi {
  private static _caches: any = {};
  private _plugin: MetaScryPluginApi;
  private _kebabPropSplayer: (base: any, topLevelPropertiesToIgnore: Array<string> | null) => object;
  private _lowerCaseSplayer: (base: any) => object;

  //#region Initalization
  
  constructor(plugin: MetaScryPluginApi) {
    this._plugin = plugin;
    this._initializeKebabPropSplayer();
    this._initializePropLowercaseSplayer();
  }

  //#region Property Name Splayer Initialization

  private _initializeKebabPropSplayer() {
    this._kebabPropSplayer = (() => {
      switch (this.plugin.settings.splayKebabCaseProperties) {
        case SplayKebabCasePropertiesOption.Lowercase:
          return (base, topLevelPropertiesToIgnore) =>
            MetadataScrier._recurseOnAllObjectProperties(base, MetadataScrier._splayKebabToLowercase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.CamelCase:
          return (base, topLevelPropertiesToIgnore) =>
            MetadataScrier._recurseOnAllObjectProperties(base, MetadataScrier._splayKebabToLowerCamelcase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.LowerAndCamelCase:
          return (base, topLevelPropertiesToIgnore) =>
            MetadataScrier._recurseOnAllObjectProperties(base, MetadataScrier._splayKebabToLowerAndLowerCamelcase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.Disabled:
        default:
          return base => base;
      }
    })();
  }

  private _initializePropLowercaseSplayer() {
    this._lowerCaseSplayer = this.plugin.settings.splayFrontmatterWithoutDataview
      ? base => MetadataScrier._recurseOnAllObjectProperties(base, MetadataScrier._splayToLowerCase)
      : base => base;
  }

  private static _recurseOnAllObjectProperties(
    value: any,
    fn: (key: string, value: any, data: any | object) => any | object,
    topLevelPropertiesToIgnore: Array<string> | null = null
  ): any {
    if (value && IsObject(value)) {
      if (IsArray(value)) {
        return value.map((i: any) => this._recurseOnAllObjectProperties(i, fn));
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
    if (key.includes(KebabCaseWordSeperatorCharacter)) {
      data[key.replace(/-/g, "").toLowerCase()] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerCamelcase(key: string, value: any, data: any | object): any | object {
    if (key.includes(KebabCaseWordSeperatorCharacter)) {
      data[key
        .toLowerCase()
        .split('-')
        .map((part, i) => (i !== 0 && part) ? part.charAt(0).toUpperCase() + part.substring(1) : part)
        .join('')] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerAndLowerCamelcase(key: string, value: any, data: any | object): any | object {
    if (key.includes(KebabCaseWordSeperatorCharacter)) {
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

  //#endregion
  
  //#region Static Api Access

  /**
   * The instance of the Api via the Metascrier class
   */
  static get Api(): MetaScryApi {
    return StaticMetaScryPluginContainer.Instance.api;
  }

  /**
   * Access to the Dataview Api
   * (Read access and Data display)
   */
  static get DataviewApi(): DataviewApi {
    return StaticMetaScryPluginContainer.DataviewApi;
  }

  /**
   * Access to the Metaedit Api
   * (Write access)
   */
  static get MetadataEditApi(): any {
    return StaticMetaScryPluginContainer.MetadataEditApi
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

  sources(overrides: MetadataSources = {}) {
    return {
      ...MetadataScrier.DefaultSources,
      ...overrides
    } as MetadataSources;
  }

  get defaultSources() : MetadataSources {
    return this.sources();
  } 

  get Plugin(): MetaScryPluginApi {
    // @ts-expect-error: app.plugin is not mapped.
    return this._plugin ??= app.plugins.plugins[MetadataScrierPluginKey];
  }

  get plugin(): MetaScryPluginApi {
    // @ts-expect-error: app.plugin is not mapped.
    return this._plugin ??= app.plugins.plugins[MetadataScrierPluginKey];
  }

  get edit(): MetadataEditApi {
    return StaticMetaScryPluginContainer.MetadataEditApi;
  }

  get Edit(): MetadataEditApi {
    return this.edit;
  }

  get dv(): DataviewApi {
    return StaticMetaScryPluginContainer.DataviewApi;
  }

  get Dv(): DataviewApi {
    return StaticMetaScryPluginContainer.DataviewApi;
  }
  
  //#endregion

  //#region Current File Properties

  get Current(): CurrentNoteMetaScryApi {
    return this.current;
  }

  get current(): CurrentNoteMetaScryApi {
    return new CurrentNoteScrier(this);
  }

  get Data(): Metadata {
    return this.Current.Data;
  }

  get data(): Metadata {
    return this.Current.Data;
  }

  //#endregion
   
  //#region Metadata Fetchers

  vault(file: FileSource = null): TFile | TFolder | TAbstractFile | null {
    if (file instanceof TAbstractFile) {
      return file;
    }

    const path = (MetadataScrier.ParseFilePathFromSource(file) || this.Current.Path);
    return app.vault.getAbstractFileByPath(path)
      ?? app.vault.getAbstractFileByPath(path + ExtensionFilePathSeperatorCharacter + DefaultMarkdownFileExtension);
  }
  file = (file: FileSource = null): TFile | null =>
    this.vault(file) as TFile;
  folder = (file: FileSource = null): TFolder| null =>
    this.vault(file) as TFolder;
  
  async markdown(source?: FileSource): Promise<string> {
    
  }
  md = (source?: FileSource): Promise<string> =>
    this.markdown(source);
  
  
  async html(source?: FileSource): Promise<HTMLElement> {
  
  }
  
  async text(source?: FileSource): Promise<string> {
    
  }
  txt = (source?: FileSource): Promise<string> =>
    this.text(source);

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
  obsidianMetadataFileCache = (file: FileSource = null): CachedFileMetadata | CachedFileMetadata[] | null =>
    this.omfc(file);
  
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
  fm = (file: FileSource = null): Frontmatter | Frontmatter[] | null =>
    this.frontmatter(file)
  matter = (file: FileSource = null): Frontmatter | Frontmatter[] | null =>
    this.frontmatter(file)

  sections(file: FileSource = null): Sections | Sections[] | null {
    const fileCache = this.omfc(file);

    if (Array.isArray(fileCache)) {
      return fileCache.map(f => this.sections(f.path) as Sections);
    } else if (!fileCache) {
      return null;
    } else {
      return new NoteSections(fileCache?.path, fileCache?.headings) as Sections;
    }
  }

  dvMatter(source: FileSource = null, useSourceQuery: boolean = false): DvData | DataArray<DvData | DataArray<any> | null> | null {
    const providedPath: string = source ? MetadataScrier.ParseFilePathFromSource(source) as string : this.Current.Path;
    const paths = MetadataScrier
      .DataviewApi
      .pagePaths(useSourceQuery ? providedPath : (`"` + providedPath + '"'));

    if (paths.length > 1) {
      return paths.map((p: string) => this.dvMatter(p));
    } else if (!paths.length) {
      return null;
    } else {
      const result = MetadataScrier
        .DataviewApi
        .page(paths[0]);
    
      return this._kebabPropSplayer(result, [FileMetadataPropertyLowercaseKey, FileMetadataPropertyUppercaseKey]) as DvData;
    }
  }
  dataviewFrontmatter = (source: FileSource = null, useSourceQuery: boolean = false): DvData | DataArray<DvData | DataArray<any> | null> | null =>
    this.dvMatter(source, useSourceQuery);

  cache(source: FileSource = null): Cache | Cache[] {
    const fileObject = this.vault(source);
    if (fileObject === null) {
      const key = MetadataScrier.ParseFilePathFromSource(source);
      if (key !== null && key !== undefined) {
        MetadataScrier._caches[key] = MetadataScrier._caches[key] || {};

        return MetadataScrier._caches[key];
      }
      
      throw "Invalid Key for File";
    } else if (fileObject instanceof TFolder) {
      return fileObject.children.map(f => this.cache(f) as (Cache | Cache[])).flat();
    } else {
      MetadataScrier._caches[fileObject.path] = MetadataScrier._caches[fileObject.path] || {};

      return MetadataScrier._caches[fileObject.path];
    }
  }
  temp = (source: FileSource = null): Cache | Cache[] =>
    this.cache(source);
  
  
  globals(key: string | string[], setToValue?: any): any | any[] | undefined {
    if (typeof key === "string") {
      if (arguments.length > 1) {
        return this.plugin.tryToSetExtraGlobal(key, setToValue);
      } else return this.plugin.tryToGetExtraGlobal(key);
    } else {
      if (arguments.length > 1) {
        return key.map(k => this.globals(key, setToValue));
      } else {
        return key.map(k => this.globals(key));
      }
    }
  }

  prototypes(prototypePath: string): Frontmatter | Frontmatter[] | null {
    return this.frontmatter(MetadataScrier.BuildPrototypeFileFullPath(prototypePath));
  }

  values(dataPath: string): Frontmatter | Frontmatter[] | null {
    return this.frontmatter(MetadataScrier.BuildDataFileFullPath(dataPath));
  }

  get(file: FileSource = null, sources: MetadataSources | boolean = MetadataScrier.DefaultSources): Metadata | Metadata[] | null {
    if (file instanceof TFolder) {
      return file.children.map(c => this.get(c, sources)).flat();
    }

    const fileName = file
      ? (MetadataScrier.ParseFilePathFromSource(file)
        ?? this.current.path)
      : this.Current.Path;

    if (fileName?.endsWith(FolderPathSeperatorCharacter)) {
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
      values = this._kebabPropSplayer(MetadataScrier
        .DataviewApi
        .page(fileName), [FileMetadataPropertyLowercaseKey, FileMetadataPropertyUppercaseKey]) || {};
    } else {
      if (sources === false) {
        return {};
      }

      // if we need dv sources
      if (sources.DataviewInline || sources.FileInfo) {
        values = this._kebabPropSplayer(MetadataScrier
          .DataviewApi
          .page(fileName), [FileMetadataPropertyLowercaseKey, FileMetadataPropertyUppercaseKey]) || {};

        // remove dv inline?
        let frontmatter: Frontmatter = null!;
        if (!sources.DataviewInline) {
          frontmatter = this.frontmatter(fileName) as Frontmatter;
          Object.keys(values).forEach(prop => {
            // if it's not a frontmatter prop or the 'file' metadata prop
            if (!frontmatter.hasOwnProperty(prop) && (prop !== FileMetadataPropertyLowercaseKey && prop !== FileMetadataPropertyUppercaseKey)) {
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

    // add/remove file metadata field(from dv)?
    if (sources === "true" || (sources as MetadataSources).FileInfo) {
      values[FileMetadataPropertyLowercaseKey] = values.file;
      values[FileMetadataPropertyUppercaseKey] = values.file;
    } else {
      delete values[FileMetadataPropertyUppercaseKey];
      delete values[FileMetadataPropertyLowercaseKey];
    }

    // add cache?
    if (sources === true || sources.Cache) {
      const foundCache = this.cache(fileName);
      values[CacheMetadataPropertyLowercaseKey] = foundCache;
      values[CacheMetadataPropertyCapitalizedKey] = foundCache;
    }

    // add sections?`
    if (sources === true || sources.Sections) {
      if (IsObject(sources) && !(sources as MetadataSources).FileInfo) {
        values[FileMetadataPropertyLowercaseKey] = {};
        values[FileMetadataPropertyUppercaseKey] = {};
      }

      const sections = this.sections(fileName);
      values[FileMetadataPropertyLowercaseKey][SectionsMetadataPropertyCapitalizedKey] = sections;
      values[FileMetadataPropertyUppercaseKey][SectionsMetadataPropertyLowercaseKey] = sections;
      values[FileMetadataPropertyLowercaseKey][SectionsMetadataPropertyCapitalizedKey] = sections;
      values[FileMetadataPropertyUppercaseKey][SectionsMetadataPropertyLowercaseKey] = sections;
    }

    return values;
  }
  from = (file: FileSource = null, sources: MetadataSources | boolean = MetadataScrier.DefaultSources): Metadata | Metadata[] | null =>
    this.get(file, sources);

  //#endregion

  //#region Metadata Modifiers

  patch(file: FileItem, frontmatterData: Record<string, any> | any, propertyName: string | null = null, options: FrontmatterUpdateOptions = {toValuesFile: false, prototype: false}): void {
    if (options.prototype && options.toValuesFile) {
      this.patch(file, frontmatterData, propertyName, { ...options, prototype: false });
      this.patch(file, frontmatterData, propertyName, { ...options, toValuesFile: false });

      return
    }

    const { updateOrInsertFieldInTFile: update } = this.edit;
    const fileName = MetadataScrier._parseFileNameFromDataFileFileOrPrototype(options.toValuesFile ?? false, file, options.prototype ?? false);
    const fileObject = file instanceof TFile ? file : (this.file(fileName) as TFile);

    if (propertyName != null) {
      update(propertyName, frontmatterData, fileObject);
    } else {
      Object.keys(frontmatterData).forEach(propertyName => update(propertyName, frontmatterData[propertyName], fileObject));
    }
  }

  set(file: FileItem, frontmatterData: any, options: FrontmatterUpdateOptions = {toValuesFile: false, prototype: false}): void {
    if (options.prototype && options.toValuesFile) {
      this.set(file, frontmatterData, { ...options, prototype: false });
      this.set(file, frontmatterData, { ...options, toValuesFile: false });

      return;
    }

    const { updateOrInsertFieldInTFile: update } = this.edit;
    const fileName = MetadataScrier._parseFileNameFromDataFileFileOrPrototype(options.toValuesFile ?? false, file, options.prototype ?? false);
    const fileObject = file instanceof TFile ? file : (this.file(fileName) as TFile);

    this.clear(fileName);
    Object.keys(frontmatterData).forEach(propertyName => update(propertyName, frontmatterData[propertyName], fileObject));
  }

  clear(file: FileItem = null, frontmatterProperties: string | Array<string> | Record<string, any> | null = null, options: FrontmatterUpdateOptions = {toValuesFile: false, prototype: false}) : void {
    if (options.prototype && options.toValuesFile) {
      this.set(file, frontmatterProperties, { ...options, prototype: false });
      this.set(file, frontmatterProperties, { ...options, toValuesFile: false });

      return;
    }

    const fileName = MetadataScrier._parseFileNameFromDataFileFileOrPrototype(options.toValuesFile ?? false, file, options.prototype ?? false);
    let propsToClear = [];

    if (IsString(frontmatterProperties)) {
      propsToClear.push(frontmatterProperties);
    } else if (IsObject(frontmatterProperties)) {
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
    const keys = (IsString(propertyPath))
      ? (propertyPath as string)
        .split('.')
      : propertyPath;

    let parent = onObject;
    for (const currentKey of keys) {
      if (!IsObject(parent)) {
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
    const keys = (IsString(propertyPath))
      ? (propertyPath as string)
        .split('.')
      : propertyPath;

    let parent = fromObject;
    for (const currentKey of keys) {
      if (!IsObject(parent) || !parent.hasOwnProperty(currentKey)) {
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
    return (IsString(propertyPath)
      ? (propertyPath as string)
        .split('.')
      : (propertyPath as string[]))
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
    const keys = (IsString(propertyPath))
      ? (propertyPath as string)
        .split('.')
      : propertyPath;

    let parent = onObject;
    let currentKey;
    for (currentKey of keys) {
      if (IsObject(parent)) {
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

    if (IsFunction(value)) {
      parent[currentKey] = value(parent[currentKey]);
    } else {
      parent[currentKey] = value;
    }
  }

  //#endregion

  //#region Filename Utilities

  path(relativePath: string | null = null, extension: string | boolean = "", rootFolder: string | null = null) : string {
    return MetadataScrier._addExtension(MetadataScrier._findPath(relativePath, extension, rootFolder), extension);
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
    return (MetadataScrier.Api.path(relativePath, extension, rootFolder));
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
    if (IsObject(file) && file !== null) {
      fileName = (file as FileData | TAbstractFile).path!;
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
    return app.plugins.plugins[MetadataScrierPluginKey].settings.dataFilesPath + dataPath;
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
    return app.plugins.plugins[MetadataScrierPluginKey].settings.prototypesPath + prototypePath;
  }

  private static _parseFileNameFromDataFileFileOrPrototype(toValuesFile: string | boolean, file: FileSource, prototype: string | boolean) {
    return toValuesFile
      ? file
        ? MetadataScrier.BuildDataFileFullPath(MetadataScrier.ParseFilePathFromSource(file)!)
        : (IsString(toValuesFile)
          ? MetadataScrier.BuildDataFileFullPath(toValuesFile as string)
          : MetadataScrier.BuildDataFileFullPath(MetadataScrier.Api.Current.Path))
      : prototype
        ? file
          ? MetadataScrier.BuildPrototypeFileFullPath(MetadataScrier.ParseFilePathFromSource(file)!)
          : (IsString(prototype)
            ? MetadataScrier.BuildPrototypeFileFullPath(prototype as string)
            : MetadataScrier.BuildPrototypeFileFullPath(MetadataScrier.Api.Current.Path))
        : MetadataScrier.ParseFilePathFromSource(file) || MetadataScrier.Api.Current.Path;
  }
  
  private static _findPath(relativePath: string | null = null, extension: string | boolean = "", rootFolder: string | null = null) : string {
    if (!relativePath) {
      return MetadataScrier.Api.current.path
    }
    
    let currentFolder: TFolder = rootFolder
      ? (app.vault.getAbstractFileByPath(rootFolder) as TFolder)
      : MetadataScrier.Api.Current.Note.parent;
    
    if (!currentFolder) {
      throw `Root Folder Not Found: ${currentFolder}.`;
    }

    if (relativePath.startsWith("?")) {
      const foundFile = app.metadataCache.getFirstLinkpathDest(MetadataScrier._addExtension(relativePath.substring(1), extension), currentFolder.path);
      if (foundFile) {
        return foundFile.path.substring(0, foundFile.path.length - foundFile.extension.length - 1);
      }
    }

    const [fileName, ...folders] = relativePath.split(FolderPathSeperatorCharacter).reverse();
    let absolutePath = fileName;

    if (folders && folders.length) {
      for (var folder of folders.reverse()) {
        if (folder === ParentFolderPathSelector) {
          currentFolder = currentFolder.parent;
        } else if (folder === CurrentFolderPathSelector) {
          continue;
        } else {
          absolutePath = folder + (absolutePath ? FolderPathSeperatorCharacter + absolutePath : "");
        }
      }
    } else {
      const foundFile = app.metadataCache.getFirstLinkpathDest(MetadataScrier._addExtension(relativePath, extension), currentFolder.path);
      if (foundFile) {
        return foundFile.path.substring(0, foundFile.path.length - foundFile.extension.length - 1);
      }
    }

    if (currentFolder.path !== FolderPathSeperatorCharacter) {
      return currentFolder.path + (absolutePath ? FolderPathSeperatorCharacter + absolutePath : "");
    } else {
      return absolutePath;
    }
  }

  private static _addExtension(path: string, extension: string | boolean): string {
    if (extension) {
      if (!IsString(extension)) {
        return path + ExtensionFilePathSeperatorCharacter + DefaultMarkdownFileExtension;
      } else {
        return path + ExtensionFilePathSeperatorCharacter + extension;
      }
    } else {
      return path;
    }
  }

  //#endregion

  //#endregion
}