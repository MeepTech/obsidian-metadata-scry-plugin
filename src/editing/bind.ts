import { TFolder } from "obsidian";
import { InternalStaticMetadataScrierPluginContainer } from "../static";
import {
    CurrentMetaBindApi,
    CurrentMetaBindGenericFunction,
    CurrentMetaBindIndividualInputTypeFunction,
    MetaBindApi,
    BindingResult,
    MetaBindGenericFunction,
    MetaBindIndividualInputTypeFunction
} from "../types/editing/bind";
import {
    AbstractInputField,
    InputFieldArgumentType,
    InputFieldDeclaration,
    InputFieldMarkdownRenderChildType,
    InputFieldType
} from "../types/_external_sources/meta-bind";
import { NotesSource } from "../types/fetching/sources";
import { IsArray, IsTFolder, ParsePathFromNoteSource } from "../utilities";
import { BindSettings } from "../lib";

//#region global

/**
 * The base function for interacting with meta-bind, with child prop functions for specific field types.
 *
 * @internal
 */
const GlobalAnyInputBinder: MetaBindGenericFunction = (
  source?: NotesSource | string,
  frontmatterKey?: string | Array<String> | null | true | false,
  fieldType: InputFieldType | 'auto' = 'auto',
  args: Record<InputFieldArgumentType, any> | {} = {},
  options: BindSettings = {}
): BindingResult => {
  const meta = InternalStaticMetadataScrierPluginContainer.Api;
  const metaBindApi = InternalStaticMetadataScrierPluginContainer.MetaBindApi;

  // check if one or many files.
  var declaration: string | InputFieldDeclaration;
  var files = meta.vault(source ?? meta.current.pathex);
  if (IsTFolder(files)) {
    var allByFile
      = {} as Record<string, AbstractInputField | undefined | Record<string, AbstractInputField | undefined>>;
    
    let count = 0;
    for (const path in files.children) {
      allByFile[path] = GlobalAnyInputBinder(
        path,
        frontmatterKey,
        fieldType,
        args,
        options
      ) as AbstractInputField | undefined | Record<string, AbstractInputField | undefined>;
      allByFile[count] = allByFile[path];
      Object.defineProperty(allByFile, count, {
        value: allByFile[path],
        enumerable: false
      });
      count++;
    }
    
    Object.defineProperty(allByFile, "count", {
      value: count,
      enumerable: false
    });
    return allByFile as BindingResult;
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

    let count = 0;
    for (const key of frontmatterKey as Array<string>) {
      all[key] = GlobalAnyInputBinder(
        source,
        key,
        fieldType,
        args,
        options
      ) as AbstractInputField | undefined;
      Object.defineProperty(all, count, {
        value: all[key],
        enumerable: false
      });
      count++;
    }
    Object.defineProperty(all, "count", {
      value: count,
      enumerable: false
    });
    return all as BindingResult;
  } // if we have a frontmatter key we need to build and validate the argument based inputfieldeclaration
  else {
    declaration = {
      isBound: (!!frontmatterKey || frontmatterKey === "0" || frontmatterKey === "false"),
      inputFieldType: fieldType,
      bindTarget: frontmatterKey
    } as InputFieldDeclaration;
    source = (source !== undefined)
      ? ParsePathFromNoteSource(source) as string
      : meta.current.pathex;
  }
    
  declaration = metaBindApi.buildDeclaration(
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
  
  const abstractField = metaBindApi.buildInputFieldMarkdownRenderChild(
    declaration,
    source,
    document.createElement(mode ? 'div' : 'span'),
    mode   
  ).inputField;

  if (!options.hasOwnProperty("callOnLoad") || options.callOnLoad) {
    abstractField?.inputFieldMarkdownRenderChild.onload();
  }
    
  if (options.returnAbstractField) {
    return abstractField as BindingResult;
  } else {
    return abstractField?.inputFieldMarkdownRenderChild.containerEl as BindingResult;
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
    source?: NotesSource | string,
    frontmatterKey?: string | Array<String> | null | false,
    args: Record<InputFieldArgumentType, any> | {} = {},
    options: BindSettings = {}
  ): BindingResult =>
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

/** @internal*/
const MetadataInputBinder: MetaBindApi
  = GlobalAnyInputBinder as MetaBindApi;
  
/** @internal*/
export { MetadataInputBinder }; 
    
//#endregion
    
//#region current
  
/**
 * The base function for interacting with meta-bind, with child prop functions for specific field types.
 * 
 * @internal
 */
const CurrentAnyInputBinder: CurrentMetaBindGenericFunction = (
  key?: string | Array<String> | null | false | true,
  fieldType: InputFieldType | 'auto' = 'auto',
  args: Record<InputFieldArgumentType, any> | {} = {},
  options: BindSettings = {}
): BindingResult => {
  return GlobalAnyInputBinder(undefined, key, fieldType, args, options);
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
    frontmatterKey?: string | Array<String> | null | false,
    args: Record<InputFieldArgumentType, any> | {} = {},
    options: BindSettings = {}
  ): BindingResult =>
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

/** @internal*/
const CurrentMetadataInputBinder: CurrentMetaBindApi
  = CurrentAnyInputBinder as CurrentMetaBindApi;
  
/** @internal*/
export {CurrentMetadataInputBinder}; 
//#endregion
