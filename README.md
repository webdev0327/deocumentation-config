# @barchart/documentation-generator

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSkJiVDZVKzIvUkh5Vkpzd1prRHlKbGozYUhiSWFXMEhzZFphdzBhTWRiWnRXK2dGMk1GMU52QS8rcTJBWEJjNXZkOTRpUXpMcFBLdjFoYmhRWVhNNStRPSIsIml2UGFyYW1ldGVyU3BlYyI6IlVubWUzdm0reHVoZE5SaDAiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/documentation-generator)

A command-line tool that quickly generates easy-to-maintain websites for technical documentation. These websites are follow [Barchart's](https://www.barchart.com/solutions) standards for layout and styling.

### Basic Features

* Emits a single-page web application using [Docsify](https://docsify.js.org/#/), including:
  * A standard cover page
  * A standard sidebar
  * A standard page structure
  * Standard CSS styles
  * Content authoring uses [Markdown](https://en.wikipedia.org/wiki/Markdown) instead of [HTML](https://en.wikipedia.org/wiki/HTML)
* Generates _optional_ SDK documentation:
  * Parses your JavaScript files, extracts [JSDoc](https://en.wikipedia.org/wiki/JSDoc) comments, and emits markdown
* Generates _optional_ API documentation by:
  * Parses your [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) files and emits markdown
* One-click publishing to [GitHub Pages](https://pages.github.com/).

### Usage Guide

This tool has been used to document itself (see the ```docs```) folder. The resulting site can be viewed here:

https://barchart.github.io/documentation-generator/#/

### Example Sites

These sites were generated (and are maintained) using this tool:

* [Barchart Market Data SDK](https://barchart.github.io/marketdata-api-js/#/)
* [Barchart Alert Service SDK](https://barchart.github.io/alerts-client-js/#/)

### Package Managers

This library has been published as a *public* module to NPM as [@barchart/documentation-generator](https://www.npmjs.com/package/@barchart/documentation-generator). Install as follows:

```shell
npm install -g @barchart/documentation-generator
```

### License

This software is provided under the MIT license.