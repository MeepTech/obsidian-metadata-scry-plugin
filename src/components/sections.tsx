import { Keys } from "src/constants";
import { IsFunction } from "src/utilities";
import { Section } from "../types/sections/section";

const ComponentLoadingText = "...Loading";

export namespace ReactSectionComponents {

  /**
   * Proptypes for Section component
   */
  export type SectionPropTypes = {
    data: Section,
    mode?: SectionRenderMode | undefined,
    renderer?: ((
      section?: Section,
      renderedContents?: string | HTMLElement
    ) => any) 
      | undefined,
    enabled?: ((
      section?: Section,
      renderedContents?: string | HTMLElement
    ) => boolean)
      | undefined
      | boolean
  };

  /**
   * Enum for the render modes of a section or sections
   */
  export enum SectionRenderMode {
    md = "md",
    html = "html",
    txt = "txt"
  }

  /**
   * All of the available render modes or sections.
   */
  export const SectionRenderModes: Array<SectionRenderMode> = [
    SectionRenderMode.md,
    SectionRenderMode.txt,
    SectionRenderMode.html
  ];

  /**
   * Render A note Section fetched from Metascry-Api using react.
   */
  export const Section: React.FunctionComponent<SectionPropTypes> = ({
    data,
    mode = SectionRenderMode.md,
    renderer = undefined,
    enabled = true
  }: SectionPropTypes) => {
    const { React, Markdown } = (app as any).plugins.plugins[Keys.ReactComponentsPluginKey];
    const { useState, useEffect } = React;
    const section = data;

    // validation
    if (!section) {
      throw "'data' prop of type Section is required.";
    }
    if (!SectionRenderModes.includes(mode)) {
      throw `Unrecognized/invalid mode for Sections React component: ${mode}. Valid modes: ${SectionRenderModes.join(", ")}`;
    }

    // load the section content we want
    const [renderedContent, setRenderedContent] = useState(null);
    useEffect(async () => {
      const value = await section[mode];
      setRenderedContent(value);
    }, []);

    // wait for content to render/load
    if (renderedContent !== null) {
      // is-enabled check using the loaded content
      if ((IsFunction(enabled) && enabled(section, renderedContent)) || enabled) {
        // custom renderer option
        if (renderer) {
          return renderer(section, renderedContent);
        } else {
          // default markdown renderer
          if (mode.toLowerCase() == SectionRenderMode.md) {
            return <span
              className={`Section-${section.header.text.replace(" ", "-")} Section-Index-${section.header.index} Section-Level-${section.header.level}`}>
              <Markdown src={renderedContent} />
            </span>;
          } // full html post-renderer
          else if (mode.toLowerCase() == SectionRenderMode.html) {
            return <span
              className={`Section-${section.header.text.replace(" ", "-")} Section-Index-${section.header.index} Section-Level-${section.header.level}`}
              dangerouslySetInnerHTML={{
                __html: renderedContent
                  ? renderedContent.innerHTML
                  : ""
              }} />;
          } // cleaned txt (from html.innerText)
          else {
            return <div
              className={`Section-${section.header.text.replace(" ", "-")} Section-Index-${section.header.index} Section-Level-${section.header.level}`}>
              {renderedContent}
            </div>;
          }
        }
      }
    }

    // else: loading...
    return <i>{ComponentLoadingText}</i>;
  }

  export type SectionsPropTypes = {
    data: Section[],
    mode?: SectionRenderMode | undefined,
    renderer?: ((
      section?: Section,
      renderedContents?: string | HTMLElement,
      allSections?: Record<string, Section>,
      allRenderedSectionContents?: Record<string, string> | Record<string, HTMLElement>
    ) => any)
    | undefined,
    filter?: ((
      section?: Section,
      renderedContents?: string | HTMLElement,
      allSections?: Record<string, Section>,
      allRenderedSectionContents?: Record<string, string> | Record<string, HTMLElement>
    ) => boolean)
    | undefined
    | boolean
  };

  /**
   * Render Note Sections fetched from MetaScryApi using react.
   */
  export const Sections: React.FunctionComponent<SectionsPropTypes> = ({
    data,
    mode = SectionRenderMode.md,
    renderer = undefined,
    filter = true
  }: SectionsPropTypes) => {
    const { React } = (app as any).plugins.plugins["obsidian-react-components"];
    const { useState, useEffect } = React;

    // validation
    if (!data) {
      throw "'data' prop of type Section[] is required.";
    }
    if (!SectionRenderModes.includes(mode)) {
      throw `Unrecognized mode: ${mode}. Valid modes: ${SectionRenderModes.join(", ")}`;
    }

    // hooks to load sections data
    const [renderedSections, setRenderedSections] = useState(null);
    useEffect(async () => {
      // load all sections at once.
      const renderedItems: Record<string, string> | Record<string, HTMLElement> = {};
      for (const section of data) {
        renderedItems[section.id] = await section[mode];
      }

      setRenderedSections(renderedItems);
    }, []);

    const sections
      = data
        //@ts-expect-error: indexBy added to array prototype in plugin.ts
        // TODO: wrap indexBy's contents in a static call and call that here instead.
        .indexBy("id");

    // if we're all loaded
    if (renderedSections !== null) {
      // props for individual sections
      const childProps: any = {
        mode
      };
      if (renderer) {
        childProps.renderer
          = (s: Section, r: string | HTMLElement) => renderer(s, r, sections, renderedSections);
      }
      if (filter) {
        childProps.enabled = IsFunction(filter)
          ? (s: Section, r: string | HTMLElement) => filter(s, r, sections, renderedSections)
          : filter;
      }

      // loop though and render the sections:
      return <>
        {data && data.map(section =>
          <Section data={section} {...childProps} />)}
      </>;
    }

    // else: loading...
    return <i>{ComponentLoadingText}</i>;
  }

  /**
   * All components
   */
  export const Components = {
    Section,
    Sections
  }
}
