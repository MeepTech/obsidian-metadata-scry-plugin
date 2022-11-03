# Correct Section Keys in all
## -Code
```js
dv.el("p", Object.keys(meta.sections(meta.path("test.data")).all).join(", "));
```
## -Result
```dataviewjs
dv.el("p", Object.keys(meta.sections(meta.path("test.data")).all).join(", "));
```

## -Expected
Test-Section, test-section, test-Section, testsection, testSection, TestSection, With A [Link](app://obsidian.md/OtherItem), With A Link, withalink, WithALink, withALink, Test Section 2, testsection2, TestSection2, testSection2, Subsection One, subsectionone, SubsectionOne, subsectionOne, Without (hidden::9), Without 9, without9, Without9, With D[ata::9], With Data 9, withdata9, WithData9, withData9