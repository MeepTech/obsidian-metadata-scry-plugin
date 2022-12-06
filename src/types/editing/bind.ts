import {
    AbstractInputField,
  InputFieldArgumentType,
  InputFieldType
} from "../_external_sources/meta-bind";
import { NotesSource } from "../fetching/sources";
import { BindSettings } from "../settings";
import { ScryResults } from "../datas";

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
 *
 * // TODO: test if we need to check and then call Promise.All() like how we used to call the flatten function.
 */
export type BindingResult
  = ScryResults<BoundInputField> | ScryResults<Promise<BoundInputField>>;

/**
 * An async return from metabind
 */
export type BoundInputField
  = AbstractInputField | HTMLElement | undefined;
  
/**
 * A generic meta-bind function for binding to any input type
 *
 * @internal
 */
export type MetaBindGenericFunction = (
  source?: NotesSource | string,
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
) => BindingResult;

/**
 * Mapped key of all the individual functions by name (lower and capitalized).
 */
type MetaBindIndividualInputTypesApi 
  = MetaBindIndividualInputTypesLowercaseApi
    & MetaBindIndividualInputTypesCapitalApi;

/**
 * Bind to a specific type of input
 */
export type MetaBindIndividualInputTypeFunction = (
  source: NotesSource | string,
  frontmatterKey?: string | Array<String> | null | false,
  args?: Record<InputFieldArgumentType, any> | {},
  options?: BindSettings
) => BindingResult;

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
 *
 * @internal
 */
export type CurrentMetaBindGenericFunction = (
  /**
   * The frontmatter key to bind (if it contains : it will be parsed as pure source.) 
   */
  key?: string | Array<String> | null | true | false,
  fieldType?: InputFieldType | 'auto',
  args?: Record<InputFieldArgumentType, any> | {},
  options?: BindSettings
) => BindingResult;

/**
 * Mapped key of all the individual functions by name (lower and capitalized).
 */
type CurrentMetaBindIndividualInputTypesApi 
  = CurrentMetaBindIndividualInputTypesLowercaseApi
    & CurrentMetaBindIndividualInputTypesCapitalApi;

/**
 * Bind to a specific type of input
 */
export type CurrentMetaBindIndividualInputTypeFunction = (
  frontmatterKey?: string | Array<String> | null | true | false,
  args?: Record<InputFieldArgumentType, any> | {},
  options?: BindSettings
) => BindingResult;

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
