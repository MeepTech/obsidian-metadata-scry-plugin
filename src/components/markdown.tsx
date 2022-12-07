import { Keys } from "src/constants";

export namespace ReactMarkdownComponents {

  /**
   * Proptypes for InlineMd component
   */
  export type InlineMdPropTypes = {
    src: string;
    maxDepth?: number;
  }

  /**
   * Version of Markdown components, but inline.
   * 
   * TODO: fix dataview inline tag formatting issue
   */
  export const InlineMd: React.FunctionComponent<InlineMdPropTypes> = ({
    src,
    maxDepth = 10
  }: InlineMdPropTypes) => {
    const ReactComponentsPlugin = (app as any).plugins.plugins[Keys.ReactComponentsPluginKey];
    const { Markdown, React } = ReactComponentsPlugin;
    const { useRef, useEffect, useState } = React;
    const containerRef = useRef(null);

    const [initialized, setInitialized] = useState(false);
    // runs after initial render to replace the contents.
    useEffect(() => {
      if (!initialized) {
        if (containerRef.current) {
          // just crop out the contents and put them back in a span instead.
          const currentItemContents = containerRef.current!.children[0]?.children[0]?.innerHTML ?? "";
          containerRef.current!.children[0].innerHTML = currentItemContents;
          setInitialized(true);
        }
      }
    }, []);

    return <span ref={containerRef}>
      <Markdown src={src} maxDepth={maxDepth} />
    </span>
  }

  export const Components = {
    InlineMd
  };
}
