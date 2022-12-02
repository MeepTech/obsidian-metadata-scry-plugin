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
import { FrontmatterUpdateSettings, SplayKebabCasePropertiesOptions } from "../types/settings";
import {
  CachedFileMetadata, DataviewMatter,
  Frontmatter,
  Metadata,
  PromisedScryResults,
  ScryResultMap,
  ScryResults
} from "../types/datas";
import {
  Keys,
  Symbols,
  DefaultFrontmatterUpdateOptions
} from '../constants';
import { InternalStaticMetadataScrierPluginContainer } from "../static";
import { CurrentNoteScrier } from "./current";
import { NoteSections } from '../sections/sections';
import {
  BuildDataValueFileFullPath,
  BuildPrototypeFileFullPath,
  IsArray,
  IsObject,
  IsString,
  ParsePathFromNoteSource,
  Path
} from '../utilities';
import { MetadataSources, NotesSource, SingleFileSource } from '../types/fetching/sources';
import { MetaBindApi } from '../types/editing/bind';
import { MetadataInputBinder } from '../editing/bind';

/**
 * Access and edit metadata about a file from multiple sources.
 * 
 * @internal
 */
export class MetadataScrier implements MetaScryApi {
  private static _caches: any = {};
  // TODO: replace internals with the new splay function
  private _kebabPropSplayer: (base: any, topLevelPropertiesToIgnore?: Array<string>) => object;
  private _lowerCaseSplayer: (base: any) => object;

  //#region Initalization

  constructor() {
    this._initializeKebabPropSplayer();
    this._initializePropLowercaseSplayer();
  }

  //#region Property Name Splayer Initialization

  private _initializeKebabPropSplayer() {
    // TODO: replace internals with the new splay function
    this._kebabPropSplayer = (() => {
      switch (InternalStaticMetadataScrierPluginContainer.Settings.splayKebabCaseProperties) {
        case SplayKebabCasePropertiesOptions.Lowercase:
          return (base, topLevelPropertiesToIgnore) =>
            MetadataScrier._recurseOnAllObjectProperties(base, MetadataScrier._splayKebabToLowercase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOptions.CamelCase:
          return (base, topLevelPropertiesToIgnore) =>
            MetadataScrier._recurseOnAllObjectProperties(base, MetadataScrier._splayKebabToLowerCamelcase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOptions.LowerAndCamelCase:
          return (base, topLevelPropertiesToIgnore) =>
            MetadataScrier._recurseOnAllObjectProperties(base, MetadataScrier._splayKebabToLowerAndLowerCamelcase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOptions.Disabled:
        default:
          return base => base;
      }
    })();
  }

  private _initializePropLowercaseSplayer() {
    this._lowerCaseSplayer = InternalStaticMetadataScrierPluginContainer.Settings.splayFrontmatterWithoutDataview
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
    if (key.includes(Symbols.KebabCasePropertyNameWordSeperatorCharacter)) {
      data[key.replace(/-/g, "").toLowerCase()] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerCamelcase(key: string, value: any, data: any | object): any | object {
    if (key.includes(Symbols.KebabCasePropertyNameWordSeperatorCharacter)) {
      data[key
        .toLowerCase()
        .split('-')
        .map((part, i) => (i !== 0 && part) ? part.charAt(0).toUpperCase() + part.substring(1) : part)
        .join('')] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerAndLowerCamelcase(key: string, value: any, data: any | object): any | object {
    if (key.includes(Symbols.KebabCasePropertyNameWordSeperatorCharacter)) {
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

  vault(source: NotesSource = this.current.path): TFile | TFolder | TAbstractFile | null {
    if (source instanceof TAbstractFile) {
      return source;
    }
    const path = (ParsePathFromNoteSource(source) || this.Current.Path);

    return app.vault.getAbstractFileByPath(path)
      ?? app.vault.getAbstractFileByPath(path + Symbols.ExtensionFilePathSeperatorCharacter + Symbols.DefaultMarkdownFileExtension);
  } // aliases:
  file = (source: NotesSource = this.current.path): TFile | null =>
    this.vault(source) as TFile;
  folder = (source: NotesSource = this.current.path): TFolder | null =>
    this.vault(source) as TFolder;

  markdown(source: NotesSource = this.current.path): PromisedScryResults<string> {
    const file = this.vault(source);
    if (file instanceof TFolder) {
      return MetadataScrier._splayToPathIndexedRecord(file.children, this.markdown);
    } else if (file instanceof TFile) {
      return app.vault.cachedRead(file);
    }

    return Promise.resolve(undefined);
  } // aliases:
  md = (source: NotesSource = this.current.path): PromisedScryResults<string> =>
    this.markdown(source);

  html(source: NotesSource = this.current.path, rawMd?: string): PromisedScryResults<HTMLElement> {
    const file = this.vault(source);
    if (file instanceof TFolder) {
      return MetadataScrier._splayToPathIndexedRecord(file.children, this.html);
    } else if (file instanceof TFile) {
      return (async () => (app as AppWithPlugins).plugins.plugins[Keys.CopyToHtmlPluginKey]!.convertMarkdown(
        rawMd || (await this.md(file)) as string,
        file.path
      ))();
    }

    return Promise.resolve(undefined);
  }

  text(source: NotesSource = this.current.path): PromisedScryResults<string> {
    const file = this.vault(source);
    if (file instanceof TFolder) {
      return MetadataScrier._splayToPathIndexedRecord(file.children, this.text);
    } else if (file instanceof TFile) {
      return (async () => {
        const html = await this.html(source);
        const text = html!.textContent || "";

        return text as string;
      })();
    }

    return Promise.resolve(undefined);
  } // aliases:
  txt = (source: NotesSource = this.current.path): PromisedScryResults<string> =>
    this.text(source);

  embed(
    source: NotesSource,
    container?: HTMLElement,
    intoNote?: SingleFileSource
  ): ScryResults<HTMLElement> {
    source = typeof source === 'string' && source.contains(Symbols.SectionLinkSeperatorCharachter)
      ? source
      : this.vault(source);

    if (source instanceof TFolder) {
      return MetadataScrier._splayToPathIndexedRecord(source.children, this.embed);
    }

    const containerEl = container || document.createElement("div");
    if (!container) {
      const workspaceEl = app.workspace.getActiveViewOfType(MarkdownView)!.containerEl.children[1];
      workspaceEl.appendChild(containerEl);
    }

    if (!intoNote) {
      intoNote = this.file(this.current.path) as TFile;
    } else {
      intoNote = intoNote instanceof TFile
        ? intoNote
        : this.file(ParsePathFromNoteSource(intoNote))
    }

    const embedData = {
      app,
      containerEl,
      displayMode: false,
      linktext: source,
      remainingNestLevel: 5,
      showTitle: true,
      sourcePath: source
    };

    //@ts-expect-error secret function
    const embed = MarkdownRenderer.loadEmbed(
      embedData,
      intoNote,
      containerEl
    )

    embed.load();
    embed.loadFile();

    return containerEl;
  }

  omfc(source: NotesSource = this.current.path): ScryResults<CachedFileMetadata> {
    const fileObject = this.vault(source);

    if (!(fileObject instanceof TFile)) {
      if (fileObject instanceof TFolder) {
        return MetadataScrier._splayToPathIndexedRecord(fileObject.children, this.omfc);
      } else {
        throw `Note or Folder Not Found: ${fileObject?.path}`;
      }
    }

    const result = (app.metadataCache.getFileCache(fileObject) as CachedFileMetadata) || null;
    if (result !== null) {
      result.path = fileObject.path;
    }

    return result;
  } // aliases:
  obsidianMetadataFileCache = (source: NotesSource = this.current.path): ScryResults<CachedFileMetadata> =>
    this.omfc(source);

  frontmatter(source: NotesSource = this.current.path): ScryResults<Frontmatter> {
    const file = this.vault(source);

    if (file instanceof TFolder) {
      return MetadataScrier._splayToPathIndexedRecord(file.children, this.frontmatter);
    } else {
      const fileCache = this.omfc(file);
      if (fileCache?.frontmatter) {
        return this._lowerCaseSplayer(this._kebabPropSplayer(fileCache?.frontmatter));
      }
    }

    return undefined;
  } // aliases:
  fm = (source: NotesSource = this.current.path): ScryResults<Frontmatter> =>
    this.frontmatter(source)
  matter = (source: NotesSource = this.current.path): ScryResults<Frontmatter> =>
    this.frontmatter(source)

  sections(source: NotesSource = this.current.path): ScryResults<Sections> {
    const file = this.vault(source);

    if (file instanceof TFolder) {
      return MetadataScrier._splayToPathIndexedRecord(file.children, this.sections);
    } else {
      const fileCache = this.omfc(source) as CachedFileMetadata;
      if (!fileCache) {
        return undefined;
      }

      return new NoteSections(fileCache.path, fileCache?.headings) as Sections;
    }
  }

  dvMatter(source: NotesSource = null, useSourceQuery: boolean = false): ScryResults<DataviewMatter> {
    const providedPath: string = source ? ParsePathFromNoteSource(source) as string : this.Current.Path;
    const paths = InternalStaticMetadataScrierPluginContainer
      .DataviewApi
      .pagePaths(useSourceQuery ? providedPath : (`"` + providedPath + '"'));

    if (paths.length > 1) {
      return MetadataScrier._splayToPathIndexedRecord(paths.array(), this.dvMatter);
    } else if (!paths.length) {
      return undefined;
    } else {
      const result = InternalStaticMetadataScrierPluginContainer
        .DataviewApi
        .page(paths[0]);

      return this._kebabPropSplayer(result, [
        Keys.FileMetadataPropertyLowercaseKey,
        Keys.FileMetadataPropertyUppercaseKey
      ]) as DataviewMatter;
    }
  } // aliases:
  dataviewFrontmatter = (source: NotesSource = null, useSourceQuery: boolean = false): ScryResults<DataviewMatter> =>
    this.dvMatter(source, useSourceQuery);

  cache(source: NotesSource = null): ScryResults<Cache> {
    const fileObject = this.vault(source);
    if (fileObject === null) {
      const key = ParsePathFromNoteSource(source);
      if (key !== null && key !== undefined) {
        MetadataScrier._caches[key] = MetadataScrier._caches[key] || {};

        return MetadataScrier._caches[key];
      }

      throw "Invalid Key for File";
    } else if (fileObject instanceof TFolder) {
      return MetadataScrier._splayToPathIndexedRecord(fileObject.children, this.cache);
    } else {
      MetadataScrier._caches[fileObject.path] = MetadataScrier._caches[fileObject.path] || {};

      return MetadataScrier._caches[fileObject.path];
    }
  } // aliases:
  temp = (source: NotesSource = null): ScryResults<Cache> =>
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

  prototypes(prototypePath: string): ScryResults<Frontmatter> {
    return this.frontmatter(BuildPrototypeFileFullPath(prototypePath));
  }

  values(dataPath: string): ScryResults<Frontmatter> {
    return this.frontmatter(BuildDataValueFileFullPath(dataPath));
  }

  get(source: NotesSource | MetadataSources = this.current.path, sources: MetadataSources | boolean = MetadataScrier.DefaultSources): ScryResults<Metadata> {
    // double check the object. If it's a metadata source object, re-run this with that as the sources and the source as the current file.
    if (IsObject(source)) {
      if (source instanceof TFolder) {
        return source.children.map(c => this.get(c, sources)).flat();
      } else if (!source!.hasOwnProperty("path")) {
        if (Keys.MetadataSourceKeys.some(key => source!.hasOwnProperty(key))) {
          if (!Object.keys(source!).some(key => !Keys.MetadataSourceKeys.includes(key))) {
            return this.get(this.current.path, source as MetadataSources);
          }
        }
      }
    }

    const filePath = source
      ? (ParsePathFromNoteSource(source as NotesSource)
        ?? this.current.path)
      : this.Current.Path;

    if (filePath?.endsWith(Symbols.FolderPathSeperatorCharacter)) {
      const folderName = filePath.substring(0, -1);
      const fileObject = this.vault(folderName);

      if (fileObject instanceof TFolder) {
        return fileObject.children.map(c => this.get(c, sources)).flat();
      } else {
        throw "Expected folder because of trailing slash(/): '" + filePath + "'.";
      }
    } else {
      const fileObject = this.vault(filePath);

      if (fileObject instanceof TFolder) {
        return fileObject.children.map(c => this.get(c, sources)).flat();
      }
    }

    let values: any = {};

    if (sources === true) {
      values = this._kebabPropSplayer(InternalStaticMetadataScrierPluginContainer
        .DataviewApi
        .page(filePath), [Keys.FileMetadataPropertyLowercaseKey, Keys.FileMetadataPropertyUppercaseKey]) || {};
    } else {
      if (sources === false) {
        return {};
      }

      // if we need dv sources
      if (sources[Keys.DataviewInlineMetadataSourceKey] || sources[Keys.FileInfoMetadataSourceKey]) {
        values = this._kebabPropSplayer(InternalStaticMetadataScrierPluginContainer
          .DataviewApi
          .page(filePath), [Keys.FileMetadataPropertyLowercaseKey, Keys.FileMetadataPropertyUppercaseKey]) || {};

        // remove dv inline?
        let frontmatter: Frontmatter = null!;
        if (!sources[Keys.DataviewInlineMetadataSourceKey]) {
          frontmatter = this.frontmatter(filePath) as Frontmatter;
          Object.keys(values).forEach(prop => {
            // if it's not a frontmatter prop or the 'file' metadata prop
            if (!frontmatter.hasOwnProperty(prop) && (prop !== Keys.FileMetadataPropertyLowercaseKey && prop !== Keys.FileMetadataPropertyUppercaseKey)) {
              delete values[prop];
            }
          });
        }

        // remove frontmatter?
        if (!sources[Keys.FrontmatterMetadataSourceKey]) {
          frontmatter = frontmatter || this.frontmatter(filePath);
          Object.keys(frontmatter).forEach(prop => {
            delete values[prop];
          });
        }
      } // just the frontmatter/cache?
      else if (sources[Keys.FrontmatterMetadataSourceKey]) {
        values = this.frontmatter(filePath);
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
      const foundCache = this.cache(filePath);
      values[Keys.CacheMetadataPropertyLowercaseKey] = foundCache;
      values[Keys.CacheMetadataPropertyCapitalizedKey] = foundCache;
    }

    // add sections?
    if (sources === true || sources[Keys.NoteSectionsMetadataSourceKey]) {
      if (IsObject(sources) && !(sources as MetadataSources)[Keys.FileInfoMetadataSourceKey]) {
        values[Keys.FileMetadataPropertyLowercaseKey] = {};
        values[Keys.FileMetadataPropertyUppercaseKey] = {};
      }

      const sections = this.sections(filePath);
      values[Keys.FileMetadataPropertyLowercaseKey][Keys.SectionsMetadataPropertyCapitalizedKey] = sections;
      values[Keys.FileMetadataPropertyLowercaseKey][Keys.SectionsMetadataPropertyLowercaseKey] = sections;
      values[Keys.FileMetadataPropertyUppercaseKey][Keys.SectionsMetadataPropertyCapitalizedKey] = sections;
      values[Keys.FileMetadataPropertyUppercaseKey][Keys.SectionsMetadataPropertyLowercaseKey] = sections;
    }

    return values;
  } // aliases:
  from = (source: NotesSource = this.current.path, sources: MetadataSources | boolean = MetadataScrier.DefaultSources): ScryResults<Metadata> =>
    this.get(source, sources);

  //#endregion

  //#region Metadata Modifiers

  async patch(
    source: SingleFileSource,
    frontmatterData: Record<string, any> | any, propertyName: string | null = null,
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
        return await update(propertyName, frontmatterData, fileObject, options?.inline);
      } else {
        const results: Frontmatter[] = await Promise.all(
          Object.keys(frontmatterData)
            .map(async propertyName => (await update(
              propertyName,
              frontmatterData[propertyName],
              fileObject,
              options?.inline
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

      await this.clear(fileObject);
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

  path(relativePath: string | null = null, extension: string | boolean = "", rootFolder: string | null = null): string {
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

  private static _splayToPathIndexedRecord<TType>(
    paths: Array<NotesSource>,
    using: (path: NotesSource) => ScryResults<TType>,
    flatten: boolean = false
  ): ScryResultMap<TType> {
    const result: ScryResultMap<TType> = {};

    for (const source of paths) {
      if (flatten) {
        const children: ScryResults<TType> = using(source);
        if (IsObject(children)) {
          const correntTypedChildren = children as { [path: string]: ScryResults<TType> };
          for (const childPath of Object.keys(correntTypedChildren)) {
            result[childPath] = correntTypedChildren[childPath];
          }
        }
      }

      result[ParsePathFromNoteSource(source)!] = using(source);
    }

    return result;
  }

  //#endregion
}
