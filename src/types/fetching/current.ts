import { TFile } from "obsidian";
import { Frontmatter, Metadata, Cache } from "../datas";
import { Sections } from "../sections/sections";
import { CurrentNoteMetaEditApi } from "../editing/editor";
import { CurrentMetaBindApi } from "../editing/bind";
import { FrontmatterUpdateSettings } from "../settings";

/**
 * Interface for the current note within the api
 */
export interface CurrentNoteMetaScryApi {

  /**
   * Get all Metadata from the default sources for the current file.
   *
   * @alias {@link data}
   * @alias {@link MetaScryApi.data}
   *
   * @see {@link MetaScryApi.get}
   */
  get Data(): Metadata;

  /**
   * Get all Metadata from the default sources for the current file.
   *
   * @alias {@link Data}
   * @alias {@link MetaScryApi.data}
   *
   * @see {@link MetaScryApi.get}
   */
  get data(): Metadata;

  /**
   * The current note focused by the workspace.
   *
   * @alias {@link note}
   *
   * @see {@link MetaScryApi.file}
   * @see {@link MetaScryApi.vault}
   * @see {@link MetaScryApi.folder}
   */
  get Note(): TFile;

  /**
   * The current note focused by the workspace.
   *
   * @alias {@link Note}
   *
   * @see {@link MetaScryApi.file}
   * @see {@link MetaScryApi.vault}
   * @see {@link MetaScryApi.folder}
   */
  get note(): TFile;

  /**
   * The current path of the current note without the extension
   *
   * @alias {@link path}
   *
   * @see {@link pathex}
   * @see {@link PathEx}
   * @see {@link MetaScryApi.path}
   */
  get Path(): string;

  /**
   * The current path of the current note without the extension
   *
   * @alias {@link Path}
   *
   * @see {@link pathex}
   * @see {@link PathEx}
   * @see {@link MetaScryApi.path}
   */
  get path(): string;

  /**
   * The current path of the current note with it's extension
   *
   * @alias {@link pathex}
   *
   * @see {@link path}
   * @see {@link Path}
   * @see {@link MetaScryApi.path}
   */
  get PathEx(): string;

  /**
   * The current path of the current note with it's extension
   *
   * @alias {@link PathEx}
   *
   * @see {@link path}
   * @see {@link Path}
   * @see {@link MetaScryApi.path}
   */
  get pathex(): string;

  /**
   * Get just the frontmatter of the current file
   *
   * @alias {@link fm}
   * @alias {@link matter}
   * @alias {@link frontmatter}
   * @alias {@link Frontmatter}
   *
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get Matter(): Frontmatter;

  /**
   * Get just the frontmatter of the current file
   *
   * @alias {@link fm}
   * @alias {@link matter}
   * @alias {@link frontmatter}
   * @alias {@link Matter}
   *
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get matter(): Frontmatter;

  /**
   * Get just the frontmatter of the current file
   *
   * @alias {@link Matter}
   * @alias {@link matter}
   * @alias {@link frontmatter}
   * @alias {@link Frontmatter}
   *
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get fm(): Frontmatter;

  /**
   * Get just the frontmatter of the current file
   *
   * @alias {@link fm}
   * @alias {@link matter}
   * @alias {@link frontmatter}
   * @alias {@link Matter}
   *
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get Frontmatter(): Frontmatter;

  /**
   * Get just the frontmatter of the current file
   *
   * @alias {@link fm}
   * @alias {@link matter}
   * @alias {@link Matter}
   * @alias {@link Frontmatter}
   *
   * @see {@link MetaScryApi.fm}
   * @see {@link MetaScryApi.matter}
   * @see {@link MetaScryApi.frontmatter}
   * @see {@link MetaScryApi.get}
   */
  get frontmatter(): Frontmatter;

  /**
   * Access the cached vales for the current file only.
   *
   * @alias {@link cache}
   * @alias {@link global#cache}
   *
   * @see {@link MetaScryApi.cache}
   */
  get Cache(): Cache;

  /**
   * Access the cached vales for the current file only.
   *
   * @alias {@link Cache}
   * @alias {@link global#cache}
   *
   * @see {@link MetaScryApi.cache}
   */
  get cache(): Cache;

  /**
   * Access the sections for the current file only.
   *
   * @alias {@link sections}
   *
   * @see {@link MetaScryApi.sections}
   */
  get Sections(): Sections;

  /**
   * Access the sections for the current file only.
   *
   * @alias {@link Sections}
   *
   * @see {@link MetaScryApi.sections}
   */
  get sections(): Sections;

  /**
   * A link to the opd-metadata-lib plugin api
   *
   * @alias {@link edit}
   *
   * @see {@link MetaScryApi.edit}
   * @see {@link patch}
   * @see {@link set}
   * @see {@link clear}
   */
  get Edit(): CurrentNoteMetaEditApi;

  /**
   * A link to the opd-metadata-lib plugin api
   *
   * @alias {@link Edit}
   *
   * @see {@link MetaScryApi.edit}
   * @see {@link patch}
   * @see {@link set}
   * @see {@link clear}
   */
  get edit(): CurrentNoteMetaEditApi;

  /**
   * Patch individual properties of the current file's frontmatter metadata.
   *
   * @param {Record<string, any>|any} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string|null} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to patch said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to patch said data prototype file. You can also pass in the path here instead.
   *
   * @alias {@link MetaScryApi.patch}
   *
   * @see {@link set}
   * @see {@link edit}
   * @see {@link clear}
   */
  patch(
    frontmatterData: any,
    propertyName?: string | undefined,
    options?: FrontmatterUpdateSettings
  ): Promise<Frontmatter>;

  /**
   * Replace the existing frontmatter the current file with entirely new data, clearing out all old data in the process.
   *
   * @param {Frontmatter} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   *
   * @alias {@link MetaScryApi.set}
   *
   * @see {@link patch}
   * @see {@link edit}
   * @see {@link CurrentFileMetaScryApi.edit}
   * @see {@link clear}
   */
  set(
    frontmatterData: any,
    options?: FrontmatterUpdateSettings
  ): Promise<Frontmatter>;

  /**
   * Used to clear values from metadata.
   *
   * @param {object|string} file The file to clear properties for. defaults to the current file.
   * @param {string|Array<string>|Record<string, any>|null} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
   *
   * @alias {@link MetaScryApi.clear}
   *
   * @see {@link set}
   * @see {@link edit}
   * @see {@link CurrentFileMetaScryApi.edit}
   * @see {@link patch}
   */
  clear(
    frontmatterProperties?: string | Array<string> | object | undefined,
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
  bind: CurrentMetaBindApi;
    
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
  Bind: CurrentMetaBindApi;
 
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
  inputField: CurrentMetaBindApi;
 
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
  InputField: CurrentMetaBindApi;
}
