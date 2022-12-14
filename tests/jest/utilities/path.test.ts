import { describe, test, beforeAll, expect } from "@jest/globals";
import { Path } from "../../../src/utilities";
import util from 'node:util';
import Vault, { FILE } from "../../mocks/app-api/vault";

const TEST_CASES = [
  {
    input: [],
    expected: "folder/file_0.md",
    output: "Current Note Path"
  },
  {
    input: [`""`],
    expected: "folder/file_0.md",
    output: "Current Note Path"
  },
  {
    input: [`"./"`],
    expected: "folder",
    output: "Parent Folder Path"
  },
  {
    input: [`"../"`],
    expected: "",
    output: "Parent Folder's Parent Folder Path (Root Path)"
  },
  {
    input: [`"../"`, undefined, "folder/folder_3"],
    expected: "folder",
    output: "Parent Folder's Parent Folder Path"
  },
  {
    input: [`"./%s.md"`],
    params: [["file_1"]],
    expected: "folder/file_1.md",
    output: "Sibling Note Path"
  },
  {
    input: [`"../%s"`, undefined, "folder/folder_3"],
    params: [["file_1"]],
    expected: "folder/file_1.md",
    output: "Cousin Note Path"
  },
  {
    input: [`"./%s"`],
    params: [["folder_4"]],
    expected: "folder/folder_4",
    output: "Sibling Folder Path"
  },
  {
    input: [`"../%s"`, undefined, "folder/folder_3"],
    params: [["folder_4"]],
    expected: "folder/folder_4",
    output: "Cousin Folder Path"
  },
  {
    input: [`"./%s.md"`],
    params: [["folder_3"]],
    output: "Sibling Note Path",
    expected: "folder/folder_3.md",
    when: ["the Sibling Note has the same Name as a Sibling Folder."]
  },
  {
    input: [`"./%s"`],
    params: [["folder_3"]],
    output: "Sibling Folder Path",
    expected: "folder/folder_3",
    when: ["the Sibling Folder has the same Name as a Sibling Note."]
  },
  {
    input: [`"/"`],
    expected: "",
    output: "Root Folder Path"
  },
];

describe("Path($)", () => {
  const {
    files: {
      file_0, file_1, file_2, // file_2 is named "folder_3" in it's data for testing purpuses.
        file_3_0, file_3_1,
      file1_0, file1_1,
      file
    },
    folders: {
      folder,
        folder_3,
        folder_4,
      folder1
    }
  } = Vault.Mock([
    [FILE, FILE, "folder_3", [ // folder
      FILE, FILE // folder_3
    ], []], // folder_4
    [FILE, FILE], // folder1
    FILE // file
  ]);

  beforeAll(() => {
    file_0.setMockAsCurrentNote();
  });

  test.each(TEST_CASES)("($params) => $output | $when", (testCase) => {
    expect(
      Path(...(
        testCase.params
          ? testCase.input.map(
            (input: string | undefined, index: number) =>
            (input && testCase.params[index])
              ? util.format(input, testCase.params[index])
              : input
          ) : testCase.input
      ))
    ).toStrictEqual(testCase.expected);
  });
});