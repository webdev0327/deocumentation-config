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
│   │   │   └── _sidebar.md <-- auto-generated from "root" sidebar file
│   │   ├── releases
│   │   │   ├── 0.0.0.md <-- stub file (rename, edit, or remove)
│   │   │   ├── 0.0.1.md <-- stub file (rename, edit, or remove)
│   │   │   └── _sidebar.md <-- auto-generated from "root" sidebar file
│   │   ├── product_overview.md <-- stub file (rename, edit, or remove)
│   │   ├── quick_start.md <-- stub file (rename, edit, or remove)
│   │   ├── release_notes.md <-- auto-generated from releases folder
│   │   └── _sidebar.md <-- auto-generated from "root" sidebar file
│   ├── styles
│   │   └── override.css <-- user stylesheet (edit as desired)
│   ├── index.html <-- bootstraps site, loading Docsify code
│   ├── .nojekyll <-- for GitHub
│   ├── _coverpage.md <-- the cover page (edit as desired)
│   └── _sidebar.md <-- the sidebar (edit as desired, copied to subfolders)
```

## Viewing Your Site

After initialization, run the ```serve``` command to view your site locally:

```shell
documentation serve
```

As you modify your site, changes will be immediately reflected.

## Editing Your Site

### Editing Pages

In the ```docs/content``` folder, we recommend you keep the following files:

* ```product_overview.md``` — A product description, for technical and non-technical audiences.
* ```quick_start.md``` — A technical walk-through containing the bare minimum.

You can also add new pages by creating new Markdown files anywhere within the ```docs/content``` folder. We recommend you include a ```Key Concepts``` section for the complete technical details of your product (see the ```docs/content/concepts``` folder).

### Editing the Sidebar

As you add or remove files, you might want them to appear in the sidebar. Edit the ```_sidebar.md``` file in the ```docs``` folder. Then run ``` generate``` command to apply your changes to all other ```_sidebar.md``` files:

```shell
documentation generate
```

## Content Auto-Generation

At present, this tool can auto-generate pages for:

* A JavaScript SDK, and
* A REST-ful web service

As the project grows, we'll add support for additional programming languages (Java and TypeScript are on the roadmap).

### SDK (JavaScript)

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
│   │   │   └──_sidebar.md <-- auto-generated from "root" sidebar file
│   │   └── sdk_reference.md <-- auto-generated
```

**You can re-execute this command to regenerate your documentation (after source code changes).**

Here is an example of SDK documentation:

https://barchart.github.io/marketdata-api-js/#/content/sdk_reference

### Web Service (OpenAPI)

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
│   │   │   ├── try.md <-- auto-generated, optional tool to "try" the API
│   │   │   └── _sidebar.md <-- auto-generated from "root" sidebar file
│   │   └── api_reference.md <-- auto-generated
```

**You can re-execute this command to regenerate your documentation (after the OpenAPI file changes).**

Here is an example of API documentation:

https://barchart.github.io/alerts-client-js/#/content/api_reference

### Other (Release Notes)

You can write a short Markdown file for each release. Place these files in the ```docs/content/releases``` folder. Running the ```generate``` command will automatically create a ```Release Notes``` page.

The files should be named in accordance with semver rules, for example:

```text
├── docs
│   ├── content
│   │   ├── releases
│   │   │   ├── 1.0.0.md <-- you write this file
│   │   │   ├── 1.0.1.md <-- you write this file
│   │   │   └── 2.33.444.md <-- you write this file
│   │   └── release_notes.md <-- auto-generated
```

As an added benefit, these files can be used for GitHub releases (e.g. [here]()).