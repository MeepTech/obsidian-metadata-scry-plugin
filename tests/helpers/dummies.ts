import { FileManager, MetadataCache, PluginManifest, TAbstractFile, TFile, TFolder, Vault, Workspace } from "obsidian";
import { DefaultPluginSettings } from "src/constants";
import { CachedFileMetadata, GetInstance, IsArray } from "src/lib";
import MetadataScrierPlugin from "src/plugin";
import { AppWithPlugins } from "src/types/plugin";

export const Instance = GetInstance();
export const plugin: MetadataScrierPlugin = MakePlugin();
export const app: AppWithPlugins = MakeApp();

function MakeApp() {
  const app: AppWithPlugins = {
    plugins: {} as any,
    vault: {
      getAbstractFileByPath: (path: string) => {
        const vault: Vault & { __test__filesystem?: Record<string, TAbstractFile>}
          = this;
        
        if (!vault.__test__filesystem) {
          return null;
        }

        let root: Record<string, TAbstractFile> | TFolder = vault.__test__filesystem;
        const pathParts = path.split("/");
        for (const part of pathParts) {
          let item: TAbstractFile | undefined
          if (root instanceof TFolder) {
            item = root.children.find(f => f.name === part);
          } else if (root instanceof Array<TAbstractFile>) {
            item = root[part];
          }

          if (item instanceof TFile) {
            return item;
          } else if (item instanceof TFolder) {
            root = item;
          }
        }

        return null;
      },
      cachedRead: (file: TFile) =>
        Promise.resolve(this.__test__fileContents ? this.__test__fileContents[file.path] : "")
    } as any as Vault,
    workspace: {} as any as Workspace,
    metadataCache: {
      getFileCache: (file: TFile) => ({} as CachedFileMetadata)
    } as any as MetadataCache,

    fileManager: {} as any as FileManager
  } as AppWithPlugins;
  /** @ts-expect-error */
  app.vault.app = app;
  /** @ts-expect-error */
  app.workspace.app = app;
  /** @ts-expect-error */
  app.metadataCache.app = app;
  /** @ts-expect-error */
  app.fileManager.app = app;

  return app;
}

export function MakePlugin(): MetadataScrierPlugin {
  return new MetadataScrierPlugin(app, {} as PluginManifest);
}

export function InitPlugin(plugin?: MetadataScrierPlugin) {
  plugin ??= MakePlugin();

  /** @ts-expect-error */
  plugin._settings = DefaultPluginSettings;
  /** @ts-expect-error */
  plugin._initApi();
}

export function MakeFolder(path: string, files: Array<string | TFolder> = []): TFolder {
  const folderName: string = path.split('/').pop()!;
  const folder: TFolder = { name: folderName, path: path } as TFolder;
  folder.children = files.map(p => (typeof path === "string") ? MakeFile(path + "/" + p, folder) : path);

  return folder;
}

export function MakeFile(path: string, parent?: TFolder | undefined): TFile {
  const fileNameWithExtension: string = path.split('/').pop()!;
  const [fileName, extension] = fileNameWithExtension.split(".");
  return {
    vault: app.vault,
    path: path,
    name: fileNameWithExtension,
    parent: parent,
    stat: {},
    basename: fileName,
    extension: extension
  } as TFile;
}

export function SetVaultFolders(folders: Array<TAbstractFile> | TAbstractFile, onApp?: AppWithPlugins): void {
  onApp ??= app;
  const vault: Vault & { __test__filesystem?: Record<string, TAbstractFile>}
    = onApp.vault;

  vault.__test__filesystem ??= {};
  if (folders instanceof TAbstractFile) {
      vault.__test__filesystem[folders.path] = folders;
  } else {
    for (const file of folders) {
      vault.__test__filesystem[file.path] = file;
    }
  }
}

export function ClearVaultFolders(folderName?: string | Array<string>, onApp?: AppWithPlugins): void {
  onApp ??= app;
  const vault: Vault & { __test__filesystem?: Record<string, TAbstractFile> }
    = onApp.vault;
  
  if (folderName) {
    if (vault.__test__filesystem) {
      if (IsArray(folderName)) {
        for (const folder of (folderName as Array<string>)) {
          delete vault.__test__filesystem[folder as string];
        }
      } else {
        delete vault.__test__filesystem[folderName as string];
      }
    }
  } else {
    delete vault.__test__filesystem;
  }
}

export function SetFileContents(path: string, contents?: string, onApp?: AppWithPlugins) {
  onApp ??= app;
  const vault: Vault & { __test__fileContents?: Record<string, string>}
    = onApp.vault;

  if (contents !== undefined) {
    vault.__test__fileContents ??= { [path]: contents };
  } else {
    ClearFileContents(path, onApp);
  }
}

export function ClearFileContents(path?: string | Array<string>, onApp?: AppWithPlugins): void {
  onApp ??= app;
  const vault: Vault & { __test__fileContents?: Record<string, string> }
    = onApp.vault;
  
  if (vault.__test__fileContents) {
    if (path !== undefined) {
      if (IsArray(path)) {
        for (const file of (path as Array<string>)) {
            delete vault.__test__fileContents[file as string];
        }
      } else
        if (vault.__test__fileContents.hasOwnProperty(path as string)) {
          delete vault.__test__fileContents[path as string];
        }
      
      if (!Object.keys(vault.__test__fileContents).length) {
        delete vault.__test__fileContents;
      }
    } else {
      if ((vault as Object).hasOwnProperty("__test__fileContents")) {
        delete vault.__test__fileContents;
      }
    }
  }
}

export function SetFileMatter(path: string, matter?: Record<string, any>, onApp?: AppWithPlugins) {
  onApp ??= app;
  const vault: Vault & { __test__metadata?: Record<string, any>}
    = onApp.vault;

  if (matter !== undefined) {
    vault.__test__metadata ??= { [path]: matter };
  } else {
    ClearFileMatter(path, onApp);
  }
}

export function ClearFileMatter(path?: string | Array<string>, onApp?: AppWithPlugins): void {
  onApp ??= app;
  const vault: Vault & { __test__metadata?: Record<string, any> }
    = onApp.vault;
  
  if (vault.__test__metadata) {
    if (path !== undefined) {
      if (IsArray(path)) {
        for (const file of (path as Array<string>)) {
            delete vault.__test__metadata[file as string];
        }
      } else
        if (vault.__test__metadata.hasOwnProperty(path as string)) {
          delete vault.__test__metadata[path as string];
        }
      
      if (!Object.keys(vault.__test__metadata).length) {
        delete vault.__test__metadata;
      }
    } else {
      if ((vault as Object).hasOwnProperty("__test__metadata")) {
        delete vault.__test__metadata;
      }
    }
}