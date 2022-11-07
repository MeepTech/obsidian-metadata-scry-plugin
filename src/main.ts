import { Plugin } from 'obsidian';
import { MetadataScrier } from './meta';
import { DefaultSettings, MetadataScrierPluginSettingTab } from './settings';
import { StaticMetaScryPluginContainer as StaticMetaScryPluginApiContainer, MetaScryApi, MetaScryPluginSettings, MetaScryPluginApi as MetaScryPluginApi, StaticMetaScryApi } from "./api";
import { ReactSectionComponents } from "./components/sections";
import { ReactMarkdownComponents } from './components/markdown';
import { MetadataScrierPluginKey } from "./constants";

/**
 * Metadata Scrier Api Obsidian.md Plugin
 */
export default class MetadataScrierPlugin extends Plugin implements MetaScryPluginApi {
  static get Key() {
    return MetadataScrierPluginKey;
  }

  private static _instance: MetaScryApi;
  settings: MetaScryPluginSettings;
  
  //#region Api Access

  /**
   * The current instance of the MetadataScryApi api
   */
  static get Instance() : MetaScryApi {
    return MetadataScrierPlugin._instance;
  }

  get api(): MetaScryApi {
    return MetadataScrierPlugin._instance;
  }

  //#endregion

  //#region Initialization

  async onload() {
    super.onload();
    await this.loadSettings();
    this.addSettingTab(new MetadataScrierPluginSettingTab(this.app, this));

    this._initApi();
  }

  onunload() {
    this._deinitApi();
  }
  
	async loadSettings() {
		this.settings = Object.assign({}, DefaultSettings, await this.loadData());
  }
  
	async saveSettings() {
    // reset the api when settings are updated.
    this._deinitApi();
    await this.saveData(this.settings);
    this._initApi();
  }
  
  private _initApi() {
    this._verifyDependencies();
    StaticMetaScryPluginApiContainer.Instance = this;
    MetadataScrierPlugin._instance = new MetadataScrier(this);

    this._initGlobals();
    this._initHelperMethods();
  }

  /** 
   * if one of the dependenies is missing, disable the plugin and warn the user.
   */
  private _verifyDependencies() {
    // @ts-expect-error: app.plugin is not mapped.
    if (!app.plugins.plugins.dataview || !app.plugins.plugins.metaedit) {
      // @ts-expect-error: app.plugin is not mapped.
      const error = `Cannot initialize plugin: ${MetadataScrierPluginKey}. Dependency plugin is missing: ${!app.plugins.plugins.dataview ? "Dataview" : "Metaedit"}. (The ${MetadataScrierPluginKey} plugin has been automatically disabled.)`;
      // @ts-expect-error: app.plugin is not mapped.
      app.plugins.disablePlugin(MetadataScrierPluginKey);
      alert(error);
      throw error;
    }
  }

  //#region Object property and Global defenitions.

  private _initGlobals() {
    this._initGlobalPluginApis();
    this._initGlobalCache();
    this._initGlobalPath();
  }

  private _initHelperMethods() {
    this._initObjectPropertyHelperMethods();
    this._initArrayHelperMethods();
  }

  private _initObjectPropertyHelperMethods() {
    if (this.settings.defineObjectPropertyHelperFunctions) {
      /**
       * Find a deep property in an object, returning true on success.
       *
       * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
       * @param {{onTrue:function(object), onFalse:function()}|function(object)|[function(object), function()]} thenDo (Optional) A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
       * @returns true if the property exists, false if not.
       */
      Object.defineProperty(Object.prototype, 'hasProp', {
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
      Object.defineProperty(Object.prototype, 'getProp', {
        value: function (path: string | Array<string>, defaultValue: any) {
          const value = MetadataScrier.GetDeepProperty(path, this);
          if (defaultValue !== undefined && (value === undefined)) {
            if (typeof defaultValue === "function") {
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
      Object.defineProperty(Object.prototype, 'setProp', {
        value: function (propertyPath: string | Array<string>, value: any) {
          return MetadataScrier.SetDeepProperty(propertyPath, value, this);
        },
        enumerable: false
      });
      
    }
  }

  private _initArrayHelperMethods() {
    if (this.settings.defineArrayHelperFunctions) {
      /**
       * index an array of objects by a shared property with unique values among the
       * 
       * @param {string} uniqueKeyPropertyPath The path to the unique key on each object to use as the index of the object in the returned record.
       * 
       * @returns An aggregate object with the original objects from the input list indexed by the value of the property at the provided key path.
       */
      Object.defineProperty(Array.prototype, 'indexBy', {
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
      Object.defineProperty(Array.prototype, 'aggregateBy', {
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

  private _initGlobalPluginApis() {
    this._initGlobalScrys();
    this._initExtraApiGlobal();
  }

  private _initExtraApiGlobal() {
    if (this.settings.globalMetaScryExtraName) {
      try {
        /**
         * Global access to the MetadataScryApi on desktop.
         */
        Object.defineProperty(global, this.settings.globalMetaScryExtraName, {
          get() {
            return MetadataScrier.Api;
          }
        });
      } catch { }
      try {
        /**
         * Global access to the MetadataScryApi on mobile.
         */
        Object.defineProperty(window, this.settings.globalMetaScryExtraName, {
          get() {
            return MetadataScrier.Api;
          }
        });
      } catch { }
    }
  }

  private _initGlobalScrys() {
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
            ...ReactSectionComponents,
            ...ReactMarkdownComponents,
            Components: {
              ...ReactSectionComponents.Components,
              ...ReactMarkdownComponents.Components
            },
            SectionComponents: ReactSectionComponents.Components,
            MarkdownComponents: ReactMarkdownComponents.Components,
            ...apiAndPlugin
          } : apiAndPlugin;

      try {
        /**
         * Global access to the StaticMetadataScryPluginApi on desktop.
         */
        Object.defineProperty(global, "Scry", {
          get() {
            return staticApi;
          }
        });
      } catch { }
      try {
        /**
         * Global access to the StaticMetadataScryPluginApi on mobile.
         */
        Object.defineProperty(window, "Scry", {
          get() {
            return staticApi;
          }
        });
      } catch { }

      try {
        /**
         * Global access to the MetaScryApi on desktop.
         */
        Object.defineProperty(global, "scry", {
          get() {
            return MetadataScrier.Api;
          }
        });
      } catch { }
      try {
        /**
         * Global access to the MetaScryApi on mobile.
         */
        Object.defineProperty(window, "scry", {
          get() {
            return MetadataScrier.Api;
          }
        });
      } catch { }
    }
  }

  private _initGlobalCache() {
    try {
      /**
       * Global access to the cache on desktop.
       * @name global#cache
       */
      Object.defineProperty(global, this.settings.globalCacheName, {
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
      Object.defineProperty(window, this.settings.globalCacheName, {
        get() {
          return MetadataScrier.Api.Current.Cache;
        }
      });
    } catch { }
  }

  private _initGlobalPath() {
    try {
      /**
       * Global access to the cache on desktop.
       * @name global#path
       */
      Object.defineProperty(global, this.settings.globalPathName, {
        value: MetadataScrier.Api.path
      });
    } catch { }

    try {
      /**
       * Global access to the cache on mobile.
       * @name global#path
       */
      Object.defineProperty(window, this.settings.globalPathName, {
        value: MetadataScrier.Api.path
      });
    } catch { }
  }

  //#endregion

  //#endregion

  //#region De-Initialization

  private _deinitApi() {
    this._deinitGlobals();
    this._deinitHelperMethods();
    
    MetadataScrierPlugin._instance = undefined!;
  }

  private _deinitHelperMethods() {
    this._deinitObjectPropertyHelpers();
    this._deinitArrayHelpers();
  }

  private _deinitGlobals() {
    this._deinitGlobalPluginApis();
    this._deinitGlobalCache();
    this._deinitGlobalPath();
  }

  private _deinitGlobalCache() {
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

  private _deinitGlobalPath() {
    if (this.settings.globalPathName) {
      try {
        // @ts-ignore: Global Scope
        delete global[this.settings.globalPathName];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete window[this.settings.globalPathName];
      } catch { }
    }
  }


  private _deinitGlobalPluginApis() {
    if (this.settings.defineScryGlobalVariables) {
      try {
        // @ts-ignore: Global Scope
        delete global["Scry"];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete window["Scry"];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete global["scry"];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete window["scry"];
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

  private _deinitObjectPropertyHelpers() {
    if (this.settings.defineObjectPropertyHelperFunctions) {
      try {
        // @ts-ignore: Global Scope
        delete Object.prototype["hasProp"];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete Object.prototype["getProp"];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete Object.prototype["setProp"];
      } catch { }
    }
  }

  private _deinitArrayHelpers() {
    if (this.settings.defineArrayHelperFunctions) {
      try {
        // @ts-ignore: Global Scope
        delete Array.prototype["aggregateBy"];
      } catch { }
      try {
        // @ts-ignore: Global Scope
        delete Array.prototype["indexBy"];
      } catch { }
    }
  }

  //#endregion
}


