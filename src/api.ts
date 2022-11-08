import {
  CachedMetadata,
  Plugin,
  TAbstractFile,
  TFile,
  TFolder
} from "obsidian";

//#region Plugin

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
 * Interface for the plugin itself
 */
export type MetaScryPluginApi = {
  /**
   * Get the current instance of the MetaScryApi object.
   * 
   * @alias {@link MetadataScrier.Api}
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
} & Plugin;

/**
 * Interface for the plugin settings
 */
export interface MetaScryPluginSettings {
  /**
   * The global property key for the 'cache' variable 
   */
  globalCacheName: string;

  /**
   * The global property key for the 'meta' variable 
   */
  globalMetaScryExtraName: string;

  /**
   * The global property key for the 'path' function 
   */
  globalPathName: string;

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

//#endregion

//#region Meta Datas

/**
 * Extension of cachedfilemetadata that just adds the path for internal use.
 */
export type CachedFileMetadata = CachedMetadata & {
  /**
   * Full path of the file the metadata is for.
   */
  path: string;
};

/**
 * A full metadata set returned from MetaScryApi.get
 */
export type Metadata = {
  /**
   * The 'file' metadata object. This contains things about the file/note itself, such as the date it was made and edited, and it's path. 
   * This info isn't written in the note anywhere.
   * This is compiled by Dataview
   *
   * @alias {@link Metadata.File}
   * 
   * @see {@link MetaScryApi.get}
   * @see {@link MetaScryApi.dv}
   * @see {@link MetaScryApi.file}
   * @see {@link MetaScryApi.vault}
   * @see {@link CurrentNoteMetaScryApi.note}
   * @see {@link CurrentNoteMetaScryApi.Note}
   */
  file?: FileData;

  /**
   * The 'file' metadata object. This contains things about the file/note itself, such as the date it was made and edited, and it's path. 
   * This info isn't written in the note anywhere.
   * This is compiled by Dataview
   *
   * @alias {@link Metadata.file}
   * 
   * @see {@link MetaScryApi.get}
   * @see {@link MetaScryApi.dv}
   * @see {@link MetaScryApi.file}
   * @see {@link MetaScryApi.vault}
   * @see {@link CurrentNoteMetaScryApi.note}
   * @see {@link CurrentNoteMetaScryApi.Note}
   */
  File?: FileData;

  /**
   * The meta-scry api cache object for the file
   *
   * @alias {@link Metadata.Cache}
   * @alias {@link global#cache}
   * 
   * @see {@link MetaScryApi.get}
   * @see {@link MetaScryApi.cache}
   * @see {@link CurrentNoteMetaScryApi.cache}
   * @see {@link CurrentNoteMetaScryApi.Cache}
   */
  cache?: Cache;

  /**
   * The meta-scry api cache object for the file
   *
   * @alias {@link Metadata.cache}
   * @alias {@link global#cache}
   * 
   * @see {@link MetaScryApi.get}
   * @see {@link MetaScryApi.cache}
   * @see {@link CurrentNoteMetaScryApi.cache}
   * @see {@link CurrentNoteMetaScryApi.Cache}
   */
  Cache?: Cache;
} & Frontmatter;

/**
 * An internal cache for a note.
 */
export type Cache = {
  /**
   * A value cached by a key
   */
  [prpertyKey: string]: any;
} & Object;

/**
 * The frontmatter of a note.
 */
export type Frontmatter = {
  /**
   * A frontmatter property and value
   */
  [prpertyKey: string]: any;
} & Object;

/**
 * The data in the 'file' object provided by dataview.
 * Sections is added by the MetaScry Api.
 */
export type FileData = {
  // these fields are compiled by dataview:
  name: string;
  folder: string;
  path: string;
  ext: string;
  link: DataLink;
  size: number;
  ctime: Date;
  cday: Date;
  mtime: Date;
  mday: Date;
  tags: string[];
  etags: string[];
  inlinks: DataLink[];
  outlinks: DataLink[];
  aliases: string[];
  tasks: DataTask[];
  lists: DataTask[];
  frontmatter?: Frontmatter;
  starred?: boolean;
  day?: Date;
  // the other fields come from meta-scry:

  /**
   * Sections under headings in the given file. You can load the content with md, html, and txt
   * 
   * @alias {@link sections}
   */
  sections?: Sections;

  /**
   * Sections under headings in the given file. You can load the content with md, html, and txt
   *
   * @alias {@link sections}
   */
  Sections?: Sections;
}

/**
 * An obsidian link.
 * Conmpiled by dataview
 */
interface DataLink {
  /**
   * The path the link points to
   */
  path: string;
  // TODO: finish
}

/**
 * A md task or list item. 
 * Conmpiled by dataview.
 */
interface DataTask {
  // TODO: fill in
}

/**
 * A full metadata set returned from meta.get.
 */
export type DvData = {
  /**
   * The dv file object
   * 
   * @see {@link Metadata.File}
   */
  file: FileData;
} & Frontmatter;

//#endregion

//#region Apis

/**
 * Something we can get a file or folder's path from.
 * 
 * Either a 'file/folder' object with a '.path' property, or the path itself as a string.
 */
export type FileSource = string | TFile | TFolder | TAbstractFile | FileData | DataLink | null

/**
 * Something we can get a specific file's path from.
 * 
 * Either a 'file' object with a '.path' property, or the path itself as a string.
 */
 export type FileItem = string | TFile | FileData | DataLink | null

/**
 * Passed into any update functions to modify what they do.
 */
export interface FrontmatterUpdateOptions {
  toValuesFile?: boolean | string;
  prototype?: string | boolean;
};

/**
 * The sources to pull Metadata values from for a file.
 */
export interface MetadataSources {
  /**
   * The 'file' field containing metadata about the file itself
   */
  FileInfo?: boolean;
   
  /**
   * The Frontmatter (YAML at the top of a note)
   */
  Frontmatter?: boolean;
   
  /**
   * Inline Dataview data fields
   */
  DataviewInline?: boolean;
   
  /**
   * Cached values from MetaScryApi.cache
   */
  Cache?: boolean;
   
  /**
   * Sections from the note itself
   */
  Sections?: boolean;
}

/**
 * Interface for the Api.
 * Access and edit metadata about a file from multiple sources.
 */
export interface MetaScryApi {

  /**
   * Get the plugin that runs this api
   * 
   * @alias {@link plugin}
   * @alias {@link StaticMetaScryPluginContainer.Instance}
   */
  get Plugin(): MetaScryPluginApi;

  /**
   * Get the plugin that runs this api
   * 
   * @alias {@link Plugin}
   * @alias {@link StaticMetaScryPluginContainer.Instance}
   */
  get plugin(): MetaScryPluginApi;

  /**
   * Used to fetch various metadata for the current file.
   * 
   * @alias {@link current}
   */
  get Current(): CurrentNoteMetaScryApi;

  /**
   * Used to fetch various metadata for the current file.
   * 
   * @alias {@link Current}
   */
  get current(): CurrentNoteMetaScryApi;

  /**
   * Get all Metadata from the default sources for the current file.
   * 
   * @alias {@link data}
   * @alias {@link CurrentNoteMetaScryApi.data}
   * @alias {@link CurrentNoteMetaScryApi.data}
   * @alias {@link CurrentNoteMetaScryApi.Data}
   * @alias {@link CurrentNoteMetaScryApi.Data}
   * 
   * @see {@link get}
   */
  get Data(): Metadata;

  /**
   * Get all Metadata from the default sources for the current file.
   * 
   * @alias {@link Data}
   * @alias {@link CurrentNoteMetaScryApi.data}
   * @alias {@link CurrentNoteMetaScryApi.data}
   * @alias {@link CurrentNoteMetaScryApi.Data}
   * @alias {@link CurrentNoteMetaScryApi.Data}
   * 
   * @see {@link get}
   */
  get data(): Metadata;

  /**
   * Default sources for the MetaScryApi.get function
   *
   * @alias {@link MetadataScrier.DefaultSources}
   * 
   * @see {@link sources}
   * @see {@link get}
   */
  get defaultSources(): MetadataSources;

  /**
   * Helper to get the default MetaScryApi.get sources with any desired overrides
   * 
   * @param {MetadataSources} overrides (Optional) any properties you want to override from the Default Sources, in one object. Defaults to all default sources if nothing is provided.
   * 
   * @see {@link MetadataScrier.DefaultSources}
   * @see {@link sources}
   * @see {@link get}
   */
  sources(overrides?: MetadataSources): MetadataSources;

  /**
   * Get a file or folder from the vault
   * 
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   * 
   * @returns the found TFile or TFolder
   * 
   * @alias {@link folder}
   * @alias {@link file}
   * 
   * @see {@link CurrentNoteMetaScryApi.note}
   * @see {@link CurrentNoteMetaScryApi.Note}
   */
  vault(source: FileSource): TFile | TFolder | TAbstractFile | null;

  /**
   * Get a file from the vault (alias for vault())
   * 
   * @param {FileSource} source The file object(with a path property) or the full path string
   * 
   * @returns the found TFile
   * 
   * @alias {@link vault}
   * 
   * @see {@link folder}
   * @see {@link CurrentNoteMetaScryApi.note}
   * @see {@link CurrentNoteMetaScryApi.Note}
   */
  file(source: FileSource): TFile | null;

  /**
   * Get a folder from the vault
   * 
   * @param {FileSource} source The folder object(with a path property) or the full path string
   * 
   * @returns the found TFolder
   * 
   * @alias {@link vault}
   * 
   * @see {@link file}
   * @see {@link CurrentNoteMetaScryApi.note}
   * @see {@link CurrentNoteMetaScryApi.Note}
   */
  folder(source: FileSource): TFolder | null;
  
  /**
   * Used to fetch the "Obsidian Metadata File Cache" object from the obsidian api.
   * 
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns The cached file metadata object if it exists, or an array of objects if a folder was provided.
   *
   * @alias {@link omfc}
   */
   obsidianMetadataFileCache(source?: FileSource): CachedFileMetadata | CachedFileMetadata[] | null;
  
  /**
   * Used to fetch the "Obsidian Metadata File Cache" object from the obsidian api. 
   * 
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns The cached file metadata object if it exists, or an array of objects if a folder was provided.
   *
   * @alias {@link obsidianMetadataFileCache}
   */
  omfc(source?: FileSource): CachedFileMetadata | CachedFileMetadata[] | null;

  /**
   * Get just the frontmatter for the given file. 
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   * 
   * @returns Just the frontmatter for the file.
   * 
   * @alias {@link fm}
   * @alias {@link matter}
   * 
   * @see {@link CurrentNoteMetaScryApi.fm}
   * @see {@link CurrentNoteMetaScryApi.matter}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   * @see {@link CurrentNoteMetaScryApi.Matter}
   * @see {@link CurrentNoteMetaScryApi.Frontmatter}
   * @see {@link get}
   */
  frontmatter(source?: FileSource): Frontmatter | Frontmatter[] | null;

  /**
   * Get just the frontmatter for the given file. 
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the frontmatter for the file.
   * 
   * @alias {@link frontmatter}
   * @alias {@link matter}
   * 
   * @see {@link CurrentNoteMetaScryApi.fm}
   * @see {@link CurrentNoteMetaScryApi.matter}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   * @see {@link CurrentNoteMetaScryApi.Matter}
   * @see {@link CurrentNoteMetaScryApi.Frontmatter}
   * @see {@link get}
   */
  fm(source?: FileSource): Frontmatter | Frontmatter[] | null;

  /**
   * Get just the frontmatter for the given file.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the frontmatter for the file.
   * 
   * @alias {@link fm}
   * @alias {@link frontmatter}
   * 
   * @see {@link CurrentNoteMetaScryApi.fm}
   * @see {@link CurrentNoteMetaScryApi.matter}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   * @see {@link CurrentNoteMetaScryApi.Matter}
   * @see {@link CurrentNoteMetaScryApi.Frontmatter}
   * @see {@link get}
   */
  matter(source?: FileSource): Frontmatter | Frontmatter[] | null;

  /**
   * Get just the sections for the given file.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the sections under their headings for the file.
   * 
   * @see {@link CurrentNoteMetaScryApi.sections}
   * @see {@link CurrentNoteMetaScryApi.Sections}
   * @see {@link get}
   */
  sections(source?: FileSource): Sections | Sections[] | null;

  /**
   * Get the dataview api values for the given file; Inline, frontmatter, and the file value.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string, or a dv query source.
   * @param {boolean} useSourceQuery (Optional) If you want to use a dv source query instead of assuming a file path is provided. Defaults to false (""s are added to the passed in path by default).
   *
   * @returns Just the dataview(+frontmatter) values for the file.
   * 
   * @see {@link get}
   */
  dv(source?: FileSource, useSourceQuery?: boolean): DvData | DvData[] | null;

  /**
   * Get just the (meta-scry) cache data for a file.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string.
   *
   * @returns The cache data only for the requested file
   * 
   * @see {@link CurrentNoteMetaScryApi.cache}
   * @see {@link CurrentNoteMetaScryApi.Cache}
   * @see {@link get}
   */
  cache(source?: FileSource): Cache | Cache[];

  /**
   * Get the desired prototypes
   *
   * @param {string} prototypePath The path to the prototype file desired.
   *
   * @returns An object containing the prototypes in the givne file
   */
  prototypes(prototypePath: string): Frontmatter | Frontmatter[] | null;

  /**
   * Get the desired values from data storage
   *
   * @param {string} dataPath The path to the data file desired.
   *
   * @returns An object containing the yaml data stored in the givne file
   */
  values(dataPath: string): Frontmatter | Frontmatter[] | null;  

  /**
   * Get the Metadata for a given file using the supplied sources.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string.
   * @param {bool|MetadataSources} sources The sources to get metadata from. Defaults to all.
   *
   * @returns The requested metadata
   * 
   * @see {@link data}
   * @see {@link Data}
   * @see {@link CurrentNoteMetaScryApi.data}
   * @see {@link CurrentNoteMetaScryApi.data}
   * @see {@link CurrentNoteMetaScryApi.Data}
   * @see {@link CurrentNoteMetaScryApi.Data}
   * @see {@link fm}
   * @see {@link matter}
   * @see {@link frontmatter}
   * @see {@link CurrentNoteMetaScryApi.fm}
   * @see {@link CurrentNoteMetaScryApi.matter}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   * @see {@link CurrentNoteMetaScryApi.Matter}
   * @see {@link CurrentNoteMetaScryApi.Frontmatter}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.sections}
   * @see {@link CurrentNoteMetaScryApi.Sections}
   * @see {@link cache}
   * @see {@link CurrentNoteMetaScryApi.cache}
   * @see {@link CurrentNoteMetaScryApi.Cache}
   * @see {@link dv}
   */
  get(source?: FileSource, sources?: MetadataSources | boolean): Metadata | Metadata[] | null;
  
  /**
   * Patch individual properties of the frontmatter metadata.
   *
   * @param {FileItem} file The name of the file or the file object with a path
   * @param {Record<string, any>|any} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string|null} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to patch said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to patch said data prototype file. You can also pass in the path here instead.
   *
   * @see {@link CurrentNoteMetaScryApi.patch}
   * @see {@link set}
   * @see {@link clear}
   */
  patch(file: FileItem, frontmatterData: Record<string, any> | any, propertyName?: string | null, options?: FrontmatterUpdateOptions): void;
  
  /**
   * Replace the existing frontmatter of a file with entirely new data, clearing out all old data in the process.
   *
   * @param {FileItem} file The name of the file or the file object with a path
   * @param {Frontmatter} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   *
   * @see {@link CurrentNoteMetaScryApi.set}
   * @see {@link clear}
   * @see {@link patch}
   */
  set(file: FileItem, frontmatterData: any, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;

  /**
   * Used to clear values from metadata.
   *
   * @param {FileItem} file The file to clear properties for. defaults to the current file.
   * @param {string|Array<string>|Record<string, any>|null} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
   *
   * @see {@link CurrentNoteMetaScryApi.clear}
   * @see {@link set}
   * @see {@link patch}
   */
  clear(file?: FileItem, frontmatterProperties?: string | Array<string> | Record<string, any> | null, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;
  
  /**
   * Turn a relative path into a full path
   *
   * @param relativePath The relative path to map to. Will preform immediate search if it starts with ?.
   * @param extension The extension to add. Defaults to no extension (false/empty). If true is passed in .md will be added.
   * @param rootFolder (Optional) The root folder path the relative path is relative too. Defaults to the current note's folder
   *
   * @returns The full file path.
   * 
   * @alias {@link global#path}
   */
  path(relativePath?: string | null, extension?: string | boolean, rootFolder?: string | null): string
}

/**
 * Interface for the current note within the api
 */
export interface CurrentNoteMetaScryApi {

  /**
   * Get all Metadata from the default sources for the current file.
   * 
   * @alias {@link data}
   * @alias {@link MetaScryApi.data}
   * 
   * @see {@link MetaScryApi.get}
   */
  get Data(): Metadata;

  /**
   * Get all Metadata from the default sources for the current file.
   *
   * @alias {@link Data}
   * @alias {@link MetaScryApi.data}
   * 
   * @see {@link MetaScryApi.get}
   */
  get data(): Metadata;
  
  /**
   * The current note focused by the workspace.
   * 
   * @alias {@link note}
   *
   * @see {@link MetaScryApi.file}
   * @see {@link MetaScryApi.vault}
   * @see {@link MetaScryApi.folder}
   */
  get Note(): TFile;
  
  /**
   * The current note focused by the workspace.
   * 
   * @alias {@link Note}
   * 
   * @see {@link MetaScryApi.file}
   * @see {@link MetaScryApi.vault}
   * @see {@link MetaScryApi.folder}
   */
  get note(): TFile;

  /**
   * The current path of the current note without the extension
   * 
   * @alias {@link path}
   * 
   * @see {@link pathex}
   * @see {@link PathEx}
   * @see {@link MetaScryApi.path}
   */
  get Path(): string;
  
  /**
   * The current path of the current note without the extension
   * 
   * @alias {@link Path}
   * 
   * @see {@link pathex}
   * @see {@link PathEx}
   * @see {@link MetaScryApi.path}
   */
  get path(): string;

  /**
   * The current path of the current note with it's extension
   * 
   * @alias {@link pathex}
   * 
   * @see {@link path}
   * @see {@link Path}
   * @see {@link MetaScryApi.path}
   */
  get PathEx(): string;
  
  /**
   * The current path of the current note with it's extension
   * 
   * @alias {@link PathEx}
   * 
   * @see {@link path}
   * @see {@link Path}
   * @see {@link MetaScryApi.path}
   */
  get pathex(): string;

  /**
   * Get just the frontmatter of the current file
   * 
   * @alias {@link fm}
   * @alias {@link matter}
   * @alias {@link frontmatter}
   * @alias {@link Frontmatter}
   * 
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get Matter(): Frontmatter;
  
  /**
   * Get just the frontmatter of the current file
   * 
   * @alias {@link fm}
   * @alias {@link matter}
   * @alias {@link frontmatter}
   * @alias {@link Matter}
   * 
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get matter(): Frontmatter;
  
  /**
   * Get just the frontmatter of the current file
   * 
   * @alias {@link Matter}
   * @alias {@link matter}
   * @alias {@link frontmatter}
   * @alias {@link Frontmatter}
   * 
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get fm(): Frontmatter;

  /**
   * Get just the frontmatter of the current file
   * 
   * @alias {@link fm}
   * @alias {@link matter}
   * @alias {@link frontmatter}
   * @alias {@link Matter}
   * 
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get Frontmatter(): Frontmatter;
  
  /**
   * Get just the frontmatter of the current file
   * 
   * @alias {@link fm}
   * @alias {@link matter}
   * @alias {@link Matter}
   * @alias {@link Frontmatter}
   * 
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get frontmatter(): Frontmatter;

  /**
   * Access the cached vales for the current file only.
   * 
   * @alias {@link cache}
   * @alias {@link global#cache}
   * 
   * @see {@link MetaScryApi.cache}
   */
  get Cache(): Cache;

  /**
   * Access the cached vales for the current file only.
   * 
   * @alias {@link Cache}
   * @alias {@link global#cache}
   * 
   * @see {@link MetaScryApi.cache}
   */
  get cache(): Cache;

  /**
   * Access the sections for the current file only.
   * 
   * @alias {@link sections}
   * 
   * @see {@link MetaScryApi.sections}
   */
  get Sections(): Sections;
  
  /**
   * Access the sections for the current file only.
   * 
   * @alias {@link Sections}
   * 
   * @see {@link MetaScryApi.sections}
   */
  get sections(): Sections;

  /**
   * Patch individual properties of the current file's frontmatter metadata.
   *
   * @param {Record<string, any>|any} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string|null} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to patch said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to patch said data prototype file. You can also pass in the path here instead.
   *
   * @see {@link MetaScryApi.patch}
   * @see {@link set}
   * @see {@link clear}
   */
  patch(frontmatterData: any, propertyName?: string | null, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;
  
  /**
   * Replace the existing frontmatter the current file with entirely new data, clearing out all old data in the process.
   *
   * @param {Frontmatter} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   *
   * @see {@link MetaScryApi.set}
   * @see {@link patch}
   * @see {@link clear}
   */
  set(frontmatterData: any, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;
  
  /**
   * Used to clear values from metadata.
   *
   * @param {object|string} file The file to clear properties for. defaults to the current file.
   * @param {string|Array<string>|Record<string, any>|null} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
   *
   * @see {@link MetaScryApi.clear}
   * @see {@link set}
   * @see {@link patch}
   */
  clear(frontmatterProperties?: string | Array<string> | object | null, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;
}

/**
 * Static Api accessed through "Metadata" global calls
 */
export interface StaticMetaScryApi {
  [key: string | number | symbol]: any;
  Components?: Record<string, any>;
  SectionComponents?: Record<string, any>;
  Api: MetaScryApi;
  Plugin: MetaScryPluginApi
}

//#endregion

//#region Sections

export interface Heading {

  /**
   * The text of the heading/section title. (without the #s)
   * 
   * @alias {@link text}
   * @alias {@link txt}
   * @alias {@link Txt}
   */
  get Text(): string;

  /**
   * The text of the heading/section title. (without the #s)
   * 
   * @alias {@link Text}
   * @alias {@link txt}
   * @alias {@link Txt}
   */
  get text(): string;

  /**
   * The text of the heading/section title. (without the #s)
   * 
   * @alias {@link txt}
   * @alias {@link text}
   * @alias {@link Text}
   * 
   * @see {@link md}
   * @see {@link Md}
   */
  get Txt(): string;

  /**
   * The text of the heading/section title. (without the #s)
   * 
   * @alias {@link txt}
   * @alias {@link text}
   * @alias {@link Text}
   * 
   * @see {@link md}
   * @see {@link Md}
   */
  get txt(): string;

  /**
   * The index of the heading (if there's another heading with the same name this gets incremeneted.)
   *
   * @alias {@link Index}
   * 
   * @see {@link level}
   * @see {@link Level}
   */
  get index(): number;

  /**
   * The index of the heading (if there's another heading with the same name this gets incremeneted.)
   *
   * @alias {@link index}
   * 
   * @see {@link level}
   * @see {@link Level}
   */
  get Index(): number;

  /**
   * The depth/level of the heading/The number of #s in the header.
   * 
   * @alias {@link level}
   * 
   * @see {@link index}
   * @see {@link Index}
   */
  get Level(): number;

  /**
   * The depth/level of the heading/The number of #s in the header.
   * 
   * @alias {@link Level}
   * 
   * @see {@link index}
   * @see {@link Index}
   */
  get level(): number;

  /**
   * The plain-text markdown of the section's header Pre-processed, with the ##s
   * 
   * @alias {@link Md}
   * 
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get md(): string;

  /**  
   * The plain-text markdown of the section's header Pre-processed, with the ##s
   * 
   * @alias {@link md}
   * 
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get Md(): string;
}

/**
 * Information about a section of a note
 */
interface SectionInfo {

  /**
   * The path of the note this section is from with the header appended after a #
   * 
   * @alias {@link Path}
   * 
   * @see {@link keys}
   * @see {@link id}
   * @see {@link Keys}
   * @see {@link Id}
   */
  get path(): string;
  
  /**
   * The path of the note this section is from with the header appended after a #
   *
   * @alias {@link path}
   * 
   * @see {@link keys}
   * @see {@link id}
   * @see {@link Keys}
   * @see {@link Id}
   */
  get Path(): string;

  /**
   * A unique key/identifier for this section out of all notes and sections.
   * 
   * @alias {@link id}
   * 
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link header}
   * @see {@link Header}
   * @see {@link keys}
   * @see {@link Keys}
   * @see {@link path}
   * @see {@link Path}
   */
  get Id(): string;
  
  /**
   * A unique key/identifier for this section out of all notes and sections.
   * 
   * @alias {@link Id}
   * 
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link header}
   * @see {@link Header}
   * @see {@link keys}
   * @see {@link Keys}
   * @see {@link path}
   * @see {@link Path}
   */
  get id(): string;

  /**
   * The keys that can be used to identify and access this section.
   *
   * @alias {@link keys}
   * 
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link header}
   * @see {@link Header}
   * @see {@link Id}
   * @see {@link id}
   */
  get Keys(): string[];

  /**
   * The keys that can be used to identify and access this section.
   *
   * @alias {@link keys}
   * 
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link header}
   * @see {@link Header}
   * @see {@link Id}
   * @see {@link id}
   */
  get keys(): string[];

  /**
   * The number of sub-sections directly within this section.
   *
   * @alias {@link count}
   *
   * @see {@link subtitles}
   * @see {@link sections}
   * @see {@link unique}
   * @see {@link Subtitles}
   * @see {@link Sections}
   * @see {@link Unique}
   */
  get Count(): number;

  /**
   * The number of sub-sections directly within this section.
   *
   * @alias {@link Count}
   *
   * @see {@link subtitles}
   * @see {@link sections}
   * @see {@link unique}
   * @see {@link Subtitles}
   * @see {@link Sections}
   * @see {@link Unique}
   */
  get count(): number;

  /**
   * The section that contains this one, if there is one. If not this is a root section.
   * 
   * @alias {@link container}
   * 
   * @see {@link root}
   * @see {@link Root}
   */
  get Container(): Section | null;
  
  /**
   * The section that contains this one, if there is one. If not this is a root section.
   *
   * @alias {@link Container}
   * 
   * @see {@link root}
   * @see {@link Root}
   */
  get container(): Section | null;

  /**
   * The sub-sections directly under this section.
   *
   * @alias {@link sections}
   *
   * @see {@link subtitles}
   * @see {@link unique}
   * @see {@link Subtitles}
   * @see {@link Unique}
   */
  get Sections(): Record<string, Section[]>;

  /**
   * The sub-sections directly under this section.
   *
   * @alias {@link Sections}
   *
   * @see {@link subtitles}
   * @see {@link unique}
   * @see {@link Subtitles}
   * @see {@link Unique}
   */
  get sections(): Record<string, Section[]>;

  /**
   * The unique sub-titles/headings directly under this section heading (not sub-sub headings)
   *
   * @alias {@link Subtitles}
   *
   * @see {@link sections}
   * @see {@link unique}
   * @see {@link Sections}
   * @see {@link Unique}
   */
  get subtitles(): Heading[];

  /**
   * The unique sub-titles/headings directly under this section heading (not sub-sub headings)
   * 
   * @alias {@link subtitles}
   *
   * @see {@link sections}
   * @see {@link unique}
   * @see {@link Sections}
   * @see {@link Unique}
   */
  get Subtitles(): Heading[];

  /**
   * Get all the unique sub-sections in this section.
   * 
   * @alias {@link Unique}
   *
   * @see {@link sections}
   * @see {@link Subtitles}
   * @see {@link Sections}
   * @see {@link subtitles}
   */
  get unique(): Section[];

  /**
   * Get all the unique sub-sections in this section.
   * 
   * @alias {@link unique}
   *
   * @see {@link sections}
   * @see {@link Subtitles}
   * @see {@link Sections}
   * @see {@link subtitles}
   */
  get Unique(): Section[];

  /**
   * The Sections object used to build the sections in the file this section is from.
   * Contains info about the note/file.
   * 
   * @alias {@link root}
   * 
   * @see {@link Container}
   * @see {@link container}
   */
  get Root(): Sections;

  /**
   * The Sections object used to build the sections in the file this section is from.
   * Contains info about the note/file.
   * 
   * @alias {@link Root}
   * 
   * @see {@link Container}
   * @see {@link container}
   */
  get root(): Sections;

  /**
   * The heading of this section
   * 
   * @alias {@link Header}
   * 
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link keys}
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Count}
   * @see {@link count}
   * @see {@link path}
   * @see {@link Path}
   */
  get header(): Heading;
  
  /**
   * The heading of this section
   * 
   * @alias {@link header}
   * 
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link keys}
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Count}
   * @see {@link count}
   * @see {@link path}
   * @see {@link Path}
   */
  get Header(): Heading;

  /**
   * (Async!) 
   * The plain-text markdown of the section's entire contents. Pre-processed.
   * This contains all sub-section text and headers as well.
   * @async
   * 
   * @alias {@link Md}
   * 
   * @see {@link Html}
   * @see {@link html}
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link Text}
   * @see {@link text}
   */
  get md(): Promise<string>;

  /**
   * (Async!) 
   * The plain-text markdown of the section's entire contents. Pre-processed.
   * This contains all sub-section text and headers as well.
   * @async
   * 
   * @alias {@link md}
   * 
   * @see {@link Html}
   * @see {@link html}
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get Md(): Promise<string>;

  /**
   * (Async!) 
   * The html element rendered from the markdown based on all of obsidian's rendering passes.
   * @async
   * 
   * @alias {@link Html}
   * 
   * @see {@link Md}
   * @see {@link md}
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get html(): Promise<HTMLElement>;

  /**
   * (Async!) 
   * The html element rendered from the markdown based on all of obsidian's rendering passes.
   * @async
   * 
   * @alias {@link html}
   * 
   * @see {@link Md}
   * @see {@link md}
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get Html(): Promise<HTMLElement>;

  /**
   * (Async!) 
   * Get the plain text version of the processed markdown/html.
   * @async
   * 
   * @alias {@link txt}
   * @alias {@link text}
   * @alias {@link Text}
   * 
   * @see {@link Md}
   * @see {@link md}
   * @see {@link Html}
   * @see {@link html}
   */
  get Txt(): Promise<string>;

  /**
   * (Async!) 
   * Get the plain text version of the processed markdown/html.
   * @async
   * 
   * @alias {@link Txt}
   * @alias {@link text}
   * @alias {@link Text}
   * 
   * @see {@link Md}
   * @see {@link md}
   * @see {@link Html}
   * @see {@link html}
   */
  get txt(): Promise<string>;

  /**
   * (Async!) 
   * Get the plain text version of the processed markdown/html.
   * @async
   * 
   * @alias {@link text}
   * @alias {@link txt}
   * @alias {@link Txt}
   * 
   * @see {@link Md}
   * @see {@link md}
   * @see {@link Html}
   * @see {@link html}
   */
  get Text(): Promise<string>;

  /**
   * (Async!) 
   * Get the plain text version of the processed markdown/html.
   * @async
   * 
   * @alias {@link Text}
   * @alias {@link txt}
   * @alias {@link Txt}
   * 
   * @see {@link Md}
   * @see {@link md}
   * @see {@link Html}
   * @see {@link html}
   */
  get text(): Promise<string>;
}

/**
 * Sub-sections of a note section
 */
interface SectionChildren {
  /**
   * A sub-section of this section.
   */
  [key: string]: Section
}

/**
 * A collection of sections in a note, and the data to fetch them.
 */
interface SectionsNoteData {
  /**
   * The path to the note for these sections
   * 
   * @alias {@link Path}
   */
  get path(): string;

  /**
   * The path to the note for these sections
   * 
   * @alias {@link path}
   */
  get Path(): string;

  /**
   * The number of total sections, and sub sections.
   * 
   * @alias {@link Count}
   * 
   * @see {@link all}
   * @see {@link All}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link root}
   * @see {@link Root}
   */
  get count(): number;

  /**
   * The number of total sections, and sub sections.
   * 
   * @alias {@link count}
   * 
   * @see {@link all}
   * @see {@link All}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link root}
   * @see {@link Root}
   */
  get Count(): number;

  /**
   * All sections and sub-sections in the file, indexed by name. values are in arrays in case of duplicate headings
   * 
   * @alias {@link All}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link root}
   * @see {@link Root}
   */
  get all(): Record<string, Section[]>;

  /**
   * All sections and sub-sections in the file, indexed by name. values are in arrays in case of duplicate headings
   * 
   * @alias {@link all}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link root}
   * @see {@link Root}
   */
  get All(): Record<string, Section[]>;

  /**
   * All highest level/root sections (not sub-sections) in the file, indexed by name. values are in arrays in case of duplicate headings
   * 
   * @alias {@link Root}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link all}
   * @see {@link All}
   */
  get root(): Record<string, Section[]>;

  /**
   * All highest level/root sections (not sub-sections) in the file, indexed by name. values are in arrays in case of duplicate headings
   *
   * @alias {@link Root}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link all}
   * @see {@link All}
   */
  get Root(): Record<string, Section[]>;

  /**
   * The unique headers and sub-headers in this file
   
   * @alias {@link headers}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link root}
   * @see {@link Root}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link all}
   * @see {@link All}
   */
  get Headers(): Heading[];

  /**
   * The unique headers and sub-headers in this file
   
   * @alias {@link Headers}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link root}
   * @see {@link Root}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link all}
   * @see {@link All}
   */
  get headers(): Heading[];

  /**
   * Get all the unique sections in this note.
   
   * @alias {@link Unique}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link root}
   * @see {@link Root}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link all}
   * @see {@link All}
   */
  get unique(): Section[];

  /**
   * Get all the unique sections in this note.
   *
   * @alias {@link Unique}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link root}
   * @see {@link Root}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link all}
   * @see {@link All}
   */
  get Unique(): Section[];

  named(name: string): Section[];
}

/**
 * Information about sections in a note.
 */
interface SectionsCollection {
  /**
   * A section, indexe by one of it's splayed keys.
   */
  [key: string]: Section
}

/**
 * A section of a note.
 */
export type Section = SectionChildren & SectionInfo;

/**
 * All of the sections in a note.
 */
export type Sections = SectionsCollection & SectionsNoteData;

//#endregion