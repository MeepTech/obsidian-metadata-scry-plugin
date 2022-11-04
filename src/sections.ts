import { Sections, Section, PluginContainer, SplayKebabCasePropertiesOption, Heading } from './api';
import { HeadingCache, MarkdownRenderer, TFile } from 'obsidian';

/**
 * Implementation of Heading
 */
class SectionHeader implements Heading {
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
    return `${'#'.repeat(this.level)} ${this.text}`
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
  private _root
    : NoteSections;
  // @ts-expect-error: Default Indexer Type Override
  private _renderContainer
    : HTMLElement = null!;
  // @ts-expect-error: Default Indexer Type Override
  private _md
    : string = null!;
  // @ts-expect-error: Default Indexer Type Override
  private _keys
    : string[] = [];
  // @ts-expect-error: Default Indexer Type Override
  private _count
    : number = 0;
  // @ts-expect-error: Default Indexer Type Override
  private _container
    : NoteSection | null = null;
  // @ts-expect-error: Default Indexer Type Override
  private _sections
    : Record<string, NoteSection[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _subtitles
    : Heading[] = [];
  // @ts-expect-error: Default Indexer Type Override
  private _heading
    : Heading;
  // @ts-expect-error: Default Indexer Type Override
  private _unique
    : Record<string, NoteSection> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _promise
    : Promise<string> | null = null;
  // @ts-expect-error: Default Indexer Type Override
  private _text
    : string | null = null;
  // @ts-expect-error: Default Indexer Type Override
  private _id
    : string | null = null;

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
  : Promise<string> {
    return this.md;
  }
  
  // @ts-expect-error: Default Indexer Type Override
  get md()
  : Promise<string> {
    if (this._md === null) {
      return this._promise ??= this._find().then(r => {
        this._md = r;
        this._promise = null;
        return r;
      });
    } else {
      return Promise.resolve(this._md);
    }
  }

  // @ts-expect-error: Default Indexer Type Override
  get Html()
  : Promise<HTMLElement> {
    return this.html;
  }
  
  // @ts-expect-error: Default Indexer Type Override
  get html()
  : Promise<HTMLElement> {
    if (!this._renderContainer) {
      return this.md.then(v => {
        if (this._renderContainer === null) {
          this._renderContainer = document.createElement("div");
          //@ts-expect-error: Api should expect null but does not.
          MarkdownRenderer.renderMarkdown(this._md, this._renderContainer, this.root.path, null);
        }

        return this._renderContainer;
      });
    }

    return Promise.resolve(this._renderContainer);
  }

  // @ts-expect-error: Default Indexer Type Override
  get Txt()
  : Promise<string> {
    return this.txt;
  }

  // @ts-expect-error: Default Indexer Type Override
  get txt()
  : Promise<string> {
    if (this._text === null) {
      return  this.html.then(v => {
        this._text = v.textContent || "";
        return this._text;
      });
    }

    return Promise.resolve(this._text);
  }

  // @ts-expect-error: Default Indexer Type Override
  get path()
  : string {
    return this._root.path + "#" + this.header.text;
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
  get Id()
  : string {
    return this._id ??= this.header.index + ":|:" + this.path + ":|:" + this.header.level
  }

  // @ts-expect-error: Default Indexer Type Override
  get id()
  : string {
    return this.Id;   
  }
    
  // @ts-expect-error: Default Indexer Type Override
  private async _find()
    : Promise<string> {
    const fullNoteContents = (await this.root.loadText()) || "";
    const headerMd = this.header.Md;

    // find the headers that match
    const headerRegEx = new RegExp(`((?:^${headerMd})|(?:\\n${headerMd}))`, "gm");
    const matches = fullNoteContents.matchAll(headerRegEx);

    if (!matches) {
      throw `Section Header: "${headerMd}", not found in file: ${this.root.path}.`;
    }

    const results = [...matches];
    if (!results || !results.length) {
      throw `Section Header: "${headerMd}", not found in file: ${this.root.path}.`;
    }

    // find the one at the correct index
    const result = results.at(this.header.index);
    if (!result || (!result.index && result.index !== 0)) {
      throw `Section Header: "${headerMd}", with index: ${this._index}, not found in file: ${this.root.path}.`;
    }

    // find the start of this header's content.
    const start = fullNoteContents.indexOf("\n", result.index + headerMd.length);
    if (start === -1) {
      return "";
    }

    // find the end
    const match = fullNoteContents.substring(start).match(new RegExp(`(\\n#\{1,${this.header.level}\})`, "m"));
    if (match && (match.index || match.index === 0)) {
      return fullNoteContents.substring(start + 1, start + match.index);
    }
    return fullNoteContents.substring(start + 1);
  }

  //#endregion

  //#region Initialization

  constructor(note: NoteSections, index: number, heading: HeadingCache) {
    this._root = note;
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
      parent._unique[child.id] = child;
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

    // remove special and illegal name characters
    cleaned = cleaned.replace(new RegExp("(?:(^[\\d ][^{a-zA-Z_\\-}]*)|([^{a-zA-Z0-9_\\-\\\$ }]))", "g"), "");

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
  private _all
    : Record<string, NoteSection[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _root
    : Record<string, NoteSection[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _unique
    : Record<string, NoteSection> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _path
    : string = "";
  // @ts-expect-error: Default Indexer Type Override
  private _count
    : number = 0;
  // @ts-expect-error: Default Indexer Type Override
  private _md
    : string = null!;

  // @ts-expect-error: Default Indexer Type Override for Object Extension
  [key: string]: NoteSection;
  // @ts-expect-error: Default Indexer Type Override
  get path()
    : string { return this._path; }
  // @ts-expect-error: Default Indexer Type Override
  get Path()
    : string { return this._path; }
  // @ts-expect-error: Default Indexer Type Override
  get count()
    : number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get Count()
    : number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get all()
    : Record<string, NoteSection[]> { return this._all; }
  // @ts-expect-error: Default Indexer Type Override
  get All()
    : Record<string, NoteSection[]> { return this._all; }
  // @ts-expect-error: Default Indexer Type Override
  get Root()
    : Record<string, NoteSection[]> { return this._root; }
  // @ts-expect-error: Default Indexer Type Override
  get root()
    : Record<string, NoteSection[]> { return this._root; }

  // @ts-expect-error: Default Indexer Type Override
  get headers()
  : Heading[] {
    return Object
      .values(this._unique)
      .map(u => u.header);
  }

  // @ts-expect-error: Default Indexer Type Override
  get Headers()
    : Heading[] { return this.headers; }

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
        if (previous && (previous.header.level < current.header.level)) {
          parent = previous;
        }

        // check if this one has moved out of the current parent header.
        while (parent && (current.header.level <= parent.header.level)) {
          parent = parent.Container;
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
        this._unique[current.id] = current;
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
  async loadText()
    : Promise<string> {
    if (this._md !== null) {
      return this._md;
    } else {
      const file = PluginContainer.Instance.api.vault(this.path) as TFile;
      this._md = await app.vault.cachedRead(file);

      return this._md;
    }
  }
}
