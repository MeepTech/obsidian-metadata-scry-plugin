# Cache
Each file has it's own cache object.
This cache is designed to work between different types of codeblocks within the same note. This allows you to store custom js values easily between codeblocks in the same note without needing to modify global state yourself!

**NOTE**: This cache is not a consistent data storage system and only exists in-memory. This means it may be cleared or re-set when you close the note or close or refeesh the Obsidian app.

EX: 
```
---
name:
  first: John
  last: Madden
---
'``dataview
const {
  name {
    first: firstName,
    last: lastName
  }
} = meta.Current;

cache["fullName"] = `${firstName} ${lastName}`;
'``
```