import { describe, test, expect } from '@jest/globals';
import { CachedFileMetadata, DataFetcherSettings, NotesSource, ScryResults } from 'src/lib';
import { ClearFileMatter, ClearVaultFolders, Instance, MakeFolder, SetFileMatter, SetVaultFolders } from 'tests/helpers/dummies';

export default () =>
  describe("*Obsidian File Metadata Cache Fetching Methods", () => {
    // setup
    // - mocks
    const testFolderInVaultRoot = MakeFolder("test", ["file1.md", "file2.md"]);
    SetVaultFolders(testFolderInVaultRoot);
    const file1Path = testFolderInVaultRoot.children[0].path;
    const file2 = testFolderInVaultRoot.children[0];
    SetFileMatter(file1Path, { test_value_1: "one", ['test-value-2']: "two" });

    // - test generator methods
    const tests_ForOmfcReturn = (method: (source: NotesSource, options?: DataFetcherSettings)
      => ScryResults<CachedFileMetadata>) => {
      describe("=> CachedFileMetadata", () => {
        describe("(source: NoteSource)", () => {
          test("succesfully found the file's metadata", () => {
            // logic
            const result = method(file1Path);

            // validation
            expect(result).toBeInstanceOf(Object);
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result?.frontmatter).toBeInstanceOf(Object);
            expect(result?.frontmatter).not.toBeNull();
            expect(result?.frontmatter).not.toBeUndefined();
          });
          test("succesfully found no metadata for file", () => {
            // logic
            const result = method(file2)

            // validation
            expect(result).toBeInstanceOf(Object);
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result?.frontmatter).toBeUndefined();
          });
          test("Successfully returned undefined for File not found", () => {
            // logic
            const result = method("test/a.md");

            // validation
            expect(result).toBeUndefined();
          });
        });
      });
    };
    
    // tests
    describe("omfc()", () => {
      tests_ForOmfcReturn(Instance.Api.omfc);
    });
    describe("obsidianMetadataFileCache()", () => {
      tests_ForOmfcReturn(Instance.Api.obsidianMetadataFileCache);
    });


    // cleanup
    ClearFileMatter(file1Path);
    ClearVaultFolders(testFolderInVaultRoot.path);
  });