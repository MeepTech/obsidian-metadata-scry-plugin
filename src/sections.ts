import { Sections, Section, PluginContainer, SplayKebabCasePropertiesOption } from './api';
import { HeadingCache } from 'obsidian';

class NoteSection implements Section {
  [key: string]: NoteSection;
  // @ts-expect-error: Default Indexer Type Override
  level: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  keys: string[] = [];
  // @ts-expect-error: Default Indexer Type Override
  count: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  path: string = "";
  // @ts-expect-error: Default Indexer Type Override
  title: string = "";
  // @ts-expect-error: Default Indexer Type Override
  parent: NoteSection|null = null;
  // @ts-expect-error: Default Indexer Type Override
  children: Record<string, NoteSection> = {};
  
  // @ts-expect-error: Default Indexer Type Override
  get contents(): string {
    throw new Error('Method not implemented.');
  }

  //#region Initialization

  constructor(notePath: string, heading: HeadingCache) {
    this.path = notePath;
    this.level = heading.level;
    this.title = heading.heading;

    this.keys = NoteSection.SplayKeys(this.title);
  }

  // @ts-expect-error: Default Indexer Type Override
  addChild(child: NoteSection) {
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

export class NoteSections extends Object implements Sections {
  // @ts-expect-error: Default Indexer Type Override for Object Extension
  [key: string]: Section;
  // @ts-expect-error: Default Indexer Type Override
  all: Record<string, Section[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  path: string = "";
  // @ts-expect-error: Default Indexer Type Override
  contents: string = null;

  //#region Initialization
  constructor(notePath: string | undefined, headings: HeadingCache[] | undefined) {
    super();
    if (notePath !== undefined && headings !== undefined) {
      this.path = notePath;

      let parent: NoteSection = null!;
      for (const heading of headings) {
        // make the new section
        const current = new NoteSection(notePath, heading);

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
  named(name: string): Section[] {
    return NoteSection.SplayKeys(name)
      .map(k => this.all[k])
      .filter(s => s)
      .flat();
  }
}
