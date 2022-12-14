import { MarkdownView } from "obsidian";
import App from "../app-api/app";

/**
 * Mock for the copy to html plugin
 */
export default class CopyToHtmlPlugin {
  app: App;

  constructor(app: App) {
    this.app = app;
  }
  
  convertView(
    view: MarkdownView,
    options?: { convertSvgToBitmap: boolean; removeFrontMatter: boolean; } | undefined
  ): Promise<HTMLElement> {
    var containerEl = document.createElement('div');
    var para = document.createElement('p');
    para.innerHTML = view.data;
    containerEl.appendChild(para);

    return Promise.resolve(containerEl);
  }

  convertMarkdown(
    markdown: string,
    sourceFilePath?: string | undefined,
    options?: { convertSvgToBitmap: boolean; removeFrontMatter: boolean; } | undefined
  ): Promise<HTMLElement> {
    var containerEl = document.createElement('div');
    var para = document.createElement('p');
    para.innerHTML = markdown;
    containerEl.appendChild(para);

    return Promise.resolve(containerEl);
  }
}