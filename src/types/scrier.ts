import {
  TAbstractFile,
  TFile,
  TFolder
} from "obsidian";
import {
  DataArray,
  DataviewApi} from "obsidian-dataview";
import { MetaScryPluginApi } from "./plugin";
import { Frontmatter, Metadata, CachedFileMetadata, DvData, Cache } from "./data";
import { Sections } from "./sections";
import { NotesSource, MetadataSources, SingleFileSource } from "./sources";
import { MetadataEditApi, FrontmatterUpdateOptions } from "./editor";
import { CurrentNoteMetaScryApi } from "./current";
import { InputFieldMarkdownRenderChildType } from "./external/meta-bind";
import { MetaBindApi } from "./bind";

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
   * A link to the dv plugin api
   *
   * @alias {@link Dv}
   * @alias {@link MetadataScrier.DataviewApi}
   * @alias {@link getAPI} From DataviewApi
   *
   * @see {@link dataviewFrontmatter}
   * @see {@link CurrentFileMetaScryApi.dataviewFrontmatter}
   */
  get dv(): DataviewApi;

  /**
   * A link to the dv plugin api
   *
   * @alias {@link dv}
   * @alias {@link MetadataScrier.DataviewApi}
   * @alias {@link getAPI} From DataviewApi
   *
   * @see {@link dataviewFrontmatter}
   * @see {@link CurrentFileMetaScryApi.dataviewFrontmatter}
   */
  get Dv(): DataviewApi;

  /**
   * A link to the opd-metadata-lib plugin api
   *
   * @alias {@link edit}
   *
   * @see {@link CurrentFileMetaScryApi.edit}
   * @see {@link patch}
   * @see {@link set}
   * @see {@link clear}
   */
  get Edit(): MetadataEditApi;

  /**
   * A link to the opd-metadata-lib plugin api
   *
   * @alias {@link Edit}
   *
   * @see {@link CurrentFileMetaScryApi.edit}
   * @see {@link patch}
   * @see {@link set}
   * @see {@link clear}
   */
  get edit(): MetadataEditApi;

  /**
   * Used to fetch various metadata for the current file.
   *
   * @alias {@link current}
   *
   * @see {@link get}
   * @see {@link data}
   */
  get Current(): CurrentNoteMetaScryApi;

  /**
   * Used to fetch various metadata for the current file.
   *
   * @alias {@link Current}
   *
   * @see {@link get}
   * @see {@link data}
   */
  get current(): CurrentNoteMetaScryApi;

  /**
   * Get all Metadata from the default sources for the current file.
   *
   * @alias {@link data}
   * @alias {@link CurrentNoteMetaScryApi.data}
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
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns the found TFile or TFolder
   *
   * @alias {@link folder}
   * @alias {@link file}
   *
   * @see {@link CurrentNoteMetaScryApi.note}
   */
  vault(source: NotesSource): TFile | TFolder | TAbstractFile | null;

  /**
   * Get a file from the vault (alias for vault())
   *
   * @param {NotesSource} source The file object(with a path property) or the full path string
   *
   * @returns the found TFile
   *
   * @alias {@link vault}
   *
   * @see {@link folder}
   * @see {@link CurrentNoteMetaScryApi.note}
   */
  file(source: NotesSource): TFile | null;

  /**
   * Get a folder from the vault
   *
   * @param {NotesSource} source The folder object(with a path property) or the full path string
   *
   * @returns the found TFolder
   *
   * @alias {@link vault}
   *
   * @see {@link file}
   * @see {@link CurrentNoteMetaScryApi.note}
   */
  folder(source: NotesSource): TFolder | null;

  /**
   * Used to fetch the "Obsidian Metadata File Cache" object from the obsidian api.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns The cached file metadata object if it exists, or an array of objects if a folder was provided.
   *
   * @alias {@link omfc}
   */
  obsidianMetadataFileCache(source?: NotesSource): CachedFileMetadata | CachedFileMetadata[] | null;

  /**
   * Used to fetch the "Obsidian Metadata File Cache" object from the obsidian api.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns The cached file metadata object if it exists, or an array of objects if a folder was provided.
   *
   * @alias {@link obsidianMetadataFileCache}
   */
  omfc(source?: NotesSource): CachedFileMetadata | CachedFileMetadata[] | null;

  /**
   * Used to fetch the markdown text of the entire file or all provided files.
   * @async
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @alias {@link markdown}
   *
   * @see {@link html}
   * @see {@link text}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.markdown}
   * @see {@link Section.markdown}
   */
  md(source?: NotesSource): Promise<string>;

  /**
   * Used to fetch the markdown text of the entire file or all provided files.
   * @async
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @alias {@link md}
   *
   * @see {@link html}
   * @see {@link text}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.markdown}
   * @see {@link Section.markdown}
   */
  markdown(source?: NotesSource): Promise<string>;

  /**
   * Used to fetch the rendered html elements resulting from the markdown of the entire file (or all provided files).
   * @async
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   * @param {string} rawMd (optional) Md to render instead of the full file contents.
   * 
   * @see {@link markdown}
   * @see {@link text}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.html}
   * @see {@link Section.html}
   */
  html(source?: NotesSource, rawMd?: string | undefined): Promise<HTMLElement>;

  /**
   * Used to fetch the plain text contents of the fully rendered markdown+html obsidian note.
   * @async
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @alias {@link text}
   *
   * @see {@link markdown}
   * @see {@link html}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.text}
   * @see {@link Section.text}
   */
  txt(source?: NotesSource): Promise<string>;

  /**
   * Used to fetch the plain text contents of the fully rendered markdown+html obsidian note.
   * @async
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @alias {@link txt}
   *
   * @see {@link markdown}
   * @see {@link html}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.text}
   * @see {@link Section.text}
   */
  text(source?: NotesSource): Promise<string>;

  /**
   * Used to embed the desired link into a file using a div element.
   * 
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string with the desired optional section after a #
   * @param container (Optional) an existing container to attach the element to.
   * @param intoNote (Optional) the note you are embeding into, this defaults to the current note.
   *
   * @returns A div with the embeded content attached.
   *
   * @see {@link html}
   * @see {@link Section.embed}
   */
  embed(
    source: NotesSource,
    container?: HTMLElement | undefined,
    intoNote?: SingleFileSource | undefined
  ): HTMLElement

  /**
   * Get just the frontmatter for the given file.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the frontmatter for the file.
   *
   * @alias {@link fm}
   * @alias {@link matter}
   *
   * @see {@link get}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   */
  frontmatter(source?: NotesSource): Frontmatter | Frontmatter[] | null;

  /**
   * Get just the frontmatter for the given file.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the frontmatter for the file.
   *
   * @alias {@link frontmatter}
   * @alias {@link matter}
   *
   * @see {@link get}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   */
  fm(source?: NotesSource): Frontmatter | Frontmatter[] | null;

  /**
   * Get just the frontmatter for the given file.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the frontmatter for the file.
   *
   * @alias {@link fm}
   * @alias {@link frontmatter}
   *
   * @see {@link get}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   */
  matter(source?: NotesSource): Frontmatter | Frontmatter[] | null;

  /**
   * Get just the sections for the given file.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string
   *
   * @returns Just the sections under their headings for the file.
   *
   * @see {@link get}
   * @see {@link html}
   * @see {@link markdown}
   * @see {@link text}
   * @see {@link CurrentNoteMetaScryApi.sections}
   */
  sections(source?: NotesSource): Sections | Sections[] | null;

  /**
   * Get the dataview api values for the given file; Inline, frontmatter, and the file value.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string, or a dv query source.
   * @param {boolean} useSourceQuery (Optional) If you want to use a dv source query instead of assuming a file path is provided. Defaults to false (""s are added to the passed in path by default).
   *
   * @returns Just the dataview(+frontmatter) values for the file.
   *
   * @alias {@link dataviewFrontmatter}
   *
   * @see {@link get}
   * @see {@link data}
   * @see {@link frontmatter}
   * @see {@link CurrentNoteMetaScryApi.dataviewFrontmatter}
   */
  dvMatter(source?: NotesSource, useSourceQuery?: boolean): DvData | DataArray<DvData | DataArray<any> | null> | null;

  /**
   * Get the dataview api values for the given file; Inline, frontmatter, and the file value.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string, or a dv query source.
   * @param {boolean} useSourceQuery (Optional) If you want to use a dv source query instead of assuming a file path is provided. Defaults to false (""s are added to the passed in path by default).
   *
   * @returns Just the dataview(+frontmatter) values for the file.
   *
   * @alias {@link dvMatter}
   *
   * @see {@link get}
   * @see {@link data}
   * @see {@link frontmatter}
   * @see {@link CurrentNoteMetaScryApi.dataviewFrontmatter
   */
  dataviewFrontmatter(source?: NotesSource, useSourceQuery?: boolean): DvData | DataArray<DvData | DataArray<any> | null> | null;

  /**
   * Get just the (meta-scry) cache data for a file.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string.
   *
   * @returns The cache data only for the requested file
   *
   * @alias {@link temp}
   *
   * @see {@link get}
   * @see {@link globals}
   * @see {@link obsidianMetadataFileCache}
   * @see {@link CurrentNoteMetaScryApi.cache}
   */
  cache(source?: NotesSource): Cache | Cache[];

  /**
   * Get just the (meta-scry) cache data for a file.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string.
   *
   * @returns The cache data only for the requested file
   *
   * @alias {@link cache}
   *
   * @see {@link get}
   * @see {@link globals}
   * @see {@link obsidianMetadataFileCache}
   * @see {@link CurrentNoteMetaScryApi.cache}
   */
  temp(source?: NotesSource): Cache | Cache[];

  /**
   * Get or Set a global values across all obsidian.
   * WARNING DONT USE THIS IF YOU DONT KNOW WHAT YOURE DOING!
   *
   * @param {NotesSource} key The key of the global to fetch or set.
   *
   * @returns The global or globals with the given key(s)
   *
   * @see {@link get}
   * @see {@link cache}
   * @see {@link MetadataScrierPlugin.tryToGetExtraGlobal}
   * @see {@link MetadataScrierPlugin.tryToSetExtraGlobal}
   */
  globals(key: string | string[], setToValue: any): any | any[] | undefined;

  /**
   * Get the desired prototypes
   *
   * @param {string} prototypePath The path to the prototype file desired.
   *
   * @returns An object containing the prototypes in the givne file
   *
    * @see {@link cache}
    * @see {@link globals}
    * @see {@link values}
   */
  prototypes(prototypePath: string): Frontmatter | Frontmatter[] | null;

  /**
   * Get the desired values from data storage
   *
   * @param {string} dataPath The path to the data file desired.
   *
   * @returns An object containing the yaml data stored in the givne file
   *
    * @see {@link cache}
    * @see {@link globals}
    * @see {@link prototypes}
   */
  values(dataPath: string): Frontmatter | Frontmatter[] | null;

  /**
   * Get the Metadata for a given file using the supplied sources.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string.
   * @param {bool|MetadataSources} sources The sources to get metadata from. Defaults to all.
   *
   * @returns The requested metadata
   *
   * @alias {@link from}
   *
   * @see {@link data}
   * @see {@link CurrentNoteMetaScryApi.data}
   * @see {@link frontmatter}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.sections}
   * @see {@link cache}
   * @see {@link CurrentNoteMetaScryApi.cache}
   * @see {@link dataviewFrontmatter}
   * @see {@link CurrentNoteMetaScryApi.dataviewFrontmatter}
   */
  get(source?: NotesSource, sources?: MetadataSources | boolean): Metadata | Metadata[] | null;

  /**
   * Get the Metadata for a given file using the supplied sources.
   *
   * @param {NotesSource} source The file/folder object(with a path property) or the full path string.
   * @param {bool|MetadataSources} sources The sources to get metadata from. Defaults to all.
   *
   * @returns The requested metadata
   *
   * @alias {@link get}
   *
   * @see {@link data}
   * @see {@link CurrentNoteMetaScryApi.data}
   * @see {@link frontmatter}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.sections}
   * @see {@link cache}
   * @see {@link CurrentNoteMetaScryApi.cache}
   * @see {@link dataviewFrontmatter}
   * @see {@link CurrentNoteMetaScryApi.dataviewFrontmatter}
   */
  from(source?: NotesSource, sources?: MetadataSources | boolean): Metadata | Metadata[] | null;

  /**
   * Patch individual properties of the frontmatter metadata.
   * @async
   *
   * @param {SingleFileSource} file The name of the file or the file object with a path
   * @param {Record<string, any>|any} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string|null} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here. 
   * @param {FrontmatterUpdateOptions} options (Optional) options.
   *
   * @see {@link CurrentNoteMetaScryApi.patch}
   * @see {@link set}
   * @see {@link clear}
   */
  patch(
    file: SingleFileSource,
    frontmatterData: Record<string, any> | any,
    propertyName?: string | undefined,
    options?: FrontmatterUpdateOptions
  ): Promise<Frontmatter>;

  /**
   * Replace the existing frontmatter of a file with entirely new data, clearing out all old data in the process.
   * @async
   *
   * @param {SingleFileSource} file The name of the file or the file object with a path
   * @param {Frontmatter} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {FrontmatterUpdateOptions} options (Optional) options.
   * 
   * @see {@link CurrentNoteMetaScryApi.set}
   * @see {@link clear}
   * @see {@link patch}
   */
  set(
    file: SingleFileSource,
    frontmatterData: any,
    options?: FrontmatterUpdateOptions
  ): Promise<Frontmatter>;

  /**
   * Used to clear values from metadata.
   * @async
   *
   * @param {SingleFileSource} file The file to clear properties for. defaults to the current file.
   * @param {string|Array<string>|Record<string, any>|null} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {FrontmatterUpdateOptions} options (Optional) options.
   *
   * @see {@link CurrentNoteMetaScryApi.clear}
   * @see {@link set}
   * @see {@link patch}
   */
  clear(
    file?: SingleFileSource,
    frontmatterProperties?: string | Array<string> | Record<string, any> | undefined,
    options?: FrontmatterUpdateOptions
  ): Promise<Frontmatter>;
 
  /**
   * Make input fields bound to your frontmatter properties! 
   * (Meta-Bind plugin api access)
   * 
   * @alias {@link Bind}
   * @alias {@link inputField}
   * 
   * @see {@link MetaBindPlugin.bindTargetMetadataField}
   * @see {@link MetaBindPlugin.buildDeclaration}
   */
  bind: MetaBindApi;
    
  /**
   * Make input fields bound to your frontmatter properties! 
   * (Meta-Bind plugin api access)
   * 
   * @alias {@link bind}
   * @alias {@link inputField}
   * 
   * @see {@link MetaBindPlugin.bindTargetMetadataField}
   * @see {@link MetaBindPlugin.buildDeclaration}
   */
  Bind: MetaBindApi;

  /**
   * Make input fields bound to your frontmatter properties! 
   * (Meta-Bind plugin api access)
   * 
   * @alias {@link InputField}
   * @alias {@link bind}
   * 
   * @see {@link MetaBindPlugin.bindTargetMetadataField}
   * @see {@link MetaBindPlugin.buildDeclaration}
   */
  inputField: MetaBindApi;

  /**
   * Make input fields bound to your frontmatter properties! 
   * (Meta-Bind plugin api access)
   * 
   * @alias {@link inputField}
   * @alias {@link bind}
   * 
   * @see {@link MetaBindPlugin.bindTargetMetadataField}
   * @see {@link MetaBindPlugin.buildDeclaration}
   */
  InputField: MetaBindApi;

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
  path(relativePath?: string | null, extension?: string | boolean, rootFolder?: string | null): string;
}

/**
 * Static Api accessed through "Metadata" global calls
 */
export interface StaticMetaScryApi {
  [key: string | number | symbol]: any;
  Components?: Record<string, any>;
  SectionComponents?: Record<string, any>;
  Api: MetaScryApi;
  Plugin: MetaScryPluginApi;
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
