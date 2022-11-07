export namespace ReactMarkdownComponents {

  /**
   * Version of Markdown components, but inline.
   * 
   * TODO: fix dataview inline tag formatting issue
   */
  export const InlineMd = ({ src, maxDepth = 10 }: { src: string; maxDepth: number }) => {
    const plugin = (app as any).plugins.plugins["obsidian-react-components"];
    const { Markdown, React } = plugin;
    const { useRef, useEffect, useState } = React;
    const containerRef = useRef(null);

    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
      if (!initialized) {
        if (containerRef.current) {
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
  }
}