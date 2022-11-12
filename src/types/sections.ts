// TODO: Export this folder to the npm importable api when that's made.

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

  named(name: string): Section[];
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

/**
 * A markdown heading from a note file.
 */
 export interface Heading {

  /**
   * The text of the heading/section title. (without the #s)
   * 
   * @alias {@link text}
   * @alias {@link txt}
   * @alias {@link Txt}
   */
  get Text(): string;

  /**
   * The text of the heading/section title. (without the #s)
   * 
   * @alias {@link Text}
   * @alias {@link txt}
   * @alias {@link Txt}
   */
  get text(): string;

  /**
   * The text of the heading/section title. (without the #s)
   * 
   * @alias {@link txt}
   * @alias {@link text}
   * @alias {@link Text}
   * 
   * @see {@link md}
   * @see {@link Md}
   */
  get Txt(): string;

  /**
   * The text of the heading/section title. (without the #s)
   * 
   * @alias {@link txt}
   * @alias {@link text}
   * @alias {@link Text}
   * 
   * @see {@link md}
   * @see {@link Md}
   */
  get txt(): string;

  /**
   * The index of the heading (if there's another heading with the same name this gets incremeneted.)
   *
   * @alias {@link Index}
   * 
   * @see {@link level}
   * @see {@link Level}
   */
  get index(): number;

  /**
   * The index of the heading (if there's another heading with the same name this gets incremeneted.)
   *
   * @alias {@link index}
   * 
   * @see {@link level}
   * @see {@link Level}
   */
  get Index(): number;

  /**
   * The depth/level of the heading/The number of #s in the header.
   * 
   * @alias {@link level}
   * 
   * @see {@link index}
   * @see {@link Index}
   */
  get Level(): number;

  /**
   * The depth/level of the heading/The number of #s in the header.
   * 
   * @alias {@link Level}
   * 
   * @see {@link index}
   * @see {@link Index}
   */
  get level(): number;

  /**
   * The plain-text markdown of the section's header Pre-processed, with the ##s
   * 
   * @alias {@link Md}
   * 
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get md(): string;

  /**  
   * The plain-text markdown of the section's header Pre-processed, with the ##s
   * 
   * @alias {@link md}
   * 
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get Md(): string;
}
