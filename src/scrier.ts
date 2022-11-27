import {
  MarkdownRenderer,
  MarkdownView,
  TAbstractFile,
  TFile,
  TFolder
} from 'obsidian';
import {
  DataArray,
  DataviewApi
} from "obsidian-dataview";

import {
  Sections
} from './types/sections';
import {
  MetaScryApi
} from "./types/scrier";
import { CurrentNoteMetaScryApi } from "./types/current";
import { FrontmatterUpdateSettings, MetaEditApi } from "./types/editor";
import {
  MetaScryPluginApi,
  SplayKebabCasePropertiesOption,
  AppWithPlugins
} from "./types/plugin";
import {
  CachedFileMetadata, DataviewMatter,
  Frontmatter,
  Metadata
} from "./types/data";
import {
	Keys,
	Symbols,
  DefaultFrontmatterUpdateOptions
} from './constants';
import { InternalStaticMetadataScrierPluginContainer } from "./static";
import { CurrentNoteScrier } from "./current";
import { NoteSections } from './sections';
import {
  BuildDataValueFileFullPath,
  BuildPrototypeFileFullPath,
  IsArray,
  IsObject,
  IsString,
  ParseFilePathFromSource,
  Path
} from './utilities';
import { MetadataSources, NotesSource, SingleFileSource } from './types/sources';
import { MetaBindApi } from './types/bind';
import { MetadataInputBinder } from './bind';

/**
 * Access and edit metadata about a file from multiple sources.
 */
export class MetadataScrier implements MetaScryApi {
  private static _caches: any = {};
  private _kebabPropSplayer: (base: any, topLevelPropertiesToIgnore: Array<string> | null) => object;
  private _lowerCaseSplayer: (base: any) => object;

  //#region Initalization

  constructor() {
    this._initializeKebabPropSplayer();
    this._initializePropLowercaseSplayer();
  }

  //#region Property Name Splayer Initialization

  private _initializeKebabPropSplayer() {
    this._kebabPropSplayer = (() => {
      switch (InternalStaticMetadataScrierPluginContainer.Settings.splayKebabCaseProperties) {
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
    if (key.includes(Symbols.KebabCaseWordSeperatorCharacter)) {
      data[key.replace(/-/g, "").toLowerCase()] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerCamelcase(key: string, value: any, data: any | object): any | object {
    if (key.includes(Symbols.KebabCaseWordSeperatorCharacter)) {
      data[key
        .toLowerCase()
        .split('-')
        .map((part, i) => (i !== 0 && part) ? part.charAt(0).toUpperCase() + part.substring(1) : part)
        .join('')] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerAndLowerCamelcase(key: string, value: any, data: any | object): any | object {
    if (key.includes(Symbols.KebabCaseWordSeperatorCharacter)) {
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

    const path = (ParseFilePathFromSource(source) || this.Current.Path);
    return app.vault.getAbstractFileByPath(path)
      ?? app.vault.getAbstractFileByPath(path + Symbols.ExtensionFilePathSeperatorCharacter + Symbols.DefaultMarkdownFileExtension);
  } // aliases:
  file = (source: NotesSource = this.current.path): TFile | null =>
    this.vault(source) as TFile;
  folder = (source: NotesSource = this.current.path): TFolder | null =>
    this.vault(source) as TFolder;

  async markdown(source: NotesSource = this.current.path): Promise<string> {
    const file = this.file(source) as TFile;
    const md = await app.vault.cachedRead(file);

    return md;
  } // aliases:
  md = async (source: NotesSource = this.current.path): Promise<string> =>
    await this.markdown(source);

  async html(source: NotesSource = this.current.path, rawMd: string | undefined = undefined): Promise<HTMLElement> {
    const path = ParseFilePathFromSource(source)!;
    return await (app as AppWithPlugins).plugins.plugins[Keys.CopyToHtmlPluginKey]!.convertMarkdown(
      rawMd || await this.md(path),
      path
    );
  }

  async text(source: NotesSource = this.current.path): Promise<string> {
    const html = await this.html(source);
    const text = html.textContent || "";

    return text;
  } // aliases:
  txt = async (source: NotesSource = this.current.path): Promise<string> =>
    await this.text(source);

  embed(source: NotesSource, container: HTMLElement | undefined = undefined, intoNote: SingleFileSource | undefined = undefined)
    : HTMLElement {
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
        : this.file(ParseFilePathFromSource(intoNote))
    }

    const embedData = {
      app,
      containerEl,
      displayMode: false,
      linktext: this.path,
      remainingNestLevel: 5,
      showTitle: true,
      sourcePath: (intoNote as TFile).path
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

  omfc(source: NotesSource = this.current.path): CachedFileMetadata | CachedFileMetadata[] | null {
    const fileObject = this.vault(source);

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
  } // aliases:
  obsidianMetadataFileCache = (source: NotesSource = this.current.path): CachedFileMetadata | CachedFileMetadata[] | null =>
    this.omfc(source);

  frontmatter(source: NotesSource = this.current.path): Frontmatter | Frontmatter[] | null {
    const fileCache = this.omfc(source);

    if (Array.isArray(fileCache)) {
      return fileCache.map(f => this.frontmatter(f.path) as Frontmatter);
    } else {
      return (fileCache && fileCache.frontmatter)
        ? this._lowerCaseSplayer(this._kebabPropSplayer(fileCache?.frontmatter, null))
        : null;
    }
  } // aliases:
  fm = (source: NotesSource = this.current.path): Frontmatter | Frontmatter[] | null =>
    this.frontmatter(source)
  matter = (source: NotesSource = this.current.path): Frontmatter | Frontmatter[] | null =>
    this.frontmatter(source)

  sections(source: NotesSource = this.current.path): Sections | Sections[] | null {
    const fileCache = this.omfc(source);

    if (Array.isArray(fileCache)) {
      return fileCache.map(f => this.sections(f.path) as Sections);
    } else if (!fileCache) {
      return null;
    } else {
      return new NoteSections(fileCache?.path, fileCache?.headings) as Sections;
    }
  }

  dvMatter(source: NotesSource = null, useSourceQuery: boolean = false): DataviewMatter | DataArray<DataviewMatter | DataArray<any> | null> | null {
    const providedPath: string = source ? ParseFilePathFromSource(source) as string : this.Current.Path;
    const paths = InternalStaticMetadataScrierPluginContainer
      .DataviewApi
      .pagePaths(useSourceQuery ? providedPath : (`"` + providedPath + '"'));

    if (paths.length > 1) {
      return paths.map((p: string) => this.dvMatter(p));
    } else if (!paths.length) {
      return null;
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
  dataviewFrontmatter = (source: NotesSource = null, useSourceQuery: boolean = false): DataviewMatter | DataArray<DataviewMatter | DataArray<any> | null> | null =>
    this.dvMatter(source, useSourceQuery);

  cache(source: NotesSource = null): Cache | Cache[] {
    const fileObject = this.vault(source);
    if (fileObject === null) {
      const key = ParseFilePathFromSource(source);
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
  } // aliases:
  temp = (source: NotesSource = null): Cache | Cache[] =>
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
    return this.frontmatter(BuildPrototypeFileFullPath(prototypePath));
  }

  values(dataPath: string): Frontmatter | Frontmatter[] | null {
    return this.frontmatter(BuildDataValueFileFullPath(dataPath));
  }

  get(source: NotesSource | MetadataSources = this.current.path, sources: MetadataSources | boolean = MetadataScrier.DefaultSources): Metadata | Metadata[] | null {
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
      ? (ParseFilePathFromSource(source as NotesSource)
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
  from = (source: NotesSource = this.current.path, sources: MetadataSources | boolean = MetadataScrier.DefaultSources): Metadata | Metadata[] | null =>
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
        ? BuildDataValueFileFullPath(ParseFilePathFromSource(source)!)
        : (IsString(toValuesFile)
          ? BuildDataValueFileFullPath(toValuesFile as string)
          : BuildDataValueFileFullPath(InternalStaticMetadataScrierPluginContainer.Api.Current.Path))
      : prototype
        ? source
          ? BuildPrototypeFileFullPath(ParseFilePathFromSource(source)!)
          : (IsString(prototype)
            ? BuildPrototypeFileFullPath(prototype as string)
            : BuildPrototypeFileFullPath(InternalStaticMetadataScrierPluginContainer.Api.Current.Path))
        : ParseFilePathFromSource(source) || InternalStaticMetadataScrierPluginContainer.Api.Current.Path;
  }

  //#endregion
}
