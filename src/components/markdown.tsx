import { MarkdownRenderer, TFile } from 'obsidian';

export namespace ReactMarkdownComponents {

  /**
   * Version of Markdown components, but inline.
   */
  export const InlineMd = ({ src, maxDepth = 10 }: { src: string; maxDepth: number }) => {
    const plugin = (app as any).plugins.plugins["obsidian-react-components"];
    const { Markdown, React: { useRef, useEffect, useState } } = plugin;
    const containerRef: React.RefObject<HTMLElement> = useRef();

    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
      if (!initialized) {
        debugger;
        const currentItemContents = containerRef.current!.children[0].innerHTML;
        containerRef.current!.innerHTML = `<span>${currentItemContents}</span>`
        setInitialized(true);
      }
    }, []);

    return <Markdown src={src} maxDepth={maxDepth} />
  }

  export const Components = {
    InlineMd
  }
}