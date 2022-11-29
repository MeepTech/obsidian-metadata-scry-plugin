import {
  TAbstractFile,
  TFile,
  TFolder
} from "obsidian";
import { Link } from "obsidian-dataview";
import { FileData } from "./data";
import { Keys } from "../constants";

/**
 * The sources to pull Metadata values from for a file.
 */

export type MetadataSources = {

  /**
   * The 'file' field containing metadata about the file itself
   */
  [Keys.FileInfoMetadataSourceKey]?: boolean;

  /**
   * The Frontmatter (YAML at the top of a note)
   */
  [Keys.FrontmatterMetadataSourceKey]?: boolean;

  /**
   * Inline Dataview data fields
   */
  [Keys.DataviewInlineMetadataSourceKey]?: boolean;

  /**
   * Cached values from MetaScryApi.cache
   */
  [Keys.ScryNoteCacheMetadataSourceKey]?: boolean;

  /**
   * Sections from the note itself
   */
  [Keys.NoteSectionsMetadataSourceKey]?: boolean;
};

/**
 * Something we can get a file or folder's path from.
 *
 * Either a 'file/folder' object with a '.path' property, or the path itself as a string.
 */
export type NotesSource = string | TFile | TFolder | TAbstractFile | FileData | Link | null;

/**
 * Something we can get a specific file's path from.
 *
 * Either a 'file' object with a '.path' property, or the path itself as a string.
 */
export type SingleFileSource = string | TFile | FileData | Link | null;
