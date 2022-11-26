import {
    AbstractInputField,
  InputFieldArgumentType,
  InputFieldType
} from "./external/meta-bind";
import { BindSettings } from "./scrier";
import { NotesSource } from "./sources";

//#region global

/**
 * Api for binding inputs to the frontmatter of other notes.
 */
export type MetaBindApi
  = MetaBindGenericFunction
    & MetaBindIndividualInputTypesApi;
    
/**
 * Meta bind api functions can return 1 field, or:
 *   multiple fields for one file, indexed by field name, or;
 *   multiple sets of the above, indexed by file path, or;
 *   undefined from the api on some failures.
 * Fields are retured as HTMLElement by default, but can be returned as AbstractInputField via the BindingSettings.
 * Returns a promise by default, unless awaitOnLoad or callOnLoad options are false
 */
export type MetaBindApiReturn
  = MetaBindApiSyncReturn | MetaBindApiAsyncReturn;

export type MetaBindApiSyncReturn
  = AbstractInputField 
    | Record<string, AbstractInputField | undefined | Record<string, AbstractInputField | undefined>>
    | HTMLElement
    | Record<string, HTMLElement | undefined | Record<string, HTMLElement | undefined>>
    | undefined;
    
export type MetaBindApiAsyncReturn
  = Promise<MetaBindApiSyncReturn>;
  
/**
 * A generic meta-bind function for binding to any input type
 */
export type MetaBindGenericFunction = (
  source: NotesSource | string | undefined | null,
  /**
   * The frontmatter key to use.
   * If it's true, all fields in the whole file will be bound!
   * If undefined then it's assumed a full meta-bind syntax string was passed as the source.
   * If a different falsey, empty string, or null is passed (other than '0'), NO field will be bound!
   */
  frontmatterKey?: string | Array<String> | null | true | false,
  fieldType?: InputFieldType | 'auto',
  args?: Record<InputFieldArgumentType, any> | {},
  options?: BindSettings
) => MetaBindApiReturn;

/**
 * Mapped key of all the individual functions by name (lower and capitalized).
 */
export type MetaBindIndividualInputTypesApi 
  = MetaBindIndividualInputTypesLowercaseApi
    & MetaBindIndividualInputTypesCapitalApi;

/**
 * Bind to a specific type of input
 */
export type MetaBindIndividualInputTypeFunction = (
  source: NotesSource | string | undefined | null,
  frontmatterKey?: string | Array<String> | undefined | null | false,
  args?: Record<InputFieldArgumentType, any> | {},
  options?: BindSettings
) => MetaBindApiReturn;

/**
 * Mapped key of all the individual functions by lowercase name.
 */
type MetaBindIndividualInputTypesLowercaseApi = {
  [Input in InputFieldType as `${SnakeToCamelCase<Input>}`]: MetaBindIndividualInputTypeFunction;
}

/**
 * Mapped key of all the individual functions by capitals name.
 */
type MetaBindIndividualInputTypesCapitalApi = {
  [Input in InputFieldType as `${SnakeToCamelCase<Input>}`]: MetaBindIndividualInputTypeFunction;
}

//#endregion

//#region current

/**
 * Api for binding inputs to the frontmatter of the current note.
 */
export type CurrentMetaBindApi
  = CurrentMetaBindGenericFunction
  & CurrentMetaBindIndividualInputTypesApi;

/**
 * Used to bind to any kind of input
 */
export type CurrentMetaBindGenericFunction = (
  /**
   * The frontmatter key to bind (if it contains : it will be parsed as pure source.) 
   */
  key?: string | Array<String> | undefined | null | true | false,
  fieldType?: InputFieldType | 'auto' | undefined | null,
  args?: Record<InputFieldArgumentType, any> | {},
  options?: BindSettings
) => MetaBindApiReturn;

/**
 * Mapped key of all the individual functions by name (lower and capitalized).
 */
export type CurrentMetaBindIndividualInputTypesApi 
  = CurrentMetaBindIndividualInputTypesLowercaseApi
    & CurrentMetaBindIndividualInputTypesCapitalApi;

/**
 * Bind to a specific type of input
 */
export type CurrentMetaBindIndividualInputTypeFunction = (
  frontmatterKey?: string | Array<String> | undefined | null | true | false,
  args?: Record<InputFieldArgumentType, any> | {},
  options?: BindSettings
) => MetaBindApiReturn;

/**
 * Mapped key of all the individual functions by lowercase name.
 */
type CurrentMetaBindIndividualInputTypesLowercaseApi = {
  [Input in InputFieldType as `${SnakeToCamelCase<Input>}`]: CurrentMetaBindIndividualInputTypeFunction;
}

/**
 * Mapped key of all the individual functions by capitals name.
 */
type CurrentMetaBindIndividualInputTypesCapitalApi = {
  [Input in InputFieldType as `${SnakeToCamelCase<Input>}`]: CurrentMetaBindIndividualInputTypeFunction;
}

//#endregion

//#region Utility
type SnakeToCamelCase<Key extends string> = Key extends `${infer FirstPart}_${infer FirstLetter}${infer LastPart}`
  ? `${FirstPart}${Uppercase<FirstLetter>}${SnakeToCamelCase<LastPart>}`
  : Key;

//#endregion
