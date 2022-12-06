import {
  TAbstractFile,
  TFile,
  TFolder
} from "obsidian";
import {
  DataArray,
  DataviewApi
} from "obsidian-dataview";
import { MetaScryPluginApi } from "../plugin";
import { Frontmatter, Metadata, CachedFileMetadata, DataviewMatter, Cache, ScryResults, PromisedScryResults, ScryResult } from "../datas";
import { Sections } from "../sections/sections";
import { NotesSource, MetadataSources, SingleFileSource } from "./sources";
import { MetaEditApi as MetaEditApi } from "../editing/editor";
import { CurrentNoteMetaScryApi } from "./current";
import { MetaBindApi } from "../editing/bind";
import { DataFetcherSettings, FrontmatterUpdateSettings, PromisedDataFetcherSettings } from "../settings";

/**
* Interface for the Api.
* Access and edit metadata about a file from multiple sources.
*/
export interface MetaScryApi {

  /**
   * Get the plugin that runs this api
   *
   * @alias {@link plugin}
   * @alias {@link app.plugins.plugins["meta-scry"]}
   */
  get Plugin(): MetaScryPluginApi;

  /**
   * Get the plugin that runs this api
   *
   * @alias {@link Plugin}
   * @alias {@link app.plugins.plugins["meta-scry"]}
   */
  get plugin(): MetaScryPluginApi;

  /**
   * A link to the dv plugin api
   *
   * @alias {@link Dv}
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
   * @see {@link CurrentNoteMetaScryApi.edit}
   * @see {@link patch}
   * @see {@link set}
   * @see {@link clear}
   */
  get Edit(): MetaEditApi;

  /**
   * A link to the opd-metadata-lib plugin api
   *
   * @alias {@link Edit}
   *
   * @see {@link CurrentNoteMetaScryApi.edit}
   * @see {@link patch}
   * @see {@link set}
   * @see {@link clear}
   */
  get edit(): MetaEditApi;

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
   * @alias {@link Scry.DefaultSources}
   *
   * @see {@link sources}
   * @see {@link get}
   */
  get defaultSources(): MetadataSources;

  /**
   * Helper to get the default MetaScryApi.get sources with any desired overrides
   *
   * @param overrides (Optional) any properties you want to override from the Default Sources, in one object. Defaults to all default sources if nothing is provided.
   *
   * @see {@link MetadataScrier.DefaultSources}
   * @see {@link sources}
   * @see {@link get}
   */
  sources(overrides?: MetadataSources): MetadataSources;

  /**
   * Get a file or folder from the vault
   *
   * @param source The file/folder object(with a path property) or the full path string
   *
   * @returns the found TFile or TFolder
   *
   * @alias {@link folder}
   * @alias {@link file}
   *
   * @see {@link CurrentNoteMetaScryApi.note}
   */
  vault(source?: NotesSource): TFile | TFolder | TAbstractFile | undefined;

  /**
   * Get a file from the vault (alias for vault())
   *
   * @param source The file object(with a path property) or the full path string
   *
   * @returns the found TFile
   *
   * @alias {@link vault}
   *
   * @see {@link folder}
   * @see {@link CurrentNoteMetaScryApi.note}
   */
  file(source?: NotesSource): TFile | undefined;

  /**
   * Get a folder from the vault
   *
   * @param source The folder object(with a path property) or the full path string
   *
   * @returns the found TFolder
   *
   * @alias {@link vault}
   *
   * @see {@link file}
   * @see {@link CurrentNoteMetaScryApi.note}
   */
  folder(source?: NotesSource): TFolder | undefined;

  /**
   * Used to fetch the "Obsidian Metadata File Cache" object from the obsidian api.
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @returns The cached file metadata object if it exists, or an array of objects if a folder was provided.
   *
   * @alias {@link omfc}
   */
  obsidianMetadataFileCache(source?: NotesSource, options?: DataFetcherSettings): ScryResults<CachedFileMetadata>;

  /**
   * Used to fetch the "Obsidian Metadata File Cache" object from the obsidian api.
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @returns The cached file metadata object if it exists, or an array of objects if a folder was provided.
   *
   * @alias {@link obsidianMetadataFileCache}
   */
  omfc(source?: NotesSource, options?: DataFetcherSettings): ScryResults<CachedFileMetadata>;

  /**
   * Used to fetch the markdown text of the entire file or all provided files.
   * @async
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @alias {@link markdown}
   *
   * @see {@link html}
   * @see {@link text}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.markdown}
   * @see {@link Section.markdown}
   */
  md(source?: NotesSource, options?: PromisedDataFetcherSettings): PromisedScryResults<string>;

  /**
   * Used to fetch the markdown text of the entire file or all provided files.
   * @async
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @alias {@link md}
   *
   * @see {@link html}
   * @see {@link text}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.markdown}
   * @see {@link Section.markdown}
   */
  markdown(source?: NotesSource, options?: PromisedDataFetcherSettings): PromisedScryResults<string>;

  /**
   * Used to fetch the rendered html elements resulting from the markdown of the entire file (or all provided files).
   * @async
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   * @param options.fromRawMd (optional) Md to render instead of the full file contents.
   * 
   * @see {@link markdown}
   * @see {@link text}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.html}
   * @see {@link Section.html}
   */
  html(
    source?: NotesSource,
    options?: PromisedDataFetcherSettings
      & { fromRawMd?: string }
  ): PromisedScryResults<HTMLElement>;

  /**
   * Used to fetch the plain text contents of the fully rendered markdown+html obsidian note.
   * @async
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @alias {@link text}
   *
   * @see {@link markdown}
   * @see {@link html}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.text}
   * @see {@link Section.text}
   */
  txt(source?: NotesSource, options?: PromisedDataFetcherSettings): PromisedScryResults<string>;

  /**
   * Used to fetch the plain text contents of the fully rendered markdown+html obsidian note.
   * @async
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @alias {@link txt}
   *
   * @see {@link markdown}
   * @see {@link html}
   * @see {@link sections}
   * @see {@link CurrentNoteMetaScryApi.text}
   * @see {@link Section.text}
   */
  text(source?: NotesSource, options?: PromisedDataFetcherSettings): PromisedScryResults<string>;

  /**
   * Used to embed the desired link into a file using a div element.
   * 
   * @param source The file/folder object(with a path property) or the full path string with the desired optional section after a #
   * @param options (optional) Options to change how the data is fetched and/or returned.
   * @param options.container (Optional) an existing container to attach the element to.
   * @param options.intoNote (Optional) the note you are embeding into, this defaults to the current note.
   *
   * @returns A div with the embeded content attached.
   *
   * @see {@link html}
   * @see {@link Section.embed}
   */
  embed(
    source: NotesSource,
    options?: DataFetcherSettings & {
      container?: HTMLElement,
      intoNote?: SingleFileSource
    }
  ): ScryResults<HTMLElement>

  /**
   * Get just the frontmatter for the given file.
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @returns Just the frontmatter for the file.
   *
   * @alias {@link fm}
   * @alias {@link matter}
   *
   * @see {@link get}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   */
  frontmatter(source?: NotesSource, options?: DataFetcherSettings): ScryResults<Frontmatter>;

  /**
   * Get just the frontmatter for the given file.
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @returns Just the frontmatter for the file.
   *
   * @alias {@link frontmatter}
   * @alias {@link matter}
   *
   * @see {@link get}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   */
  fm(source?: NotesSource, options?: DataFetcherSettings): ScryResults<Frontmatter>;

  /**
   * Get just the frontmatter for the given file.
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @returns Just the frontmatter for the file.
   *
   * @alias {@link fm}
   * @alias {@link frontmatter}
   *
   * @see {@link get}
   * @see {@link CurrentNoteMetaScryApi.frontmatter}
   */
  matter(source?: NotesSource, options?: DataFetcherSettings): ScryResults<Frontmatter>;

  /**
   * Get just the sections for the given file.
   *
   * @param source The file/folder object(with a path property) or the full path string
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @returns Just the sections under their headings for the file.
   *
   * @see {@link get}
   * @see {@link html}
   * @see {@link markdown}
   * @see {@link text}
   * @see {@link CurrentNoteMetaScryApi.sections}
   */
  sections(source?: NotesSource, options?: DataFetcherSettings): ScryResults<Sections>;

  /**
   * Get the dataview api values for the given file; Inline, frontmatter, and the file value.
   *
   * @param source The file/folder object(with a path property) or the full path string, or a dv query source.
   * @param options (optional) Options to change how the data is fetched and/or returned.
   * @param options.useSourceQuery (Optional) If you want to use a dv source query instead of assuming a file path is provided. Defaults to false (""s are added to the passed in path by default).
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
  dvMatter(
    source?: NotesSource,
    options?: PromisedDataFetcherSettings
      & { useSourceQuery?: boolean }
  ): ScryResults<DataviewMatter>;

  /**
   * Get the dataview api values for the given file; Inline, frontmatter, and the file value.
   *
   * @param source The file/folder object(with a path property) or the full path string, or a dv query source.
   * @param options (optional) Options to change how the data is fetched and/or returned.
   * @param options.useSourceQuery (Optional) If you want to use a dv source query instead of assuming a file path is provided. Defaults to false (""s are added to the passed in path by default).
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
  dataviewFrontmatter(
    source?: NotesSource,
    options?: PromisedDataFetcherSettings
      & { useSourceQuery?: boolean }
  ): ScryResults<DataviewMatter>;

  /**
   * Get just the (meta-scry) cache data for a file.
   *
   * @param source The file/folder object(with a path property) or the full path string.
   * @param options (optional) Options to change how the data is fetched and/or returned.
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
  cache(source?: NotesSource, options?: DataFetcherSettings): ScryResults<Cache>;

  /**
   * Get just the (meta-scry) cache data for a file.
   *
   * @param source The file/folder object(with a path property) or the full path string.
   * @param options (optional) Options to change how the data is fetched and/or returned.
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
  temp(source?: NotesSource, options?: DataFetcherSettings): ScryResults<Cache>;

  /**
   * Get or Set a global values across all obsidian.
   * WARNING DONT USE THIS IF YOU DONT KNOW WHAT YOURE DOING!
   *
   * @param key The key or keys of the global to fetch or set.
   *
   * @returns The global or globals with the given key(s)
   *
   * @see {@link get}
   * @see {@link cache}
   * @see {@link MetadataScrierPlugin.tryToGetExtraGlobal}
   * @see {@link MetadataScrierPlugin.tryToSetExtraGlobal}
   */
  globals(key: string | string[], setToValue?: any): any | any[] | undefined;

  /**
   * Get the desired prototypes
   *
   * @param prototypePath The path to the prototype file desired.
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @returns An object containing the prototypes in the givne file
   *
    * @see {@link cache}
    * @see {@link globals}
    * @see {@link values}
   */
  prototypes(prototypePath: string, options?: DataFetcherSettings): ScryResults<Frontmatter>;

  /**
   * Get the desired values from data storage
   *
   * @param dataPath The path to the data file desired.
   * @param options (optional) Options to change how the data is fetched and/or returned.
   *
   * @returns An object containing the yaml data stored in the givne file
   *
    * @see {@link cache}
    * @see {@link globals}
    * @see {@link prototypes}
   */
  values(dataPath: string, options?: DataFetcherSettings): ScryResults<Frontmatter>;

  /**
   * Get the Metadata for a given file using the supplied sources.
   *
   * @param source The file/folder object(with a path property) or the full path string.
   * @param sources The sources to get metadata from. Defaults to all.
   * @param options (optional) Options to change how the data is fetched and/or returned.
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
   * @see {@link DefaultSources}
   */
  get(
    source?: NotesSource | MetadataSources,
    sources?: MetadataSources | boolean,
    options?: DataFetcherSettings
  ): ScryResults<Metadata>;

  /**
   * Get the Metadata for a given file using the supplied sources.
   *
   * @param source The file/folder object(with a path property) or the full path string.
   * @param sources The sources to get metadata from. Defaults to all.
   * @param options (optional) Options to change how the data is fetched and/or returned.
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
  from(
    source?: NotesSource | MetadataSources,
    sources?: MetadataSources | boolean,
    options?: DataFetcherSettings
  ): ScryResults<Metadata>;

  /**
   * Patch individual properties of the frontmatter metadata.
   * @async
   *
   * @param file The name of the file or the file object with a path
   * @param frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here. 
   * @param options (Optional) options.
   *
   * @see {@link CurrentNoteMetaScryApi.patch}
   * @see {@link set}
   * @see {@link clear}
   */
  patch(
    file: SingleFileSource,
    frontmatterData: Record<string, any> | any,
    propertyName?: string,
    options?: FrontmatterUpdateSettings
  ): Promise<Frontmatter>;

  /**
   * Replace the existing frontmatter of a file with entirely new data, clearing out all old data in the process.
   * @async
   *
   * @param file The name of the file or the file object with a path
   * @param frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param options (Optional) options.
   * 
   * @see {@link CurrentNoteMetaScryApi.set}
   * @see {@link clear}
   * @see {@link patch}
   */
  set(
    file: SingleFileSource,
    frontmatterData: any,
    options?: FrontmatterUpdateSettings
  ): Promise<Frontmatter>;

  /**
   * Used to clear values from metadata.
   * @async
   *
   * @param file The file to clear properties for. defaults to the current file.
   * @param frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param options (Optional) options.
   *
   * @see {@link CurrentNoteMetaScryApi.clear}
   * @see {@link set}
   * @see {@link patch}
   */
  clear(
    file?: SingleFileSource,
    frontmatterProperties?: string | Array<string> | Record<string, any>,
    options?: FrontmatterUpdateSettings
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
  path(relativePath?: string, extension?: string | boolean, rootFolder?: string): string;
}


