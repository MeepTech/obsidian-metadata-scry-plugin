import { Internal as OpdMetadataEditLibrary } from "@opd-libs/opd-metadata-lib/lib/Internal";
import { Frontmatter } from "../datas";
import { NotesSource } from "../fetching/sources";
import { MetadataEditorSettings } from "../settings";

/**
 * Api object with all functions found in the 'OPD-metadata-lib' metadata editor library compiled into an easy to use global api object.
 *
 * From: https://github.com/OPD-libs/OPD-libs/blob/main/libs/OPD-metadata-lib/src/API.ts
 *
 * @see {@link CurrentNoteMetaEditApi}
 */

export interface MetaEditApi extends ContextlessMetadataEditApiMethods {

  /**
   * Get the frontmatter field from a given file
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param source (optional) Defaults to the current file
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object
   *
   * @alias {@link getFieldFromTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link CurrentNoteMetaEditApi.get}
   *
   * @see {@link getField}
   * @see {@link MetaScryApi.get}
   */
  getFieldFromTFile(propertyAccessorKey: string, source?: NotesSource, options?: MetadataEditorSettings): any;

  /**
   * Check if the frontmatter field exists in the given file
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param source (optional) Defaults to the current file
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns true If the frontmatter property is present in the given file
   *
   * @alias {@link doesFieldExistInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link CurrentNoteMetaEditApi.exists}
   *
   * @see {@link hasField}
   * @see {@link MetaScryApi.get}
   * @see {@link MetaScryApi.frontmatter}
   */
  doesFieldExistInTFile(propertyAccessorKey: string, source?: NotesSource, options?: MetadataEditorSettings): boolean;

  /**
   * Insert a new field into the frontmatter of the desired file.
   * @async
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param value The value to insert
   * @param source (optional) Defaults to the current file
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object or single inline value (if inline is true)
   *
   * @alias {@link insertFieldInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link CurrentNoteMetaEditApi.insert}
   *
   * @see {@link insertField}
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.patch}
   * @see {@link CurrentNoteMetaEditApi.patch}
   */
  insertFieldInTFile(
    propertyAccessorKey: string,
    value: (any | (() => any)),
    source?: NotesSource,
    options?: MetadataEditorSettings
  ): Promise<Frontmatter> | Promise<any>;

  /**
   * Update the value of an existing field in the frontmatter of the desired file.
   * @async
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param newValue The new value to set, or a function that takes the current value and returns an updated value.
   * @param source (optional) Defaults to the current file
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object or single inline value (if inline is true)
   *
   * @alias {@link updateFieldInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link CurrentNoteMetaEditApi.update}
   *
   * @see {@link updateField}
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.patch}
   * @see {@link CurrentNoteMetaEditApi.patch}
   */
  updateFieldInTFile(
    propertyAccessorKey: string,
    newValue: (any | ((original?: any) => any)),
    source?: NotesSource,
    options?: MetadataEditorSettings
  ): Promise<Frontmatter> | Promise<any>;

  /**
   * Update the value of an existing field in the frontmatter of the desired file, or insert it as a new field if it does not yet exist.
   * @async
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param newValue The new value to set, or a function that takes the current value and returns an updated value. (no arguments are passed in if the field does not exist yet.)
   * @param source (optional) Defaults to the current file
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object or single inline value (if inline is true)
   *
   * @alias {@link updateOrInsertFieldInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link CurrentNoteMetaEditApi.upsert}
   *
   * @see {@link updateOrInsertField}
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.patch}
   * @see {@link CurrentNoteMetaEditApi.patch}
   */
  updateOrInsertFieldInTFile(
    propertyAccessorKey: string,
    newValue: (any | ((original?: any) => any)),
    source?: NotesSource,
    options?: MetadataEditorSettings
  ): Promise<Frontmatter> | Promise<any>;

  /**
   * Delete the existing field in the frontmatter of the desired file.
   * @async
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param source (optional) Defaults to the current file
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object or undefined (if inline is true)
   *
   * @alias {@link deleteFieldInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link CurrentNoteMetaEditApi.delete}
   *
   * @see {@link deleteField}
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.clear}
   * @see {@link CurrentNoteMetaEditApi.clear}
   */
  deleteFieldInTFile(
    propertyAccessorKey: string,
    source?: NotesSource,
    options?: MetadataEditorSettings
  ): Promise<Frontmatter> | Promise<any>;

  /**
   * Set all the frontmatter in a given file
   * @async
   *
   * @param newMatter
   * @param source (optional) Defaults to the current file
   *
   * @returns The updated frontmatter object
   *
   * @alias {@link OpdMetadataEditLibrary.updateFrontmatter} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @alias {@link CurrentNoteMetaEditApi.replace}
   *
   * @see {@link MetaScryApi.edit}
   * @see {@link CurrentNoteMetaEditApi.set}
   * @see {@link MetaScryApi.set}
   */
  setAllFrontmatter(newMatter: Frontmatter, source?: NotesSource): Promise<Frontmatter>;
};


/**
 * Api object with all functions found in the 'OPD-metadata-lib' metadata editor plugin, with the targets of all of the functions directed to the desired file.
 *
 * @see {@link MetaEditApi}
 */
export interface CurrentNoteMetaEditApi extends ContextlessMetadataEditApiMethods {

  /**
   * Get the frontmatter field from a given file
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object
   *
   * @alias {@link getFieldFromTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link MetaEditApi.getFieldFromTFile}
   *
   * @see {@link getField}
   * @see {@link MetaScryApi.get}
   */
  get(propertyAccessorKey: string, options?: MetadataEditorSettings): any;

  /**
   * Check if the frontmatter field exists in the given file
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns If the frontmatter property is present in the given file
   *
   * @alias {@link doesFieldExistInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link MetaEditApi.doesFieldExistInTFile}
   *
   * @see {@link hasField}
   * @see {@link MetaScryApi.get}
   * @see {@link MetaScryApi.frontmatter}
   */
  exists(propertyAccessorKey: string, options?: MetadataEditorSettings): boolean;

  /**
   * Insert a new field into the frontmatter of the desired file.
   * @async
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param value The value to insert
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object or single inline value (if inline is true)
   *
   * @alias {@link insertFieldInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link MetaEditApi.insertFieldInTFile}
   *
   * @see {@link insertField}
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.patch}
   * @see {@link CurrentNoteMetaEditApi.patch}
   */
  insert(
    propertyAccessorKey: string,
    value: (any | (() => any)),
    options?: MetadataEditorSettings
  ): Promise<Frontmatter> | Promise<any>;

  /**
   * Update the value of an existing field in the frontmatter of the desired file.
   * @async
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param newValue The new value to set, or a function that takes the current value and returns an updated value.
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object or single inline value (if inline is true)
   *
   * @alias {@link updateFieldInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link MetaEditApi.updateFieldInTFile}
   *
   * @see {@link updateField}
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.patch}
   * @see {@link CurrentNoteMetaEditApi.patch}
   */
  update(
    propertyAccessorKey: string,
    newValue: (any | ((original?: any) => any)),
    options?: MetadataEditorSettings
  ): Promise<Frontmatter> | Promise<any>;

  /**
   * Update the value of an existing field in the frontmatter of the desired file, or insert it as a new field if it does not yet exist.
   * @async
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param newValue The new value to set, or a function that takes the current value and returns an updated value. (no arguments are passed in if the field does not exist yet.)
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object or single inline value (if inline is true)
   *
   * @alias {@link updateOrInsertFieldInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link MetaEditApi.updateOrInsertFieldInTFile}
   *
   * @see {@link updateField}
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.patch}
   * @see {@link CurrentNoteMetaEditApi.patch}
   */
  upsert(
    propertyAccessorKey: string,
    newValue: (any | ((original?: any) => any)),
    options?: MetadataEditorSettings
  ): Promise<Frontmatter> | Promise<any>;

  /**
   * Delete the existing field in the frontmatter of the desired file.
   * @async
   *
   * @param propertyAccessorKey The key used to access the property. Can be a compound key like "test.key" or even "test[key].inside" etc.
   * @param options (optional) options for editing/updating/getting the metadata value
   *
   * @returns The updated frontmatter object or undefined (if inline is true)
   *
   * @alias {@link deleteFieldInTFile} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @see {@link MetaEditApi.deleteFieldInTFile}
   *
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.clear}
   * @see {@link CurrentNoteMetaEditApi.clear}
   * @see {@link deleteField}
   */
  delete(
    propertyAccessorKey: string,
    options?: MetadataEditorSettings
  ): Promise<Frontmatter> | Promise<undefined>;

  /**
   * Set all the frontmatter in a given file
   * @async
   *
   * @param newMatter
   *
   * @returns The updated frontmatter object
   *
   * @alias {@link OpdMetadataEditLibrary.updateFrontmatter} This function is a wrapper for an Opd-Metadata-Lib api function.
   * @alias {@link MetaEditApi.setAllFrontmatter}
   *
   * @see {@link MetaScryApi.edit}
   * @see {@link CurrentNoteMetaEditApi.set}
   * @see {@link MetaScryApi.set}
   */
  replace(newMatter: Frontmatter): Promise<Frontmatter> | Promise<any>;

  /**
   * Remove the entire frontmatter heading from the current file.
   * @async
   *
   * @see {@link OpdMetadataEditLibrary.removeFrontmatter}
   * @see {@link MetaScryApi.edit}
   * @see {@link MetaScryApi.clear}
   * @see {@link CurrentNoteMetaScryApi.clear}
   */
  clear(): Promise<void>;
}

/**
 * Methods from the 'OPD-metadata-lib' api that are not specific to a given note file, and just work on metadata objects and raw file contents
 * 
 * @internal
 */
export interface ContextlessMetadataEditApiMethods {
  getMetadataFromFileContent: typeof OpdMetadataEditLibrary.getMetaDataFromFileContent;
  getMetadataFromYaml: typeof OpdMetadataEditLibrary.getMetaDataFromYAML;
  getMetadataFromFileCache: typeof OpdMetadataEditLibrary.getMetadataFromFileCache;
  hasField: typeof OpdMetadataEditLibrary.hasField;
  getField: typeof OpdMetadataEditLibrary.getField;
  deleteField: typeof OpdMetadataEditLibrary.deleteField;
  updateField: typeof OpdMetadataEditLibrary.updateField;
  insertField: typeof OpdMetadataEditLibrary.insertField;
  updateOrInsertField: typeof OpdMetadataEditLibrary.updateOrInsertField;
  removeFrontmatterFromFileContent: typeof OpdMetadataEditLibrary.removeFrontmatter;
}
