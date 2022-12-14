import { Metadata } from "../../../src/types/datas";
import { AppWithPlugins } from "../../../src/types/plugin";
import TFolder from "./folder";
import MetadataCache from "./metadata-cache";
import Vault from "./vault";

/**
 * A mock TAbstractFile class
 */
export abstract class TAbstractFile {
    vault: Vault;
    path: string;
    name: string;
    parent: TFolder;
}

/**
 * A mock file for obsidian
 */
export default class TFile extends TAbstractFile {
  stat: { ctime: number; mtime: number; size: number; };
  basename: string;
  extension: string;
  
  public static Mock(path: string, parent?: TFolder | undefined, vault?: Vault): TFile {
    const fileNameWithExtension: string = path.split('/').pop()!;
    const [fileName, extension] = fileNameWithExtension.split(".");

    const tfile = new TFile();
    tfile.vault = vault ?? app.vault as any;
    tfile.path = path;
    tfile.name = fileNameWithExtension;
    tfile.parent = parent!;
    tfile.stat = { ctime: 0, mtime: 0, size: 10 };
    tfile.basename = fileName;
    tfile.extension = extension;
    return tfile;
  }

  public addToVault = (onApp?: AppWithPlugins): void =>
     (app as any).addAbstractFileToRootOfVault(this, onApp);

  public removeFromVault = (onApp?: AppWithPlugins): void =>
    (app as any).removeAbstractFileFromRootOfVault(this, onApp);

  public setContents(contents?: string, onApp?: AppWithPlugins): void {
    onApp ??= app as AppWithPlugins;
    const vault: Vault & { __test__fileContents?: Record<string, string>; } = onApp.vault as any;

    if (contents !== undefined) {
      if (!vault.__test__fileContents) {
        vault.__test__fileContents = { [this.path]: contents };
      } else {
        vault.__test__fileContents[this.path] = contents;
      }
    } else {
      this.clearContents(onApp);
    }
  }

  public clearContents(onApp?: AppWithPlugins): void {
    onApp ??= app as AppWithPlugins;
    const vault: Vault & { __test__fileContents?: Record<string, string>; } = onApp.vault as any;

    if (vault.__test__fileContents) {
      if (vault.__test__fileContents.hasOwnProperty(this.path)) {
        delete vault.__test__fileContents[this.path];
      }

      if (!Object.keys(vault.__test__fileContents).length) {
        delete vault.__test__fileContents;
      }
    }
  }

  public setMatter(matter?: Metadata, onApp?: AppWithPlugins): void {
    onApp ??= app as AppWithPlugins;
    const cache: MetadataCache & { __test__metadata?: Record<string, Metadata>; }
      = onApp.metadataCache as any;

    if (matter !== undefined) {
      if (!cache.__test__metadata) {
        cache.__test__metadata = { [this.path]: matter };
      } else {
        cache.__test__metadata[this.path] = matter;
      }
    } else {
      this.clearMatter(onApp);
    }
  }

  clearMatter(onApp?: AppWithPlugins): void {
    onApp ??= app as AppWithPlugins;
    const cache: MetadataCache & { __test__metadata?: Record<string, Metadata>; }
      = onApp.metadataCache as any;

    if (cache.__test__metadata) {
      if (cache.__test__metadata.hasOwnProperty(this.path)) {
        delete cache.__test__metadata[this.path];
      }

      if (!Object.keys(cache.__test__metadata).length) {
        delete cache.__test__metadata;
      }
    }
  }
}
