import { Section } from "../api";

export namespace Meta {

  /**
   * Render A note Section fetched from Metadata-Api using react.
   */
  export const Section = ({
    data,
    mode = "md",
    renderer = undefined,
    enabled = undefined
  }: {
    data: Section,
    mode?: string | undefined,
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
  }) => {
    const { React, Markdown } = (app as any).plugins.plugins["obsidian-react-components"];
    const { useState, useEffect } = React;
    const section = data;
    
    // load the section content we want
    const [renderedContent, setRenderedContent] = useState(null);
    useEffect(async () => {
      const value = await section[mode];
      setRenderedContent(value);
    }, []);
    
    // wait for content to render/load
    if (renderedContent !== null) {
      // is-enabled check using the loaded content
      if ((typeof enabled === "function" && enabled(section, renderedContent)) || enabled) {
        // custom renderer option
        if (renderer) {
          return renderer(section, renderedContent);
        } else {
          // default markdown renderer
          if (mode.toLowerCase() == "md") {
            return <span
              className={`Section-${section.header.text.replace(" ", "-")} Section-Index-${section.header.index} Section-Level-${section.header.level}`}>
              <Markdown src={renderedContent} />
            </span>;
          } // full html post-renderer
          else if (mode.toLowerCase() == "html") {
            return <span
              className={`Section-${section.header.text.replace(" ", "-")} Section-Index-${section.header.index} Section-Level-${section.header.level}`}
              dangerouslySetInnerHTML={{
                __html: renderedContent
                  ? renderedContent.innerHTML
                  : ""
              }} />;
          } // cleaned text (from html)
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
    return <i>{"...Loading"}</i>;
  }

  /**
   * Render Note Sections fetched from Metadata-Api using react.
   */
  export const Sections = ({
    data,
    mode = "md",
    renderer = undefined,
    filter = undefined
  }: {
      data: Section[],
      mode?: string | undefined,
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
  }) => {
    const { React } = (app as any).plugins.plugins["obsidian-react-components"].React;
    const { useState, useEffect } = React;
    const sections
      = data
        //@ts-expect-error: indexBy added to array prototype in main.ts
        // TODO: wrap indexBy's contents in a static call and call that here instead.
        .indexBy("id");

    const [renderedSections, setRenderedSections] = useState(null);
    useEffect(async () => {
      // load all sections at once.
      const renderedItems = {};
      for (const section of data) {
        renderedItems[section.id] = await section[mode];
      }

      setRenderedSections(renderedItems);
    }, []);

    // if we're all loaded
    if (renderedSections !== null) {
      // props for individual sections
      const childProps : any = {
        mode
      };
      if (renderer) {
        childProps.renderer
          = (s, r) => renderer(s, r, sections, renderedSections);
      }
      if (filter) {
        childProps.enabled
          = (s, r) => filter(s, r, sections, renderedSections);
      }

      // loop though and render the sections:
      return <>
        {data && data.map(section =>
          <Meta.Section data={section} {...childProps} />)}
      </>;
    }

    // else: loading...
    return <i>{"Loading"}</i>;
  }
}