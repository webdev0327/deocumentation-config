## Requirements

This tool runs on [Node.js](https://nodejs.org/en/). We recommend using [Node Version Manager](https://github.com/nvm-sh/nvm).

## Installation

```shell
npm install -g @barchart/documentation-generator
````

Once installed, the you can execute the ```documentation``` program from the command line, for example:

```shell
documentation --version
```

## Creating Your Site

Navigate to the root folder for your project, then execute the ```init``` command:

```shell
documentation init
```

This will create a ```docs``` folder and the following skeletal structure:

```text
├── docs
│   ├── content
│   │   ├── concepts
│   │   │   ├── concept_one.md <-- stub file (rename, edit, or remove)
│   │   │   ├── concept_two.md <-- stub file (rename, edit, or remove)
│   │   │   ├── _sidebar.md <-- auto-generated from "root" sidebar file
│   │   ├── releases
│   │   │   ├── 0.0.0.md <-- stub file (rename, edit, or remove)
│   │   │   └── 0.0.1.md <-- stub file (rename, edit, or remove)
│   │   │   ├── _sidebar.md <-- auto-generated from "root" sidebar file
│   │   ├── product_overview.md <-- stub file (rename, edit, or remove)
│   │   ├── quick_start.md <-- stub file (rename, edit, or remove)
│   │   ├── release_notes.md <-- auto-generated from releases folder
│   │   ├── _sidebar.md <-- auto-generated from "root" sidebar file
│   ├── styles
│   │   ├── override.css <-- user stylesheet (edit as desired)
│   ├── index.html <-- bootstraps site, loading Docsify code
│   ├── .nojekyll <-- for GitHub
│   ├── _coverpage.md <-- the cover page (edit as desired)
│   ├── _sidebar.md <-- the sidebar (edit as desired, copied to subfolders)
```

## Viewing Your Site

Once the files have been created, you can view your site locally. Run the ```serve``` command:

```shell
documentation serve
```

As you modify the site, changes will be immediately reflected.

## Content Auto-Generation

### JavaScript

If you are documenting a JavaScript library, this tool can extract [JSDoc](https://en.wikipedia.org/wiki/JSDoc) comments from your source code and auto-generate pages describing your SDK in a nicely-formatted fashion.

Use the ```generate``` command, as follows:

```shell
documentation generate
```

You will be interactively prompted for the path to your code files (relative to your project's root folder). Once the command completes, an ```SDK Reference``` section will appear on your site and the following supporting directories and files will be added to your ```docs``` folder:

```text
├── docs
│   ├── content
│   │   ├── sdk
│   │   │   ├── some_code_namespace_one.md <-- auto-generated
│   │   │   ├── some_code_namespace_two.md <-- auto-generated
│   │   │   ├── _sidebar.md <-- auto-generated from "root" sidebar file
│   │   ├── sdk_reference.md <-- auto-generated
```

**You can re-execute this command to regenerate your documentation (after source code changes).**

Here is an example of SDK documentation:

https://barchart.github.io/marketdata-api-js/#/content/sdk_reference

### OpenAPI

If you are documenting a web service and you've written an [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) document, this tool can parse the file and auto-generate pages describing your API in a nicely-formatted fashion.

Use the ```generate``` command, as follows:

```shell
documentation generate
```

You will be interactively prompted for the path to your OpenAPI file (relative to your project's root folder). Once the command completes, an ```API Reference``` section will appear on your site and the following supporting directories and files will be added to your ```docs``` folder:

```text
├── docs
│   ├── content
│   │   ├── api
│   │   │   ├── components.md <-- auto-generated
│   │   │   ├── paths.md <-- auto-generated
│   │   │   ├── try.md <-- aauto-generated, optional tool to "try" the API
│   │   │   ├── _sidebar.md <-- auto-generated from "root" sidebar file
│   │   ├── api_reference.md <-- auto-generated
```

**You can re-execute this command to regenerate your documentation (after the OpenAPI file changes).**

Here is an example of API documentation:

https://barchart.github.io/alerts-client-js/#/content/api_reference