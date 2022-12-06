import { describe } from '@jest/globals';
import { CachedFileMetadata, NotesSource } from 'src/lib';
import { ScryResults } from 'src/types/datas';
import { DataFetcherSettings } from 'src/types/settings';

export default () =>
  describe("*Obsidian File Metadata Cache Fetching Methods", () => {
    // TODO: add these tests eventually, very low priority
    const testForTFolderReturn = (method: (source: NotesSource, options?: DataFetcherSettings)
      => ScryResults<CachedFileMetadata>) => {
      
      };
  });