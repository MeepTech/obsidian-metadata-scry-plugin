import { describe, test } from '@jest/globals';
import describe_FileSystemDataFetchingMethods from "./file-system-data-fetching-methods";
import describe_FileContentsDataFetchingMethods from "./file-contents-data-fetching-methods";
import describe_ObsidianFileMetadataCacheFetchingMethods from "./obsidian-file-metadata-cache-fetching-methods";

describe("MetadataScrier implements MetadataScryApi", () => {
  describe("*Data Fetching", () => {
    describe_FileSystemDataFetchingMethods();
    describe_FileContentsDataFetchingMethods();
    describe_ObsidianFileMetadataCacheFetchingMethods();
  });
});
