import {
  PluginManifest,
  Command,
  PluginSettingTab,
  ViewCreator,
  MarkdownPostProcessor,
  MarkdownPostProcessorContext,
  ObsidianProtocolHandler,
  EditorSuggest,
  Component,
  EventRef,
  KeymapEventHandler
} from "obsidian";
import { DefaultPluginSettings } from "../../../src/constants";
import { MetaScryApi } from "../../../src/types/fetching/scrier";
import { MetaScryPluginSettings } from "../../../src/types/settings";
import App from "../app-api/app";

/**
 * A mock meta-scry plugin for obsidian.
 */
export default class MetaScryPlugin {
  private _settings: MetaScryPluginSettings;
  public api: MetaScryApi;
  public app: App;
  public manifest: PluginManifest;

  get Api(): MetaScryApi {
    return this.api;
  }

  public get settings(): MetaScryPluginSettings {
    return this._settings;
  }

  get key(): string {
    return "meta-scry";
  }

  public static Mock(): MetaScryPlugin {
    const plugin: MetaScryPlugin = new MetaScryPlugin();
    plugin._settings = DefaultPluginSettings;

    return plugin;
  }

  public init(onApp?: App): MetaScryPlugin {
    onApp ??= app as any as App;
    this.app = onApp;
    onApp.plugins.plugins["meta-scry"] = this as any;

    return this;
  }

  // #region Not Ipmelemented:

  updateSettings(newSettings: MetaScryPluginSettings): void {
    this._settings = newSettings;
  }

  tryToGetExtraGlobal(key: string) {
    throw new Error("Mock method not implemented.");
  }

  tryToSetExtraGlobal(key: string, setValue?: any): boolean {
    throw new Error("Mock method not implemented.");
  }

  //#region Obsidian.Plugin methods

  addRibbonIcon(icon: string, title: string, callback: (evt: MouseEvent) => any): HTMLElement {
    throw new Error("Mock method not implemented.");
  }
  addStatusBarItem(): HTMLElement {
    throw new Error("Mock method not implemented.");
  }
  addCommand(command: Command): Command {
    throw new Error("Mock method not implemented.");
  }
  addSettingTab(settingTab: PluginSettingTab): void {
    throw new Error("Mock method not implemented.");
  }
  registerView(type: string, viewCreator: ViewCreator): void {
    throw new Error("Mock method not implemented.");
  }
  registerExtensions(extensions: string[], viewType: string): void {
    throw new Error("Mock method not implemented.");
  }
  registerMarkdownPostProcessor(postProcessor: MarkdownPostProcessor, sortOrder?: number | undefined): MarkdownPostProcessor {
    throw new Error("Mock method not implemented.");
  }
  registerMarkdownCodeBlockProcessor(language: string, handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => void | Promise<any>, sortOrder?: number | undefined): MarkdownPostProcessor {
    throw new Error("Mock method not implemented.");
  }
  registerCodeMirror(callback: (cm: any) => any): void {
    throw new Error("Mock method not implemented.");
  }
  registerEditorExtension(extension: any): void {
    throw new Error("Mock method not implemented.");
  }
  registerObsidianProtocolHandler(action: string, handler: ObsidianProtocolHandler): void {
    throw new Error("Mock method not implemented.");
  }
  registerEditorSuggest(editorSuggest: EditorSuggest<any>): void {
    throw new Error("Mock method not implemented.");
  }
  loadData(): Promise<any> {
    throw new Error("Mock method not implemented.");
  }
  saveData(data: any): Promise<void> {
    throw new Error("Mock method not implemented.");
  }
  load(): void {
    throw new Error("Mock method not implemented.");
  }
  onload(): void {
    throw new Error("Mock method not implemented.");
  }
  unload(): void {
    throw new Error("Mock method not implemented.");
  }
  onunload(): void {
    throw new Error("Mock method not implemented.");
  }
  addChild<T extends Component>(component: T): T {
    throw new Error("Mock method not implemented.");
  }
  removeChild<T extends Component>(component: T): T {
    throw new Error("Mock method not implemented.");
  }
  register(cb: () => any): void {
    throw new Error("Mock method not implemented.");
  }
  registerEvent(eventRef: EventRef): void {
    throw new Error("Mock method not implemented.");
  }
  registerDomEvent<K extends keyof WindowEventMap>(el: Window, type: K, callback: (this: HTMLElement, ev: WindowEventMap[K]) =>
    any, options?: boolean | AddEventListenerOptions | undefined): void;
  registerDomEvent<K extends keyof DocumentEventMap>(el: Document, type: K, callback: (this: HTMLElement, ev: DocumentEventMap[K]) =>
    any, options?: boolean | AddEventListenerOptions | undefined): void;
  registerDomEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) =>
    any, options?: boolean | AddEventListenerOptions | undefined): void;
  registerDomEvent(el: unknown, type: unknown, callback: unknown, options?: unknown): void {
    throw new Error("Mock method not implemented.");
  }
  registerScopeEvent(keyHandler: KeymapEventHandler): void {
    throw new Error("Mock method not implemented.");
  }
  registerInterval(id: number): number {
    throw new Error("Mock method not implemented.");
  }

  //#endregion

  //#endregion
}
