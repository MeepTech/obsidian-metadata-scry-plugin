import { CachedMetadata, Plugin, TAbstractFile, TFile, TFolder } from "obsidian";

//#region Plugin

/**
 * Enum for the kebab splay settings options
 */
export enum SplayKebabCasePropertiesOption {
  Disabled = 0,
  Lowercase = 1,
  CamelCase = 2,
  LowerAndCamelCase = 3
}

/**
 * Static container for the current metadata plugin instance. 
 * Internal use only.
 */
export class PluginContainer {

  /**
   * The current instance of the metadata api plugin.
   */
  static Instance: MetadataPlugin;

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
}

/**
 * Interface for the plugin itself
 */
export type MetadataPlugin = {
  /**
   * Get the current instance of the Metadata Api object/interface
   */
  get api(): MetadataApi;

  /**
   * The settings for the api.
   * Call saveSettings if you update them.
   */
  settings: MetadataApiSettings;

  /**
   * Call after updating the settings object to re-load the api
   */
  saveSettings(): void;
} & Plugin;

/**
 * Interface for the plugin settings
 */
export interface MetadataApiSettings {
  /**
   * The global property key for the 'cache' variable 
   */
  globalCacheName: string;

  /**
   * The global property key for the 'meta' variable 
   */
  globalMetadataApiName: string;

  /**
   * The global property key for the 'path' function 
   */
  globalPathName: string;

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
 * A full metadata set returned from meta.get.
 */
export type MetaData = {
  /**
   * The DV file object
   */
  file?: FileData;
  /**
   * The DV file object
   */
  File?: FileData;
  /**
   * The metadata api cache
   */
  cache?: Cache;
  /**
   * The metadata api cache
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
 * Sections is added by the current Metadata Api.
 */
export type FileData = {
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
  sections?: Sections;
  Sections?: Sections;
  starred?: boolean;
  day?: Date;
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
}

/**
 * A md task or list item. 
 * Conmpiled by dataview.
 */
interface DataTask {

}

/**
 * A full metadata set returned from meta.get.
 */
export type DvData = {
  /**
   * The dv file object
   */
  file: FileData;
} & Frontmatter;

//#endregion

//#region Apis

/**
 * The sources to pull Metadata values from for a file.
 */
export interface MetadataSources {
  /**
   * The 'file' field containing metadata about the file itself
   */
  FileInfo: boolean;
   
  /**
   * The Frontmatter (YAML at the top of a note)
   */
  Frontmatter: boolean;
   
  /**
   * Inline Dataview data fields
   */
  DataviewInline: boolean;
   
  /**
   * Cached values from the Metadata.Cache.
   */
  Cache: boolean;
   
  /**
   * Sections from the note itself
   */
  Sections: boolean;
}

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
export type UpdateOptions = {
  toValuesFile?: boolean | string;
  prototype?: string | boolean;
};

/**
 * Interface for the Api.
 * Access and edit metadata about a file from multiple sources.
 */
export interface MetadataApi {
  /**
   * Get the plugin that runs this api
   */
  get Plugin(): MetadataPlugin;

  /**
   * Get the plugin that runs this api
   */
  get plugin(): MetadataPlugin;

  /**
   * Used to fetch various metadata for the current file.
   */
  get Current(): CurrentApi;

  /**
   * Used to fetch various metadata for the current file.
   */
  get current(): CurrentApi;

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Data(): MetaData;

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get data(): MetaData;

  /**
   * Get a file or folder from the vault
   * 
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   * 
   * @returns the found TFile or TFolder
   */
  vault(source: FileSource): TFile | TFolder | TAbstractFile | null;
  
  /**
   * Used to fetch the "Obsidian Metadata File Cache" object from the obsidian api.
   * 
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns The cached file metadata object if it exists, or an array of objects if a folder was provided.
   */
  omfc(source?: FileSource): CachedFileMetadata | CachedFileMetadata[] | null;

  /**
   * Get just the frontmatter for the given file.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the frontmatter for the file.
   */
  frontmatter(source?: FileSource): Frontmatter | Frontmatter[] | null;

  /**
   * Get just the sections for the given file.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the sections under their headings for the file.
   */
  sections(source?: FileSource): Sections | Sections[] | null;

  /**
   * Get the dataview api values for the given file; Inline, frontmatter, and the file value.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string, or a dv query source.
   *
   * @returns Just the dataview(+frontmatter) values for the file.
   */
  dv(source?: FileSource): DvData | DvData[] | null;

  /**
   * Get just the (metadata-api) cache data for a file.
   *
   * @param {FileSource} source The file/folder object(with a path property) or the full path string.
   *
   * @returns The cache data only for the requested file
   */
  cache(source?: FileSource): Cache | Cache[] | null;

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
   */
  get(source?: FileSource, sources?: MetadataSources | boolean): MetaData | MetaData[] | null;
  
  /**
   * Patch individual properties of the frontmatter metadata.
   *
   * @param {FileItem} file The name of the file or the file object with a path
   * @param {Record<string, any>|any} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string|null} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to patch said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to patch said data prototype file. You can also pass in the path here instead.
   *
   * @returns The updated Metadata.
   */
  patch(file: FileItem, frontmatterData: Record<string, any> | any, propertyName?: string | null, options?: UpdateOptions): void;
  
  /**
   * Replace the existing frontmatter of a file with entirely new data, clearing out all old data in the process.
   *
   * @param {FileItem} file The name of the file or the file object with a path
   * @param {Frontmatter} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   *
   * @returns The updated Metadata
   */
  set(file: FileItem, frontmatterData: any, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;

  /**
   * Used to clear values from metadata.
   *
   * @param {FileItem} file The file to clear properties for. defaults to the current file.
   * @param {string|Array<string>|Record<string, any>|null} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
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
   */
  path(relativePath?: string | null, extension?: string | boolean, rootFolder?: string | null): string
}

/**
 * Interface for the current note within the api
 */
export interface CurrentApi {

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Data(): MetaData;

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get data(): MetaData;
  
  /**
   * The current note focused by the workspace.
   */
  get Note(): TFile;
  
  /**
   * The current note focused by the workspace.
   */
  get note(): TFile;

  /**
   * The current path of the current note
   */
  get Path(): string;
  
  /**
   * The current path of the current note
   */
  get path(): string;

  /**
   * The current path of the current note with it's extension
   */
  get PathEx(): string;
  
  /**
   * The current path of the current note with it's extension
   */
  get pathex(): string;

  /**
   * Get just the frontmatter of the current file
   */
  get Matter(): Frontmatter;
  
  /**
   * Get just the frontmatter of the current file
   */
  get matter(): Frontmatter;

  /**
   * Access the cached vales for the current file only.
   */
  get Cache(): Cache;

  /**
   * Access the cached vales for the current file only.
   */
  get cache(): Cache;

  /**
   * Access the sections for the current file only.
   */
  get Sections(): Sections;
  
  /**
   * Access the sections for the current file only.
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
   * @returns The updated Metadata.
   */
  patch(frontmatterData: any, propertyName?: string | null, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;
  
  /**
   * Replace the existing frontmatter the current file with entirely new data, clearing out all old data in the process.
   *
   * @param {Frontmatter} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   *
   * @returns The updated Metadata
   */
  set(frontmatterData: any, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;
  
  /**
   * Used to clear values from metadata.
   *
   * @param {object|string} file The file to clear properties for. defaults to the current file.
   * @param {string|Array<string>|Record<string, any>|null} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
   */
  clear(frontmatterProperties?: string | Array<string> | object | null, options?: {toValuesFile?: boolean | string, prototype?: string | boolean}): void;
}

//#endregion

//#region Sections

export interface Heading {

  /**
   * The text of the heading/section title. (without the #s)
   */
  get Text(): string;

  /**
   * The text of the heading/section title. (without the #s)
   */
  get text(): string;

  /**
   * The index of the heading (if there's another heading with the same name this gets incremeneted.)
   */
  get index(): number;

  /**
   * The index of the heading (if there's another heading with the same name this gets incremeneted.)
   */
  get Index(): number;

  /**
   * The depth/level of the heading/The number of #s in the header.
   */
  get Level(): number;

  /**
   * The depth/level of the heading/The number of #s in the header.
   */
  get level(): number;

  /**
   * The plain-text markdown of the section's header Pre-processed, with the ##s
   */
  get md(): string;

  /**  
   * The plain-text markdown of the section's header Pre-processed, with the ##s
   */
  get Md(): string;
}

/**
 * Information about a section of a note
 */
interface SectionInfo {

  /**
   * The keys that can be used to identify and access this section.
   */
  get Keys(): string[];

  /**
   * The keys that can be used to identify and access this section.
   */
  get keys(): string[];

  /**
   * The number of sub-sections directly within this section.
   */
  get Count(): number;

  /**
   * The number of sub-sections directly within this section.
   */
  get count(): number;

  /**
   * The section that contains this one, if there is one. If not this is a root section.
   */
  get Container(): Section | null;
  
  /**
   * The section that contains this one, if there is one. If not this is a root section.
   */
  get container(): Section | null;

  /**
   * The sub-sections directly under this section.
   */
  get Sections(): Record<string, Section[]>;

  /**
   * The sub-sections directly under this section.
   */
  get sections(): Record<string, Section[]>;

  /**
   * The unique sub-titles/headings directly under this section heading (not sub-sub headings)
   */
  get subtitles(): Heading[];

  /**
   * The unique sub-titles/headings directly under this section heading (not sub-sub headings)
   */
  get Subtitles(): Heading[];

  /**
   * Get all the unique sub-sections in this section.
   */
  get unique(): Section[];

  /**
   * Get all the unique sub-sections in this section.
   */
  get Unique(): Section[];

  /**
   * The Sections object used to build the sections in the file this section is from.
   * Contains info about the note/file.
   */
  get Root(): Sections;

  /**
   * The Sections object used to build the sections in the file this section is from.
   * Contains info about the note/file.
   */
  get root(): Sections;

  /**
   * The direct code of the header, with the #s
   */
  get header(): Heading;
  
  /**
   * The direct code of the header, with the #s
   */
  get Header(): Heading;

  /**
   * The plain-text markdown of the section's entire contents. Pre-processed.
   * This contains all sub-section text and headers as well.
   */
  get md(): Promise<string>;

  /**
   * The plain-text markdown of the section's entire contents. Pre-processed.
   * This contains all sub-section text and headers as well.
   */
  get Md(): Promise<string>;

  /**
   * The html element rendered from the markdown based on all of obsidian's rendering passes.
   */
  get html(): Promise<HTMLElement>;

  /**
   * The html element rendered from the markdown based on all of obsidian's rendering passes.
   */
  get Html(): Promise<HTMLElement>;

  /**
   * The path of the note this section is from with the header appended after a #
   */
  get path(): string;
  
  /**
   * The path of the note this section is from with the header appended after a #
   */
  get Path(): string;
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
   */
  get path(): string;
  /**
   * The path to the note for these sections
   */
  get Path(): string;
  /**
   * The number of total sections, and sub sections.
   */
  get count(): number;
  /**
   * The number of total sections, and sub sections.
   */
  get Count(): number;
  /**
   * All sections and sub-sections in the file, indexed by name. values are in arrays in case of duplicate headings
   */
  get all(): Record<string, Section[]>;
  /**
   * All sections and sub-sections in the file, indexed by name. values are in arrays in case of duplicate headings
   */
  get All(): Record<string, Section[]>;
  /**
   * All highest level/root sections (not sub-sections) in the file, indexed by name. values are in arrays in case of duplicate headings
   */
  get root(): Record<string, Section[]>;
  /**
   * All highest level/root sections (not sub-sections) in the file, indexed by name. values are in arrays in case of duplicate headings
   */
  get Root(): Record<string, Section[]>;
  /**
   * The unique headers and sub-headers in this file
   */
  get Headers(): Heading[];
  /**
   * The unique headers and sub-headers in this file
   */
  get headers(): Heading[];
  /**
   * Get all the unique sections in this note.
   */
  get unique(): Section[];
  /**
   * Get all the unique sections in this note.
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