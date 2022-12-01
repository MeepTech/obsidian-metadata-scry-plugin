import { MarkdownView, Plugin } from "obsidian";

/**
 * Borrowed from: https://github.com/mvdkwast/obsidian-copy-as-html
 * Up to date for commit:
 */
export type CopyToHtmlPlugin = {
	
  /**
   * Render a markdown view to an html element, with dataview and other js included.
   * @async
   *
   * @param {MarkdownView} view The view to conver to html
   * @param {{ convertSvgToBitmap: boolean }} options (Optional) rendering options.
   *
   * @returns The detatched container html element of the rendered view.
   *
   * @see {@link AppWithPlugins.convertMarkdown}
   */
  convertView(
    view: MarkdownView,
    options?: { convertSvgToBitmap: boolean; removeFrontMatter: boolean; }
	): Promise<HTMLElement>;
	
  /**
   * Render a markdown view to an html element, with dataview and other js included.
   * @async
   *
   * @param {MarkdownView} view The view to conver to html
   * @param {{ convertSvgToBitmap: boolean }} options (Optional) rendering options.
   *
   * @returns The detatched container html element of the rendered view.
   *
   * @see {@link convertView}
   */
  convertMarkdown(
    markdown: string,
    sourceFilePath?: string | undefined,
    options?: { convertSvgToBitmap: boolean; removeFrontMatter: boolean; }
  ): Promise<HTMLElement>;
} & Plugin;
