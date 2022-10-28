import { App, Plugin, PluginSettingTab, Setting, TFile, TFolder } from 'obsidian';
import { Arr, Obj } from 'tern';

enum SplayKebabCasePropertiesOption {
  Disabled = 0,
  Lowercase = 1,
  LowerCamelCase = 2,
  LowerAndLowerCamelCase = 3
}

interface MetadataApiSettings {
  globalCacheName: string;
  globalMetadataApiName: string;
  defineObjectPropertyHelperFunctions: boolean;
  splayKebabCaseProperties: SplayKebabCasePropertiesOption;
  splayFrontmatterWithoutDataview: boolean;
  prototypesPath: string;
  valuesPath: string;
}

const DEFAULT_SETTINGS: MetadataApiSettings = {
  globalCacheName: 'cache',
  globalMetadataApiName: 'meta',
  defineObjectPropertyHelperFunctions: true,
  splayKebabCaseProperties: SplayKebabCasePropertiesOption.LowerAndLowerCamelCase,
  splayFrontmatterWithoutDataview: true,
  prototypesPath: "_/_assets/_data/_prototypes",
  valuesPath: "_/_assets/_data/_values"
}

export default class MetadataApiPlugin extends Plugin {
  private static _instance: Metadata;
  settings: MetadataApiSettings;
  
  static get Instance() {
    return MetadataApiPlugin._instance;
  }

  get api(): Metadata {
    return MetadataApiPlugin._instance;
  }

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
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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

    this._initGlobalMetadata();
    this._initGlobalCache();
    if (this.settings.defineObjectPropertyHelperFunctions) {
      this._initObjectPropertyHelperMethods();
    }
  }

  /** 
   * if one of the dependenies is missing, disable the plugin and warn the user.
   */
  private _verifyDependencies() {
    if (!app.plugins.plugins.dataview || !app.plugins.plugins.metaedit) {
      const error = `Cannot initialize plugin: Metadata-Api. Dependency plugin is missing: ${!app.plugins.plugins.dataview ? "Dataview" : "Metaedit"}. (The metadata-api plugin has been automatically disabled.)`;
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

  private _deinitApi() {
    this._deinitGlobalMetadata();
    this._deinitGlobalCache();
    this._deinitObjectPropertyHelpers();
    
    MetadataApiPlugin._instance = undefined;
  }

  private _deinitGlobalCache() {
    try {
      delete global[this.settings.globalCacheName];
    } catch { }
    try {
      delete window[this.settings.globalCacheName];
    } catch { }
  }

  private _deinitGlobalMetadata() {
    try {
      delete global["Metadata"];
    } catch { }
    try {
      delete window["Metadata"];
    } catch { }
    try {
      delete global[this.settings.globalMetadataApiName];
    } catch { }
    try {
      delete window[this.settings.globalMetadataApiName];
    } catch { }
  }

  private _deinitObjectPropertyHelpers() {
    try {
      delete Object.prototype["hasProp"];
    } catch { }
    try {
      delete Object.prototype["getProp"];
    } catch { }
    try {
      delete Object.prototype["setProp"];
    } catch { }
  }

  //#endregion
}

class MetadataApiSettingTab extends PluginSettingTab {
  plugin: MetadataApiPlugin;

  constructor(app: App, plugin: MetadataApiPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Medatata Api Settings' });
    
    new Setting(containerEl)
      .setName('Metadata Api Variable Name')
      .setDesc('The variable name to use for the Metadata Api global scope variable registered by this plugin')
      .addText(text => text
        .setPlaceholder('meta')
        .setValue(this.plugin.settings.globalMetadataApiName)
        .onChange(async (value) => {
          this.plugin.settings.globalMetadataApiName = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Global Cache Variable Name')
      .setDesc('The variable name to use for the cache global scope variable registered by this plugin')
      .addText(text => text
        .setPlaceholder('cache')
        .setValue(this.plugin.settings.globalCacheName)
        .onChange(async (value) => {
          this.plugin.settings.globalCacheName = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName('Add Object Property Helper Functions.')
      .setDesc('Adds the function hasProp, getProp, and setProp to all objects for deep property access.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.defineObjectPropertyHelperFunctions)
        .onChange(async (value) => {
          this.plugin.settings.defineObjectPropertyHelperFunctions = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName('Splay Kebab-Case Properties.')
      .setDesc('This option adds copies of any kebab-case properties with the desired naming schemes. This is similar to how a lowercase version of values with uppercase letters are provided in dataview.')
      .addDropdown(toggle => toggle
        .setValue(this.plugin.settings.splayKebabCaseProperties.toString())
        .addOptions(Object.fromEntries(
          Object.entries(SplayKebabCasePropertiesOption).map(([key, value]) =>
            [key.toString(), value.toString()]))
        )
        .onChange(async (value) => {
          this.plugin.settings.splayKebabCaseProperties = (<any>SplayKebabCasePropertiesOption)[parseInt(value)];
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName('Splay Frontmatter Properties to Lower Case even without Dataview.')
      .setDesc('Dataview splays property keys with uppercase values to lowercase, creating two keys. If this is true, Metadata Api will add this functionality to the base Frontmatter calls, even without Dataview sources included.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.splayFrontmatterWithoutDataview)
        .onChange(async (value) => {
          this.plugin.settings.splayFrontmatterWithoutDataview = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName('Prototypes File Path')
      .setDesc('The path to prototype data storage')
      .addText(text => text
        .setPlaceholder('_/_assets/_data/_prototypes')
        .setValue(this.plugin.settings.prototypesPath)
        .onChange(async (value) => {
          this.plugin.settings.prototypesPath = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Data Storage Values Path')
      .setDesc('The path to the value data storage')
      .addText(text => text
        .setPlaceholder("_/_assets/_data/_values")
        .setValue(this.plugin.settings.valuesPath)
        .onChange(async (value) => {
          this.plugin.settings.valuesPath = value;
          await this.plugin.saveSettings();
        }));
  }
}

/**
 * The sources to pull Metadata values from for a file.
 */
interface MetadataSources {
  /**
   * The 'file' field containing metadata about the file itself
   */
  FileMetadata: boolean,
  /**
   * The Frontmatter (YAML at the top of a note)
   */
  Frontmatter: boolean,
  /**
   * Inline Dataview data fields
   */
  DataviewInline: boolean,
  /**
   * Cached values from the Metadata.Cache.
   */
  FileCache: boolean
}

/**
 * Access to current metadata
 */
class CurrentMetadata {
  private _api: Metadata;

  constructor(metaApi: Metadata) {
    this._api = metaApi;
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Data(): object {
    return this._api.get();
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get data(): object {
    return this.Data;
  }

  /**
   * The current note focused by the workspace.
   */
  get Note(): TFile {
    const current = app.workspace.getActiveFile();
    if (!current) {
      throw "No Current File";
    }

    return current;
  }
  
  /**
   * The current note focused by the workspace.
   */
  get note(): TFile {
    return this.Note;
  }

  /**
   * The current path of the current note
   */
  get Path(): string {
    const note: TFile = this.Note;
    let path = note.path;
    if (note.extension) {
      path = path.slice(0, 0 - (note.extension.length + 1));
    }

    return path;
  }

  /**
   * The current path of the current note
   */
  get path(): string {
    return this.Path;
  }

  /**
   * Get just the frontmatter of the current file
   */
  get Matter() : object {
    return this._api.frontmatter();
  }
  
  /**
   * Get just the frontmatter of the current file
   */
  get matter(): object {
    return this.Matter;
  }

  /**
   * Access the cached vales for the current file only.
   */
  get Cache() : object {
    return this._api.cache();
  }

  /**
   * Access the cached vales for the current file only.
   */
  get cache(): object {
    return this.Cache;
  }

  /**
   * Patch individual properties of the current file's frontmatter metadata.
   * 
   * @param {*|object} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to patch said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to patch said data prototype file. You can also pass in the path here instead.
   * 
   * @returns The updated Metadata.
   */
  patch(frontmatterData: any, propertyName: string | null = null, toValuesFile: boolean | string = false, prototype: string | boolean = false): any|object {
    return this._api.patch(this.path, frontmatterData, propertyName, toValuesFile, prototype);
  }
  
  /**
   * Replace the existing frontmatter the current file with entirely new data, clearing out all old data in the process.
   * 
   * @param {object} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   * 
   * @returns The updated Metadata
   */
  set(frontmatterData: any, toValuesFile: boolean | string = false, prototype: string | boolean = false): any | object {
    return this._api.set(this.path, frontmatterData, toValuesFile, prototype)
  }

  /**
   * Used to clear values from metadata.
   * 
   * @param {object|string} file The file to clear properties for. defaults to the current file.
   * @param {string|array} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
   */
  clear(frontmatterProperties: string | Array<string> | object | null = null, toValuesFile: boolean | string = false, prototype: string | boolean = false) {
    return this._api.clear(this.path, frontmatterProperties, toValuesFile, prototype);
  }
}

/**
 * Access and edit metadata about a file from multiple sources.
 */
class Metadata {
  private static _caches: any = {};
  private _plugin: MetadataApiPlugin;
  private _kebabPropSplayer: (base: any, topLevelPropertiesToIgnore: Array<string>|null) => object;
  private _lowerCaseSplayer: (base: any) => object;
  
  //#region Initalization

  constructor(plugin: MetadataApiPlugin) {
    this._plugin = plugin;
    this._initializeKebabPropSplayer();
    this._initializePropLowercaseSplayer();
  }

  /**
   * set the splay function for kebab case
   */
  private _initializeKebabPropSplayer() {
    this._kebabPropSplayer = (() => {
      switch (this.plugin.settings.splayKebabCaseProperties) {
        case SplayKebabCasePropertiesOption.Lowercase:
          return (base, topLevelPropertiesToIgnore) => Metadata._recurseOnAllObjectProperties(base, Metadata._splayKebabToLowercase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.LowerCamelCase:
          return (base, topLevelPropertiesToIgnore) => Metadata._recurseOnAllObjectProperties(base, Metadata._splayKebabToLowerCamelcase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.LowerAndLowerCamelCase:
          return (base, topLevelPropertiesToIgnore) => Metadata._recurseOnAllObjectProperties(base, Metadata._splayKebabToLowerAndLowerCamelcase, topLevelPropertiesToIgnore);
        case SplayKebabCasePropertiesOption.Disabled:
        default:
          return base => base;
      }
    })();
  }

  /**
   * set the frontmatter only splay function
   */
  private _initializePropLowercaseSplayer() {
    this._lowerCaseSplayer = this.plugin.settings.splayFrontmatterWithoutDataview
        ? base => Metadata._recurseOnAllObjectProperties(base, Metadata._splayToLowerCase)
        : base => base;
  }

  /**
   * Used to recurse splaying
   */
  private static _recurseOnAllObjectProperties(value: any, fn: (key: string, value: any, data: any | object) => any | object, topLevelPropertiesToIgnore: Array<string> | null = null): any {
    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        return value.map(i =>
          this._recurseOnAllObjectProperties(i, fn));
      } else {
        const data: any = {};
        for (const key of Object.keys(value)) {
          if (topLevelPropertiesToIgnore && topLevelPropertiesToIgnore.contains(key)) {
            data[key] = value;
          } else {
            fn(key, this._recurseOnAllObjectProperties(value[key], fn), data);
          }
        }
        
        return data;
      }
    } else {
      return value;
    }
  }

  private static _splayKebabToLowercase(key: string, value: any, data: any | object) : any | object {
    if (key.includes("-")) {
      data[key.replace(/-/g, "").toLowerCase()] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerCamelcase(key: string, value: any, data: any | object) : any | object {
    if (key.includes("-")) {
      data[key
        .toLowerCase()
        .split('-')
        .map((part, i) => i !== 0 ? part.charAt(0).toUpperCase() + part.substring(1) : part)
        .join('')
      ] = value;
    }

    data[key] = value;
  }

  private static _splayKebabToLowerAndLowerCamelcase(key: string, value: any, data: any | object) : any | object {
    if (key.includes("-")) {
      const lowerKey = key.toLowerCase();
      data[lowerKey.replace(/-/g, "")] = value;
      data[lowerKey
        .split('-')
        .map((part, i) => i !== 0 ? part.charAt(0).toUpperCase() + part.substring(1) : part)
        .join('')] = value;
    }

    data[key] = value;
  }

  private static _splayToLowerCase(key: string, value: any, data: any | object): any | object {
    data[key] = value;
    data[key.toLowerCase()] = value;
  }

  //#endregion

  /**
   * The instance of the Metadata class
   */
  static get Api(): Metadata {
    return MetadataApiPlugin.Instance;
  }

  /**
   * Access to the Dataview Api
   * (Read access and Data display)
   */
  static get DataviewApi() {
    return app
      .plugins
      .plugins
      .dataview
      .api;
  }
  
  /** 
   * Access to the Metaedit Api
   * (Write access)
   */
  static get MetaeditApi() {
    return app
      .plugins
      .plugins
      .metaedit
      .api;
  }

  /**
   * Get the plugin that runs this api
   */
  get Plugin(): MetadataApiPlugin {
    return this.plugin;
  }

  /**
   * Get the plugin that runs this api
   */
  get plugin(): MetadataApiPlugin {
    return this._plugin || app.plugins.plugins["metadata-api"];
  }
  
  /**
   * The default sources to pull Metadata values from for a file.
   */
  static get DefaultSources() : MetadataSources {
    return {
      /**
       * The 'file' field containing metadata about the file itself
       */
      FileMetadata: true,
      /**
       * The Frontmatter (YAML at the top of a note)
       */
      Frontmatter: true,
      /**
       * Inline Dataview data fields
       */
      DataviewInline: true,
      /**
       * Cached values from the Metadata.Cache in a single field named 'cache'.
       */
      FileCache: true
    };
  }

  //#region Current File Properties

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Current() : CurrentMetadata {
    return this.current;
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get current(): CurrentMetadata {
    return new CurrentMetadata(this);
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Data() : object {
    return this.Current.Data;
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get data(): object {
    return this.Current.Data;
  }

  //#endregion

  //#region Metadata Fetchers

  /**
   * Get just the frontmatter for the given file.
   * 
   * @param {object|string} file The file object(with a path property) or the full file path
   * 
   * @returns Just the frontmatter for the file.
   */
  frontmatter(file: string | TFile | null = null): object {
    const fileObject = app.vault.getAbstractFileByPath((Metadata.ParseFileName(file) || this.Current.Path) + ".md");
    const fileCache = app.metadataCache.getFileCache(fileObject);
    
    return (fileCache && fileCache.frontmatter) ? this._lowerCaseSplayer(this._kebabPropSplayer(fileCache?.frontmatter, null)) : {};
  }

  /**
   * Get the dataview api values for the given file; Inline, frontmatter, and the file value.
   * 
   * @param {object|string} file The file object(with a path property) or the full file path
   * 
   * @returns Just the dataview)+frontmatter) values for the file.
   */
  dv(file: string | TFile | null = null): object {
    return this._kebabPropSplayer(Metadata
      .DataviewApi
      .page(file ? Metadata.ParseFileName(file) : this.Current.Path), ["file"]);
  }

  /**
   * Get just the cache data for a file.
   * 
   * @param {object|string} file The file or filename to fetch for.
   * 
   * @returns The cache data only for the requested file
   */
  cache(file : string|TFile|null = null) : object {
    const fileName = Metadata.ParseFileName(file) || this.Current.Path;
    Metadata._caches[fileName] = Metadata._caches[fileName] || {};

    return Metadata._caches[fileName];
  }

  /**
   * Get the desired prototypes
   * 
   * @param {string} prototypePath The path to the prototype file desired.
   * 
   * @returns An object containing the prototypes in the givne file
   */
  prototypes(prototypePath: string) : object {
    return this.frontmatter(Metadata.BuildPrototypeFileFullPath(prototypePath));
  }

  /**
   * Get the desired data from value storage
   * 
   * @param {string} prototypePath The path to the desired data file.
   *
   * @returns An object containing the frontmatter stored in the given file
   */
  values(dataPath: string) : object {
    return this.frontmatter(Metadata.BuildDataFileFullPath(dataPath));
  }

  /**
   * Get the Metadata for a given file using the supplied sources.
   * 
   * @param {*} file The name of the file or the file object with a path
   * @param {bool|object} sources The sources to get metadata from. Defaults to all.
   * 
   * @returns The requested metadata
   */
  get(file: string|TFile|null = null, sources: MetadataSources|boolean = Metadata.DefaultSources) : object {
    const fileName = file ? Metadata.ParseFileName(file) : this.Current.Path;
    let values: any = {};

    if (sources === true) {
      values = this._kebabPropSplayer(Metadata
        .DataviewApi
        .page(fileName), ["file"]) || {};
    } else {
      if (sources === false) {
        return {};
      }

      // if we need dv sources
      if (sources.DataviewInline || sources.FileMetadata) {
        values = this._kebabPropSplayer(Metadata
          .DataviewApi
          .page(fileName), ["file"]) || {};
        
        // remove file metadata?
        if (!sources.FileMetadata) {
          delete values.file;
        }

        // remove dv inline?
        let frontmatter: object = null;
        if (!sources.DataviewInline) {
          frontmatter = this.frontmatter(fileName);
          Object.keys(values).forEach(prop => {
            // if it's not a frontmatter prop or the 'file' metadata prop
            if (!frontmatter.hasOwnProperty(prop) && prop != "file") {
              delete values[prop];
            }
          });
        }

        // remove frontmatter?
        if (!sources.Frontmatter) {
          frontmatter = frontmatter || this.frontmatter(fileName);
          Object.keys(frontmatter).forEach(prop => {
            delete values[prop];
          });
        }
      } // just the frontmatter/cache?
      else if (sources.Frontmatter) {
        values = this.frontmatter(fileName);
      }
    }

    // add cache?
    if (sources === true || sources.FileCache) {
      values["cache"] = this.cache(fileName);
    }

    return values;
  }

  //#endregion

  //#region Metadata Modifiers

  /**
   * Patch individual properties of the frontmatter metadata.
   * 
   * @param {object|string} file The name of the file or the file object with a path
   * @param {*|object} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to patch said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to patch said data prototype file. You can also pass in the path here instead.
   * 
   * @returns The updated Metadata.
   */
  patch(file: string|TFile|null, frontmatterData: any, propertyName: string|null = null, toValuesFile: boolean|string = false, prototype: string|boolean = false) : object {
    if (prototype && toValuesFile) {
      throw "Cannot patch toValuesFile and prototype at the same time.";
    }

    const { update } = Metadata.MetaeditApi;
    const fileName = Metadata._parseFileNameFromDataFileFileOrPrototype(toValuesFile, file, prototype);
      
    if (propertyName != null) {
      update(propertyName, frontmatterData, fileName);
    } else {
      Object.keys(frontmatterData).forEach(propertyName =>
        update(propertyName, frontmatterData[propertyName], fileName));
    }

    return this.get(fileName);
  }

  /**
   * Replace the existing frontmatter of a file with entirely new data, clearing out all old data in the process.
   * 
   * @param {object|string} file The name of the file or the file object with a path
   * @param {object} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to set to said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to set to said data prototype file. You can also pass in the path here instead.
   * 
   * @returns The updated Metadata
   */
  set(file: string|TFile|null, frontmatterData: any, toValuesFile: boolean|string = false, prototype: string|boolean = false) : object {
    if (prototype && toValuesFile) {
      throw "Cannot patch toValuesFile and prototype at the same time.";
    }

    const { update } = Metadata.MetaeditApi;
    const fileName = Metadata._parseFileNameFromDataFileFileOrPrototype(toValuesFile, file, prototype);

    this.clear(fileName);
    Object.keys(frontmatterData).forEach(propertyName =>
      update(propertyName, frontmatterData[propertyName], fileName));

    return this.get(fileName);
  }
  
  /**
   * Used to clear values from metadata.
   * 
   * @param {object|string} file The file to clear properties for. defaults to the current file.
   * @param {string|array} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   * @param {boolean|string} toValuesFile (Optional) set this to true if the path is a data value file path and you want to clear from said data value file. You can also pass the path in here instead.
   * @param {boolean|string} prototype (Optional) set this to true if the path is a data prototype file path and you want to clear from said data prototype file. You can also pass in the path here instead.
   */
  clear(file: string|TFile|null = null , frontmatterProperties: string|Array<string>|object|null = null, toValuesFile: boolean|string = false, prototype: string|boolean = false) {
    if (prototype && toValuesFile) {
      throw "Cannot patch toValuesFile and prototype at the same time.";
    }

    const fileName = Metadata._parseFileNameFromDataFileFileOrPrototype(toValuesFile, file, prototype);
    let propsToClear = [];
    
    if (typeof frontmatterProperties === "string") {
      propsToClear.push(frontmatterProperties);
    } else if (typeof frontmatterProperties === 'object') {
      if (frontmatterProperties === null) {
        propsToClear = Object.keys(this.frontmatter(fileName));
      } else if (Array.isArray(frontmatterProperties)) {
        propsToClear = frontmatterProperties;
      } else {
        propsToClear = Object.keys(frontmatterProperties);
      }
    } 

    throw "not implemented";
  }

  //#endregion

  //#region Utilities
  //#region Object Deep Property Utilities

  /**
   * Find a deep property in an object.
   * 
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {object} onObject The object containing the desired key
   *  
   * @returns true if the property exists, false if not. 
   */
  static ContainsDeepProperty(propertyPath: string|Array<string>, onObject: any) : boolean {
    const keys = (typeof (propertyPath) == "string")
      ? propertyPath
        .split('.')
      : propertyPath;
    
    let parent = onObject;
    for (const currentKey of keys) {
      if (typeof parent !== "object") {
        return false;
      }

      if (!parent.hasOwnProperty(currentKey)) {
        return false;
      }

      parent = parent[currentKey];
    }

    return true;
  }

  /**
   * Get a deep property in an object, null if not found.
   * 
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {{onTrue:function(object), onFalse:function()}|function(object)|[function(object), function()]} thenDo A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
   * @param {object} fromObject The object containing the desired key
   *  
   * @returns if the property exists. 
   */
  static TryToGetDeepProperty(propertyPath: string|Array<string>, thenDo: any, fromObject: any) : boolean {
    const keys = (typeof (propertyPath) == "string")
      ? propertyPath
        .split('.')
      : propertyPath;
    
    let parent = fromObject;
    for (const currentKey of keys) {
      if (typeof parent !== "object" || !parent.hasOwnProperty(currentKey)) {
        if (thenDo && thenDo.onFalse) {
          thenDo.onFalse();
        }
        return false;
      }

      parent = parent[currentKey];
    }

    if (thenDo) {
      const then = thenDo.onTrue || thenDo;
      if (then) {
        return then(parent);
      }
    }

    return true;
  }

  /**
   * Get a deep property in an object, null if not found.
   * 
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {object} fromObject The object containing the desired key
   *  
   * @returns The found deep property, or null if not found. 
   */
  static GetDeepProperty(propertyPath: string|Array<string>, fromObject: any) : any|null {
    return (typeof (propertyPath) == "string"
      ? propertyPath
        .split('.')
      : propertyPath)
      .reduce((t, p) => t?.[p], fromObject);
  }

  /**
   * Set a deep property in an object, even if it doesn't exist.
   * 
   * @param {string|[string]} propertyPath Array of keys, or dot seperated propery key.
   * @param {object|function(object)} value The value to set, or a function to update the current value and return it.
   * @param {object} fromObject The object containing the desired key
   *  
   * @returns The found deep property, or null if not found. 
   */
  static SetDeepProperty(propertyPath: string | Array<string>, value: any, onObject: any): void {
    const keys = (typeof (propertyPath) == "string")
      ? propertyPath
        .split('.')
      : propertyPath;
    
    let parent = onObject;
    let currentKey;
    for (currentKey of keys) {
      if (typeof parent !== "object") {
        throw `Property: ${currentKey}, in Path: ${propertyPath}, is not an object. Child property values cannot be set!`;
      }

      // if this parent doesn't have the property we want, add it as an empty object for now.
      if (!parent.hasOwnProperty(currentKey)) {
        parent[currentKey] = {};
      }
      
      // if this isn't the last one, set it as parent.
      if (currentKey != keys[keys.length - 1]) {
        parent = parent[currentKey];
      }
    }

    if (!currentKey) {
      throw "No Final Key Provided!?";
    }

    if (typeof value === "function") {
      parent[currentKey] = value(parent[currentKey]);
    } else {
      parent[currentKey] = value;
    }
  }

  //#endregion
  //#region Filename Utilities
  /**
   * Turn a relative path into a full path
   * 
   * @param relativePath The relative path to map to
   * @param rootFolder (Optional) The root folder path the relative path is relative too. Defaults to the current note's folder
   * 
   * @returns The full file path.
   */
  path(relativePath: string|null = null, rootFolder: string | null = null) {
    if (!relativePath) {
      return this.current.path;
    }

    const [fileName, ...folders]
      = relativePath.split("/").reverse();

    let absolutePath = fileName;
    let currentFolder: TFolder = rootFolder
      ? app.vault.getAbstractFileByPath(rootFolder)
      : this.Current.Note.parent
  
    for (var folder of folders.reverse()) {
      if (folder === "..") {
        currentFolder = currentFolder.parent;
      } else if (folder === ".") {
        continue;
      } else {
        absolutePath = folder + "/" + absolutePath;
      }
    }

    if (currentFolder.path !== "/") {
      return currentFolder.path + "/" + absolutePath;
    } else {
      return absolutePath;
    }
  }
  
  /**
   * Get a file path string based on a file path string or file object.
   * 
   * @param {object|string} file The file object (with a path property) or file name
   * 
   * @returns The file path
   */
  static ParseFileName(file : string|TFile|null) : string|null {
    let fileName = file || null;
    if (typeof file === "object" && file !== null) {
      fileName = file.path.split('.').slice(0, -1).join('.');
    }
    
    return fileName;
  }
  
  /**
   * Get the full path of a data file from it's data path.
   * 
   * @param dataPath The path after the value set in settings for the path to data value files.
   * 
   * @returns the full path from the root of the vault.
   */
  static BuildDataFileFullPath(dataPath : string) {
    return app.plugins.plugins["metadata-api"].settings.dataFilesPath + dataPath;
  }
  
  /**
   * Get the full path of a prototype file from it's data path.
   * 
   * @param prototypePath The path after the value set in settings for the path to data prototypes files.
   * 
   * @returns the full path from the root of the vault.
   */
  static BuildPrototypeFileFullPath(prototypePath : string) {
    return app.plugins.plugins["metadata-api"].settings.prototypesPath + prototypePath;
  }
  
  private static _parseFileNameFromDataFileFileOrPrototype(toValuesFile: string | boolean, file: string | TFile | null, prototype: string | boolean) {
    return toValuesFile
      ? file
        ? Metadata.BuildDataFileFullPath(Metadata.ParseFileName(file))
        : (typeof toValuesFile === "string"
          ? Metadata.BuildDataFileFullPath(toValuesFile)
          : Metadata.BuildDataFileFullPath(Metadata.Api.Current.Path))
      : prototype
        ? file
          ? Metadata.BuildPrototypeFileFullPath(Metadata.ParseFileName(file))
          : (typeof prototype === "string"
            ? Metadata.BuildPrototypeFileFullPath(prototype)
            : Metadata.BuildPrototypeFileFullPath(Metadata.Api.Current.Path))
        : Metadata.ParseFileName(file) || Metadata.Api.Current.Path;
  }
  
  //#endregion

  //#endregion
}