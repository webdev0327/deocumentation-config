# Manual Documentation

The CLI allows you to host a manual documentation. 

!> The `api` and `sdk` folders shouldn't be updated manually.

## Quick Start

A Quick Start guide is, in essence, a shortened version of a manual, meant to make a consumer familiar with a product as soon as possible. The CLI generates the file `content/quick_start.md` once when the first time `generate` or `init` commands are called. You must write a quick start guide to this file.

## Overview

A Product Overview must contain a product description is to supply consumers with important information about the features and benefits of the product. The CLI generates the file `content/product-overview.md` once when the first time `generate` or `init` commands are called. You must write a product overview guide to this file.

## Key Concepts

A Key Concepts guide must describe the main points of a project. The CLI generates the `content/concepts` folders. All Key Concepts files must be put inside this folder. To add key concepts files to the sidebar, the `_sidebar.md` files should be updated manually.

**Example**:

```markdown
* [Overview](/content/product_overview)
* [Quick Start](/content/quick_start)
* Key Concepts
    * [JSDoc](/content/concepts/jsdoc)
    * [OpenAPI](/content/concepts/openapi)
    * [Manual documentation](/content/concepts/manual)
``` 

## Additional documentation

You can add additional documentation by creating a new folder inside the `content` folder and adding links to files inside the `_sidebar.md` files. Learn more about a sidebar [here](/content/product_overview#sidebar).