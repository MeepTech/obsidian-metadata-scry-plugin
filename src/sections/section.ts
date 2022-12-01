import { HeadingCache } from 'obsidian';
import { Heading } from "../types/sections/heading";
import { Section } from "../types/sections/section";
import { SplayKebabCasePropertiesOptions } from "../types/settings";
import {
  DataviewInlineRegex,
  KebabCaseDashesRegex,
  MarkdownWikiLinkRegex,
  PropertyNameIllegalCharachtersRegex,
  SpacesRegex,
  Symbols
} from '../constants';
import { InternalStaticMetadataScrierPluginContainer } from "../static";
import { SectionHeader } from './heading';
import { NoteSections } from './sections';
import { Splay } from 'src/utilities';

/**
 * Implementation of Section
 *
 * @internal
 */
export class NoteSection implements Section {

  //#region Fields

  //#region Internal

  // @ts-expect-error: Default Indexer Type Override
  private _root: NoteSections;
  // @ts-expect-error: Default Indexer Type Override
  private _html: HTMLElement = null!;
  // @ts-expect-error: Default Indexer Type Override
  private _md: string = null!;
  // @ts-expect-error: Default Indexer Type Override
  private _keys: string[] = [];
  // @ts-expect-error: Default Indexer Type Override
  private _count: number = 0;
  // @ts-expect-error: Default Indexer Type Override
  private _parentTitle: NoteSection | null = null;
  // @ts-expect-error: Default Indexer Type Override
  private _sections: Record<string, NoteSection[]> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _subtitles: Heading[] = [];
  // @ts-expect-error: Default Indexer Type Override
  private _heading: Heading;
  // @ts-expect-error: Default Indexer Type Override
  private _unique: Record<string, NoteSection> = {};
  // @ts-expect-error: Default Indexer Type Override
  private _text: string | null = null;
  // @ts-expect-error: Default Indexer Type Override
  private _id: string | null = null;

  //#endregion

  //#region Properties

  [key: string]: NoteSection;
  // @ts-expect-error: Default Indexer Type Override
  get keys(): string[] { return this._keys; }
  // @ts-expect-error: Default Indexer Type Override
  get Keys(): string[] { return this._keys; }
  // @ts-expect-error: Default Indexer Type Override
  get count(): number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get Count(): number { return this._count; }
  // @ts-expect-error: Default Indexer Type Override
  get Container(): NoteSection | null { return this._parentTitle; }
  // @ts-expect-error: Default Indexer Type Override
  get container(): NoteSection | null { return this._parentTitle; }
  // @ts-expect-error: Default Indexer Type Override
  get Sections(): Record<string, NoteSection[]> { return this._sections; }
  // @ts-expect-error: Default Indexer Type Override
  get sections(): Record<string, NoteSection[]> { return this._sections; }
  // @ts-expect-error: Default Indexer Type Override
  get Root(): NoteSections { return this._root; }
  // @ts-expect-error: Default Indexer Type Override
  get root(): NoteSections { return this._root; }
  // @ts-expect-error: Default Indexer Type Override
  get subtitles(): Heading[] { return this._subtitles; }
  // @ts-expect-error: Default Indexer Type Override
  get Subtitles(): Heading[] { return this._subtitles; }

  //#endregion

  //#endregion

  //#region Load and Get

  // @ts-expect-error: Default Indexer Type Override
  get Header(): Heading {
    return this._heading;
  }

  // @ts-expect-error: Default Indexer Type Override
  get header(): Heading {
    return this._heading;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Md(): Promise<string> {
    return this.md;
  }

  // @ts-expect-error: Default Indexer Type Override
  get md(): Promise<string> {
    return (async () => {
      if (this._md === null) {
        this._md = await this._find();
      }

      return this._md;
    })();
  }

  // @ts-expect-error: Default Indexer Type Override
  get Html(): Promise<HTMLElement> {
    return this.html;
  }

  // @ts-expect-error: Default Indexer Type Override
  get html(): Promise<HTMLElement> {
    return (async () => {
      if (this._html === null) {
        const md = await this.md;
        this._html = await InternalStaticMetadataScrierPluginContainer.Api.html(this.root.path, md);
      }

      return this._html;
    })();
  }

  // @ts-expect-error: Default Indexer Type Override
  get Text(): Promise<string> {
    return this.txt;
  }

  // @ts-expect-error: Default Indexer Type Override
  get text(): Promise<string> {
    return this.txt;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Txt(): Promise<string> {
    return this.txt;
  }

  // @ts-expect-error: Default Indexer Type Override
  get txt(): Promise<string> {
    return (async () => {
      if (this._text === null) {
        const html = await this.html;
        this._text = html.textContent || "";
      }

      return this._text;
    })();
  }

  // @ts-expect-error: Default Indexer Type Override
  get path(): string {
    return this._root.path
      + Symbols.SectionLinkSeperatorCharachter
      + this.header.text;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Path(): string {
    return this.path;
  }

  // @ts-expect-error: Default Indexer Type Override
  get unique(): NoteSection[] {
    return Object.values(this._unique);
  }

  // @ts-expect-error: Default Indexer Type Override
  get Unique(): NoteSection[] {
    return this.unique;
  }

  // @ts-expect-error: Default Indexer Type Override
  get Id(): string {
    return this._id ??= this.header.index
      + Symbols.SectionIdPartDelimiter
      + this.path
      + Symbols.SectionIdPartDelimiter
      + this.header.level;
  }

  // @ts-expect-error: Default Indexer Type Override
  get id(): string {
    return this.Id;
  }

  // @ts-expect-error: Default Indexer Type Override
  private async _find(): Promise<string> {
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
    // TODO: cache all 6 regex header levels to make this quicker.
    const match = fullNoteContents
      .substring(start)
      .match(new RegExp(`(\\n${Symbols.HeadingLevelMarkerCharachter}\{1,${this.header.level}\})`, "m"));
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

    this._keys = Splay(this._heading.text);
  }

  // @ts-expect-error: Default Indexer Type Override
  addChild(
    child: NoteSection
  ): void {
    // add to sub-titles
    this._subtitles.push(child.header);

    // add to all parents:
    let parent: NoteSection | null = this;
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
      child._parentTitle = this;
    }

    this._count += 1;
  }
}
