import { Heading } from "../types/sections/heading";
import { Symbols } from '../constants';

/**
 * Implementation of Heading
 *
 * @internal
 */
export class SectionHeader implements Heading {

  //#region Fields

  //#region Internal

  private _text: string;
  private _index: number;
  private _level: number;

  //#endregion

  //#region Properties

  get text(): string { return this._text; }
  get Text(): string { return this._text; }
  get Txt(): string { return this._text; }
  get txt(): string { return this._text; }
  get index(): number { return this._index; }
  get Index(): number { return this._index; }
  get Level(): number { return this._level; }
  get level(): number { return this._level; }
  get md(): string { return this.Md; }
  get Md(): string {
    return `${Symbols.HeadingLevelMarkerCharachter.repeat(this.level)} ${this.text}`;
  }

  //#endregion

  //#region Initialization

  constructor(text: string, level: number, index: number) {
    this._text = text;
    this._level = level;
    this._index = index;
  }

  //#endregion
}
