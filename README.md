# @barchart/documentation-generator

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSkJiVDZVKzIvUkh5Vkpzd1prRHlKbGozYUhiSWFXMEhzZFphdzBhTWRiWnRXK2dGMk1GMU52QS8rcTJBWEJjNXZkOTRpUXpMcFBLdjFoYmhRWVhNNStRPSIsIml2UGFyYW1ldGVyU3BlYyI6IlVubWUzdm0reHVoZE5SaDAiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/documentation-generator)

A **command-line tool** that _quickly_ generates _easy-to-maintain_ websites for **technical documentation** adhering to [Barchart's](https://www.barchart.com/solutions) guidelines for content, style, and layout.

### Basic Features

* Emits a single-page web application using [Docsify](https://docsify.js.org/#/), with:
  * a standard cover page,
  * a standard sidebar,
  * a standard page structure, and
  * a standard stylesheet.
* Creates skeleton of pages, with:
  * placeholders for content, and
  * content written using [Markdown](https://en.wikipedia.org/wiki/Markdown).
* Auto-generates SDK documentation from your code, as follows:
  * parses your JavaScript files,
  * extracts [JSDoc](https://en.wikipedia.org/wiki/JSDoc) comments, and
  * emits markdown pages.
* Auto-generates API documentation for your web service, as follows:
  * parses your [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) file, and
  * emits markdown (see example output)
* Easy to deploy and maintain using [GitHub Pages](https://pages.github.com/).

### Usage Guide

This tool was used to document itself (see the ```docs``` folder). The site is published to [GitHub Pages](https://pages.github.com/) here:

https://barchart.github.io/documentation-generator/#/

However, if you're pathologically incapable of reading documentation (which would be ironic — considering the purpose of this tool — just execute the following:

```shell
npm install -g @barchart/documentation-generator

mkdir my-first-documentation-site
cd my-first-documentation-site

documentation init
documentation serve
```

### Example Sites

These sites were generated (and are maintained) using this tool:

* [Barchart Market Data SDK](https://barchart.github.io/marketdata-api-js/#/)
* [Barchart Alert Service SDK](https://barchart.github.io/alerts-client-js/#/)

### Package Managers

This tool has been published as a *public* module to NPM as [@barchart/documentation-generator](https://www.npmjs.com/package/@barchart/documentation-generator). Install as follows:

```shell
npm install -g @barchart/documentation-generator
```

### License

This software is provided under the MIT license.