import { AppWithPlugins } from "../../../src/types/plugin";
import App from "./app";
import TFile, {TAbstractFile} from "./file";
import Vault from "./vault";

/**
 * A mock of the TFolder class for testing.
 */
export default class TFolder extends TAbstractFile {
  children: TAbstractFile[] = [];
  
  isRoot(): boolean {
    return false;
  }

  static MockRoot(): TFolder {
    const mock = this.Mock("");
    mock.isRoot = () => true;

    return mock;
  }

  static Mock(path: string, files: Array<string | TFile | TFolder> | undefined = [], vault?: Vault): TFolder {
    const folder: TFolder = new TFolder();
    folder.name = path.split('/').pop()!;
    folder.path = path;
    folder.vault = vault ?? app.vault as any;

    folder.children = files?.map(p =>
      TFolder._setParentFolder(
        (typeof p === "string")
          ? TFile.Mock(p, folder)
          : p,
        folder
      )
    ) ?? [];

    return folder;
  }

  setMockedChild<TItem extends TAbstractFile>(item: TItem, index?: number): TItem {
    item = TFolder._setParentFolder(
      item as any as (TFile | TFolder),
      this
    ) as any as TItem

    if (index) {
      this.children[index] = item;
    } else {
      this.children.push(item);
    }

    return item;
  }

  file(key: string | number): TFile {
    if (typeof key === "string") {
      return (this.children.find(f => f.path === key)
        ?? this.children.find(f => f.name === key)
        ?? this.children.find(f => (f as TFile).basename === key)
      ) as TFile;
    } else {
      return this.children[key] as TFile;
    }
  }

  folder(key: string | number): TFolder {
    if (typeof key === "string") {
      return (this.children.find(f => f.path === key)
        ?? this.children.find(f => f.name === key)
      ) as TFolder;
    } else {
      return this.children[key] as TFolder;
    }
  }

  addToVaultAsMock = (onApp?: AppWithPlugins): void =>
    ((onApp ?? app as any) as App).addAbstractFileToRootOfVault(this, onApp);

  removeThisMockFromVault = (onApp?: AppWithPlugins): void =>
    ((onApp ?? app as any) as App).removeAbstractFileFromRootOfVault(this, onApp);

  private static _setParentFolder(child: TFolder | TFile, parent: TFolder): TFolder | TFile {
    child.parent = parent;
    child.path = (parent.path ? (parent.path + "/") : "") + child.path;

    if (require("../../../src/utilities").IsTFile(child)) {
      return child;
    }

    for (const item of (child as TFolder).children) {
      if ((item as object)?.hasOwnProperty("children")) {
        TFolder._setParentFolder(item as TFolder, (child as TFolder));
      } else {
        item.path = parent.path + "/" + item.path;
      }
    }

    return child;
  }
}
