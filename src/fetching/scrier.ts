import {
  MarkdownRenderer,
  MarkdownView,
  TAbstractFile,
  TFile,
  TFolder
} from 'obsidian';
import {
  DataviewApi
} from "obsidian-dataview";

import {
  Sections
} from '../types/sections/sections';
import {
  MetaScryApi
} from "../types/fetching/scrier";
import { CurrentNoteMetaScryApi } from "../types/fetching/current";
import { MetaEditApi } from "../types/editing/editor";
import {
  MetaScryPluginApi,
  AppWithPlugins
} from "../types/plugin";
import { DataFetcherSettings, FrontmatterUpdateSettings } from "../types/settings";
import {
  CachedFileMetadata, DataviewMatter,
  Frontmatter,
  Metadata,
  PromisedScryResults,
  ScryResultsMap,
  ScryResultPromiseMap,
  ScryResults
} from "../types/datas";
import {
  Keys,
  Symbols,
  DefaultFrontmatterUpdateOptions} from '../constants';
import { InternalStaticMetadataScrierPluginContainer } from "../static";
import { CurrentNoteScrier } from "./current";
import { NoteSections } from '../sections/sections';
import {
  BuildDataValueFileFullPath,
  BuildPrototypeFileFullPath,
  IsArray,
  IsObject,
  IsString,
  IsTAbstractFile,
  IsTFile,
  IsTFolder,
  ParsePathFromNoteSource,
  Path,
  Splay
} from '../utilities';
import { MetadataSources, NotesSource, SingleFileSource } from '../types/fetching/sources';
import { MetaBindApi } from '../types/editing/bind';
import { MetadataInputBinder } from '../editing/bind';
import { ScryResultsMap as ScryResultsConstructor, SingleScryResult } from './result';

/**
 * Access and edit metadata about a file from multiple sources.
 * 
 * @internal
 */
export class MetadataScrier implements MetaScryApi {
  private static _caches: any = {};
  private _scryResultPropSplayer: (base: any, topLevelPropertiesToIgnore?: Array<string>) => object;

  //#region Initalization

  constructor() {
    this._initializeKebabPropSplayer();
    //this._initializePropLowercaseSplayer();
  }

  //#region Property Name Splayer Initialization

  private _initializeKebabPropSplayer() {
    this._scryResultPropSplayer = (key, topLevelPropertiesToIgnore) => {
      return MetadataScrier._recurseOnAllObjectProperties(
        key,
        (k, v, d) => {
          for (const name of Splay(k)) {
            d[name] = v;
          }
        },
        topLevelPropertiesToIgnore
      );
    };
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

  //#endregion

  //#endregion

  //#region Static Api Access

  /**
   * The default sources to pull Metadata values from for a file.
   */
  static get DefaultSources(): MetadataSources {
    return {
      /**
       * The 'file' field containing metadata about the file itself
       */
      [Keys.FileInfoMetadataSourceKey]: true,
      /**
       * The Frontmatter (YAML at the top of a note)
       */
      [Keys.FrontmatterMetadataSourceKey]: true,
      /**
       * Inline Dataview data fields
       */
      [Keys.DataviewInlineMetadataSourceKey]: true,
      /**
       * Cached values from the Metadata.Cache in a single field named 'cache'.
       */
      [Keys.ScryNoteCacheMetadataSourceKey]: true,
      /**
       * Sections from the Metadata Cache
       */
      [Keys.NoteSectionsMetadataSourceKey]: true
    };
  }

  sources(overrides: MetadataSources = {}) {
    return {
      ...MetadataScrier.DefaultSources,
      ...overrides
    } as MetadataSources;
  }

  get defaultSources(): MetadataSources {
    return this.sources();
  }

  get Plugin(): MetaScryPluginApi {
    return InternalStaticMetadataScrierPluginContainer.Plugin;
  }

  get plugin(): MetaScryPluginApi {
    return this.Plugin;
  }

  get edit(): MetaEditApi {
    return InternalStaticMetadataScrierPluginContainer.MetadataEditApi;
  }

  get Edit(): MetaEditApi {
    return this.edit;
  }

  get dv(): DataviewApi {
    return InternalStaticMetadataScrierPluginContainer.DataviewApi;
  }

  get Dv(): DataviewApi {
    return InternalStaticMetadataScrierPluginContainer.DataviewApi;
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

  vault(source: NotesSource = this.current.path): TFile | TFolder | TAbstractFile | undefined {
    if (IsTAbstractFile(source)) {
      return source;
    }

    const path = (ParsePathFromNoteSource(source) || this.Current.Path);

    return app.vault.getAbstractFileByPath(path)
      ?? app.vault.getAbstractFileByPath(path + Symbols.ExtensionFilePathSeperatorCharacter + Symbols.DefaultMarkdownFileExtension)
      ?? undefined;
  } // aliases:
  file = (source: NotesSource = this.current.path): TFile | undefined =>
    this.vault(source) as TFile;
  folder = (source: NotesSource = this.current.path): TFolder | undefined =>
    this.vault(source) as TFolder;

  markdown = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings = {}
  ): PromisedScryResults<string> =>
    this._scryForFolderOrFile(
      source,
      { ...options, isPromised: true },
      file => app.vault.cachedRead(file)
    ) as PromisedScryResults<string>;
  // aliases:
  md = (source: NotesSource = this.current.path, options?: DataFetcherSettings): PromisedScryResults<string> =>
    this.markdown(source, options);

  html = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings & { fromRawMd?: string } = {}
  ): PromisedScryResults<HTMLElement> =>
    this._scryForFolderOrFile(
      source,
      { ...options, isPromised: true },
      async (file, options) => (app as AppWithPlugins).plugins.plugins[Keys.CopyToHtmlPluginKey]!.convertMarkdown(
        (options as DataFetcherSettings & { fromRawMd?: string })?.fromRawMd || (await this.md(file)) as string,
        file.path
      )
    ) as PromisedScryResults<HTMLElement>;

  text = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings = {}
  ): PromisedScryResults<string> =>
    this._scryForFolderOrFile(
      source,
      { ...options, isPromised: true },
      async (file) => {
        const html = await this.html(file);
        const text = html!.textContent || "";

        return text as string;
      }
    ) as PromisedScryResults<string>;
  // aliases:
  txt = (source: NotesSource = this.current.path, options?: DataFetcherSettings): PromisedScryResults<string> =>
    this.text(source, options);

  embed(
    source: NotesSource,
    options: DataFetcherSettings & {
      container?: HTMLElement,
      intoNote?: SingleFileSource
    } = {}
  ): ScryResults<HTMLElement> {
    source = typeof source === 'string' && source.contains(Symbols.SectionLinkSeperatorCharachter)
      ? source
      : this.vault(source);

    if (IsTFolder(source)) {
      return this._splayToPathIndexedRecord(
        source.children,
        this.embed,
        options
      ) as ScryResultsMap<HTMLElement> as ScryResults<HTMLElement>;
    }

    const containerEl = options.container || document.createElement("div");
    if (!options.container) {
      const workspaceEl = app.workspace.getActiveViewOfType(MarkdownView)!.containerEl.children[1];
      workspaceEl.appendChild(containerEl);
    }

    if (!options.intoNote) {
      options.intoNote = this.file(this.current.path) as TFile;
    } else {
      options.intoNote = options.intoNote instanceof TFile
        ? options.intoNote
        : this.file(ParsePathFromNoteSource(options.intoNote))
    }

    const embedData = {
      app,
      containerEl,
      displayMode: false,
      linktext: source,
      remainingNestLevel: 5,
      showTitle: true,
      sourcePath: ParsePathFromNoteSource(source)
    };

    //@ts-expect-error secret function
    const embed = MarkdownRenderer.loadEmbed(
      embedData,
      options.intoNote,
      containerEl
    )

    embed.load();
    embed.loadFile();

    return SingleScryResult(containerEl, options) as ScryResults<HTMLElement>;
  }

  omfc = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings = {}
  ): ScryResults<CachedFileMetadata> =>
    this._scryForFolderOrFile(
      source,
      options,
      (file, options) => {
        const result = (app.metadataCache.getFileCache(file) as CachedFileMetadata) || null;
        if (result !== null) {
          result.path = file.path;
        }

        return result;
      }
    ) as ScryResults<CachedFileMetadata>;
  // aliases:
  obsidianMetadataFileCache = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings = {}
  ): ScryResults<CachedFileMetadata> =>
    this.omfc(source, options);

  frontmatter = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings = {}
  ): ScryResults<Frontmatter> =>
    this._scryForFolderOrFile(
      source,
      options,
      (file, options) => {
        const fileCache = this.omfc(file, options);
        if (fileCache?.frontmatter) {
          return this._scryResultPropSplayer(fileCache?.frontmatter);
        }
      }
    ) as ScryResults<Frontmatter>;
  // aliases:
  fm = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings = {}
  ): ScryResults<Frontmatter> =>
    this.frontmatter(source, options)
  matter = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings = {}
  ): ScryResults<Frontmatter> =>
    this.frontmatter(source, options)

  sections = (
    source: NotesSource = this.current.path,
    options: DataFetcherSettings = {}
  ): ScryResults<Sections> =>
    this._scryForFolderOrFile(
      source,
      options,
      (file, options) => {
        const fileCache = this.omfc(file, options) as CachedFileMetadata;
        if (!fileCache) {
          return undefined;
        }

        return new NoteSections(fileCache.path, fileCache?.headings) as Sections;
      }
    ) as ScryResults<Sections>;

  dvMatter(
    source?: NotesSource,
    options: DataFetcherSettings & { useSourceQuery?: boolean } = {}
  ): ScryResults<DataviewMatter> {
    const providedPath: string = source ? ParsePathFromNoteSource(source) as string : this.Current.Path;
    const paths = InternalStaticMetadataScrierPluginContainer
      .DataviewApi
      .pagePaths(options?.useSourceQuery ? providedPath : (`"` + providedPath + '"'));

    if (paths.length > 1) {
      return this._splayToPathIndexedRecord(
        paths.array(),
        this.dvMatter,
        options
      ) as ScryResultsMap<DataviewMatter> as ScryResults<DataviewMatter>;
    } else if (!paths.length) {
      return undefined;
    } else {
      const result = InternalStaticMetadataScrierPluginContainer
        .DataviewApi
        .page(paths[0]);

      return this._scryResultPropSplayer(result, [
        Keys.FileMetadataPropertyLowercaseKey,
        Keys.FileMetadataPropertyUppercaseKey
      ]) as DataviewMatter as ScryResults<DataviewMatter>;
    }
  } // aliases:
  dataviewFrontmatter = (
    source?: NotesSource,
    options: DataFetcherSettings & { useSourceQuery?: boolean } = {}
  ): ScryResults<DataviewMatter> =>
    this.dvMatter(source, options);

  cache(
    source?: NotesSource,
    options: DataFetcherSettings = {}
  ): ScryResults<Cache> {
    const fileObject = this.vault(source);

    if (fileObject === undefined) {
      const key = ParsePathFromNoteSource(source);
      if (key !== null) {
        MetadataScrier._caches[key] = MetadataScrier._caches[key] || {};

        return MetadataScrier._caches[key];
      }

      throw "Invalid Key for File";
    } else if (IsTFolder(fileObject)) {
      return this._splayToPathIndexedRecord(
        fileObject.children,
        this.cache,
        options
      ) as ScryResultsMap<Cache> as ScryResults<Cache>;
    } else {
      MetadataScrier._caches[fileObject.path] = MetadataScrier._caches[fileObject.path] || {};

      return MetadataScrier._caches[fileObject.path];
    }
  } // aliases:
  temp = (
    source?: NotesSource,
    options: DataFetcherSettings = {}
  ): ScryResults<Cache> =>
    this.cache(source, options);

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

  prototypes(
    prototypePath: string,
    options: DataFetcherSettings = {}
  ): ScryResults<Frontmatter> {
    return this.frontmatter(BuildPrototypeFileFullPath(prototypePath), options);
  }

  values(
    dataPath: string,
    options: DataFetcherSettings = {}
  ): ScryResults<Frontmatter> {
    return this.frontmatter(BuildDataValueFileFullPath(dataPath), options);
  }

  get(
    source: NotesSource | MetadataSources = this.current.path,
    sources: MetadataSources | boolean = MetadataScrier.DefaultSources,
    options: DataFetcherSettings = {}
  ): ScryResults<Metadata> {
    // double check the object. 
    if (IsObject(source)) {
      const potentialFolder = source as NotesSource;
      if (IsTFolder(potentialFolder)) {
        return this._splayToPathIndexedRecord(
          potentialFolder.children,
          (f, o) => this.get(f, sources, o),
          options
        ) as ScryResultsMap<Metadata> as ScryResults<Metadata>;
      } // If it's a MetadataSources object, re-run this with that as the sources and the source as the current file.
      else if (!source!.hasOwnProperty("path")) {
        if (Keys.MetadataSourceKeys.some(key => source!.hasOwnProperty(key))) {
          if (!Object.keys(source!).some(key => !Keys.MetadataSourceKeys.includes(key))) {
            return this.get(
              this.current.path,
              source as MetadataSources,
              options
            );
          }
        }
      }
    }

    const filePath = source
      ? (ParsePathFromNoteSource(source as NotesSource)
        ?? this.current.path)
      : this.Current.Path;

    const fileObject = this.vault(filePath);

    if (IsTFolder(fileObject)) {
      return this._splayToPathIndexedRecord(
        fileObject.children,
        (f, o) => this.get(f, sources, o),
        options
      ) as ScryResultsMap<Metadata> as ScryResults<Metadata>;
    }

    let values: any = {};

    if (sources === true) {
      values = this._scryResultPropSplayer(
        InternalStaticMetadataScrierPluginContainer
          .DataviewApi
          .page(filePath),
        [Keys.FileMetadataPropertyLowercaseKey, Keys.FileMetadataPropertyUppercaseKey]
      ) || {};
    } else {
      if (sources === false) {
        return {} as ScryResults<Metadata>;
      }

      // if we need dv sources
      if (sources[Keys.DataviewInlineMetadataSourceKey] || sources[Keys.FileInfoMetadataSourceKey]) {
        values = this._scryResultPropSplayer(
          InternalStaticMetadataScrierPluginContainer
            .DataviewApi
            .page(filePath),
          [Keys.FileMetadataPropertyLowercaseKey, Keys.FileMetadataPropertyUppercaseKey]
        ) || {};

        // remove dv inline?
        let frontmatter: Frontmatter = null!;
        if (!sources[Keys.DataviewInlineMetadataSourceKey]) {
          frontmatter = this.frontmatter(filePath, options) as Frontmatter;
          Object.keys(values).forEach(prop => {
            // if it's not a frontmatter prop or the 'file' metadata prop
            if (!frontmatter.hasOwnProperty(prop)
              && prop !== Keys.FileMetadataPropertyLowercaseKey
              && prop !== Keys.FileMetadataPropertyUppercaseKey
            ) {
              delete values[prop];
            }
          });
        }

        // remove frontmatter?
        if (!sources[Keys.FrontmatterMetadataSourceKey]) {
          frontmatter = frontmatter || this.frontmatter(filePath, options);
          Object.keys(frontmatter).forEach(prop => {
            delete values[prop];
          });
        }
      } // just the frontmatter/cache?
      else if (sources[Keys.FrontmatterMetadataSourceKey]) {
        values = this.frontmatter(filePath, options);
      }
    }

    // add/remove file metadata field(from dv)?
    if (sources === true || (sources as MetadataSources)[Keys.FileInfoMetadataSourceKey]) {
      values[Keys.FileMetadataPropertyLowercaseKey] = values.file;
      values[Keys.FileMetadataPropertyUppercaseKey] = values.file;
    } else {
      delete values[Keys.FileMetadataPropertyUppercaseKey];
      delete values[Keys.FileMetadataPropertyLowercaseKey];
    }

    // add cache?
    if (sources === true || sources[Keys.ScryNoteCacheMetadataSourceKey]) {
      const foundCache = this.cache(filePath, options);
      values[Keys.CacheMetadataPropertyLowercaseKey] = foundCache;
      values[Keys.CacheMetadataPropertyCapitalizedKey] = foundCache;
    }

    // add sections?
    if (sources === true || sources[Keys.NoteSectionsMetadataSourceKey]) {
      if (IsObject(sources) && !(sources as MetadataSources)[Keys.FileInfoMetadataSourceKey]) {
        values[Keys.FileMetadataPropertyLowercaseKey] = {};
        values[Keys.FileMetadataPropertyUppercaseKey] = {};
      }

      const sections = this.sections(filePath, options);
      values[Keys.FileMetadataPropertyLowercaseKey][Keys.SectionsMetadataPropertyCapitalizedKey] = sections;
      values[Keys.FileMetadataPropertyLowercaseKey][Keys.SectionsMetadataPropertyLowercaseKey] = sections;
      values[Keys.FileMetadataPropertyUppercaseKey][Keys.SectionsMetadataPropertyCapitalizedKey] = sections;
      values[Keys.FileMetadataPropertyUppercaseKey][Keys.SectionsMetadataPropertyLowercaseKey] = sections;
    }

    return values;
  } // aliases:
  from = (
    source: NotesSource | MetadataSources = this.current.path,
    sources: MetadataSources | boolean = MetadataScrier.DefaultSources,
    options: DataFetcherSettings = {}
  ): ScryResults<Metadata> =>
    this.get(source, sources, options);

  //#endregion

  //#region Metadata Modifiers

  async patch(
    source: SingleFileSource,
    frontmatterData?: Record<string, any> | any,
    propertyName?: string,
    options: FrontmatterUpdateSettings = DefaultFrontmatterUpdateOptions
  ): Promise<Frontmatter> {
    let fileName: string = null!;
    if (options.prototype && options.toValuesFile) {
      await this.patch(source, frontmatterData, propertyName, { ...options, toValuesFile: false });
      return await this.patch(source, frontmatterData, propertyName, { ...options, prototype: false });
    } else {
      fileName = MetadataScrier._parseFileNameFromDataFileFileOrPrototype(options.toValuesFile ?? false, source, options.prototype ?? false);
      const { updateOrInsertFieldInTFile: update } = this.edit;
      const fileObject = source instanceof TFile ? source : (this.file(fileName) as TFile);

      if (propertyName != null) {
        return await update(propertyName, frontmatterData, fileObject, options);
      } else {
        const results: Frontmatter[] = await Promise.all(
          Object.keys(frontmatterData)
            .map(async propertyName => (await update(
              propertyName,
              frontmatterData[propertyName],
              fileObject,
              options
            )) as Frontmatter)
        );

        return results[0] || undefined;
      }
    }
  }

  async set(
    source: SingleFileSource,
    frontmatterData: any,
    options: FrontmatterUpdateSettings = DefaultFrontmatterUpdateOptions
  ): Promise<Frontmatter> {
    let fileName: string = null!;
    if (options.prototype && options.toValuesFile) {
      await this.set(source, frontmatterData, { ...options, toValuesFile: false });
      return await this.set(source, frontmatterData, { ...options, prototype: false });
    } else {
      const { setAllFrontmatter } = this.edit;
      fileName = MetadataScrier._parseFileNameFromDataFileFileOrPrototype(options.toValuesFile ?? false, source, options.prototype ?? false);
      const fileObject = source instanceof TFile ? source : (this.file(fileName) as TFile);

      await this.clear(fileObject, options);
      return await setAllFrontmatter(frontmatterData, fileObject);
    }
  }

  async clear(
    source: SingleFileSource = this.current.path,
    frontmatterProperties: string | Array<string> | Record<string, any> | undefined = undefined,
    options: FrontmatterUpdateSettings = DefaultFrontmatterUpdateOptions
  ): Promise<Frontmatter> {
    if (options.prototype && options.toValuesFile) {
      await this.clear(source, frontmatterProperties, { ...options, prototype: false });
      await this.clear(source, frontmatterProperties, { ...options, toValuesFile: false });

      return this.frontmatter(source) as Frontmatter;
    }

    const fileName = MetadataScrier._parseFileNameFromDataFileFileOrPrototype(options.toValuesFile ?? false, source, options.prototype ?? false);
    let propsToClear = [];

    if (IsString(frontmatterProperties)) {
      propsToClear.push(frontmatterProperties);
    } else if (IsObject(frontmatterProperties)) {
      if (frontmatterProperties === undefined) {
        propsToClear = Object.keys(this.frontmatter(fileName) as Frontmatter);
      } else if (Array.isArray(frontmatterProperties)) {
        propsToClear = frontmatterProperties;
      } else {
        propsToClear = Object.keys(frontmatterProperties);
      }
    }

    throw "not implemented";
  }

  bind: MetaBindApi
    = MetadataInputBinder;
  //alias:
  inputField: MetaBindApi
    = MetadataInputBinder;
  //alias:
  Bind: MetaBindApi
    = MetadataInputBinder;
  //alias:
  InputField: MetaBindApi
    = MetadataInputBinder;

  //#endregion

  //#region Utilities

  path(relativePath?: string, extension: string | boolean = "", rootFolder?: string): string {
    return Path(relativePath, extension, rootFolder)
  }

  private static _parseFileNameFromDataFileFileOrPrototype(toValuesFile: string | boolean, source: NotesSource, prototype: string | boolean) {
    return toValuesFile
      ? source
        ? BuildDataValueFileFullPath(ParsePathFromNoteSource(source)!)
        : (IsString(toValuesFile)
          ? BuildDataValueFileFullPath(toValuesFile as string)
          : BuildDataValueFileFullPath(InternalStaticMetadataScrierPluginContainer.Api.Current.Path))
      : prototype
        ? source
          ? BuildPrototypeFileFullPath(ParsePathFromNoteSource(source)!)
          : (IsString(prototype)
            ? BuildPrototypeFileFullPath(prototype as string)
            : BuildPrototypeFileFullPath(InternalStaticMetadataScrierPluginContainer.Api.Current.Path))
        : ParsePathFromNoteSource(source) || InternalStaticMetadataScrierPluginContainer.Api.Current.Path;
  }

  private _splayToPathIndexedRecord<TType>(
    paths: Array<NotesSource>,
    singleFileLogic: (
      path: TFile,
      options: DataFetcherSettings
    ) => ScryResults<TType> | TType | undefined | Promise<TType>,
    options: DataFetcherSettings
  ): ScryResultsMap<TType> | ScryResultPromiseMap<TType> {
    const result: ScryResultsMap<TType> | ScryResultPromiseMap<TType> = {} as any;
    let count = 0;
    const keys: Array<string> = []

    for (const source of paths) {
      const subResult = this._scryForFolderOrFile(
        source,
        options,
        singleFileLogic
      );

      const sourcePath = ParsePathFromNoteSource(source)!;
      (result as any)[sourcePath] = subResult;
      Object.defineProperty(result, count++, {
        value: subResult,
        enumerable: false
      });
      keys.push(sourcePath);

      if (options?.flatten) {
        if (subResult instanceof Promise) {
          continue;
        } else if (IsObject(subResult)) {
          const children = subResult as { [path: string]: ScryResults<TType> };
          for (const childPath of Object.keys(children)) {
            (result as any)[childPath] = children[childPath];
            Object.defineProperty(result, count++, {
              value: children[childPath],
              enumerable: false
            });
            keys.push(childPath);
          }
        }
      }
    }

    const collection = result as any;
    delete collection.count;
    Object.defineProperty(collection, "count", {
      value: count,
      enumerable: false
    });
    Object.defineProperty(collection, "keys", {
      value: keys,
      enumerable: false
    });

    return ScryResultsConstructor(
      collection,
      options
    ) as ScryResultsMap<TType> | ScryResultPromiseMap<TType>;
  }

  private  _scryForFolderOrFile<TType>(
    source: NotesSource,
    options: DataFetcherSettings & {
      isPromised?: boolean
    },
    singleFileLogic: (
      path: TFile,
      options: DataFetcherSettings
    ) => ScryResults<TType> | TType | undefined | Promise<TType>
  ): ScryResults<TType> | PromisedScryResults<TType> {
    const file = this.vault(source);

    if (IsTFolder(file)) {
      return this._splayToPathIndexedRecord(
        file.children,
        singleFileLogic,
        options
      ) as ScryResults<TType> | PromisedScryResults<TType>;
    } else if (IsTFile(file)) {
      return SingleScryResult(singleFileLogic(file, options), options) as ScryResults<TType> | PromisedScryResults<TType>;
    }

    return options.isPromised
      ? (Promise.resolve(undefined) as any as PromisedScryResults<TType>)
      : (undefined as any as ScryResults<TType>);
  }

  //#endregion
}
