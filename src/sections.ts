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
  [key: string]: NoteSection;
  // @ts-expect-error: Default Indexer Type Override
  level: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  keys: string[] = [];
  // @ts-expect-error: Default Indexer Type Override
  count: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  index: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  title: string = "";
  // @ts-expect-error: Default Indexer Type Override
  note: NoteSections;
  // @ts-expect-error: Default Indexer Type Override
  parent: NoteSection|null = null;
  // @ts-expect-error: Default Indexer Type Override
  children: Record<string, NoteSection> = {};

  //#region Load and Get

  // @ts-expect-error: Default Indexer Type Override
  get header()
  : string {
    return `${'#'.repeat(this.level)} ${this.title}`;
  }
  
  // @ts-expect-error: Default Indexer Type Override
  get contents()
  : string {
    if (this._contents === null) {
      this._contents = this._find();
    }

    return this._contents;
  }
  
  // @ts-expect-error: Default Indexer Type Override
  get rendered()
  : HTMLElement {
    if (this._renderContainer === null) {
      this._renderContainer = document.createElement("div");
      //@ts-expect-error: Api should expect null but does not.
      MarkdownRenderer.renderMarkdown(this.contents, container, this.note.path, null);
    }

    return this._renderContainer;
  }
    
  // @ts-expect-error: Default Indexer Type Override
  private _find()
    : string {
    const fullNoteContents = this.note.contents;
    const header = this.header;

    // find the headers that match
    const results = [...fullNoteContents.matchAll(new RegExp(`/\n${header}/g`))];
    if (!results) {
      throw `Section Header: "${header}", not found in file: ${this.note.path}.`;
    }

    // find the one at the correct index
    const result = results.at(this.index);
    if (!result || !result.index) {
      throw `Section Header: "${header}", with index: ${this.index}, not found in file: ${this.note.path}.`;
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

  constructor(note: Sections, index: number, heading: HeadingCache) {
    this.note = note;
    this.index = index;
    this.level = heading.level;
    this.title = heading.heading;

    this.keys = NoteSection.SplayKeys(this.title);
  }

  // @ts-expect-error: Default Indexer Type Override
  addChild(
    child: NoteSection
  ) : void {
    for (const key in child.keys) {
      if (!this.hasOwnProperty(key)) {
        this[key] = child;
      }
      
      this.children[key] = child;
      child.parent = this;
    }

    this.count += 1;
  }

  static SplayKeys(text: string): string[] {
    const keys = [text];

    // clean the key of dataview values and wikilinks
    let cleaned = text;
    if (cleaned.contains("[")) {
      cleaned = cleaned.replace("/\[\[(?:(?:([^\]]*)\|([^\]]*))|([^\]]*))\]\]/g", "$2$3");
      if (cleaned.contains("::")) {
        cleaned = cleaned.replace("/\[(?:(?:(?:([^\[:\|]*)\|([^\[:]*)::([^\]]*)))|(?:(?:([^\[:]*)::([^\]]*))))\]/g", "$2$4");
      }
    }

    keys.push(cleaned);

    if (PluginContainer.Instance.settings.splayFrontmatterWithoutDataview) {
      const lower = cleaned.toLowerCase();
      const camel = cleaned.replace(" ", "");
      let LowerCamel = camel[0].toUpperCase() + camel.substring(1);

      keys.push(lower, camel, LowerCamel);
      if (PluginContainer.Instance.settings.splayKebabCaseProperties && cleaned.contains("-")) {
        if (PluginContainer.Instance.settings.splayKebabCaseProperties === SplayKebabCasePropertiesOption.LowerAndCamelCase) {
          const lowerKey = cleaned.toLowerCase();
          keys.push(lowerKey.replace(/-/g, ""));
          keys.push(lowerKey
            .split('-')
            .map((part, i) => i !== 0 ? part.charAt(0).toUpperCase() + part.substring(1) : part)
            .join(''));
          keys.push(cleaned
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.substring(1))
            .join(''));
        } else if (PluginContainer.Instance.settings.splayKebabCaseProperties === SplayKebabCasePropertiesOption.Lowercase) {
          keys.push(cleaned.replace(/-/g, "").toLowerCase());
        } else if (PluginContainer.Instance.settings.splayKebabCaseProperties === SplayKebabCasePropertiesOption.CamelCase) {
          keys.push(cleaned
            .toLowerCase()
            .split('-')
            .map((part, i) => i !== 0 ? part.charAt(0).toUpperCase() + part.substring(1) : part)
            .join('')
          );
          keys.push(cleaned
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.substring(1))
            .join('')
          );
        }
      }
    }

    return keys;
  }

  //#endregion
}

/**
 * Implementation of Sections
 */
export class NoteSections extends Object implements Sections {
  // @ts-expect-error: Default Indexer Type Override for Object Extension
  [key: string]: Section;
  // @ts-expect-error: Default Indexer Type Override
  all: Record<string, Section[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  path: string = "";
  
  // @ts-expect-error: Default Indexer Type Override
  get contents()
  : string {
    return PluginContainer
      .DataviewApi
      .io
      .load(this.note.path);
  }

  //#region Initialization

  constructor(notePath: string | undefined, headings: HeadingCache[] | undefined) {
    super();
    if (notePath !== undefined && headings !== undefined) {
      this.path = notePath;

      let parent: NoteSection = null!;
      for (const heading of headings) {
        // make the new section
        const current = new NoteSection(
          this,
          this.all[heading.heading]
            ? this.all[heading.heading].length
            : 0,
          heading
        );

        // if there's no current parent, or the level of this is the same as or greater than the current parent, switch this to the parent.
        if (!parent || (current.level >= parent.level)) {
          parent = current;
          for (const key in parent.keys) {
            if (!this.hasOwnProperty(key)) {
              this[key] = parent;
            }
          }
        } else {
          parent.addChild(current);
        }

        // register all the keys in all
        for (const key in current.keys) {
          if (!this.all[key]) {
            this.all[key].push(current);
          } else {
            this.all[key] = [current];
          }
        }
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
      .map(k => this.all[k])
      .filter(s => s)
      .flat();
  }
}
