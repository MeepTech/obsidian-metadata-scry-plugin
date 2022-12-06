import { expect, describe, test } from '@jest/globals';
import { TAbstractFile, TFile, TFolder } from "obsidian";
import { NotesSource, PromisedScryResults } from 'src/lib';
import { ClearVaultFolders, SetVaultFolders, Instance, MakeFolder, SetFileContents, ClearFileContents } from "tests/helpers/dummies";

export default () =>
  describe("*File System Data Fetching Methods", () => {
    // setup
    // - mocks
    const testFolderInVaultRoot = MakeFolder("test", ["file1.md", "file2.md"]);
    const testFolderInVaultRoot_1_2 = MakeFolder("test_1", ["test_3.md", "fileX.md"]);
    const testFolderInVaultRoot_1 = MakeFolder("test_0", ["test_1.md", "fileX.md", testFolderInVaultRoot_1_2]);
    const testFolderNotInVaultRoot = MakeFolder("test_2", ["file3.md", "file4.md"]);
    SetVaultFolders([testFolderInVaultRoot, testFolderInVaultRoot_1]);

    // - test validation methods
    const validateFolderFromVault = (folder: TFolder) => {
      expect(folder).toBeInstanceOf(TFolder);
      expect(folder.path).toEqual("test");
      expect(folder.children.length).toEqual(2);
      expect((folder.children[0] as TFile).basename).toEqual("file1");
      expect((folder.children[1] as TFile).name).toEqual("file2.md");
    }
    const validateFileFromValut = (file: TFile) => {
      expect(file).toBeInstanceOf(TFile);
      expect(file.name).toEqual("file1.md");
      expect(file.path).toEqual("test/file1.md");
    }

    // - test generation methods
    const testForTFolderReturn = (method: (source: NotesSource) => TFile | TFolder | undefined | TAbstractFile) => {
      describe("=> TFolder", () => {
        describe("(source: string)", () => {
          test("succesfully found the folder", () => {
            // logic
            const folder: TFolder = method("test") as TFolder;

            // validation
            validateFolderFromVault(folder);
          });
          test("unsuccesfully found the folder", () => {
            // logic
            const folder: TFolder = method("not_test") as TFolder;

            // validation
            expect(folder).toBeInstanceOf(undefined);
          });
          test("succesfully found the folder instead of file without extension", () => {
            // logic
            const file: TAbstractFile = method("test_0/test_1") as TAbstractFile;

            // validation
            expect(file).toBeInstanceOf(TFolder);
            expect(file.name).toEqual("test_1");
            expect(file.path).toEqual("test_0/test_1");
          });
        });
        describe("(source: TFolder)", () => {
          test("succesfully found the folder", () => {
            // logic
            const folder: TFolder = method(testFolderInVaultRoot) as TFolder;

            // validation
            validateFolderFromVault(folder);
          });
          test("unsuccesfully found the folder", () => {
            // logic
            const folder: TFolder = method(testFolderNotInVaultRoot) as TFolder;

            // validation
            expect(folder).toBeInstanceOf(undefined);
          });
        });
      });
    }
    const testForTFileReturn = (method: (source: NotesSource) => TFile | TFolder | undefined | TAbstractFile) => {
      describe("=> TFile", () => {
        describe("(source: string)", () => {
          test("succesfully found the file without extension", () => {
            // logic
            const file: TFile = method("test/file1") as TFile;

            // validation
            validateFileFromValut(file);
          });
          test("succesfully found the file with extension", () => {
            // logic
            const file: TFile = method("test/file1.md") as TFile;

            // validation
            validateFileFromValut(file);
          });
          test("unsuccesfully found the folder", () => {
            // logic
            const file: TFile = method("not_test/file1.md") as TFile;

            // validation
            expect(file).toBeInstanceOf(undefined);
          });
          test("unsuccesfully found the file", () => {
            // logic
            const file: TFile = method("test/testA.md") as TFile;

            // validation
            expect(file).toBeInstanceOf(undefined);
          });
          test("succesfully found the file with matching folder name using extension", () => {
            // logic
            const file: TFile = method("test_0/test_1.md") as TFile;

            // validation
            expect(file).toBeInstanceOf(TFile);
            expect(file.name).toEqual("test_1.md");
            expect(file.path).toEqual("test_0/file1.md");
          });
        });
        describe("(source: TFile)", () => {
          test("succesfully found the file", () => {
            // logic
            const file: TFile = method(testFolderInVaultRoot.children[0]) as TFile;

            // validation
            validateFileFromValut(file);
          });

          test("unsuccesfully found the file", () => {
            // logic
            const file: TFile = method(testFolderNotInVaultRoot.children[0]) as TFile;

            // validation
            expect(file).toBeInstanceOf(undefined);
          });
        });
      });
    }

    // tests
    describe("vault()", () => {
      testForTFolderReturn(Instance.Api.vault);
      testForTFileReturn(Instance.Api.vault);
    });
    describe("file()", () => {
      testForTFileReturn(Instance.Api.file);
    });
    describe("folder()", () => {
      testForTFolderReturn(Instance.Api.folder);
    });

    //cleanup
    ClearVaultFolders();
  });