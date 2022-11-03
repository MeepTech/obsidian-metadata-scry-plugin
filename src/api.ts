import { CachedMetadata, Plugin, TFile } from "obsidian";

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
   * The current instance of the Metadata Api object/interface
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
   * if hasprop, getprop, and setprop should be added to all objects
   */
  defineObjectPropertyHelperFunctions: boolean;
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
  path: string;
};

/**
 * An internal cache for a note.
 */
export type Cache = {
  [prpertyKey: string]: any;
} & Object;

/**
 * The frontmatter of a note.
 */
export type Frontmatter = {
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
  starred?: boolean;
  day?: Date;
}

/**
 * An obsidian link.
 * Conmpiled by dataview
 */
interface DataLink {

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
export type MetaData = {
  file?: FileData;
  cache?: Cache;
} & Frontmatter;

/**
 * A full metadata set returned from meta.get.
 */
export type DvData = {
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

export interface MetadataApi {
  get Plugin(): MetadataPlugin;
  get plugin(): MetadataPlugin;
  get Current(): CurrentApi;
  get current(): CurrentApi;
  get Data(): MetaData;
  get data(): MetaData;
  frontmatter(file?: string | TFile | null): Frontmatter;
  sections(file?: string | TFile | null): Sections;
  dv(file?: string | TFile | null): DvData;
  cache(file?: string | TFile | null): Cache;
  prototypes(prototypePath: string): object;
  values(dataPath: string): object;
  get(file?: string | TFile | null, sources?: MetadataSources | boolean): MetaData;
  patch(file: string | TFile | null, frontmatterData: any, propertyName?: string | null, toValuesFile?: boolean | string, prototype?: string | boolean): void;
  set(file: string | TFile | null, frontmatterData: any, toValuesFile?: boolean | string, prototype?: string | boolean): void;
  clear(file?: string | TFile | null, frontmatterProperties?: string | Array<string> | object | null, toValuesFile?: boolean | string, prototype?: string | boolean): void;
  path(relativePath?: string | null, extension?: string | boolean, rootFolder?: string | null): string
}

export interface CurrentApi {
  get Data(): MetaData;
  get data(): MetaData;
  get Note(): TFile;
  get note(): TFile;
  get Path(): string;
  get path(): string;
  get PathEx(): string;
  get pathex(): string;
  get Matter(): Frontmatter;
  get matter(): Frontmatter;
  get Cache(): Cache;
  get cache(): Cache;
  get Sections(): Sections;
  get sections(): Sections;
  patch(frontmatterData: any, propertyName?: string | null, toValuesFile?: boolean | string, prototype?: string | boolean): void;
  set(frontmatterData: any, toValuesFile?: boolean | string, prototype?: string | boolean): void;
  clear(frontmatterProperties?: string | Array<string> | object | null, toValuesFile?: boolean | string, prototype?: string | boolean): void;
}

//#endregion

//#region Sections

interface SectionInfo {
  level: number;
  keys: string[];
  count: number;
  title: string;
  parent: Section|null;
  children: Record<string, Section>;
  note: SectionsNoteData;
  get header(): string;
  get contents(): string;
  get rendered(): HTMLElement;
}

interface SectionChildren {
  [key: string]: Section
}

interface SectionsNoteData {
  path: string;
  contents: string;
  all: Record<string, Section[]>;
  named(name: string): Section[];
}

interface SectionsCollection {
  [key: string]: Section
}

export type Section = SectionChildren & SectionInfo;
export type Sections = SectionsCollection & SectionsNoteData;

//#endregion