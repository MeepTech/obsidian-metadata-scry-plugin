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
