import { expect, describe, test } from '@jest/globals';
import { ScryResultPromiseMap } from 'build/lib/lib';
import { NotesSource, PromisedScryResults, DataFetcherSettings } from 'src/lib';
import { SetVaultFolders, Instance, MakeFolder, SetFileContents, ClearFileContents, ClearVaultFolders } from "tests/helpers/dummies";

export default () =>
  describe("File Contents Data Fetching Methods", () => {
    // setup
    // - mocks
    const testSubFolder = MakeFolder("test_sub", ["file3.md", "file4.md"]);
    const testFolderInVaultRoot = MakeFolder("test", ["file1.md", "file2.md", testSubFolder]);
    SetVaultFolders(testFolderInVaultRoot);
    const testFile1Contents = "#Test\n\nThis is a test paragraph.\n\n - and\n - a\n - list\n";
    const testFile2Contents = "This one just contains a single paragraph.";
    const testFile3Contents = "#Test With Headings\n##Like This Sub-Heading\n##And This One";
    const testFile4Contents = "This one contains two paragraphs\n\nThis is the second one.";
    SetFileContents("test/file1.md", testFile1Contents);
    SetFileContents("test/file2.md", testFile2Contents);
    SetFileContents("test/sub_test/file3.md", testFile3Contents);
    SetFileContents("test/sub_test/file4.md", testFile4Contents);

    // - test generation methods
    const tests_ForMarkdownReturn = (method: (source: NotesSource, options?: DataFetcherSettings) => PromisedScryResults<string>) => {
      describe("=> PromisedScryResult<string>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Note Content in Plain Text Md", async () => {
            // logic
            const content = await method("test/file1") as string;

            // validation
            expect(content).toStrictEqual(testFile1Contents);
          });
        });
      });
      describe("=> ScryResultPromiseMap<string>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text Md", async () => {
            // logic
            const content = method("test") as ScryResultPromiseMap<string>;

            // validation
            expect(content.length).toStrictEqual(3);
            expect(await content[0]).toStrictEqual(testFile1Contents);
            expect(await content[1]).toStrictEqual(testFile2Contents);
            expect(content[2]).toBeInstanceOf(Object);
          });
        });
      });
      describe("=> ScryResultPromiseMap<string>", () => {
        describe("(source: NotesSource, options: {flatten: true}), ", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text Md (Flattened)", async () => {
            // logic
            const content = method("test", {flatten: true}) as ScryResultPromiseMap<string>;

            // validation
            expect(content.length).toStrictEqual(5);
            expect(await content[0]).toStrictEqual(testFile1Contents);
            expect(await content[1]).toStrictEqual(testFile2Contents);
            expect(content[2]).toBeInstanceOf(Object);
            expect(await content[3]).toStrictEqual(testFile3Contents);
            expect(await content[4]).toStrictEqual(testFile4Contents);
          });
        });
      });
    };
    const test_ForTextReturn = (method: (source: NotesSource, options?: DataFetcherSettings) => PromisedScryResults<string>) => {
      describe("=> PromisedScryResult<string>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Note Content in Plain Text", async () => {
            // logic
            const content = await method("test/file1") as string;

            // validation
            expect(content).toStrictEqual(testFile1Contents.replace("#", "").replace("- ", ""));
          });
        });
      });
      describe("=> ScryResultPromiseMap<string>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text", async () => {
            // logic
            const content = method("test") as ScryResultPromiseMap<string>;

            // validation
            expect(content.length).toStrictEqual(3);
            expect(await content[0]).toStrictEqual(testFile1Contents.replace("#", "").replace("- ", ""));
            expect(await content[1]).toStrictEqual(testFile2Contents.replace("#", "").replace("- ", ""));
            expect(content[2]).toBeInstanceOf(Object);
          });
        });
      });
      describe("=> ScryResultPromiseMap<string>", () => {
        describe("(source: NotesSource, options: {flatten: true}), ", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text (Flattened)", async () => {
            // logic
            const content = method("test", {flatten: true}) as ScryResultPromiseMap<string>;

            // validation
            expect(content.length).toStrictEqual(5);
            expect(await content[0]).toStrictEqual(testFile1Contents.replace("#", "").replace("- ", ""));
            expect(await content[1]).toStrictEqual(testFile2Contents.replace("#", "").replace("- ", ""));
            expect(content[2]).toBeInstanceOf(Object);
            expect(await content[3]).toStrictEqual(testFile3Contents.replace("#", "").replace("- ", ""));
            expect(await content[4]).toStrictEqual(testFile4Contents.replace("#", "").replace("- ", ""));
          });
        });
      });
    };
    const test_ForHtmlReturn = (method: (source: NotesSource, options?: DataFetcherSettings & { fromRawMd?: string }) => PromisedScryResults<HTMLElement>) => {
      describe("=> PromisedScryResult<HTMLElement>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Note Content in Plain Text Md", async () => {
            // logic
            const content = await method("test/file1") as HTMLElement;

            // validation
            expect(content.innerHTML).toStrictEqual("<p>" + testFile1Contents + "</p>");
          });
        });
        describe("(source: NotesSource, {fromRawMd: <testFile2Contents>})", () => {
          test("Succesfully Fetch Note Content in Plain Text Md from provided contents", async () => {
            // logic
            const content = await method("test/file2", { fromRawMd: testFile2Contents }) as HTMLElement;

            // validation
            expect(content.innerHTML).toStrictEqual("<p>" + testFile2Contents + "</p>");
          });
        });
      });
      describe("=> ScryResultPromiseMap<HTMLElement>", () => {
        describe("(source: NotesSource)", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text Md", async () => {
            // logic
            const content = method("test") as ScryResultPromiseMap<HTMLElement>;

            // validation
            expect(content.length).toStrictEqual(3);
            expect(await content[0]).toStrictEqual("<p>" + testFile1Contents + "</p>");
            expect(await content[1]).toStrictEqual("<p>" + testFile2Contents + "</p>");
            expect(content[2]).toBeInstanceOf(Object);
          });
        });
        describe("(source: NotesSource, options: {flatten: true}), ", () => {
          test("Succesfully Fetch Multiple Note's Contents in Plain Text Md (Flattened)", async () => {
            // logic
            const content = method("test", { flatten: true }) as ScryResultPromiseMap<HTMLElement>;

            // validation
            expect(content.length).toStrictEqual(5);
            expect(await content[0]).toStrictEqual("<p>" + testFile1Contents + "</p>");
            expect(await content[1]).toStrictEqual("<p>" + testFile2Contents + "</p>");
            expect(content[2]).toBeInstanceOf(Object);
            expect(await content[3]).toStrictEqual("<p>" + testFile3Contents + "</p>");
            expect(await content[4]).toStrictEqual("<p>" + testFile4Contents + "</p>");
          });
        });
      });
    };

    // tests
    describe("markdown()", () => {
      tests_ForMarkdownReturn(Instance.Api.markdown);
    });
    describe("md()", () => {
      tests_ForMarkdownReturn(Instance.Api.md);
    });
    describe("html()", () => {
      test_ForHtmlReturn(Instance.Api.html);
    });
    describe("text()", () => {
      test_ForTextReturn(Instance.Api.text);
    });
    describe("txt()", () => {
      test_ForTextReturn(Instance.Api.txt);
    });
    describe("embed()", () => {
      // TODO: figure out how to write this?
    });

    // cleanup
    ClearFileContents("test/file1.md");
    ClearFileContents("test/file2.md");
    ClearFileContents("test/sub_test/file3.md");
    ClearFileContents("test/sub_test/file4.md");
    ClearVaultFolders(testFolderInVaultRoot.path);
  });