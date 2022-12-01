// TODO: Export this folder to the npm importable api when that's made.

import { SingleFileSource } from "../fetching/sources";
import { Heading } from "./heading";
import { Section } from "./section";

/**
 * All of the sections in a note.
 */
export type Sections = SectionsCollection & SectionsNoteData;

/**
 * A collection of sections in a note, and the data to fetch them.
 */
interface SectionsNoteData {

  /**
   * The path to the note for these sections
   * 
   * @alias {@link Path}
   */
  get path(): string;

  /**
   * The path to the note for these sections
   * 
   * @alias {@link path}
   */
  get Path(): string;

  /**
   * The number of total sections, and sub sections.
   * 
   * @alias {@link Count}
   * 
   * @see {@link all}
   * @see {@link All}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link root}
   * @see {@link Root}
   */
  get count(): number;

  /**
   * The number of total sections, and sub sections.
   * 
   * @alias {@link count}
   * 
   * @see {@link all}
   * @see {@link All}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link root}
   * @see {@link Root}
   */
  get Count(): number;

  /**
   * All sections and sub-sections in the file, indexed by name. values are in arrays in case of duplicate headings
   * 
   * @alias {@link All}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link root}
   * @see {@link Root}
   */
  get all(): Record<string, Section[]>;

  /**
   * All sections and sub-sections in the file, indexed by name. values are in arrays in case of duplicate headings
   * 
   * @alias {@link all}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link root}
   * @see {@link Root}
   */
  get All(): Record<string, Section[]>;

  /**
   * All highest level/root sections (not sub-sections) in the file, indexed by name. values are in arrays in case of duplicate headings
   * 
   * @alias {@link Root}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link all}
   * @see {@link All}
   */
  get root(): Record<string, Section[]>;

  /**
   * All highest level/root sections (not sub-sections) in the file, indexed by name. values are in arrays in case of duplicate headings
   *
   * @alias {@link Root}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link all}
   * @see {@link All}
   */
  get Root(): Record<string, Section[]>;

  /**
   * The unique headers and sub-headers in this file
   
   * @alias {@link headers}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link root}
   * @see {@link Root}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link all}
   * @see {@link All}
   */
  get Headers(): Heading[];

  /**
   * The unique headers and sub-headers in this file
   
   * @alias {@link Headers}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link root}
   * @see {@link Root}
   * @see {@link unique}
   * @see {@link Unique}
   * @see {@link all}
   * @see {@link All}
   */
  get headers(): Heading[];

  /**
   * Get all the unique sections in this note.
   
   * @alias {@link Unique}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link root}
   * @see {@link Root}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link all}
   * @see {@link All}
   */
  get unique(): Section[];

  /**
   * Get all the unique sections in this note.
   *
   * @alias {@link Unique}
   * 
   * @see {@link count}
   * @see {@link Count}
   * @see {@link root}
   * @see {@link Root}
   * @see {@link headers}
   * @see {@link Headers}
   * @see {@link all}
   * @see {@link All}
   */
  get Unique(): Section[];

  /**
   * Get all sections with a given name key
   * 
   * @param name The name of the section to get in unclean format
   */
  named(name: string): Section[];

  /**
   * Embed this section into the given note.
   * 
   * @param container The container to add the embed to (defaults to a new element)
   * @param intoNote The note you're adding it to (defaults to current)
   */
  embed(
    container?: HTMLElement,
    intoNote?: SingleFileSource
  ): HTMLElement;
}

/**
 * Information about sections in a note.
 */
interface SectionsCollection {
  /**
   * A section, indexe by one of it's splayed keys.
   */
  [key: string]: Section
}


