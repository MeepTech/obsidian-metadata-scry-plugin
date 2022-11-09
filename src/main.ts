import { Plugin } from 'obsidian';
import {
  MetaScryApi,
  MetaScryPluginSettings,
  MetaScryPluginApi,
  StaticMetaScryApi
} from "./api";
import {
  AggregateByArrayHelperFunctionKey,
  DefaultSettings,
  GetPropObjectHelperFunctionKey,
  HasPropObjectHelperFunctionKey,
  IndexByArrayHelperFunctionKey,
  IsFunction,
  MetadataScrierPluginKey,
  ScryGlobalPropertyCapitalizedKey,
  ScryGlobalPropertyLowercaseKey,
  SetPropObjectHelperFunctionKey,
  StaticMetaScryPluginContainer
} from "./constants";
import { MetadataScrier } from './meta';
import { MetadataScrierPluginSettingTab } from './settings';
import { ReactSectionComponents } from "./components/sections";
import { ReactMarkdownComponents } from './components/markdown';

/**
 * Metadata Scrier Api Obsidian.md Plugin
 */
export default class MetadataScrierPlugin extends Plugin implements MetaScryPluginApi {
  private static _instance: MetaScryApi;
  private _settings: MetaScryPluginSettings;
  private _addedGlobals: string[];
  
  //#region Api Access

  /**
   * The current instance of the MetadataScryApi api
   */
  static get Instance(): MetaScryApi {
    return MetadataScrierPlugin._instance;
  }

  /**
   * The key for this plugin.
   * 
   * @alias {@link MetadataScrierPluginKey}
   * @alias {@link MetaScryPluginApi.key}
   */
  static get Key(): string {
    return MetadataScrierPluginKey;
  }

  get api(): MetaScryApi {
    return MetadataScrierPlugin._instance;
  }

  get key(): string {
    return MetadataScrierPluginKey;
  }

  get settings(): MetaScryPluginSettings {
    return this._settings;
  }

  //#endregion

  //#region Initialization

  async onload(): Promise<void> {
    super.onload();
    await this.loadSettings();
    this.addSettingTab(new MetadataScrierPluginSettingTab(this.app, this));

    this._initApi();
  }

  onunload(): void {
    this._deinitApi();
  }
  
  async loadSettings(): Promise<void> {
    this._settings = Object.assign({}, DefaultSettings, await this.loadData());
  }
  
  async updateSettings(newSettings: MetaScryPluginSettings): Promise<void> {
    // reset the api when settings are updated.
    this._deinitApi();

    // save settings
    await this.saveData({
      ...this.settings,
      newSettings
    });

    // reinit
    this._initApi();
  }

  tryToSetExtraGlobal(key: string, setValue: any = undefined): boolean {
    if (arguments.length == 2) {
      const [addedOnDesktop, addedOnMobile] = this._tryToAddToGlobals(key, setValue);
      return addedOnDesktop || addedOnMobile;
    } else {
      const [goneOnDesktop, goneOnMobile] = this._tryToRemoveFromGlobals(key);
      return goneOnDesktop && goneOnMobile;
    }
  }
  
  private _initApi(): void {
    this._verifyDependencies();
    StaticMetaScryPluginContainer.Instance = this;
    MetadataScrierPlugin._instance = new MetadataScrier(this);

    this._initGlobals();
    this._initHelperMethods();
  }

  /** 
   * if one of the dependenies is missing, disable the plugin and warn the user.
   */
  private _verifyDependencies(): void {
    // @ts-expect-error: app.plugin is not mapped.
    if (!app.plugins.plugins.dataview || !app.plugins.plugins.metaedit) {
      const error =
        `Cannot initialize plugin: ${MetadataScrierPluginKey}. ` +
        ` Dependency plugins are missing: ` +
        // @ts-expect-error: app.plugin is not mapped.
        (!app.plugins.plugins.dataview
          // @ts-expect-error: app.plugin is not mapped.
          ? (!app.plugins.plugins.metaedit
            ? "Dataview and Metaedit"
            : "Dataview")
          : "Metaedit") +
        `. (The ${MetadataScrierPluginKey} plugin has been automatically disabled.)`;
      // @ts-expect-error: app.plugin is not mapped.
      app.plugins.disablePlugin(MetadataScrierPluginKey);
      alert(error);
      throw error;
    }
  }

  //#region Object property and Global defenitions.

  private _initGlobals(): void {
    this._initGlobalPluginApis();
    this._initGlobalCache();
    this._initGlobalPath();
  }

  private _initHelperMethods(): void {
    this._initObjectPropertyHelperMethods();
    this._initArrayHelperMethods();
  }

  private _initObjectPropertyHelperMethods(): void {
    if (this.settings.defineObjectPropertyHelperFunctions) {
      /**
       * Find a deep property in an object, returning true on success.
       *
       * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
       * @param {{onTrue:function(object), onFalse:function()}|function(object)|[function(object), function()]} thenDo (Optional) A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
       * @returns true if the property exists, false if not.
       */
      Object.defineProperty(Object.prototype, HasPropObjectHelperFunctionKey, {
        value: function (path: string | Array<string>, thenDo: any) {
          if (thenDo) {
            return MetadataScrier.TryToGetDeepProperty(path, thenDo, this);
          } else {
            return MetadataScrier.ContainsDeepProperty(path, this);
          }
        },
        enumerable: false
      });

      /**
       * Get a deep property from an object, or return null.
       *
       * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
       *
       * @returns The found deep property, or undefined if not found.
       */
      Object.defineProperty(Object.prototype, GetPropObjectHelperFunctionKey, {
        value: function (path: string | Array<string>, defaultValue: any) {
          const value = MetadataScrier.GetDeepProperty(path, this);
          if (defaultValue !== undefined && (value === undefined)) {
            if (IsFunction(defaultValue)) {
              return defaultValue();
            } else {
              return defaultValue;
            }
          }

          return value;
        },
        enumerable: false
      });

      /**
       * Set a deep property in an object, even if it doesn't exist.
       *
       * @param {string|[string]} propertyPath Array of keys, or dot seperated propery key.
       * @param {object|function(object)} value The value to set, or a function to update the current value and return it.
       *
       * @returns The found deep property, or undefined if not found.
       */
      Object.defineProperty(Object.prototype, SetPropObjectHelperFunctionKey, {
        value: function (propertyPath: string | Array<string>, value: any) {
          return MetadataScrier.SetDeepProperty(propertyPath, value, this);
        },
        enumerable: false
      });
      
    }
  }

  private _initArrayHelperMethods(): void {
    if (this.settings.defineArrayHelperFunctions) {
      /**
       * index an array of objects by a shared property with unique values among the
       * 
       * @param {string} uniqueKeyPropertyPath The path to the unique key on each object to use as the index of the object in the returned record.
       * 
       * @returns An aggregate object with the original objects from the input list indexed by the value of the property at the provided key path.
       */
      Object.defineProperty(Array.prototype, IndexByArrayHelperFunctionKey, {
        value: function (uniqueKeyPropertyPath: string): Record<any, any> {
          const result: Record<any, any> = {};

          for (const i of this) {
            const key = i.getProp(uniqueKeyPropertyPath, undefined);
            if (key === undefined) {
              throw `Aggregation Key not found at path: ${uniqueKeyPropertyPath}.`;
            }
          
            if (result[key]) {
              throw `Key already exists in aggregate object, can't index another object by it: ${uniqueKeyPropertyPath}.`;
            } else {
              result[key] = i;
            }
          }

          return result;
        },
        enumerable: false
      });

      /**
       * Aggregate an array of objects by a value
       * 
       * @param {string} key The key to aggegate by. This uses getProp so you can pass in a compound key
       * 
       * @returns An object with arrays indexed by the value of the property at the key within the object.
       */
      Object.defineProperty(Array.prototype, AggregateByArrayHelperFunctionKey, {
        value: function (key: string): Record<any, any[]> {
          const result: Record<any, any[]> = {};

          for (const i of this) {
            const k = i
              ? i.getProp(key, "")
              : "";
          
            if (result[k]) {
              result[k].push(i);
            } else {
              result[k] = [i];
            }
          }

          return result;
        },
        enumerable: false
      });
    }
  }

  /**
   * Set up all the global api variables.
   */
  private _initGlobalPluginApis(): void {
    this._initGlobalScrys();
    this._initExtraApiGlobal();
    this._initCurrentFileGlobal();
  }
  
  /**
   * Set up global access to the MetadataScryApi.
   */
  private _initCurrentFileGlobal(): void {
    this.settings.globalCurrentFilePropertyNames
      .split(",")
      .map(String.prototype.trim)
      .forEach(key => {
        this._tryToAddToGlobals(
          key, {
          get() {
            return MetadataScrier.Api.current;
          }
        });
      });
  }

  private _tryToAddToGlobals(key: string, value: PropertyDescriptor & ThisType<any>): [boolean, boolean] {
    const results = [
      this._tryToAddToGlobal(key, value, true),
      this._tryToAddToGlobal(key, value, false)
    ];

    return results as [boolean, boolean];
  }

  private _tryToAddToGlobal(key: string, value: PropertyDescriptor & ThisType<any>, isMobile: boolean = false): boolean {
    let success: boolean = false;
    if (isMobile) {
      try {
        Object.defineProperty(window, key, value);
        success = true;
      } catch { }
    } else {
      try {
        Object.defineProperty(global, key, value);
        success = true;
      } catch { }
    }

    return success;
  }

  private _initExtraApiGlobal() : void {
    this.settings.globalMetaScryExtraNames
      .split(",")
      .map(String.prototype.trim)
      .forEach(key => {
        try {
          /**
           * Global access to the MetadataScryApi on desktop.
           */
          Object.defineProperty(global, key, {
            get() {
              return MetadataScrier.Api;
            }
          });
        } catch { }
        try {
          /**
           * Global access to the MetadataScryApi on mobile.
           */
          Object.defineProperty(window, key, {
            get() {
              return MetadataScrier.Api;
            }
          });
        } catch { }
      });
  }

  private _initGlobalScrys(): void {
    if (this.settings.defineScryGlobalVariables) {
      // build the Static Api
      const apiAndPlugin = {
        Api: this.api,
        Plugin: MetadataScrierPlugin.Instance.plugin
      };
      const staticApi: StaticMetaScryApi
        // if we have react, we want to add the components to the api.
        // @ts-expect-error: app.plugin is not mapped.
        = app.plugins.plugins["obsidian-react-components"]
          ? {
            ...apiAndPlugin,
            ...ReactSectionComponents,
            ...ReactMarkdownComponents,
            Components: {
              ...ReactSectionComponents.Components,
              ...ReactMarkdownComponents.Components
            },
            SectionComponents: ReactSectionComponents.Components,
            MarkdownComponents: ReactMarkdownComponents.Components,
            DefaultSources: MetadataScrier.DefaultSources
          } : apiAndPlugin;

      try {
        /**
         * Global access to the StaticMetadataScryPluginApi on desktop.
         */
        Object.defineProperty(global, ScryGlobalPropertyCapitalizedKey, {
          get() {
            return staticApi;
          }
        });
      } catch { }
      try {
        /**
         * Global access to the StaticMetadataScryPluginApi on mobile.
         */
        Object.defineProperty(window, ScryGlobalPropertyCapitalizedKey, {
          get() {
            return staticApi;
          }
        });
      } catch { }

      try {
        /**
         * Global access to the MetaScryApi on desktop.
         */
        Object.defineProperty(global, ScryGlobalPropertyLowercaseKey, {
          get() {
            return MetadataScrier.Api;
          }
        });
      } catch { }
      try {
        /**
         * Global access to the MetaScryApi on mobile.
         */
        Object.defineProperty(window, ScryGlobalPropertyLowercaseKey, {
          get() {
            return MetadataScrier.Api;
          }
        });
      } catch { }
    }
  }

  private _initGlobalCache(): void {
    this.settings.globalCacheNames
      .split(",")
      .map(String.prototype.trim)
      .forEach(key => {
        try {
          /**
           * Global access to the cache on desktop.
           * @name global#cache
           */
          Object.defineProperty(global, key, {
            get() {
              return MetadataScrier.Api.Current.Cache;
            }
          });
        } catch { }

        try {
          /**
           * Global access to the cache on mobile.
           * @name global#cache
           */
          Object.defineProperty(window, key, {
            get() {
              return MetadataScrier.Api.Current.Cache;
            }
          });
        } catch { }
      });
  }

  private _initGlobalPath(): void {
    this.settings.globalPathFunctionNames
      .split(",")
      .map(String.prototype.trim)
      .forEach(key => {
        try {
          /**
           * Global access to the cache on desktop.
           * @name global#path
           */
          Object.defineProperty(global, key, {
            value: MetadataScrier.Api.path
          });
        } catch { }

        try {
          /**
           * Global access to the cache on mobile.
           * @name global#path
           */
          Object.defineProperty(window, key, {
            value: MetadataScrier.Api.path
          });
        } catch { }
      });
  }

  //#endregion

  //#endregion

  //#region De-Initialization

  private _deinitApi(): void {
    this._deinitGlobals();
    this._deinitHelperMethods();
    
    MetadataScrierPlugin._instance = undefined!;
  }

  private _deinitHelperMethods(): void {
    this._deinitObjectPropertyHelpers();
    this._deinitArrayHelpers();
  }

  private _deinitGlobals(): void {
    this._deinitGlobalPluginApis();
    this._deinitGlobalCache();
    this._deinitGlobalPath();
  }

  private _tryToRemoveFromGlobals(key: string): [boolean, boolean] {
    return [
      this._tryToRemoveGlobal(key, true),
      this._tryToRemoveGlobal(key, false)
    ];
  }

  private _tryToRemoveGlobal(key: string, isMobile: boolean = false): boolean {
    if (isMobile) {
      try {
        // @ts-ignore: Global Scope
        delete window[key];
      } finally {
        try {
          // @ts-ignore: Global Scope
          return typeof window[key] === 'undefined';
        } catch {
          return true;
        }
      }
    } else {
      try {
        // @ts-ignore: Global Scope
        delete global[key];
      } finally {
        try {
          // @ts-ignore: Global Scope
          return typeof global[key] === 'undefined';
        } catch {
          return true;
        }
      }
    }
  }

  private _deinitGlobalCache(): void {
    if (this.settings.globalCacheName) {
      try {
        // @ts-ignore: Global Scope
        delete global[this.settings.globalCacheName];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete window[this.settings.globalCacheName];
      } catch { }
    }
  }

  private _deinitGlobalPath(): void {
    if (this.settings.globalPathFunctionName) {
      try {
        // @ts-ignore: Global Scope
        delete global[this.settings.globalPathFunctionName];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete window[this.settings.globalPathFunctionName];
      } catch { }
    }
  }


  private _deinitGlobalPluginApis(): void {
    if (this.settings.defineScryGlobalVariables) {
      try {
        // @ts-ignore: Global Scope
        delete global[ScryGlobalPropertyCapitalizedKey];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete window[ScryGlobalPropertyCapitalizedKey];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete global[ScryGlobalPropertyLowercaseKey];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete window[ScryGlobalPropertyLowercaseKey];
      } catch { }
    }

    if (this.settings.globalMetaScryExtraName) {
      try {
        // @ts-ignore: Global Scope
        delete global[this.settings.globalMetaScryExtraName];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete window[this.settings.globalMetaScryExtraName];
      } catch { }
    }
  }

  private _deinitObjectPropertyHelpers(): void {
    if (this.settings.defineObjectPropertyHelperFunctions) {
      try {
        // @ts-ignore: Global Scope
        delete Object.prototype[HasPropObjectHelperFunctionKey];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete Object.prototype[GetPropObjectHelperFunctionKey];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete Object.prototype[SetPropObjectHelperFunctionKey];
      } catch { }
    }
  }

  private _deinitArrayHelpers(): void {
    if (this.settings.defineArrayHelperFunctions) {
      try {
        // @ts-ignore: Global Scope
        delete Array.prototype[AggregateByArrayHelperFunctionKey];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete Array.prototype[IndexByArrayHelperFunctionKey];
      } catch { }
    }
  }

  //#endregion
}


