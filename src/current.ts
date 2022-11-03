import { TFile } from 'obsidian';
import { Cache, CurrentApi, Frontmatter, MetaData, MetadataApi, Sections } from './api';

/**
 * Access to current metadata
 */

export class CurrentMetadata implements CurrentApi {
  private _api: MetadataApi;

  constructor(metaApi: MetadataApi) {
    this._api = metaApi;
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Data(): MetaData {
    return this._api.get();
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get data(): MetaData {
    return this.Data;
  }

  /**
   * The current note focused by the workspace.
   */
  get Note(): TFile {
    const current = app.workspace.getActiveFile();
    if (!current) {
      throw "No Current File";
    }

    return current;
  }

  /**
   * The current note focused by the workspace.
   */
  get note(): TFile {
    return this.Note;
  }

  /**
   * The current path of the current note
   */
  get Path(): string {
    const note: TFile = this.Note;
    let path = note.path;
    if (note.extension) {
      path = path.slice(0, 0 - (note.extension.length + 1));
    }

    return path;
  }

  /**
   * The current path of the current note
   */
  get path(): string {
    return this.Path;
  }

  /**
   * The current path of the current note with it's extension
   */
  get PathEx(): string {
    return this.Path + "." + this.note.extension;
  }

  /**
   * The current path of the current note with it's extension
   */
  get pathex(): string {
    return this.PathEx;
  }

  /**
   * Get just the frontmatter of the current file
   */
  get Matter(): Frontmatter {
    return this._api.frontmatter();
  }

  /**
   * Get just the frontmatter of the current file
   */
  get matter(): Frontmatter {
    return this.Matter;
  }

  /**
   * Access the cached vales for the current file only.
   */
  get Cache(): Cache {
    return this._api.cache();
  }

  /**
   * Access the cached vales for the current file only.
   */
  get cache(): Cache {
    return this.Cache;
  }

  /**
   * Access the sections for the current file only.
   */
  get Sections(): Sections {
    return this._api.sections();
  }

  /**
   * Access the sections for the current file only.
   */
  get sections(): Sections {
    return this.Sections;
  }

  /**
   * Patch individual properties of the current file's frontmatter metadata.
   *
   * @param {*|object} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to patch said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to patch said data prototype file. You can also pass in the path here instead.
   *
   * @returns The updated Metadata.
   */
  patch(frontmatterData: any, propertyName: string | null = null, toValuesFile: boolean | string = false, prototype: string | boolean = false): any | object {
    return this._api.patch(this.path, frontmatterData, propertyName, toValuesFile, prototype);
  }

  /**
   * Replace the existing frontmatter the current file with entirely new data, clearing out all old data in the process.
   *
   * @param {object} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   *
   * @returns The updated Metadata
   */
  set(frontmatterData: any, toValuesFile: boolean | string = false, prototype: string | boolean = false): any | object {
    return this._api.set(this.path, frontmatterData, toValuesFile, prototype);
  }

  /**
   * Used to clear values from metadata.
   *
   * @param {object|string} file The file to clear properties for. defaults to the current file.
   * @param {string|array} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
   */
  clear(frontmatterProperties: string | Array<string> | object | null = null, toValuesFile: boolean | string = false, prototype: string | boolean = false) {
    return this._api.clear(this.path, frontmatterProperties, toValuesFile, prototype);
  }
}
