import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';
import {
  NotesSource,
  PromisedScryResults,
  DataFetcherSettings,
  ScryResultPromiseMap,
  GetInstance
} from '../../../../../src/lib';
import Vault, { FILE } from '../../../../mocks/app-api/vault';
import { expectToBeObject } from '../../../utils';

describe("File Contents Data Fetching Methods", () => {
  // mocks
  const {
    folders: { folder, folder_2 }
  } = Vault.Mock([
    [FILE, FILE, [
      FILE, FILE
    ]]
  ]);
  const file_0_contents = "#Test\n\nThis is a test paragraph.\n\n - and\n - a\n - list\n";
  const file_1_contents = "This one just contains a single paragraph.";
  const file_2_0_contents = "#Test With Headings\n##Like This Sub-Heading\n##And This One";
  const file_2_1_contents = "This one contains two paragraphs\n\nThis is the second one.";

  const Instance = GetInstance();

  // validators
  const expectSubFolderContents = async (subFolder: ScryResultPromiseMap<string>) => {
    if (expectToBeObject(subFolder)) {
      expect(await subFolder[0]).toStrictEqual(file_2_0_contents);
      expect(await subFolder[1]).toStrictEqual(file_2_1_contents);
    }
  }

  //setup
  beforeAll(() => {
    folder.file(0).setContents(file_0_contents);
    folder.file(1).setContents(file_1_contents);
    folder_2.file(0).setContents(file_2_0_contents);
    folder_2.file(1).setContents(file_2_1_contents);
  });

  // tests
  describe.each([
    ["markdown", Instance.Api.markdown],
    ["md", Instance.Api.md]
  ])(
    "markdown function alias: %s()",
    (name: string, method: (source: NotesSource, options?: DataFetcherSettings) => PromisedScryResults<string>) => {
      describe("=> PromisedScryResult<string>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Note Content in Plain Text Md", async () => {
            // logic
            const content = await method(folder.file(0).path) as string;

            // validation
            expect(content).toStrictEqual(file_0_contents);
          });
        });
      });
      describe("=> ScryResultPromiseMap<string>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text Md", async () => {
            // logic
            const content = method(folder_2.path) as ScryResultPromiseMap<string>;

            // validation
            expect(content.count).toStrictEqual(2);
            expect(await content[0]).toStrictEqual(file_2_0_contents);
            expect(await content[1]).toStrictEqual(file_2_1_contents);
          });
          test("Succesfully Fetch Multiple Note's Contents and sub folders in a tree of in Plain Text Md docs", async () => {
            // logic
            const content = method(folder.path) as ScryResultPromiseMap<string>;

            // validation
            expect(content.count).toStrictEqual(3);
            expect(await content[0]).toStrictEqual(file_0_contents);
            expect(await content[1]).toStrictEqual(file_1_contents);
            expectSubFolderContents(content[2].map);
          });
        });
        describe("(source: NotesSource, options: {flatten: true}), ", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text Md (Flattened)", async () => {
            // logic
            const content = method(folder.path, { flatten: true }) as ScryResultPromiseMap<string>;

            // validation
            expect(content.count).toStrictEqual(5);
            expect(await content[0]).toStrictEqual(file_0_contents);
            expect(await content[1]).toStrictEqual(file_1_contents);
            expectSubFolderContents(content[2].map);
            expect(await content[3]).toStrictEqual(file_2_0_contents);
            expect(await content[4]).toStrictEqual(file_2_1_contents);
          });
        });
      });
    });

  describe.each([
    ["text", Instance.Api.text],
    ["txt", Instance.Api.txt]
  ])(
    "text function alias: %s()",
    (name: string, method: (source: NotesSource, options?: DataFetcherSettings) => PromisedScryResults<string>) => {
      describe("=> PromisedScryResult<string>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Note Content in Plain Text", async () => {
            // logic
            const content = await method(folder.file(0).path) as string;

            // validation
            expect(content).toStrictEqual(file_0_contents);
          });
        });
      });
      describe("=> ScryResultPromiseMap<string>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text", async () => {
            // logic
            const content = method(folder.path) as ScryResultPromiseMap<string>;

            // validation
            expect(content.count).toStrictEqual(3);
            expect(await content[0]).toStrictEqual(file_0_contents);
            expect(await content[1]).toStrictEqual(file_1_contents);
            expect(content[2]).toBeInstanceOf(Object);
          });
        });
        describe("(source: NotesSource, options: {flatten: true}), ", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text (Flattened)", async () => {
            // logic
            const content = method(folder.path, { flatten: true }) as ScryResultPromiseMap<string>;

            // validation
            expect(content.count).toStrictEqual(5);
            expect(await content[0]).toStrictEqual(file_0_contents);
            expect(await content[1]).toStrictEqual(file_1_contents);
            expect(content[2]).toBeInstanceOf(Object);
            expect(await content[3]).toStrictEqual(file_2_0_contents);
            expect(await content[4]).toStrictEqual(file_2_1_contents);
          });
        });
      })
    });

  describe.each([
    ["html", Instance.Api.html]
  ])(
    "html function alias: %s()",
    (name: string, method: (source: NotesSource, options?: DataFetcherSettings & { fromRawMd?: string }) => PromisedScryResults<HTMLElement>) => {
      describe("=> PromisedScryResult<HTMLElement>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Note Content as HTML Elements", async () => {
            // logic
            const content = await method(folder.file(0).path) as HTMLElement;

            // validation
            expect(content.innerHTML).toStrictEqual("<p>" + file_0_contents + "</p>");
          });
        });
        describe("(source: NotesSource, {fromRawMd: <testFile2Contents>})", () => {
          test("Succesfully Fetch Note Content as HTML Elements from provided contents", async () => {
            // logic
            const content = await method(folder.file(1).path, { fromRawMd: file_1_contents }) as HTMLElement;

            // validation
            expect(content.innerHTML).toStrictEqual("<p>" + file_1_contents + "</p>");
          });
        });
      });
      describe("=> ScryResultPromiseMap<HTMLElement>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Multiple Note's Contents as HTML Elements", async () => {
            // logic
            const content = method(folder.path) as ScryResultPromiseMap<HTMLElement>;

            // validation
            expect(content.count).toStrictEqual(3);
            expect((await content[0])?.value.innerHTML).toStrictEqual("<p>" + file_0_contents + "</p>");
            expect((await content[1])?.value.innerHTML).toStrictEqual("<p>" + file_1_contents + "</p>");
            expect(content[2]).toBeInstanceOf(Object);
          });
          test("Succesfully Fetch Multiple Note's Contents as HTML Elements - Testing direct conversions.", async () => {
            // logic
            const content = method(folder.path) as ScryResultPromiseMap<HTMLElement>;

            // validation
            const file_0 = await content[0] as HTMLElement;
            expect(file_0.innerHTML).toStrictEqual("<p>" + file_0_contents + "</p>");
          });
        });
        describe("(source: NotesSource, options: {flatten: true}), ", () => {
          test("Succesfully Fetch Multiple Note's Contents as HTML Elements (Flattened)", async () => {
            // logic
            const content = method(folder.path, { flatten: true }) as ScryResultPromiseMap<HTMLElement>;

            // validation
            expect(content.count).toStrictEqual(5);
            expect((await content[0])?.value.innerHTML).toStrictEqual("<p>" + file_0_contents + "</p>");
            expect((await content[1])?.value.innerHTML).toStrictEqual("<p>" + file_1_contents + "</p>");
            expect(content[2]).toBeInstanceOf(Object);
            expect((await content[3])?.value.innerHTML).toStrictEqual("<p>" + file_2_0_contents + "</p>");
            expect((await content[4])?.value.innerHTML).toStrictEqual("<p>" + file_2_1_contents + "</p>");
          });
        });
      });
    });

  describe("embed()", () => {
    // TODO: figure out how to write this?
  });

  // cleanup
  afterAll(() => {
    folder.file(0).clearContents();
    folder.file(1).clearContents();
    folder_2.file(0).clearContents();
    folder_2.file(1).clearContents();
    folder.removeThisMockFromVault();
  });
});