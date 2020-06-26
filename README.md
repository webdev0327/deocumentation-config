# @barchart/documentation-generator

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSkJiVDZVKzIvUkh5Vkpzd1prRHlKbGozYUhiSWFXMEhzZFphdzBhTWRiWnRXK2dGMk1GMU52QS8rcTJBWEJjNXZkOTRpUXpMcFBLdjFoYmhRWVhNNStRPSIsIml2UGFyYW1ldGVyU3BlYyI6IlVubWUzdm0reHVoZE5SaDAiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/documentation-generator)

A command-line tool that quickly generates easy-to-maintain websites for technical documentation. These websites are follow [Barchart](https://www.barchart.com/solutions) standards for layout and styling.

### Basic Features

* Builds a single-page web application using [Docsify](https://docsify.js.org/#/), including:
  * A standard cover page
  * A standard sidebar
  * A standard page structure and layout
  * Standard CSS styles
* Generates _optional_ SDK documentation from:
  * JavaScript code by parsing code and reading [JSDoc](https://en.wikipedia.org/wiki/JSDoc) comments.
* Generates _optional_ API documentation from:
  * [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) files

Content is written using [Markdown](https://en.wikipedia.org/wiki/Markdown) instead of [HTML](https://en.wikipedia.org/wiki/HTML).

### Example Documentation Sites

These sites were generated (and maintained) using this tool:

* [Barchart Market Data SDK](https://barchart.github.io/marketdata-api-js/#/)
* [Barchart Alert Service SDK](https://barchart.github.io/alerts-client-js/#/)

### Usage Guide

This tool has been used to document itself. The full _documentation_ and had been published here:

https://barchart.github.io/documentation-generator/#/

### Package Managers

This library has been published as a *public* module to NPM as [@barchart/documentation-generator](https://www.npmjs.com/package/@barchart/documentation-generator).

```shell
npm install -g @barchart/documentation-generator
```

### License

This software is provided under the MIT license.