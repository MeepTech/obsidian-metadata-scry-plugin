import { TFile } from 'obsidian';
import {
  Cache,
  CurrentNoteMetaScryApi,
  Frontmatter,
  Metadata,
  MetaScryApi,
  Sections,
  FrontmatterUpdateOptions
} from './api';
import { IsString } from './constants';

/**
 * Access to current metadata via localized versions of the calls in MetaScryApi
 */

export class CurrentNoteScrier implements CurrentNoteMetaScryApi {
  private _api: MetaScryApi;

  constructor(metaApi: MetaScryApi) {
    this._api = metaApi;
  }

  get Data(): Metadata  {
    return this._api.get() as Metadata;
  }

  get data(): Metadata {
    return this.Data;
  }

  get Note(): TFile {
    const specialCache = this._api.cache("_zpec:a|") as Cache;
    if (IsString(specialCache["CurrentPath"])) {
      const current = this._api.vault(
        specialCache["CurrentPath"]
      ) as TFile;
      
      if (!current) {
        throw "No Current File";
      }
      
      return current;
    }

    const current = app.workspace.getActiveFile();

    if (!current) {
      throw "No Current File";
    }
    
    return current;
  }

  get note(): TFile {
    return this.Note;
  }

  get Path(): string {
    const note: TFile = this.Note;
    let path = note.path;
    if (note.extension) {
      path = path.slice(0, 0 - (note.extension.length + 1));
    }

    return path;
  }

  get path(): string {
    return this.Path;
  }

  get PathEx(): string {
    return this.note.path;
  }

  get pathex(): string {
    return this.PathEx;
  }

  get Matter(): Frontmatter {
    return this._api.frontmatter() as Frontmatter;
  }

  get matter(): Frontmatter {
    return this.Matter;
  }

  get fm(): Frontmatter {
    return this.Matter;
  }

  get Frontmatter(): Frontmatter {
    return this.Matter;
  }
  
  get frontmatter(): Frontmatter {
    return this.Matter;
  }

  get Cache(): Cache {
    return this._api.cache() as Cache;
  }

  get cache(): Cache {
    return this.Cache;
  }

  get Sections(): Sections {
    return this._api.sections() as Sections;
  }

  get sections(): Sections {
    return this.Sections;
  }

  patch(frontmatterData: any, propertyName: string | null = null, options: FrontmatterUpdateOptions = {toValuesFile: false, prototype: false}): any | object {
    return this._api.patch(this.path, frontmatterData, propertyName, options);
  }

  set(frontmatterData: any, options: FrontmatterUpdateOptions = {toValuesFile: false, prototype: false}): any | object {
    return this._api.set(this.path, frontmatterData, options);
  }

  clear(frontmatterProperties: string | Array<string> | object | null = null, options: FrontmatterUpdateOptions = {toValuesFile: false, prototype: false}) {
    return this._api.clear(this.path, frontmatterProperties, options);
  }
}
