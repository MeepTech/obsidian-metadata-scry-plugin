import {
  App,
  PluginSettingTab,
  Setting
} from 'obsidian';
import {
  MetaScryPluginApi,
  SplayKebabCasePropertiesOption
} from './api';
import { DefaultPluginSettings } from './constants';

/**
 * Settings for the plugin
 */
export class MetadataScrierPluginSettingTab extends PluginSettingTab {
  plugin: MetaScryPluginApi;

  constructor(app: App, plugin: MetaScryPluginApi) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Medatata Api Settings' });

    new Setting(containerEl)
      .setName('MetaScryApi Custom Global Variable Name')
      .setDesc('The variable name to use for the MetaScryApi in a global scope.  If left empty; the variable will not be registered. (Mirror for "scry" global variable, just with a custom name if you want)')
      .addText(text => text
        .setPlaceholder(DefaultPluginSettings.globalMetaScryExtraNames)
        .setValue(this.plugin.settings.globalMetaScryExtraNames)
        .onChange(async (value) => {
          await this.plugin.updateSettings({
            ...this.plugin.settings,
            globalMetaScryExtraNames: value
          });
        }));

    new Setting(containerEl)
      .setName('Global Cache Variable Name')
      .setDesc('The variable name to use for the cache global scope variable registered by this plugin. If left empty; the variable will not be registered.')
      .addText(text => text
        .setPlaceholder(DefaultPluginSettings.globalCacheNames)
        .setValue(this.plugin.settings.globalCacheNames)
        .onChange(async (value) => {
          await this.plugin.updateSettings({
            ...this.plugin.settings,
            globalCacheNames: value
          });
        }));

    new Setting(containerEl)
      .setName('Global Path Variable Name')
      .setDesc('The name to use for the path global helper function registered by this plugin. If left empty; the variable will not be registered.')
      .addText(text => text
        .setPlaceholder('path')
        .setValue(DefaultPluginSettings.globalPathFunctionNames)
        .onChange(async (value) => {
          await this.plugin.updateSettings({
            ...this.plugin.settings,
            globalPathFunctionNames: value
          });
        }));
    
    new Setting(containerEl)
    .setName('Add Global Scry and scry variables.')
    .setDesc('Adds the scry variable to access MetaScryApi globally and the Scry variable to access MetaScryPluginApi and built in components globally')
    .addToggle(toggle => toggle
      .setValue(this.plugin.settings.defineScryGlobalVariables)
      .onChange(async (value) => {
        await this.plugin.updateSettings({
          ...this.plugin.settings,
          defineScryGlobalVariables: value
        });
      }));

    new Setting(containerEl)
    .setName('Add Array Helper Functions.')
    .setDesc('Adds the functions aggregateby, indexBy, etc to all arrays for data management.')
    .addToggle(toggle => toggle
      .setValue(this.plugin.settings.defineArrayHelperFunctions)
      .onChange(async (value) => {
        await this.plugin.updateSettings({
          ...this.plugin.settings,
          defineArrayHelperFunctions: value
        });
      }));
  
    new Setting(containerEl)
      .setName('Add Object Property Helper Functions.')
      .setDesc('Adds the function hasProp, getProp, and setProp to all objects for deep property access.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.defineObjectPropertyHelperFunctions)
        .onChange(async (value) => {
          await this.plugin.updateSettings({
            ...this.plugin.settings,
            defineObjectPropertyHelperFunctions: value
          });
        }));

    new Setting(containerEl)
      .setName('Splay Kebab-Case Properties.')
      .setDesc('This option adds copies of any kebab-case properties with the desired naming schemes. This is similar to how a lowercase version of values with uppercase letters are provided in dataview.')
      .addDropdown(toggle => toggle
        .setValue(this.plugin.settings.splayKebabCaseProperties.toString())
        .addOptions(Object.fromEntries(
          Object.entries(SplayKebabCasePropertiesOption).map(([key, value]) => [key.toString(), value.toString()]))
        )
        .onChange(async (value) => {
          await this.plugin.updateSettings({
            ...this.plugin.settings,
            splayKebabCaseProperties: (<any>SplayKebabCasePropertiesOption)[parseInt(value)]
          });
        }));

    new Setting(containerEl)
      .setName('Splay Frontmatter Properties to Lower Case even without Dataview.')
      .setDesc('Dataview splays property keys with uppercase values to lowercase, creating two keys. If this is true, Metadata Api will add this functionality to the base Frontmatter calls, even without Dataview sources included.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.splayFrontmatterWithoutDataview)
        .onChange(async (value) => {
          await this.plugin.updateSettings({
            ...this.plugin.settings,
            splayFrontmatterWithoutDataview: value
          });
        }));

    new Setting(containerEl)
      .setName('Prototypes File Path')
      .setDesc('The path to prototype data storage')
      .addText(text => text
        .setPlaceholder(DefaultPluginSettings.prototypesPath)
        .setValue(this.plugin.settings.prototypesPath)
        .onChange(async (value) => {
          await this.plugin.updateSettings({
            ...this.plugin.settings,
            prototypesPath: value
          });
        }));

    new Setting(containerEl)
      .setName('Data Storage Values Path')
      .setDesc('The path to the value data storage')
      .addText(text => text
        .setPlaceholder(DefaultPluginSettings.valuesPath)
        .setValue(this.plugin.settings.valuesPath)
        .onChange(async (value) => {
          await this.plugin.updateSettings({
            ...this.plugin.settings,
            valuesPath: value
          });
        }));
  }
}
