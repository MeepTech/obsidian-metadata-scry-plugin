import {
  expect,
  describe,
  test,
  beforeAll,
  afterAll
} from '@jest/globals';
import {
  GetInstance,
  IsTFile,
  IsTFolder,
  NotesSource
} from '../../../../../src/lib';
import TFile, { TAbstractFile } from '../../../../mocks/app-api/file';
import TFolder from "../../../../mocks/app-api/folder";
import Vault, { FILE } from '../../../../mocks/app-api/vault';

describe("*File System Data Fetching Methods", () => {
  
  // mocks
  const {
    files: { file_0, file_1, file1_1 },
    folders: { folder, folder1, folder1_2 }
  } = Vault.Mock([
    [FILE, FILE],
    [FILE, "folder1_2.md", [
      FILE, FILE
    ]]
  ]);
  
  const Instance = GetInstance();

  // validators
  const expectFolder = (result: TFolder | TFile | TAbstractFile | undefined) => {
    expect(result).toBeInstanceOf(TFolder);
    const source: NotesSource = result as any;
    if (IsTFolder(source)) {
      expect(source.path).toEqual(folder.path);
      expect(source.children.length).toEqual(folder.children.length);
      expectFile_0((result as TFolder).file(0));
      expect((result as TFolder).file(1).name).toEqual(file_1.name);
    }
  }
  const expectFile_0 = (file: TFile | undefined) => {
    expect(file).toBeInstanceOf(TFile);
    if (IsTFile(file)) {
      expect(file.name).toEqual(file_0.name);
      expect(file.path).toEqual(file_0.path);
    }
  }

  // tests
  describe.each([
    ["vault", Instance.Api.vault],
    ["folder", Instance.Api.folder]
  ])(
    "folder function alias: %s()",
    (name: string, method: (source: any) => TFile | TFolder | TAbstractFile | undefined | any) => {
      describe("=> TFolder", () => {
        describe("(source: string)", () => {
          test("succesfully found the folder", () => {
            // logic
            const result = method(folder.name);

            // validation
            expectFolder(result);
          });
          test("unsuccesfully found the folder", () => {
            // logic
            const result: TFolder = method("not_test") as TFolder;

            // validation
            expect(result).toBeUndefined();
          });
          test("succesfully found the sub-folder instead of file without the extension", () => {
            // logic
            const file: TAbstractFile = method(folder1_2.path) as TAbstractFile;

            // validation
            expect(file).toBeInstanceOf(TFolder);
            expect(file.name).toEqual(folder1_2.name);
            expect(file.path).toEqual(folder1_2.path);
          });
        });
        describe("(source: TFolder)", () => {
          test("succesfully found the folder", () => {
            // logic
            const result: TFolder = method(folder) as TFolder;

            // validation
            expectFolder(result);
          });
        });
      });
    }
  );

  describe.each([
    ["vault", Instance.Api.vault],
    ["file", Instance.Api.file]
  ])(
    "file function alias: %s()",
    (name: string,
      method: (source: NotesSource) => TFile | TFolder | TAbstractFile | undefined | any
    ) => {
      describe("=> TFile", () => {
        describe("(source: string)", () => {
          test("succesfully found the file without extension", () => {
            // logic
            const file: TFile = method(folder.file(0).path.replace(".md", "")) as TFile;

            // validation
            expectFile_0(file);
          });
          test("succesfully found the file with extension", () => {
            // logic
            const file: TFile = method(folder.file(0).path) as TFile;

            // validation
            expectFile_0(file);
          });
          test("unsuccesfully found the folder", () => {
            // logic
            const file: TFile = method("not_test/file1.md") as TFile;

            // validation
            expect(file).toBeUndefined();
          });
          test("unsuccesfully found the file", () => {
            // logic
            const file: TFile = method("test/testA.md") as TFile;

            // validation
            expect(file).toBeUndefined();
          });
          test("succesfully found the file with matching folder name using extension", () => {
            // logic
            const file: TFile = method(folder1.file(1).path) as TFile;

            // validation
            expect(file).toBeInstanceOf(TFile);
            expect(file.name).toEqual(file1_1.name);
            expect(file.path).toEqual(file1_1.path);
          });
        });
        describe("(source: TFile)", () => {
          test("succesfully found the file", () => {
            // logic
            const file: TFile = method(folder.file(0)) as TFile;

            // validation
            expectFile_0(file);
          });
        });
      });
    }
  );
});