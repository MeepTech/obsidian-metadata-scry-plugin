import { describe, test, expect, afterAll, beforeAll } from '@jest/globals';
import {
  DataFetcherSettings,
  DataviewMatter,
  Frontmatter,
  GetInstance,
  Keys,
  Metadata,
  MetadataSources,
  NotesSource,
  ScryResults
} from '../../../../../src/lib';
import Vault, { FILE } from '../../../../mocks/app-api/vault';

describe("*Note Frontmatter Fetching Methods", () => {
  // mocks
  const {
    folders: {
      folder
    },
    files: {
      file_0, file_1, file_2
    }
  } = Vault.Mock([
    [FILE, FILE, FILE]
  ])

  const Instance = GetInstance();

  // setup
  beforeAll(() => {
    file_0.setMatter({ test_value_1: "one", ['test-value-2']: "two", ['test value other']: "other" });
    file_1.setMatter({ testValue3: "#3", ['test-valuE 4']: "for" });
    file_0.setContents("[test-inline::inline-data]");
  });

  // tests
  describe.each([
    ["frontmatter", Instance.Api.frontmatter],
    ["fm", Instance.Api.fm],
    ["matter", Instance.Api.matter],
  ])(
    "frontmatter function alias: %s()",
    (name: string, method: (source: NotesSource, options?: DataFetcherSettings)
      => ScryResults<Frontmatter>) => {
      describe("=> Frontmatter", () => {
        describe("(source: NoteSource)", () => {
          test("succesfully found the file's frontmatter", () => {
            // logic
            const result = method(file_0.path);

            // validation
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result).toBeInstanceOf(Object);
          });
          test("succesfully found the file's frontmatter values via splayed keys", () => {
            // logic
            const result = method(file_0.path) as Frontmatter;
            const result_1 = method(file_1.path) as Frontmatter;

            // validation
            expect(result!.test_value_1).toStrictEqual("one");
            expect(result!.testvalue2).toStrictEqual("two");
            expect(result!["test-value-1"]).toStrictEqual("one");
            expect(result!.testValue2).toStrictEqual("two");
            expect(result!["test value other"]).toStrictEqual("other");
            expect(result!.testValueOther).toStrictEqual("other");
            expect(result_1!.testValue4).toStrictEqual("for");
            expect(result_1!["test-valuE 4"]).toStrictEqual("for");
            expect(result_1!.testvalue4).toStrictEqual("for");
          });
          test("succesfully found no frontmatter for file with none", () => {
            // logic
            const result = method(file_2)

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
              const result = method(folder.path);

              // validation
              expect(result).toBeInstanceOf(Object);
              expect(result).not.toBeNull();
              expect(result!.keys).toHaveLength(3);
              expect(result!.hasOwnProperty(file_0.path)).toBeTruthy();
              expect(result!.hasOwnProperty(file_1.path)).toBeTruthy();
              expect(result!.hasOwnProperty(file_2.path)).toBeTruthy();
              expect(result![file_0.path]).toHaveProperty("test_value_1");
              expect(result![file_1.path]).toHaveProperty("testvalue4");
              expect(result![file_2.path]).toBeUndefined();
            });
          });
        });
      });
    });

  // cleanup
  afterAll(() => {
    file_0.clearMatter();
    file_1.clearMatter();
    file_0.clearContents();
    folder.removeThisMockFromVault();
  });
});