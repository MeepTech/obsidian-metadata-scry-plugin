import { Sections, Section, PluginContainer, SplayKebabCasePropertiesOption } from './api';
import { HeadingCache, MarkdownRenderer } from 'obsidian';

/**
 * Implementation of Section
 */
class NoteSection implements Section {
  // @ts-expect-error: Default Indexer Type Override
  private _renderContainer: HTMLElement = null!;
  // @ts-expect-error: Default Indexer Type Override
  private _contents: string = null!;
  // @ts-expect-error: Default Indexer Type Override
  private _level: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  private _keys: string[] = [];
  // @ts-expect-error: Default Indexer Type Override
  private _count: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  private _index: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  private _title: string = "";
  // @ts-expect-error: Default Indexer Type Override
  private _root: NoteSections;
  // @ts-expect-error: Default Indexer Type Override
  private _container: NoteSection|null = null;
  // @ts-expect-error: Default Indexer Type Override
  private _sections: Record<string, NoteSection> = {};

  //#region Properties
  
  [key: string]: NoteSection;
  // @ts-expect-error: Default Indexer Type Override
  get Level(): number { return this._level; }
  // @ts-expect-error: Default Indexer Type Override
  get Keys(): string[] { return this._keys; }
  // @ts-expect-error: Default Indexer Type Override
  get Count(): number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get Title(): string { return this._title; }
  // @ts-expect-error: Default Indexer Type Override
  get Container(): Section | null { return this._container; }
  // @ts-expect-error: Default Indexer Type Override
  get Sections(): Record<string, Section> { return this._sections; }
  // @ts-expect-error: Default Indexer Type Override
  get Root(): NoteSections { return this._root; }
  // @ts-expect-error: Default Indexer Type Override
  get level(): number { return this._level; }
  // @ts-expect-error: Default Indexer Type Override
  get keys(): string[] { return this._keys; }
  // @ts-expect-error: Default Indexer Type Override
  get count(): number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get title(): string { return this._title; }
  // @ts-expect-error: Default Indexer Type Override
  get container(): Section | null { return this._container; }
  // @ts-expect-error: Default Indexer Type Override
  get sections(): Record<string, Section> { return this._sections; }
  // @ts-expect-error: Default Indexer Type Override
  get root(): NoteSections { return this._root; }

  //#endregion

  //#region Load and Get

  // @ts-expect-error: Default Indexer Type Override
  get Header(): string {
    return this.header;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Md(): string {
    return this.md;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Html(): HTMLElement {
    return this.html;
  }

  // @ts-expect-error: Default Indexer Type Override
  get path(): string {
    return this._root.path + "#" + this._title;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Path(): string {
    return this.path
  }

  // @ts-expect-error: Default Indexer Type Override
  get header()
  : string {
    return `${'#'.repeat(this.level)} ${this.title}`;
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
  private _find()
    : string {
    const fullNoteContents = this.root.text();
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
    const start = fullNoteContents.indexOf("\n", result.index + header.length) + 1;
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
    this._level = heading.level;
    this._title = heading.heading;

    // " " deals with empty titles.
    this._keys = NoteSection.SplayKeys(this.title);
  }

  // @ts-expect-error: Default Indexer Type Override
  addChild(
    child: NoteSection
  ) : void {
    for (const key of child.keys) {
      if (!this.hasOwnProperty(key)) {
        this[key] = child;
      }
      
      this._sections[key] = child;
      child.parent = this;
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
  _all: Record<string, Section[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  _path: string = "";
  // @ts-expect-error: Default Indexer Type Override
  _count: number = 0;

  // @ts-expect-error: Default Indexer Type Override for Object Extension
  [key: string]: Section;
  // @ts-expect-error: Default Indexer Type Override
  get path(): string { return this._path; }
  // @ts-expect-error: Default Indexer Type Override
  get count(): number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get all(): Record<string, Section[]> { return this._all; }
  // @ts-expect-error: Default Indexer Type Override
  get Path(): string { return this._path; }
  // @ts-expect-error: Default Indexer Type Override
  get Count(): number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get All(): Record<string, Section[]> { return this._all; }
  
  // @ts-expect-error: Default Indexer Type Override
  text()
  : string {
    return PluginContainer
      .DataviewApi
      .io
      .load(this._note.path);
  }

  //#region Initialization

  constructor(notePath: string | undefined, headings: HeadingCache[] | undefined) {
    super();
    if (notePath !== undefined && headings !== undefined) {
      this._path = notePath;

      let parent: NoteSection = null!;
      for (const heading of headings) {
        // make the new section
        const current = new NoteSection(
          this,
          this._all[heading.heading]
            ? this._all[heading.heading].length
            : 0,
          heading
        );

        // if there's no current parent, or the level of this is the same as or greater than the current parent, switch this to the parent.
        if (!parent || (current.level <= parent.level)) {
          parent = current;
          for (const key of parent.keys) {
            if (!this.hasOwnProperty(key)) {
              this[key] = parent;
            }
          }
        } else {
          parent?.addChild(current);
        }

        // register all the keys in all
        for (const key of current.keys) {
          if (!this._all[key]) {
            this._all[key] = [current];
          } else {
            this._all[key].push(current);
          }
        }

        this._count += 1;
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
  ) : Section[] {
    return NoteSection.SplayKeys(name)
      .map(k => this._all[k])
      .filter(s => s)
      .flat();
  }
}
