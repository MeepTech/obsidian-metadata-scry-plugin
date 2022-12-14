import { DataAdapter, DataWriteOptions, EventRef } from "obsidian";
import { IsArray, IsObject, IsString } from "../../../src/utilities";
import App from "./app";
import TFile, { TAbstractFile } from "./file";
import TFolder from "./folder";

export const EMPTY = false;
export const FOLDER = []
export const FILE = true;
export const ITEMS = {
  EMPTY,
  FILE,
  FOLDER
}

export interface FileSystemShape extends Array<FileSystemShape | boolean | [] | string> {}

/**
 * A mock of the Vault class for testing.
 */
export default class Vault {
  app: App;
  adapter: DataAdapter;
  configDir: string;

  /**
   * Make a file system and mock vault.
   *
   * @param fileSystemShape The shape of the file system to make.
   * 
   * @returns the root of the file system, the vault, and all of the generated files and folders by name. 
   */
  public static Mock(fileSystemShape: FileSystemShape): { root: TFolder, files: Record<string, TFile>, folders: Record<string, TFolder>, vault: Vault } {
    const vault = new Vault();
    (vault as any).app = app;

    const result = {
      ...vault._buildFolder(fileSystemShape, TFolder.MockRoot()),
      vault
    };

    app.vault = result.vault as any;
    (app.vault as any).__test__filesystem = result.root.children;

    return result;
  }

  private _buildFolder(
    fileSystemShape: FileSystemShape,
    container: TFolder,
    containerIndexPath: string = "",
    files: Record<string, TFile> = {},
    folders: Record<string, TFolder> = {}
  ) : {
    root: TFolder,
    files: Record<string, TFile>,
    folders: Record<string, TFolder>
  } {
    var childIndex = 0;
    for (const shape of fileSystemShape) {
      let item: TAbstractFile;
      const currentIndexPath = container.isRoot()
        ? childIndex ? childIndex.toString() : ""
        : containerIndexPath + "_" + childIndex.toString();

      let itemName: string;
      if (IsArray(shape)) {
        itemName = "folder" + currentIndexPath;
        var childFolder = container.setMockedChild(
          TFolder.Mock(itemName)
        );

        if (!!shape.length) {
          childFolder = this._buildFolder(
            shape,
            childFolder,
            currentIndexPath,
            files,
            folders
          ).root;
        }

        folders[itemName] = childFolder;
        item = childFolder;
      } else {
        itemName = "file" + currentIndexPath;
        var file = TFile.Mock(IsString(shape) ? shape : (itemName + ".md"), container);
        file = container.setMockedChild(file);

        files[itemName] = file;
        item = file;
      }

      childIndex++;
    }

    return { root: container, files, folders }
  };

  getAbstractFileByPath(path: string) {
    const vault: (Vault & { __test__filesystem?: Record<string, TAbstractFile> })
      = (app as any as App).vault;

    if (!vault.__test__filesystem) {
      return null;
    }

    const pathParts = path.split("/");
    let currentItem: TAbstractFile | undefined
    let currentRoot: Record<string, TAbstractFile> | TFolder = vault.__test__filesystem;
    for (const part of pathParts) {
      if ((currentRoot as TFolder)?.children) {
        currentItem = (currentRoot as any as TFolder)!.children.find(f => f.name === part);
      } else if (IsArray(currentRoot)) {
        currentItem = (currentRoot as Array<TAbstractFile>).find(f => f.name === part);
      } else if (IsObject(currentRoot)) {
        currentItem = (currentRoot as Record<string, TAbstractFile>)[part];
      }

      if (!currentItem) {
        return null;
      }

      if ((currentItem as TFolder)?.children) {
        currentRoot = currentItem as TFolder;
      }
    }

    return currentItem ?? null;
  }

  cachedRead(file: TFile) {
    const vault: Vault & { __test__fileContents?: Record<string, TAbstractFile> }
      = (app as any as App).vault;

    if (!vault.__test__fileContents) {
      return null;
    }
    return Promise.resolve(
      vault.__test__fileContents
        ? vault.__test__fileContents[file.path]
        : ""
    );
  }

  getName(): string {
    throw new Error("Mock method not implemented.");
  }
  getRoot(): TFolder {
    throw new Error("Mock method not implemented.");
  }
  create(path: string, data: string, options?: DataWriteOptions | undefined): Promise<TFile> {
    throw new Error("Mock method not implemented.");
  }
  createBinary(path: string, data: ArrayBuffer, options?: DataWriteOptions | undefined): Promise<TFile> {
    throw new Error("Mock method not implemented.");
  }
  createFolder(path: string): Promise<void> {
    throw new Error("Mock method not implemented.");
  }
  read(file: TFile): Promise<string> {
    throw new Error("Mock method not implemented.");
  }
  readBinary(file: TFile): Promise<ArrayBuffer> {
    throw new Error("Mock method not implemented.");
  }
  getResourcePath(file: TFile): string {
    throw new Error("Mock method not implemented.");
  }
  delete(file: TAbstractFile, force?: boolean | undefined): Promise<void> {
    throw new Error("Mock method not implemented.");
  }
  trash(file: TAbstractFile, system: boolean): Promise<void> {
    throw new Error("Mock method not implemented.");
  }
  rename(file: TAbstractFile, newPath: string): Promise<void> {
    throw new Error("Mock method not implemented.");
  }
  modify(file: TFile, data: string, options?: DataWriteOptions | undefined): Promise<void> {
    throw new Error("Mock method not implemented.");
  }
  modifyBinary(file: TFile, data: ArrayBuffer, options?: DataWriteOptions | undefined): Promise<void> {
    throw new Error("Mock method not implemented.");
  }
  append(file: TFile, data: string, options?: DataWriteOptions | undefined): Promise<void> {
    throw new Error("Mock method not implemented.");
  }
  copy(file: TFile, newPath: string): Promise<TFile> {
    throw new Error("Mock method not implemented.");
  }
  getAllLoadedFiles(): TAbstractFile[] {
    throw new Error("Mock method not implemented.");
  }
  getMarkdownFiles(): TFile[] {
    throw new Error("Mock method not implemented.");
  }
  getFiles(): TFile[] {
    throw new Error("Mock method not implemented.");
  }
  on(name: "create", callback: (file: TAbstractFile) => any, ctx?: any): EventRef;
  on(name: "modify", callback: (file: TAbstractFile) => any, ctx?: any): EventRef;
  on(name: "delete", callback: (file: TAbstractFile) => any, ctx?: any): EventRef;
  on(name: "rename", callback: (file: TAbstractFile, oldPath: string) => any, ctx?: any): EventRef;
  on(name: "closed", callback: () => any, ctx?: any): EventRef;
  on(name: unknown, callback: unknown, ctx?: unknown): import("obsidian").EventRef {
    throw new Error("Mock method not implemented.");
  }
  off(name: string, callback: (...data: any) => any): void {
    throw new Error("Mock method not implemented.");
  }
  offref(ref: EventRef): void {
    throw new Error("Mock method not implemented.");
  }
  trigger(name: string, ...data: any[]): void {
    throw new Error("Mock method not implemented.");
  }
  tryTrigger(evt: EventRef, args: any[]): void {
    throw new Error("Mock method not implemented.");
  }
}