# Configuration
## Global Variable Names
The names of the global variables `meta` and `cache` can be changed in these settings.
## Declare Object Property Helper Methods
If true, this sets the Instance Methods on `Object.prototype` that help deal with accessing and setting deep object properties.
## Property Name Splaying
These settings let you modify how property keys are modified and copied in retured sets of metadata. 
For example *(using the default settings)*: The metadata api would splay/map the single frontmatter kebab-case key: `test-value`, into three different properties with the three keys: `test-value`, `testValue`, and `testvalue`, all with the same original value.
## Data Storage Locations
Settings related to the paths used for prototype and value data storage.