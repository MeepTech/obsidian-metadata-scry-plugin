import { App, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

interface MetadataApiSettings {
  globalCacheName: string;
  globalMetadataApiName: string;
  defineObjectPropertyHelperFunctions: boolean;
  prototypesPath: string;
  dataFilesPath: string;
}

const DEFAULT_SETTINGS: MetadataApiSettings = {
  globalCacheName: 'cache',
  globalMetadataApiName: 'meta',
  defineObjectPropertyHelperFunctions: true,
  prototypesPath: "_/_assets/_data/_prototypes",
  dataFilesPath: "_/_assets/_data/_values"
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

    this.initApi();
  }

  onunload() {
    this.deinitApi();
  }
  
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  
	async saveSettings() {
    await this.saveData(this.settings);
    this.deinitApi();
    this.initApi();
  }
  
  private initApi() {
    this.verifyDependencies();

    MetadataApiPlugin._instance = new Metadata();

    this.initGlobalMetadata();
    this.initGlobalCache();
    if (this.settings.defineObjectPropertyHelperFunctions) {
      this.initObjectPropertyHelperMethods();
    }
  }

  private verifyDependencies() {
    if (!app.plugins.plugins.dataview || !app.plugins.plugins.metaedit) {
      const error = `Cannot initialize plugin: Metadata-Api. Dependency plugin is missing: ${!app.plugins.plugins.dataview ? "Dataview" : "Metaedit"}`;
      alert(error);
      throw error;
    }
  }

  private initObjectPropertyHelperMethods() {
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
          return Metadata.Instance.TryToGetDeepProperty(path, thenDo, this);
        } else {
          return Metadata.Instance.ContainsDeepProperty(path, this);
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
        const value = Metadata.Instance.GetDeepProperty(path, this);
        if (defaultValue !== undefined && (value === undefined)) {
          return defaultValue;
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
      value: function (path: string|Array<string>, value: any) {
        return Metadata.Instance.SetDeepProperty(path, value, this);
      },
      enumerable: false
    });
  }

  private initGlobalMetadata() {
    /**
     * Global access to the metadata on desktop.
     */
    Object.defineProperty(global, this.settings.globalMetadataApiName, {
      get() {
        return Metadata.Instance;
      }
    });

    /**
     * Global access to the metadata on mobile.
     */
    Object.defineProperty(window, this.settings.globalMetadataApiName, {
      get() {
        return Metadata.Instance;
      }
    });
  }

  private initGlobalCache() {
    /**
     * Global access to the cache on desktop.
     */
    Object.defineProperty(global, this.settings.globalCacheName, {
      get() {
        return Metadata.Instance.Cache;
      }
    });

    /**
     * Global access to the cache on mobile.
     */
    Object.defineProperty(window, this.settings.globalCacheName, {
      get() {
        return Metadata.Instance.Cache;
      }
    });
  }

  deinitApi() {
    this.deinitGlobalMetadata();
    this.deinitGlobalCache();
    this.deinitObjectPropertyHelpers();
    
    MetadataApiPlugin._instance = undefined;
  }

  private deinitGlobalCache() {
    try {
      delete global[this.settings.globalCacheName];
    } catch { }
    try {
      delete window[this.settings.globalCacheName];
    } catch { }
  }

  private deinitGlobalMetadata() {
    try {
      delete global[this.settings.globalMetadataApiName];
    } catch { }
    try {
      delete window[this.settings.globalMetadataApiName];
    } catch { }
  }

  private deinitObjectPropertyHelpers() {
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
        .setValue(this.plugin.settings.dataFilesPath)
        .onChange(async (value) => {
          this.plugin.settings.dataFilesPath = value;
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
 * Access and edit metadata about a file from multiple sources.
 */
class Metadata {
  static _temps : any = {};

  constructor() {}

  /**
   * The instance of the Metadata class
   */
  static get Instance(): Metadata {
    return MetadataApiPlugin.Instance;
  }
  
  /**
   * The default sources to pull Metadata values from for a file.
   */
  get DefaultMetadataSources() : MetadataSources {
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
       * Cached values from the Metadata.Cache.
       */
      FileCache: true
    };
  }

  /**
   * Access to the Dataview Api
   * (Read access and Data display)
   */
  get DataviewApi() {
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
  get MetaeditApi() {
    return app
      .plugins
      .plugins
      .metaedit
      .api;
  }

  /**
   * Get all Metadata from the default sources for the current file.
   */
  get Current() : object {
    return this
      .Get(this.CurrentPath);
  }

  /**
   * The current note focused by the workspace.
   */
  get CurrentNote(): TFile {
    const current = app.workspace.getActiveFile();
    if (!current) {
      throw "No Current File";
    }

    return current;
  }

  /**
   * The current path of the current note
   */
  get CurrentPath() : string {
    const note : TFile = this.CurrentNote;
    let path = note.path;
    if (note.extension) {
      path = path.slice(0, 0 - (note.extension.length + 1));
    }

    return path;
  }

  /**
   * Get just the frontmatter of the current file
   */
  get CurrentMatter() : object {
    return this.Frontmatter(this.CurrentPath);
  }

  /**
   * Access the cached vales for the current file only.
   */
  get CurrentCache() : object {
    return this.Cache();
  }

  /**
   * Get just the frontmatter for the given file.
   * 
   * @param {object|string} file The file object(with a path property) or the full file path
   * 
   * @returns Just the frontmatter for the file.
   */
  Frontmatter(file : string|TFile|null = null) : object {
    const fileObject = app.vault.getAbstractFileByPath((this.ParseFileName(file) || this.CurrentPath) + ".md");
    const fileCache = app.metadataCache.getFileCache(fileObject);
    
    return fileCache.frontmatter || {};
  }

  /**
   * Get just the cache data for a file.
   * 
   * @param {object|string} file The file or filename to fetch for.
   * 
   * @returns The cache data only for the requested file
   */
  Cache(file : string|TFile|null = null) : object {
    const fileName = this.ParseFileName(file) || this.CurrentPath;
    Metadata._temps[fileName] = Metadata._temps[fileName] || {};

    return Metadata._temps[fileName];
  }

  /**
   * Get the desired prototypes
   * 
   * @param {string} prototypePath The path to the prototype file desired.
   * 
   * @returns An object containing the prototypes in the givne file
   */
  Prototypes(prototypePath: string) : object {
    return this.Frontmatter(app.plugins.plugins["metadata-api"].settings.prototypePath + prototypePath);
  }

  /**
   * Get the desired data from storage
   * 
   * @param {string} prototypePath The path to the desired data file.
   * 
   * @returns An object containing the frontmatter stored in the given file
   */
  Data(dataPath: string) : object {
    return this.Frontmatter(app.plugins.plugins["metadata-api"].settings.dataFilesPath + dataPath);
  }

  /**
   * Get the Metadata for a given file using the supplied sources.
   * 
   * @param {*} file The name of the file or the file object with a path
   * @param {bool|object} sources The sources to get metadata from. Defaults to all.
   * 
   * @returns The requested metadata
   */
  Get(file: string|TFile|null, sources: MetadataSources|boolean = this.DefaultMetadataSources) : object {
    const fileName = this.ParseFileName(file || this.CurrentPath);
    let values: any = {};

    if (sources === true) {
      values = this
        .DataviewApi
        .page(fileName);
    } else {
      if (sources === false) {
        return {};
      }

      // if we need dv sources
      if (sources.DataviewInline || sources.FileMetadata) {
        values = this
          .DataviewApi
          .page(fileName);
        
        // remove file metadata?
        if (!sources.FileMetadata) {
          delete values.file;
        }

        // remove dv inline?
        let frontmatter: object = {};
        if (!sources.DataviewInline) {
          frontmatter = this.Frontmatter(fileName);
          Object.keys(values).forEach(prop => {
            // if it's not a frontmatter prop or the 'file' metadata prop
            if (!frontmatter.hasOwnProperty(prop) && prop != "file") {
              delete values[prop];
            }
          });
        }

        // remove frontmatter?
        if (!sources.Frontmatter) {
          frontmatter = frontmatter || this.Frontmatter(fileName);
          Object.keys(frontmatter).forEach(prop => {
            delete values[prop];
          });
        }
      } // just the frontmatter/cache?
      else if (sources.Frontmatter) {
        values = this.Frontmatter(fileName);
      }
    }

    // add cache?
    if (sources === true || sources.FileCache) {
      values = {
        ...this.Cache(fileName),
        ...values
      }
    }

    return values;
  }

  /**
   * Patch individual properties of the frontmatter metadata.
   * 
   * @param {object|string} file The name of the file or the file object with a path
   * @param {*|object} frontmatterData The properties to patch. This can patch properties multiple keys deep as well. If a propertyName is provided then this entire object/value is set to that single property name instead
   * @param {string} propertyName (Optional) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here.
   * 
   * @returns The updated Metadata.
   */
  Patch(file: string|TFile|null, frontmatterData: any, propertyName: string|null = null) : object {
    const { update } = this.MetaeditApi;
    const fileName = this.ParseFileName(file) || this.CurrentPath;

    if (propertyName != null) {
      update(propertyName, frontmatterData, fileName);
    } else {
      Object.keys(frontmatterData).forEach(propertyName =>
        update(propertyName, frontmatterData[propertyName], fileName));
    }

    return this.Get(fileName);
  }
  
  /**
   * Replace the existing frontmatter of a file with entirely new data, clearing out all old data in the process.
   * 
   * @param {object|string} file The name of the file or the file object with a path
   * @param {object} frontmatterData The entire frontmatter header to set for the file. This clears and replaces all existing data!
   * 
   * @returns The updated Metadata
   */
  Set(file: string|TFile|null, frontmatterData: any) : object {
    const { update } = this.MetaeditApi;
    const fileName = this.ParseFileName(file) || this.CurrentPath;

    this.Clear(fileName);
    Object.keys(frontmatterData).forEach(propertyName =>
      update(propertyName, frontmatterData[propertyName], fileName));

    return this.Get(fileName);
  }
  
  /**
   * Used to clear values from metadata.
   * 
   * @param {object|string} file The file to clear properties for. defaults to the current file.
   * @param {string|array} frontmatterProperties (optional)The name of the property, an array of property names, or an object with the named keys you want cleared. If left blank, all frontmatter for the file is cleared!
   */
  Clear(file: string|TFile|null = null , frontmatterProperties: any = null) {
    const fileName = this.ParseFileName(file) || this.CurrentPath;
    let propsToClear = [];
    
    if (typeof frontmatterProperties === "string") {
      propsToClear.push(frontmatterProperties);
    } else if (typeof frontmatterProperties === 'object') {
      if (Array.isArray(frontmatterProperties)) {
        propsToClear = frontmatterProperties;
      } else {
        propsToClear = Object.keys(frontmatterProperties);
      }
    } else {
      propsToClear = Object.keys(this.Frontmatter(fileName));
    }

    throw "not implemented";
  }

  /**
   * Find a deep property in an object.
   * 
   * @param {string|array[string]} propertyPath Array of keys, or dot seperated propery key."
   * @param {object} onObject The object containing the desired key
   *  
   * @returns true if the property exists, false if not. 
   */
  ContainsDeepProperty(propertyPath: string|Array<string>, onObject: any) : boolean {
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
  TryToGetDeepProperty(propertyPath: string|Array<string>, thenDo: any, fromObject: any) : boolean {
    const keys = (typeof (propertyPath) == "string")
      ? propertyPath
        .split('.')
      : propertyPath;
    
    let parent = fromObject;
    for (const currentKey of keys) {
      if (typeof parent !== "object" || !parent.hasOwnProperty(currentKey)) {
        if (thenDo.onFalse) {
          thenDo.onFalse();
        }
        return false;
      }

      parent = parent[currentKey];
    }

    const then = thenDo.onTrue || thenDo;
    if (then) {
      return then.onTrue(parent);
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
  GetDeepProperty(propertyPath: string|Array<string>, fromObject: any) : any|null {
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
  SetDeepProperty(propertyPath: string|Array<string>, value: any, onObject: any) : void {
    const keys = (typeof (propertyPath) == "string")
      ? propertyPath
        .split('.')
      : propertyPath;
    
    let parent = onObject;
    for (const currentKey of keys) {
      if (typeof parent !== "object") {
        throw `Property: ${currentKey}, in Path: ${propertyPath}, is not an object. Child property values cannot be set!`;
      }
      if (!parent.hasOwnProperty(currentKey)) {
        parent[currentKey] = {};
      }
      
      parent = parent[currentKey];
    }

    if (typeof value === "function") {
      parent.value = value(parent.value);
    } else {
      parent.value = value;
    }
  }
  
  /**
   * Get a file path string based on a file path string or file object.
   * 
   * @param {object|string} file The file object (with a path property) or file name
   * 
   * @returns The file path
   */
  private ParseFileName(file : string|TFile|null) : string|null {
    let fileName = file || null;
    if (typeof file === "object" && file !== null) {
      fileName == file.path || file.name;
    }
    
    return fileName;
  }
}