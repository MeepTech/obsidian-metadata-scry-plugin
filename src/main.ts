import { Plugin } from 'obsidian';
import { Metadata } from './meta';
import { DefaultSettings, MetadataApiSettingTab } from './settings';
import { PluginContainer, MetadataApi, MetadataApiSettings, MetadataPlugin } from "./api";

/**
 * Metadata api obsidian.md plugin
 */
export default class MetadataApiPlugin extends Plugin implements MetadataPlugin {
  private static _instance: MetadataApi;
  settings: MetadataApiSettings;
  
  //#region Api Access

  /**
   * The current instance of the metadata api
   */
  static get Instance() : MetadataApi {
    return MetadataApiPlugin._instance;
  }

  get api(): MetadataApi {
    return MetadataApiPlugin._instance;
  }

  //#endregion

  //#region Initialization

  async onload() {
    super.onload();
    await this.loadSettings();
    this.addSettingTab(new MetadataApiSettingTab(this.app, this));

    this._initApi();
  }

  onunload() {
    this._deinitApi();
  }
  
	async loadSettings() {
		this.settings = Object.assign({}, DefaultSettings, await this.loadData());
  }
  
	async saveSettings() {
    await this.saveData(this.settings);
    // reset the api when settings are updated.
    this._deinitApi();
    this._initApi();
  }
  
  private _initApi() {
    this._verifyDependencies();
    MetadataApiPlugin._instance = new Metadata(this);
    PluginContainer.Instance = this;

    this._initGlobalMetadata();
    this._initGlobalCache();
    this._initGlobalPath();

    if (this.settings.defineObjectPropertyHelperFunctions) {
      this._initObjectPropertyHelperMethods();
    }

    if (this.settings.defineArrayHelperFunctions) {
      this._initArrayHelperMethods();
    }
  }

  /** 
   * if one of the dependenies is missing, disable the plugin and warn the user.
   */
  private _verifyDependencies() {
    // @ts-expect-error: app.plugin is not mapped.
    if (!app.plugins.plugins.dataview || !app.plugins.plugins.metaedit) {
      // @ts-expect-error: app.plugin is not mapped.
      const error = `Cannot initialize plugin: Metadata-Api. Dependency plugin is missing: ${!app.plugins.plugins.dataview ? "Dataview" : "Metaedit"}. (The metadata-api plugin has been automatically disabled.)`;
      // @ts-expect-error: app.plugin is not mapped.
      app.plugins.disablePlugin("metadata-api");
      alert(error);
      throw error;
    }
  }

  //#region Object property and Global defenitions.

  private _initObjectPropertyHelperMethods() {
    /**
     * Find a deep property in an object, returning true on success.
     *
     * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
     * @param {{onTrue:function(object), onFalse:function()}|function(object)|[function(object), function()]} thenDo (Optional) A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
     * @returns true if the property exists, false if not.
     */
    Object.defineProperty(Object.prototype, 'hasProp', {
      value: function (path: string|Array<string>, thenDo: any) {
        if (thenDo) {
          return Metadata.TryToGetDeepProperty(path, thenDo, this);
        } else {
          return Metadata.ContainsDeepProperty(path, this);
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
      value: function (path: string|Array<string>, defaultValue: any) {
        const value = Metadata.GetDeepProperty(path, this);
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
      value: function (propertyPath: string|Array<string>, value: any) {
        return Metadata.SetDeepProperty(propertyPath, value, this);
      },
      enumerable: false
    });
  }

  private _initArrayHelperMethods() {
    /**
     * Aggregate an array of objects by a value
     * 
     * @param {string} key The key to aggegate by. This uses getProp so you can pass in a compound key
     * 
     * @returns An object with arrays indexed by the value of the property at the key within the object.
     */
    Object.defineProperty(Array.prototype, 'aggregateBy', {
      value: function (key: string): Record<any, any> {
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

  private _initGlobalMetadata() {
    try {
      /**
       * Global access to the metadata on desktop.
       */
      Object.defineProperty(global, "Metadata", {
        get() {
          return Metadata;
        }
      });
    } catch { }
    try {
      /**
       * Global access to the metadata on mobile.
       */
      Object.defineProperty(window, "Metadata", {
        get() {
          return Metadata;
        }
      });
    } catch { }

    try {
      /**
       * Global access to the metadata on desktop.
       */
      Object.defineProperty(global, this.settings.globalMetadataApiName, {
        get() {
          return Metadata.Api;
        }
      });
    } catch { }
    try {
      /**
       * Global access to the metadata on mobile.
       */
      Object.defineProperty(window, this.settings.globalMetadataApiName, {
        get() {
          return Metadata.Api;
        }
      });
    } catch { }
  }

  private _initGlobalCache() {
    try {
      /**
       * Global access to the cache on desktop.
       */
      Object.defineProperty(global, this.settings.globalCacheName, {
        get() {
          return Metadata.Api.Current.Cache;
        }
      });
    } catch { }

    try {
      /**
       * Global access to the cache on mobile.
       */
      Object.defineProperty(window, this.settings.globalCacheName, {
        get() {
          return Metadata.Api.Current.Cache;
        }
      });
    } catch { }
  }

  private _initGlobalPath() {
    try {
      /**
       * Global access to the cache on desktop.
       */
      Object.defineProperty(global, this.settings.globalPathName, {
        value: Metadata.Api.path
      });
    } catch { }

    try {
      /**
       * Global access to the cache on mobile.
       */
      Object.defineProperty(window, this.settings.globalPathName, {
        value: Metadata.Api.path
      });
    } catch { }
  }

  //#endregion

  //#endregion

  //#region De-Initialization

  private _deinitApi() {
    this._deinitGlobalMetadata();
    this._deinitGlobalCache();
    this._deinitGlobalPath();
    this._deinitObjectPropertyHelpers();
    this._deinitArrayHelpers();
    
    MetadataApiPlugin._instance = undefined!;
  }

  private _deinitGlobalCache() {
    try {
      // @ts-ignore: Global Scope
      delete global[this.settings.globalCacheName];
    } catch { }
    try {
      // @ts-ignore: Global Scope
      delete window[this.settings.globalCacheName];
    } catch { }
  }

  private _deinitGlobalPath() {
    try {
      // @ts-ignore: Global Scope
      delete global[this.settings.globalPathName];
    } catch { }
    try {
      // @ts-ignore: Global Scope
      delete window[this.settings.globalPathName];
    } catch { }
  }


  private _deinitGlobalMetadata() {
    try {
      // @ts-ignore: Global Scope
      delete global["Metadata"];
    } catch { }
    try {
      // @ts-ignore: Global Scope
      delete window["Metadata"];
    } catch { }
    try {
      // @ts-ignore: Global Scope
      delete global[this.settings.globalMetadataApiName];
    } catch { }
    try {
      // @ts-ignore: Global Scope
      delete window[this.settings.globalMetadataApiName];
    } catch { }
  }

  private _deinitObjectPropertyHelpers() {
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

  private _deinitArrayHelpers() {
    try {
      // @ts-ignore: Global Scope
      delete Array.prototype["aggregateBy"];
    } catch { }
  }

  //#endregion
}


