import {
  CachedMetadata
} from "obsidian";
import {
  SMarkdownPage
} from "obsidian-dataview";
import { Sections } from "./sections/sections";
import { DataFetcherSettings } from "./settings";

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
   * @see {@link MetaScryApi.file}
   * @see {@link MetaScryApi.dataviewFrontmatter}
   * @see {@link CurrentNoteMetaScryApi.note}
   * @see {@link CurrentNoteMetaScryApi.dataviewFrontmatter}
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
   * @see {@link MetaScryApi.file}
   * @see {@link MetaScryApi.dataviewFrontmatter}
   * @see {@link CurrentNoteMetaScryApi.note}
   * @see {@link CurrentNoteMetaScryApi.dataviewFrontmatter}
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
} & Partial<SMarkdownPage["file"]>;

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
 * Dataview style frontmatter data.
 */
export type DataviewMatter = {

  /**
   * The dv file object
   *
   * @see {@link Metadata.File}
   */
  file: FileData;
} & Frontmatter;

/**
 * Results for commands in the MetaScryApi can return one item, or a record tree of items, indexed by their paths.
 */
export type ScryResults<TResult>
  = ((ScryResult<TResult> | ScryResultsMap<TResult>)
    & SingleScryResultConversionProperties<TResult>
    & ScryResultMapConversionProperties<TResult>)
  | undefined;

/**
 * A single item scry result.
 * (default for single)
 */
export type ScryResult<TResult>
  = ((TResult & SingleScryResultConversionProperties<TResult>) | undefined)
  
/**
 * A tree of result maps, with each item/sub-map indexed by a string key (usually the full path)
 * (default for multiuple)
 */
export type ScryResultsMap<TResult>
  = ScryResultMap<TResult>
    & ScryResultMapConversionProperties<TResult>;

/**
 * Properties to easily convert a result object to the result.
 */
interface SingleScryResultConversionProperties<TResult> {
  readonly value: TResult;
  readonly options: DataFetcherSettings;
}

/**
 * Just a map of scry results
 */
export interface ScryResultMap<TResult> extends ScryResultMapProperties {
  /**@ts-expect-error */
  readonly [path: string]: ScryResults<TResult>;
  readonly [index: number]: ScryResults<TResult>;
}

export interface ScryResultMapProperties {
  readonly keys: Array<string>;
  readonly count: number;
}

/**
 * Properties to easily convert a result map into accessable results.
 */
interface ScryResultMapConversionProperties<TResult> extends ScryResultMapProperties {
  readonly map: ScryResultsMap<TResult>;
  readonly options: DataFetcherSettings;
  readonly all: Array<ScryResult<TResult>>;
  readonly values: Array<TResult>;
  readonly any: boolean;
};

/**
 * Results for commands in the MetaScryApi can return one item, or a record tree of items, indexed by their paths.
 */
export type PromisedScryResults<TResult>
  = (PromisedScryResult<TResult> | ScryResultPromiseMap<TResult>)
    & SingleScryResultConversionProperties<TResult>
    & PromisedScryResultMapConversionProperties<TResult>;

/**
 * All scry results, awaiting a single promise. (default for single)
 */
export type PromisedScryResult<TResult>
  = Promise<ScryResults<TResult>> & SingleScryResultConversionProperties<TResult>;

/**
 * A tree of maps promises for each scry result, indexed by a string key (default for multiple)
 */
export type ScryResultPromiseMap<TResult> = {
  readonly [path: string]: PromisedScryResults<TResult>;
  readonly [index: number]: PromisedScryResults<TResult>;
} & PromisedScryResultMapConversionProperties<TResult>;

/**
 * Properties to easily convert a result map into accessable results.
 */
interface PromisedScryResultMapConversionProperties<TResult> extends ScryResultMapProperties {
  readonly map: ScryResultPromiseMap<TResult>;
  readonly options: DataFetcherSettings;
  readonly all: Array<PromisedScryResult<TResult>>;
  readonly values: Array<Promise<TResult>>;
  readonly any: boolean;
};

/**
 * A callback for certain property helper methods and other settings.
 */
export type ThenDoCallback = ThenDoCallbacks
  | ThenDoOnTrueCallback;

/**
 * Callback executed on true
 */
export type ThenDoOnTrueCallback
  = (found?: any) => any;

/**
 * Callback with options for onTrue and onFalse
 */
export type ThenDoCallbacks = {
  onTrue?: ThenDoOnTrueCallback;
  onFalse?: () => any;
};