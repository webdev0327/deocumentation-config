## Summary

A **command-line tool** that _quickly_ generates _easy-to-maintain_ websites for **technical documentation** adhering to [Barchart's](https://www.barchart.com/solutions) guidelines for content, style, and layout.

## Example Sites

The site **you are viewing now** was created with this tool. Here are some other Barchart products which have been documented with this tool:

* [Barchart Market Data SDK](https://barchart.github.io/marketdata-api-js/#/)
* [Barchart Alert Service SDK](https://barchart.github.io/alerts-client-js/#/)

## Key Features

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
  * parses your [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) file, and
  * emits markdown pages.
* Easy to deploy and maintain using [GitHub Pages](https://pages.github.com/).

## Software License

Feel free to use this tool. The MIT license applies.

