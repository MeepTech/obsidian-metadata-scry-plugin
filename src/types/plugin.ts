import {
  App,
  Plugin
} from "obsidian";
import { Keys } from "../constants";
import { CopyToHtmlPlugin } from "./_external_sources/copy-to-html";
import { MetaBindPlugin } from "./_external_sources/meta-bind";
import { MetaScryApi } from "./fetching/scrier";
import { MetaScryPluginSettings } from "./settings";

/**
 * Interface for the plugin itself
 */
export type MetaScryPluginApi = {

  /**
   * Get the current instance of the MetaScryApi object.
   *
   * @alias {@link MetaScryPluginApi.api}
   * @alias {@link global#scry}
   * @alias {@link global#meta}
   * @alias {@link MetaScry.Api}
   */
  get Api(): MetaScryApi;

  /**
   * Get the current instance of the MetaScryApi object.
   *
   * @alias {@link MetaScryPluginApi.Api}
   * @alias {@link global#scry}
   * @alias {@link global#meta}
   * @alias {@link MetaScry.Api}
   */
  get api(): MetaScryApi;

  /**
   * The key for this plugin.
   */
  get key(): string;

  /**
   * The settings for the api.
   * Call updateSettings if you want to update this
   */
  get settings(): MetaScryPluginSettings;

  /**
   * Call after updating the settings object to re-load the api
   */
  updateSettings(newSettings: MetaScryPluginSettings): void;

  /**
   * Get a global value if it exists.
   *
   * @param key
   *
   * @alias {@link MetaScryApi.globals}
   *
   * @see {@link tryToSetExtraGlobal}
   */
  tryToGetExtraGlobal(key: string): any | undefined;

  /**
   * Set a global value (or remove it)
   *
   * @param key
   * @param setValue (optional) the value to set. Will remove the value if nothing is passed in.
   *
   * @alias {@link MetaScryApi.globals}
   *
   * @see {@link tryToGetExtraGlobal}
   */
  tryToSetExtraGlobal(key: string, setValue?: any): boolean;
} & Plugin;

/**
 * Internalish Extension to the App with the plugins because it's missing for some reason
 * 
 * @internal
 */
export type AppWithPlugins = {
    plugins: {
      enabledPlugins: Set<string>;
      disablePlugin(key: string): void;
      plugins: {
        [Keys.MetadataScrierPluginKey]?: MetaScryPluginApi;
        [Keys.ReactComponentsPluginKey]?: Plugin;
        // TODO: remove this plugin field when all of these are moved to npm packages:      
        [Keys.MetaBindWithApiPluginKey]?: MetaBindPlugin;
        // TODO: remove this plugin field when all of these are moved to npm packages:      
        [Keys.CopyToHtmlPluginKey]?: CopyToHtmlPlugin;
      };
    };
  } & App;
