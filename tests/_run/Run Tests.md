```dataviewjs
const pages = meta
    // by file:
    .sections(path("../Metadata Api"))
    // filter out empty files
    .filter(f => f.count > 0)
    // get all the unique items from each file
    .map(f => f.unique)
    // flatten the files into one array
    .flat()
    // get h1s only
    .filter(s => s.header.level == 1)
    .aggregateBy("root.path");

for(const path of Object.keys(pages).slice(0, 1)) {
	dv.el('h3', `<u>${path}</u>`);
	for(const section of pages[path]) {
	    if (section.code) {
		    dv.el('h4', section.header.text);
		    dv.el('p', `*Code:*`);
		    dv.el('p', (await section.code.md).trim());
	    }
	}
}
```
