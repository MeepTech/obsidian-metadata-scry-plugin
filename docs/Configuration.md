# Configuration
A re-load of the app is suggested after changing any settings, but shouldn't be required.
## Global Variable Names
The names of several global variables including [meta](Api/Properties/Global/meta.md) and [cache](Api/Properties/Global/cache.md) can be changed in these settings. 
## Define Scty Global Variables
Can be used to enable/disable the [Scry and scry](Api/Properties/Global/Scry%20and%20scry.md) global variables.
## Declare Object Property Helper Methods
If true, this sets the Instance Methods on `Object.prototype` that help deal with accessing and setting deep object properties.
## Declare Array Helper Methods
If true, this sets the Instance Methods on `Array.prototype` that help deal with filtering and bucketing values.
## Property Name Splaying
These settings let you modify how property keys are modified and copied in retured sets of metadata. 
For example *(using the default settings)*: The metadata api would splay/map the single frontmatter kebab-case key: `test-value`, into three different properties with the three keys: `test-value`, `testValue`, and `testvalue`, all with the same original value.
## Data Storage Locations
Settings related to the paths used for prototype and value data storage.