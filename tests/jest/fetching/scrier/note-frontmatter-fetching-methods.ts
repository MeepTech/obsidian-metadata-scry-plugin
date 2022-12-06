import { describe, test, expect } from '@jest/globals';
import { CachedFileMetadata, DataFetcherSettings, DataviewMatter, Frontmatter, Keys, Metadata, MetadataSources, NotesSource, ScryResults } from 'src/lib';
import { MakeFolder, SetVaultFolders, SetFileMatter, Instance, ClearFileMatter, ClearVaultFolders } from 'tests/helpers/dummies';

export default () =>
  describe("*Note Frontmatter Fetching Methods", () => {
    // setup
    // - mocks
    const testFolderInVaultRoot = MakeFolder("test", ["file1.md", "file2.md"]);
    SetVaultFolders(testFolderInVaultRoot);
    const file1Path = testFolderInVaultRoot.children[0].path;
    const file2 = testFolderInVaultRoot.children[0];
    SetFileMatter(file1Path, { test_value_1: "one", ['test-value-2']: "two" });
    SetFileMatter(file2.path, { testValue3: "#3", ['test-valuE 4']: "for" });

    // - test generator methods
    const tests_ForFrontmatterReturn = (method: (source: NotesSource, options?: DataFetcherSettings)
      => ScryResults<Frontmatter>) => {
      describe("=> Frontmatter", () => {
        describe("(source: NoteSource)", () => {
          test("succesfully found the file's frontmatter", () => {
            // logic
            const result = method(file1Path);

            // validation
            expect(result).toBeInstanceOf(Object);
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result?.test_value_1).toStrictEqual("one");
            expect(result?.testvalue2).toStrictEqual("two");
          });
          test("succesfully found no frontmatter for file", () => {
            // logic
            const result = method(file2)

            // validation
            expect(result).toBeUndefined();
          });
          test("Successfully returned undefined for File not found", () => {
            // logic
            const result = method("test/a.md");

            // validation
            expect(result).toBeUndefined();
          });
        });
        describe("=> ScryResultsMap<Frontmatter>", () => {
          describe("(source: NoteSource)", () => {
            test("succesfully find multiple file's frontmatter, by folder", () => {
              // logic
              const result = method(file1Path);

              // validation
              expect(result).toBeInstanceOf(Object);
              expect(result).not.toBeNull();
              expect(Object.keys(result!)).toHaveLength(2);
              expect(result).toHaveProperty(file2.path);
              expect(result).toHaveProperty(file1Path);
              expect(result![file1Path]).toHaveProperty("test_value_1");
              expect(result![file2.path]).toHaveProperty("testvalue4");
              expect(result).toHaveProperty(file1Path);
              expect(result![file1Path]["test_value_1"]).toStrictEqual("one");
              expect(result![file2.path]["testvalue4"]).toStrictEqual("for");
            });
          });
        });
      });
    };
    const tests_ForDvMatterReturn = (method: (source: NotesSource, options?: DataFetcherSettings & { useSourceQuery?: boolean })
      => ScryResults<DataviewMatter>) => {
      describe("=> DataviewMatter", () => {
        describe("(source: NoteSource)", () => {
          test("succesfully found the file's frontmatter and other metadata via dv", () => {
            // logic
            const result = method(file1Path) as DataviewMatter;

            // validation
            expect(result).toBeInstanceOf(Object);
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result!.test_value_1).toStrictEqual("one");
            expect(result!.testvalue2).toStrictEqual("two");
            expect(result!.file.path).toStrictEqual(file1Path);
          });
          test("succesfully found no frontmatter for file", () => {
            // logic
            const result = method(file2) as DataviewMatter;

            // validation
            expect(result).toBeUndefined();
          });
          test("Successfully returned undefined for File not found", () => {
            // logic
            const result = method("test/a.md");

            // validation
            expect(result).toBeUndefined();
          });
        });
        describe("=> ScryResultsMap<DataviewMatter>", () => {
          describe("(source: string, options: {useSourceQuery: true})", () => {
            test("succesfully find multiple file's metadata using dv.pagePaths", () => {
              // logic
              // TODO: dummy the dvapi pagePaths method.
              const result = method("#test", {useSourceQuery: true});

              // validation
              expect(result).toBeInstanceOf(Object);
              expect(result).not.toBeNull();
              expect(Object.keys(result!)).toHaveLength(2);
              expect(result).toHaveProperty(file2.path);
              expect(result).toHaveProperty(file1Path);
              expect(result![file1Path]).toHaveProperty("test_value_1");
              expect(result![file2.path]).toHaveProperty("testvalue4");
              expect(result).toHaveProperty(file1Path);
              expect(result![file1Path]["test_value_1"]).toStrictEqual("one");
              expect(result![file2.path]["testvalue4"]).toStrictEqual("for");
            });
          });
        });
      });
    };
    const tests_ForGetReturn = (method: (
      source?: NotesSource | MetadataSources,
      sources?: MetadataSources | boolean,
      options?: DataFetcherSettings
    ) => ScryResults<Metadata>): void => {
      describe("=> Metadata", () => {
        describe("(source: NoteSource)", () => {
          test("Successfully got all metadata fields for default sources from a file", () => {
            const metadata: Metadata = method(file1Path) as Metadata;

            // validation
            expect(metadata).toBeInstanceOf(Object);
            expect(metadata).not.toBeNull();
            expect(metadata).not.toBeUndefined();
            expect(metadata).toHaveProperty("test_value_1");
            expect(metadata).toHaveProperty("testvalue2");
            expect(metadata?.test_value_1).toStrictEqual("one");
            expect(metadata?.testvalue2).toStrictEqual("two");
            expect(metadata).toHaveProperty(Keys.CacheMetadataPropertyCapitalizedKey);
            expect(metadata).toHaveProperty(Keys.CacheMetadataPropertyLowercaseKey);
            expect(metadata).toHaveProperty(Keys.FileMetadataPropertyLowercaseKey);
            expect(metadata).toHaveProperty(Keys.FileMetadataPropertyUppercaseKey);
            expect(metadata?.file?.path).toStrictEqual(file1Path);
            expect(metadata[Keys.FileMetadataPropertyLowercaseKey]).toHaveProperty(Keys.SectionsMetadataPropertyCapitalizedKey);
            expect(metadata[Keys.FileMetadataPropertyUppercaseKey]).toHaveProperty(Keys.SectionsMetadataPropertyCapitalizedKey);
            expect(metadata[Keys.FileMetadataPropertyLowercaseKey]).toHaveProperty(Keys.SectionsMetadataPropertyLowercaseKey);
            expect(metadata[Keys.FileMetadataPropertyUppercaseKey]).toHaveProperty(Keys.SectionsMetadataPropertyLowercaseKey);
          });
        });
      });
    }

    // tests
    describe("fm()", () => {
      tests_ForFrontmatterReturn(Instance.Api.fm);
    });
    describe("matter()", () => {
      tests_ForFrontmatterReturn(Instance.Api.matter);
    });
    describe("frontmatter()", () => {
      tests_ForFrontmatterReturn(Instance.Api.frontmatter);
    });
    describe("dvMatter()", () => {
      tests_ForDvMatterReturn(Instance.Api.dvMatter);
    });
    describe("dataviewFrontmatter()", () => {
      tests_ForDvMatterReturn(Instance.Api.dataviewFrontmatter);
    });

    // cleanup
    ClearFileMatter([file1Path, file2.path]);
    ClearVaultFolders(testFolderInVaultRoot.path);
  });