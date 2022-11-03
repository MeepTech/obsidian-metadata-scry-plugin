import { App, PluginSettingTab, Setting } from 'obsidian';
import { MetadataApiSettings, MetadataPlugin, SplayKebabCasePropertiesOption } from './api';

export const DefaultSettings: MetadataApiSettings = {
  globalCacheName: 'cache',
  globalMetadataApiName: 'meta',
  globalPathName: "path",
  defineObjectPropertyHelperFunctions: true,
  splayKebabCaseProperties: SplayKebabCasePropertiesOption.LowerAndCamelCase,
  splayFrontmatterWithoutDataview: true,
  prototypesPath: "_/_assets/_data/_prototypes",
  valuesPath: "_/_assets/_data/_values"
}

/**
 * Settings for the plugin
 */
export class MetadataApiSettingTab extends PluginSettingTab {
  plugin: MetadataPlugin;

  constructor(app: App, plugin: MetadataPlugin) {
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
      .setName('Global Path Variable Name')
      .setDesc('The name to use for the path global helper function registered by this plugin')
      .addText(text => text
        .setPlaceholder('path')
        .setValue(this.plugin.settings.globalPathName)
        .onChange(async (value) => {
          this.plugin.settings.globalPathName = value;
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
          Object.entries(SplayKebabCasePropertiesOption).map(([key, value]) => [key.toString(), value.toString()]))
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
