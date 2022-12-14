import {
  FileManager,
  Keymap,
  Scope,
  UserEvent,
  Workspace
} from "obsidian";
import { AppWithPlugins, MetaScryPluginApi } from "../../../src/types/plugin";
import CopyToHtmlPlugin from "../plugins/copy-as-html";
import { Keys } from "../../../src/constants";
import Vault from "./vault";
import MetadataCache from "./metadata-cache";

/**
  * Mock of the global 'app' object from obsidian.
  */
export default class App {
  plugins: {
    enabledPlugins: Set<string>;
    disablePlugin(key: string): void;
    plugins: {
      [Keys.MetadataScrierPluginKey]?: MetaScryPluginApi;
      [Keys.CopyToHtmlPluginKey]?: CopyToHtmlPlugin;
    };
  };
  keymap: Keymap;
  scope: Scope;
  workspace: Workspace;
  vault: Vault;
  metadataCache: MetadataCache;
  fileManager: FileManager;
  lastEvent: UserEvent | null;

  public static Mock(): App {

    // app base
    const app: App = {
      plugins: { plugins: {} },
      vault: new Vault(),
      workspace: {} as any as Workspace,
      metadataCache: new MetadataCache(),
      fileManager: {} as any as FileManager
    } as App;
      
    // parent values:
    app.vault.app = app;
    app.metadataCache.app = app;
    /** @ts-expect-error */
    app.workspace.app = app;
    /** @ts-expect-error */
    app.fileManager.app = app;

    // mocked plugin dependencies
    app.plugins.plugins[Keys.CopyToHtmlPluginKey] = new CopyToHtmlPlugin(app);

    return app;
  }

  public addAbstractFileToRootOfVault(fileOrFolder: any, onApp?: AppWithPlugins) {
    onApp ??= app as AppWithPlugins;
    const vault: Vault & { __test__filesystem?: Record<string, any>; } = onApp.vault as any as Vault;

    vault.__test__filesystem ??= {};
    vault.__test__filesystem[fileOrFolder.path] = fileOrFolder;
  }

  public removeAbstractFileFromRootOfVault(fileOrFolder: any, onApp?: AppWithPlugins) {
    onApp ??= app as AppWithPlugins;
    const vault: Vault & { __test__filesystem?: Record<string, any>; } = onApp.vault as any as Vault;

    if (!vault.__test__filesystem) {
      return;
    }

    delete vault.__test__filesystem[fileOrFolder.path];;
  }
}