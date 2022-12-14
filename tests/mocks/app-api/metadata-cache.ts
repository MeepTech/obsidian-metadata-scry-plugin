import { CachedFileMetadata } from "../../../src/types/datas";
import App from "./app";
import TFile from "./file";


export default class MetadataCache {
  app: App;

  getFileCache(file: TFile): CachedFileMetadata | undefined {
    const metadataCache: MetadataCache & { __test__metadata?: Record<string, any> }
      = app.metadataCache as any;

    return {
      frontmatter: metadataCache.__test__metadata
        ? metadataCache.__test__metadata[file.path]
        : undefined,
      path: file.path
    };
  }
}