import { TFolder } from "obsidian";
import { InternalStaticMetadataScrierPluginContainer } from "./static";
import {
    CurrentMetaBindApi,
    CurrentMetaBindGenericFunction,
    CurrentMetaBindIndividualInputTypeFunction,
    MetaBindApi,
    MetaBindApiReturn,
    MetaBindGenericFunction,
    MetaBindIndividualInputTypeFunction
} from "./types/bind";
import {
    AbstractInputField,
    InputFieldArgumentType,
    InputFieldDeclaration,
    InputFieldMarkdownRenderChildType,
    InputFieldType
} from "./types/external/meta-bind";
import { BindSettings } from "./types/scrier";
import { NotesSource } from "./types/sources";
import { IsArray, ParseFilePathFromSource } from "./utilities";

//#region global

/**
 * The base function for interacting with meta-bind, with child prop functions for specific field types.
 */
const GlobalAnyInputBinder: MetaBindGenericFunction = (
  source: NotesSource | string | undefined | null,
  frontmatterKey: string | Array<String> | undefined | null | true | false = undefined,
  fieldType: InputFieldType | 'auto' = 'auto',
  args: Record<InputFieldArgumentType, any> | {} = {},
  options: BindSettings = {}
): MetaBindApiReturn => {
  const meta = InternalStaticMetadataScrierPluginContainer.Instance.Api;
  const plugin = InternalStaticMetadataScrierPluginContainer.MetaBindApi;

  // check if one or many files.
  var declaration: string | InputFieldDeclaration;
  var files = meta.vault(source ?? meta.current.pathex);
  if (files instanceof TFolder) {
    var allByFile
      = {} as Record<string, AbstractInputField | undefined | Record<string, AbstractInputField | undefined>>;
    
    for (const path in files.children) {
      allByFile[path] = GlobalAnyInputBinder(
        path,
        frontmatterKey,
        fieldType,
        args,
        options
      ) as AbstractInputField | undefined | Record<string, AbstractInputField | undefined>;
    }
    
    return allByFile;
  }
  
  if (frontmatterKey === true) {
    if (options?.recurseFrontmatterFields) {
      //TODO: get ALL frontmatter items from the source in this case.
    frontmatterKey = [];
    } else {
      //TODO: get the the first level of frontmatter items from the source in this case.
    frontmatterKey = [];
    }
  }

  if (frontmatterKey === undefined) {
    declaration = source?.toString() ?? "";
    source = meta.Current.path;
  } // map of multiple keys
  else if (IsArray(frontmatterKey)) {
    var all = {} as Record<string, AbstractInputField | undefined>;
    for (const key of frontmatterKey as Array<string>) {
      all[key] = GlobalAnyInputBinder(source, key, fieldType, args, options) as AbstractInputField | undefined;
    }

    return all;
  } // if we have a frontmatter key we need to build and validate the argument based inputfieldeclaration
  else {
    declaration = {
      isBound: (!!frontmatterKey || frontmatterKey === "0" || frontmatterKey === "false"),
      inputFieldType: fieldType,
      bindTarget: frontmatterKey
    } as InputFieldDeclaration;
    source = (source !== undefined && source !== null)
      ? ParseFilePathFromSource(source) as string
      : meta.current.pathex;
  }
    
  declaration = plugin.buildDeclaration(
    declaration,
    args,
    undefined,
    undefined,
    undefined,
    options?.templateName
  );
  
  const mode
    = ((!!options.renderMode || typeof options.renderMode === 'number')
      && (options.renderMode === InputFieldMarkdownRenderChildType.CODE_BLOCK
        || options.renderMode === 'block'
        || options.renderMode === 'div'
      )
    ) ? InputFieldMarkdownRenderChildType.CODE_BLOCK
      : InputFieldMarkdownRenderChildType.INLINE_CODE_BLOCK;
  
  const abstractField = plugin.buildInputFieldMarkdownRenderChild(
    declaration,
    source,
    document.createElement(mode ? 'div' : 'span'),
    mode   
  ).inputField;

  if (!options.hasOwnProperty("callOnLoad") || options.callOnLoad) {
    abstractField?.inputFieldMarkdownRenderChild.onload();
  }
    
  if (options.returnAbstractField) {
    return abstractField;
  } else {
    return abstractField?.inputFieldMarkdownRenderChild.containerEl;
  }
};

for (const fieldType of Object.values(InputFieldType)) {
  if (fieldType === InputFieldType.INVALID) {
    continue;
  }
  var key: string;
  if (!fieldType.includes('_')) {
    key = fieldType;
  } else {
    const parts = fieldType.split('_');
    key = parts[0] + parts.slice(1).map(part => part[0].toUpperCase() + part.substring(1)).join()
  }

  const fieldTypeInputBinder: MetaBindIndividualInputTypeFunction = (
    source: NotesSource | undefined | null | undefined,
    frontmatterKey: string | Array<String> | undefined | null | false = undefined,
    args: Record<InputFieldArgumentType, any> | {} = {},
    options: BindSettings = {}
  ): MetaBindApiReturn =>
    GlobalAnyInputBinder(source, frontmatterKey, fieldType as InputFieldType, args, options);
  
  // lowerCamel
  //@ts-expect-error field types here can't calculate the right keys.   
  (GlobalAnyInputBinder as MetaBindApi)[key]
    = fieldTypeInputBinder;
        
  // UpperCamel
  //@ts-expect-error field types here can't calculate the right keys.   
  (GlobalAnyInputBinder as MetaBindApi)[key[0].toUpperCase() + key.substring(1)]
    = fieldTypeInputBinder;
}

const MetadataInputBinder: MetaBindApi
  = GlobalAnyInputBinder as MetaBindApi;
  
export { MetadataInputBinder }; 
    
//#endregion
    
//#region current
  
/**
 * The base function for interacting with meta-bind, with child prop functions for specific field types.
 */
const CurrentAnyInputBinder: CurrentMetaBindGenericFunction = (
  key: string | Array<String> | undefined | null | false | true = undefined,
  fieldType: InputFieldType | 'auto' = 'auto',
  args: Record<InputFieldArgumentType, any> | {} = {},
  options: BindSettings = {}
): MetaBindApiReturn => {
  return GlobalAnyInputBinder(null, key, fieldType, args, options);
};

for (const fieldType of Object.values(InputFieldType)) {
  if (fieldType === InputFieldType.INVALID) {
    continue;
  }

  var key: string;
  if (!fieldType.includes('_')) {
    key = fieldType;
  } else {
    const parts = fieldType.split('_');
    key = parts[0] + parts.slice(1).map(part => part[0].toUpperCase() + part.substring(1)).join()
  }

  const fieldTypeInputBinder: CurrentMetaBindIndividualInputTypeFunction = (
    frontmatterKey: string | Array<String> | undefined | null | false = undefined,
    args: Record<InputFieldArgumentType, any> | {} = {},
    options: BindSettings = {}
  ): MetaBindApiReturn =>
    CurrentAnyInputBinder(frontmatterKey, fieldType as InputFieldType, args, options);
  
  // lowerCamel
  //@ts-expect-error field types here can't calculate the right keys.   
  (CurrentAnyInputBinder as CurrentMetaBindApi)[key]
    = fieldTypeInputBinder;
        
  // UpperCamel
  //@ts-expect-error field types here can't calculate the right keys.   
  (CurrentAnyInputBinder as CurrentMetaBindApi)[key[0].toUpperCase() + key.substring(1)]
    = fieldTypeInputBinder;
}

const CurrentMetadataInputBinder: CurrentMetaBindApi
  = CurrentAnyInputBinder as CurrentMetaBindApi;
  
export {CurrentMetadataInputBinder}; 
//#endregion
