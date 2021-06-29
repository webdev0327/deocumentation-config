# @barchart/documentation-generator

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSkJiVDZVKzIvUkh5Vkpzd1prRHlKbGozYUhiSWFXMEhzZFphdzBhTWRiWnRXK2dGMk1GMU52QS8rcTJBWEJjNXZkOTRpUXpMcFBLdjFoYmhRWVhNNStRPSIsIml2UGFyYW1ldGVyU3BlYyI6IlVubWUzdm0reHVoZE5SaDAiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/documentation-generator)
[![NPM](https://img.shields.io/npm/v/@barchart/documentation-generator)](https://www.npmjs.com/package/@barchart/documentation-generator)

A **command-line tool** that _quickly_ generates _easy-to-maintain_ websites for **technical documentation** adhering to [Barchart's](https://www.barchart.com/solutions) guidelines for content, style, and layout.

### Basic Features

* Emits a single-page web application using [Docsify](https://docsify.js.org/#/), with:
  * a standard cover page,
  * a standard sidebar,
  * a standard page structure, and
  * a standard stylesheet.
* Creates skeleton of pages, with:
  * placeholder pages (written using [Markdown](https://en.wikipedia.org/wiki/Markdown)).
* Auto-generates SDK documentation from your code, as follows:
  * parses your JavaScript files,
  * extracts [JSDoc](https://en.wikipedia.org/wiki/JSDoc) comments, and
  * emits markdown pages.
* Auto-generates API documentation for your web service, as follows:
  * parses your [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) file (or URL), and
  * emits markdown pages.
* Easy to deploy and maintain using [GitHub Pages](https://pages.github.com/).

### Example Sites

These Barchart products were documented using this tool; the sites are hosted on [GitHub Pages](https://pages.github.com/):

* [Barchart Market Data SDK](https://docs.barchart.com/marketdata-api-js/#/)
* [Barchart Alerting Service SDK](https://docs.barchart.com/alerts/#/)
* [Barchart Watchlist Service SDK](https://docs.barchart.com/watchlist/#/)

### Usage Guide

This tool was used to document itself (see the [```docs```](./docs) folder). The resulting site has been published here:

https://barchart.github.io/documentation-generator/#/

If you're pathologically incapable of reading documentation — which would be ironic, considering the purpose of this tool — just execute the following shell commands:

```shell
npm install -g @barchart/documentation-generator

mkdir my-first-documentation-site
cd my-first-documentation-site

documentation init
documentation serve
```

### Package Managers

This tool is a *public* module on NPM, named [@barchart/documentation-generator](https://www.npmjs.com/package/@barchart/documentation-generator).

### License

This software is provided under the MIT license.