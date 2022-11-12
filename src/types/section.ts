import { Heading, Sections } from "./sections";

/**
 * A section of a note.
 */

export type Section = SectionChildren & SectionInfo;
/**
 * Information about a section of a note
 */
interface SectionInfo {

  /**
   * The path of the note this section is from with the header appended after a #
   *
   * @alias {@link Path}
   *
   * @see {@link keys}
   * @see {@link id}
   * @see {@link Keys}
   * @see {@link Id}
   */
  get path(): string;

  /**
   * The path of the note this section is from with the header appended after a #
   *
   * @alias {@link path}
   *
   * @see {@link keys}
   * @see {@link id}
   * @see {@link Keys}
   * @see {@link Id}
   */
  get Path(): string;

  /**
   * A unique key/identifier for this section out of all notes and sections.
   *
   * @alias {@link id}
   *
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link header}
   * @see {@link Header}
   * @see {@link keys}
   * @see {@link Keys}
   * @see {@link path}
   * @see {@link Path}
   */
  get Id(): string;

  /**
   * A unique key/identifier for this section out of all notes and sections.
   *
   * @alias {@link Id}
   *
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link header}
   * @see {@link Header}
   * @see {@link keys}
   * @see {@link Keys}
   * @see {@link path}
   * @see {@link Path}
   */
  get id(): string;

  /**
   * The keys that can be used to identify and access this section.
   *
   * @alias {@link keys}
   *
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link header}
   * @see {@link Header}
   * @see {@link Id}
   * @see {@link id}
   */
  get Keys(): string[];

  /**
   * The keys that can be used to identify and access this section.
   *
   * @alias {@link keys}
   *
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link header}
   * @see {@link Header}
   * @see {@link Id}
   * @see {@link id}
   */
  get keys(): string[];

  /**
   * The number of sub-sections directly within this section.
   *
   * @alias {@link count}
   *
   * @see {@link subtitles}
   * @see {@link sections}
   * @see {@link unique}
   * @see {@link Subtitles}
   * @see {@link Sections}
   * @see {@link Unique}
   */
  get Count(): number;

  /**
   * The number of sub-sections directly within this section.
   *
   * @alias {@link Count}
   *
   * @see {@link subtitles}
   * @see {@link sections}
   * @see {@link unique}
   * @see {@link Subtitles}
   * @see {@link Sections}
   * @see {@link Unique}
   */
  get count(): number;

  /**
   * The section that contains this one, if there is one. If not this is a root section.
   *
   * @alias {@link container}
   *
   * @see {@link root}
   * @see {@link Root}
   */
  get Container(): Section | null;

  /**
   * The section that contains this one, if there is one. If not this is a root section.
   *
   * @alias {@link Container}
   *
   * @see {@link root}
   * @see {@link Root}
   */
  get container(): Section | null;

  /**
   * The sub-sections directly under this section.
   *
   * @alias {@link sections}
   *
   * @see {@link subtitles}
   * @see {@link unique}
   * @see {@link Subtitles}
   * @see {@link Unique}
   */
  get Sections(): Record<string, Section[]>;

  /**
   * The sub-sections directly under this section.
   *
   * @alias {@link Sections}
   *
   * @see {@link subtitles}
   * @see {@link unique}
   * @see {@link Subtitles}
   * @see {@link Unique}
   */
  get sections(): Record<string, Section[]>;

  /**
   * The unique sub-titles/headings directly under this section heading (not sub-sub headings)
   *
   * @alias {@link Subtitles}
   *
   * @see {@link sections}
   * @see {@link unique}
   * @see {@link Sections}
   * @see {@link Unique}
   */
  get subtitles(): Heading[];

  /**
   * The unique sub-titles/headings directly under this section heading (not sub-sub headings)
   *
   * @alias {@link subtitles}
   *
   * @see {@link sections}
   * @see {@link unique}
   * @see {@link Sections}
   * @see {@link Unique}
   */
  get Subtitles(): Heading[];

  /**
   * Get all the unique sub-sections in this section.
   *
   * @alias {@link Unique}
   *
   * @see {@link sections}
   * @see {@link Subtitles}
   * @see {@link Sections}
   * @see {@link subtitles}
   */
  get unique(): Section[];

  /**
   * Get all the unique sub-sections in this section.
   *
   * @alias {@link unique}
   *
   * @see {@link sections}
   * @see {@link Subtitles}
   * @see {@link Sections}
   * @see {@link subtitles}
   */
  get Unique(): Section[];

  /**
   * The Sections object used to build the sections in the file this section is from.
   * Contains info about the note/file.
   *
   * @alias {@link root}
   *
   * @see {@link Container}
   * @see {@link container}
   */
  get Root(): Sections;

  /**
   * The Sections object used to build the sections in the file this section is from.
   * Contains info about the note/file.
   *
   * @alias {@link Root}
   *
   * @see {@link Container}
   * @see {@link container}
   */
  get root(): Sections;

  /**
   * The heading of this section
   *
   * @alias {@link Header}
   *
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link keys}
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Count}
   * @see {@link count}
   * @see {@link path}
   * @see {@link Path}
   */
  get header(): Heading;

  /**
   * The heading of this section
   *
   * @alias {@link header}
   *
   * @see {@link Heading.text}
   * @see {@link Heading.md}
   * @see {@link keys}
   * @see {@link subtitles}
   * @see {@link Subtitles}
   * @see {@link Count}
   * @see {@link count}
   * @see {@link path}
   * @see {@link Path}
   */
  get Header(): Heading;

  /**
   * The plain-text markdown of the section's entire contents. Pre-processed.
   * This contains all sub-section text and headers as well.
   * @async
   *
   * @alias {@link Md}
   *
   * @see {@link Html}
   * @see {@link html}
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link Text}
   * @see {@link text}
   */
  get md(): Promise<string>;

  /**
   * The plain-text markdown of the section's entire contents. Pre-processed.
   * This contains all sub-section text and headers as well.
   * @async
   *
   * @alias {@link md}
   *
   * @see {@link Html}
   * @see {@link html}
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get Md(): Promise<string>;

  /**
   * The html element rendered from the markdown based on all of obsidian's rendering passes.
   * @async
   *
   * @alias {@link Html}
   *
   * @see {@link Md}
   * @see {@link md}
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get html(): Promise<HTMLElement>;

  /**
   * The html element rendered from the markdown based on all of obsidian's rendering passes.
   * @async
   *
   * @alias {@link html}
   *
   * @see {@link Md}
   * @see {@link md}
   * @see {@link txt}
   * @see {@link Txt}
   * @see {@link text}
   * @see {@link Text}
   */
  get Html(): Promise<HTMLElement>;

  /**
   * Get the plain text version of the processed markdown/html.
   * @async
   *
   * @alias {@link txt}
   * @alias {@link text}
   * @alias {@link Text}
   *
   * @see {@link Md}
   * @see {@link md}
   * @see {@link Html}
   * @see {@link html}
   */
  get Txt(): Promise<string>;

  /**
   * Get the plain text version of the processed markdown/html.
   * @async
   *
   * @alias {@link Txt}
   * @alias {@link text}
   * @alias {@link Text}
   *
   * @see {@link Md}
   * @see {@link md}
   * @see {@link Html}
   * @see {@link html}
   */
  get txt(): Promise<string>;

  /**
   * Get the plain text version of the processed markdown/html.
   * @async
   *
   * @alias {@link text}
   * @alias {@link txt}
   * @alias {@link Txt}
   *
   * @see {@link Md}
   * @see {@link md}
   * @see {@link Html}
   * @see {@link html}
   */
  get Text(): Promise<string>;

  /**
   * Get the plain text version of the processed markdown/html.
   * @async
   *
   * @alias {@link Text}
   * @alias {@link txt}
   * @alias {@link Txt}
   *
   * @see {@link Md}
   * @see {@link md}
   * @see {@link Html}
   * @see {@link html}
   */
  get text(): Promise<string>;
}
/**
 * Sub-sections of a note section
 */
interface SectionChildren {
  /**
   * A sub-section of this section.
   */
  [key: string]: Section;
}
