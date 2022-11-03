import { Sections, Section, PluginContainer, SplayKebabCasePropertiesOption, Heading } from './api';
import { HeadingCache, MarkdownRenderer } from 'obsidian';

/**
 * Implementation of Heading
 */
export class SectionHeader implements Heading {
  private _text: string;
  private _index: number;
  private _level: number;

  get text(): string { return this._text; }
  get Text(): string { return this._text; }
  get index(): number { return this._index; }
  get Index(): number { return this._index; }
  get Level(): number { return this._level; }
  get level(): number { return this._level; }
  get md(): string { return this.Md; }
  get Md(): string {
    return ` ${'#'.repeat(this.level)} ${this.text}`
  }

  constructor(text: string, level: number, index: number) {
    this._text = text;
    this._level = level;
    this._index = index;
  }
}

/**
 * Implementation of Section
 */
class NoteSection implements Section {
  // @ts-expect-error: Default Indexer Type Override
  private _root: NoteSections;
  // @ts-expect-error: Default Indexer Type Override
  private _renderContainer: HTMLElement = null!;
  // @ts-expect-error: Default Indexer Type Override
  private _contents: string = null!;
  // @ts-expect-error: Default Indexer Type Override
  private _keys: string[] = [];
  // @ts-expect-error: Default Indexer Type Override
  private _count: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  private _index: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  private _container: NoteSection|null = null;
  // @ts-expect-error: Default Indexer Type Override
  private _sections: Record<string, NoteSection[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _subtitles: Heading[] = [];
  // @ts-expect-error: Default Indexer Type Override
  private _heading: Heading;
  // @ts-expect-error: Default Indexer Type Override
  private _unique: Record<string, NoteSection> = {};

  //#region Properties
  
  [key: string]: NoteSection;
  // @ts-expect-error: Default Indexer Type Override
  get keys()
    : string[] { return this._keys; }
  // @ts-expect-error: Default Indexer Type Override
  get Keys()
    : string[] { return this._keys; }
  // @ts-expect-error: Default Indexer Type Override
  get count()
    : number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get Count()
    : number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get Container()
    : NoteSection | null { return this._container; }
  // @ts-expect-error: Default Indexer Type Override
  get container()
    : NoteSection | null { return this._container; }
  // @ts-expect-error: Default Indexer Type Override
  get Sections()
    : Record<string, NoteSection[]> { return this._sections; }
  // @ts-expect-error: Default Indexer Type Override
  get sections()
    : Record<string, NoteSection[]> { return this._sections; }
  // @ts-expect-error: Default Indexer Type Override
  get Root()
    : NoteSections { return this._root; }
  // @ts-expect-error: Default Indexer Type Override
  get root()
    : NoteSections { return this._root; }
  // @ts-expect-error: Default Indexer Type Override
  get subtitles()
    : Heading[] { return this._subtitles; }
  // @ts-expect-error: Default Indexer Type Override
  get Subtitles()
    : Heading[] { return this._subtitles; }

  //#endregion

  //#region Load and Get

  // @ts-expect-error: Default Indexer Type Override
  get Header()
  : Heading {
    return this._heading;
  }

  // @ts-expect-error: Default Indexer Type Override
  get header()
  : Heading {
    return this._heading;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Md()
  : string {
    return this.md;
  }
  
  // @ts-expect-error: Default Indexer Type Override
  get md()
  : string {
    if (this._contents === null) {
      this._contents = this._find();
    }

    return this._contents;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Html()
  : HTMLElement {
    return this.html;
  }
  
  // @ts-expect-error: Default Indexer Type Override
  get html()
  : HTMLElement {
    if (this._renderContainer === null) {
      this._renderContainer = document.createElement("div");
      //@ts-expect-error: Api should expect null but does not.
      MarkdownRenderer.renderMarkdown(this._contents, container, this._note.path, null);
    }

    return this._renderContainer;
  }

  // @ts-expect-error: Default Indexer Type Override
  get path()
  : string {
    return this._root.path + "#" + this._title;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Path()
  : string {
    return this.path
  }

  // @ts-expect-error: Default Indexer Type Override
  get unique()
  : NoteSection[] {
    return Object.values(this._unique);
  }

  // @ts-expect-error: Default Indexer Type Override
  get Unique()
  : NoteSection[] {
    return this.unique;  
  }
    
  // @ts-expect-error: Default Indexer Type Override
  private _find()
    : string {
    const fullNoteContents = this.root.loadText();
    const header = this.header;

    // find the headers that match
    const results = [...fullNoteContents.matchAll(new RegExp(`^${header}`, "gm"))];
    if (!results) {
      throw `Section Header: "${header}", not found in file: ${this._note.path}.`;
    }

    // find the one at the correct index
    const result = results.at(this._index);
    if (!result || !result.index) {
      throw `Section Header: "${header}", with index: ${this._index}, not found in file: ${this._note.path}.`;
    }

    // find the start of this header's content.
    const start = fullNoteContents.indexOf("\n", result.index + header.text.length) + 1;
    if (start === 0) {
      return "";
    }

    // find the end
    const match = fullNoteContents.substring(start).match(new RegExp(`(^#{1, ${this.level}} )`, "m"));
    const end = (match && match.index) 
      ? start + match.index - 1
      : fullNoteContents.length - 1;

    // TODO: remove
    /*while (true) {
      currentEnd = fullNoteContents.indexOf(`\n #`, currentEnd) + 3;
      if (currentEnd === 2) {
        currentEnd = fullNoteContents.length - 1;
        break;
      } else {
        const hashesEnd = fullNoteContents.indexOf(" ", currentEnd);
        const headingLevel = hashesEnd - currentEnd + 1;
        if (headingLevel >= this.level) {
          currentEnd -= 3;
          break;
        } else {
          currentEnd = fullNoteContents.indexOf("\n", currentEnd);
        }
      }
    }*/

    return fullNoteContents.substring(start, end);
  }

  //#endregion

  //#region Initialization

  constructor(note: NoteSections, index: number, heading: HeadingCache) {
    this._root = note;
    this._index = index;
    this._heading = new SectionHeader(
      heading.heading,
      heading.level,
      index
    );

    this._keys = NoteSection.SplayKeys(this._heading.text);
  }

  // @ts-expect-error: Default Indexer Type Override
  addChild(
    child: NoteSection
  ): void {
    // add to sub-titles
    this._subtitles.push(child.header);

    // add to all parents:
    let parent: NoteSection|null = this;
    while (parent) {
      parent._unique[NoteSections.BuildHeaderKey(child.header)] = child;
      parent = parent.container;
    }
    
    // add all keys to this object
    for (const key of child.keys) {
      if (!this.hasOwnProperty(key)) {
        this[key] = child;
      }
      
      if (this._sections[key]) {
        this._sections[key].push(child);
      } else {
        this._sections[key] = [child];
      }
      child._container = this;
    }

    this._count += 1;
  }

  static SplayKeys(text: string): string[] {
    const keys = [text];

    // clean the key of dataview values and wikilinks
    let cleaned = text;
    if (cleaned.contains("[")) {
      cleaned = cleaned.replace(new RegExp("\\[\\[(?:(?:([^\\]]*)\\|([^\\]]*))|([^\\]]*))\\]\\]", "g"), "$2$3");
    }
    if (cleaned.contains("::")) {
      cleaned = cleaned.replace(new RegExp("\\[(?:(?:([^\\[:\\|]*)::([^\\]]*)))\\]|\\((?:(?:([^\\[:\\|]*)::([^\\]]*)))\\)", "g"), function (a, b, c, d, e, f) {
        return b ? `${b} ${c}` : e;
      });
    }

    keys.push(cleaned);

    if (PluginContainer.Instance.settings.splayFrontmatterWithoutDataview) {
      const camel = cleaned.replace(/ /g, "");
      if (!camel) {
        return keys.unique();
      }

      const lower = camel.toLowerCase();
      const lowerCamel = camel[0].toLowerCase() + camel.substring(1);

      keys.push(lower, camel, lowerCamel);
      if (PluginContainer.Instance.settings.splayKebabCaseProperties && cleaned.contains("-")) {
        if (PluginContainer.Instance.settings.splayKebabCaseProperties === SplayKebabCasePropertiesOption.LowerAndCamelCase) {
          // lower
          keys.push(lower.replace(/-/g, ""));
          // lower camel
          keys.push(lowerCamel
            .split('-')
            .map((part, i) => (i !== 0 && part) ? part.charAt(0).toUpperCase() + part.substring(1) : part)
            .join(''));
          // upper/default camel
          keys.push(camel
            .split('-')
            .map(part => part ? part.charAt(0).toUpperCase() + part.substring(1) : part)
            .join(''));
        } else if (PluginContainer.Instance.settings.splayKebabCaseProperties === SplayKebabCasePropertiesOption.Lowercase) {
          // lower
          keys.push(lower.replace(/-/g, ""));
        } else if (PluginContainer.Instance.settings.splayKebabCaseProperties === SplayKebabCasePropertiesOption.CamelCase) {
          // lower camel
          keys.push(lowerCamel
            .split('-')
            .map((part, i) => (i !== 0 && part) ? part.charAt(0).toUpperCase() + part.substring(1) : part)
            .join(''));
          // upper/default camel
          keys.push(camel
            .split('-')
            .map(part => part ? part.charAt(0).toUpperCase() + part.substring(1) : part)
            .join(''));
        }
      }
    }

    return keys.unique();
  }

  //#endregion
}

/**
 * Implementation of Sections
 */
export class NoteSections extends Object implements Sections {
  // @ts-expect-error: Default Indexer Type Override
  private _all: Record<string, NoteSection[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _root: Record<string, NoteSection[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _unique: Record<string, NoteSection> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _path: string = "";
  // @ts-expect-error: Default Indexer Type Override
  private _count: number = 0;

  // @ts-expect-error: Default Indexer Type Override for Object Extension
  [key: string]: NoteSection;
  // @ts-expect-error: Default Indexer Type Override
  get path(): string { return this._path; }
  // @ts-expect-error: Default Indexer Type Override
  get Path(): string { return this._path; }
  // @ts-expect-error: Default Indexer Type Override
  get count(): number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get Count(): number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get all(): Record<string, NoteSection[]> { return this._all; }
  // @ts-expect-error: Default Indexer Type Override
  get All(): Record<string, NoteSection[]> { return this._all; }
  // @ts-expect-error: Default Indexer Type Override
  get Root(): Record<string, NoteSection[]> { return this._root; }
  // @ts-expect-error: Default Indexer Type Override
  get root(): Record<string, NoteSection[]> { return this._root; }

  // @ts-expect-error: Default Indexer Type Override
  get headers(): Heading[] {
    return Object
      .values(this._unique)
      .map(u => u.header);
  }

  // @ts-expect-error: Default Indexer Type Override
  get Headers(): Heading[] { return this.headers; }

  // @ts-expect-error: Default Indexer Type Override
  get unique()
  : NoteSection[] {
    return Object.values(this._unique);
  }

  // @ts-expect-error: Default Indexer Type Override
  get Unique()
  : NoteSection[] {
    return this.unique;  
  }

  //#region Initialization

  constructor(notePath: string | undefined, headings: HeadingCache[] | undefined) {
    super();
    if (notePath !== undefined && headings !== undefined) {
      this._path = notePath;

      let parent: NoteSection|null = null;
      let previous: NoteSection|null = null;
      for (const heading of headings) {
        // make the new section
        const current = new NoteSection(
          this,
          this._all[heading.heading]
            ? this._all[heading.heading].length
            : 0,
          heading
        );

        // check if the last one is the parent of this one
        if (previous && (previous.level < current.level)) {
          parent = previous;
        }

        // check if this one has moved out of the current parent header.
        while (parent && (current.level <= parent.level)) {
          parent = parent.Container as NoteSection;
        }

        // add to root if there's no parent.
        if (!parent) {
          parent = current;

          if (!this._root[heading.heading]) {
            this._root[heading.heading] = [current];
          } else {
            this._root[heading.heading].push(current);
          }
          
          for (const key of parent.keys) {
            if (!this.hasOwnProperty(key)) {
              this[key] = parent;
            }
          }
        } // add as a child if there is one.
        else {
          parent?.addChild(current);
        }

        // register all the keys and title
        this._unique[NoteSections.BuildHeaderKey(current.header)] = current;
        for (const key of current.keys) {
          if (!this._all[key]) {
            this._all[key] = [current];
          } else {
            this._all[key].push(current);
          }
        }

        // increment 
        this._count += 1;
        previous = current;
      }
    }
  }

  /**
   * Make a uinique header key
   */
  static BuildHeaderKey(header: Heading) {
    return header.index + ":|:" + header.text + ":|:" + header.level;
  }

  //#endregion

  /**
   * Get all the sections with a given name in one array.
   *
   * @param name The name/key of the sections you want
   */
  // @ts-expect-error: Default Indexer Type Override
  named(
    name: string
  ) : NoteSection[] {
    return NoteSection.SplayKeys(name)
      .map(k => this._all[k])
      .filter(s => s)
      .flat();
  }
  
  // @ts-expect-error: Default Indexer Type Override
  loadText()
  : string {
    return PluginContainer
      .DataviewApi
      .io
      .load(this._note.path);
  }
}
