import { MarkdownRenderChild, TFile, Plugin } from "obsidian";

/**
 * Types in this file were borrowed from: https://github.com/mProjectsCode/obsidian-meta-bind-plugin/tree/master/src
 * Up to date for commit: 
 */

/**
 * Declaration for an input field.
 */
export interface InputFieldDeclaration {
    /**
     * The full declaration string
     */
    fullDeclaration: string;

    /**
     * The type of inplut field plus the optional arguments
     */
    declaration: string;

    /**
     * The type of inplut field
     */
    inputFieldType: InputFieldType;

    /**
     * If it's a bound field or not
     */
    isBound: boolean;

    /**
     * The target field to bind to.
     */
    bindTarget: string;

    /**
     * The arguments.
     */
    argumentContainer: InputFieldArgumentContainer;
}

export enum InputFieldArgumentType {
  CLASS = 'class',
  ADD_LABELS = 'addLabels',
  MIN_VALUE = 'minValue',
  MAX_VALUE = 'maxValue',
  OPTION = 'option',
  TITLE = 'title',
  ALIGN_RIGHT = 'alignRight',

  INVALID = 'invalid',
}

export enum InputFieldType {
  TOGGLE = 'toggle',
  SLIDER = 'slider',
  TEXT = 'text',
  TEXT_AREA = 'text_area',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  DATE = 'date',
  TIME = 'time',
  DATE_PICKER = 'date_picker',
  INVALID = 'invalid',
}

export type InputFieldDeclarationParser = {
  parse(fullDeclaration: string): InputFieldDeclaration;
}

export type InputFieldArgumentContainer = {
  arguments: AbstractInputFieldArgument[];
  add(argument: AbstractInputFieldArgument): void;
  validate(): void;

  /**
   * Merges two InputFieldArgumentContainers by overriding.
   * The arguments form the other container take priority.
   *
   * @param other
   */
  mergeByOverride(other: InputFieldArgumentContainer): InputFieldArgumentContainer;
    
  /**
   * Merges two InputFieldArgumentContainers.
   * If there is an argument that does not allow duplicates in both containers this will throw an error.
   *
   * @param other
   */
  mergeByThrow(other: InputFieldArgumentContainer): InputFieldArgumentContainer;
}

export type AbstractInputFieldArgument = {
  identifier: InputFieldArgumentType.INVALID | InputFieldArgumentType;
  allowedInputFields: InputFieldType[];
  value: any;
  requiresValue: boolean;
  allowMultiple: boolean;
  parseValue(valueStr: string): void;
  isAllowed(inputFieldType: InputFieldType): boolean;
  getAllowedInputFieldsAsString(): string;
}

export type MetaBindPlugin = {
    
  /**
   * Accessable function for building an input field.
   * 
   * @param {string|InputFieldDeclaration} declaration The field declaration string or data.
   * @param {string} sourcePath The path of the file the element is being inserted into
   * @param {HTMLElement} container The element to fill with the input element 
   * @param {InputFieldMarkdownRenderChildType} renderType Inline or Code Block
   * 
   * @returns The render child produced.
   */
  buildInputFieldMarkdownRenderChild(
    declaration: string | InputFieldDeclaration,
    sourcePath: string,
    codeBlock: HTMLElement,
    renderType?: InputFieldMarkdownRenderChildType
  ): InputFieldMarkdownRenderChild;

  /**
   * Helper method to build a declaration from some initial data or a string.
   * 
   * @param {string | InputFieldDeclaration | {}} base The base declaration data or a string to parse for it. Can also be an empty object with the other arguments provided to fill it.
   * @param {Record<InputFieldArgumentType, string> | {} | undefined } args (Optional) The arguments, indexed by name.
   * @param {InputFieldType | undefined} inputFieldType (Optional) The input field type if not provided in the base object.
   * @param {boolean | undefined} isBound (Optional) If the field should try to be bound to a bindTarget.
   * @param {Record<InputFieldArgumentType, string> | {} | undefined} args (Optional) The bind target of the field.
   * @param { string | undefined} templateName (Optional) A template to use.
   * 
   * @returns A constructed InputFieldDeclaration.
   */
  buildDeclaration(
    base: string | InputFieldDeclaration | {},
    args?: Record<InputFieldArgumentType, string> | {},
    inputFieldType?: InputFieldType,
    isBound?: boolean,
    bindTarget?: string,
    templateName?: string
  ): InputFieldDeclaration
} & Plugin;

export enum InputFieldMarkdownRenderChildType {
  INLINE_CODE_BLOCK,
  CODE_BLOCK,
}

export type InputFieldMarkdownRenderChild = {
  plugin: MetaBindPlugin;
  metaData: any;
  filePath: string;
  uid: number | undefined;
  inputField: AbstractInputField | undefined;
  error: string;
  type: InputFieldMarkdownRenderChildType;

  fullDeclaration: string;
  inputFieldDeclaration: InputFieldDeclaration | undefined;
  bindTargetFile: TFile | undefined;
  bindTargetMetadataField: string | undefined;

  limitInterval: number | undefined;
  intervalCounter: number;
  metadataValueUpdateQueue: any[];
  inputFieldValueUpdateQueue: any[];
} & MarkdownRenderChild;

export type AbstractInputField = {
  readonly allowCodeBlock: boolean;
  readonly allowInlineCodeBlock: boolean;
  readonly inputFieldMarkdownRenderChild: InputFieldMarkdownRenderChild;
  readonly onValueChange: (value: any) => void | Promise<void>;
    
  /**
   * Returns the current content of the input field
   */
  getValue(): any;
    
  /**
   * Sets the value on this input field, overriding the current content
   *
   * @param value
   */
  setValue(value: any): void;
    
  /**
   * Checks if the value is the same as the value of this input field
   *
   * @param value
   */
  isEqualValue(value: any): boolean
    
  /**
   * Returns the default value of this input field
   */
  getDefaultValue(): any;

  /**
   * Returns the HTML element this input field is wrapped in
   */
  getHtmlElement(): HTMLElement;

  /**
   * Renders the input field as a child of the container
   *
   * @param container
   */
  render(container: HTMLDivElement): void;
}
