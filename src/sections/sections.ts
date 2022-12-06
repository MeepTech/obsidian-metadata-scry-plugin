import {
  HeadingCache,
  TFile
} from 'obsidian';
import {
  Sections
} from '../types/sections/sections';
import { Heading } from "../types/sections/heading";
import {
  Symbols
} from '../constants';
import {
  InternalStaticMetadataScrierPluginContainer
} from "../static";
import { SingleFileSource } from '../types/fetching/sources';
import { NoteSection } from './section';
import { Splay } from 'src/utilities';

/**
 * Implementation of Sections
 * 
 * @internal
 */
export class NoteSections extends Object implements Sections {
  //#region Fields

  //#region Internal

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
  // @ts-expect-error: Default Indexer Type Override
  private _fm
    : string = "";
  // @ts-expect-error: Default Indexer Type Override
  private _html
    : HTMLElement = null!;

  //#endregion

  //#region  Properties

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

  //#endregion

  //#endregion

  //#region Initialization

  constructor(notePath: string | undefined, headings: HeadingCache[] | undefined) {
    super();
    this._hidePrivateProperties();

    if (notePath !== undefined && headings !== undefined) {
      this._path = notePath;

      let parent: NoteSection | null = null;
      let previous: NoteSection | null = null;
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

  // @ts-expect-error: Default Indexer Type Override
  _hidePrivateProperties = () =>
    Object.keys(this).forEach(key => {
      if (key[0] === '_') {
        Object.defineProperty(this, key, { enumerable: false })
      }
    });

  //#endregion

  // @ts-expect-error: Default Indexer Type Override
  named(
    name: string
  ): NoteSection[] {
    return Splay(name)
      .map(k => this._all[k])
      .filter(s => s)
      .flat();
  }

  // @ts-expect-error: Default Indexer Type Override
  embed(
    container?: HTMLElement,
    intoNote?: SingleFileSource
  ): HTMLElement {
    return InternalStaticMetadataScrierPluginContainer.Api.embed(
      this.path,
      { container, intoNote }
    ) as HTMLElement; 
  }

  // @ts-expect-error: Default Indexer Type Override
  async loadText()
    : Promise<string> {
    if (this._md !== null) {
      return Promise.resolve(this._md);
    } else {
      const file = InternalStaticMetadataScrierPluginContainer.Api.vault(this.path) as TFile;
      this._md = await app.vault.cachedRead(file);
      const frontMarker = Symbols.FrontmatterMarkdownSurroundingTag;
      if (this._md.startsWith(frontMarker)) {
        var startPosition = this._md.search(frontMarker) + frontMarker.length;
        var endPosition = this._md.slice(startPosition).search(frontMarker) + startPosition;
        this._fm = this._md.slice(startPosition, endPosition);
      }

      return Promise.resolve(this._md);
    }
  }

  // @ts-expect-error: Default Indexer Type Override
  async loadHtml()
    : Promise<HTMLElement> {
    if (this._html !== null) {
      return Promise.resolve(this._html);
    } else {
      const md = await this.loadText()
      return await InternalStaticMetadataScrierPluginContainer.Api.html(this.path, { fromRawMd: md }) as HTMLElement;
    }
  }

  // @ts-expect-error: Default Indexer Type Override
  public getMatter(): string {
    return this._fm;
  }
}
