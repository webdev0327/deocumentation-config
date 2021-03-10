# Release Notes

## 3.0.0
**New Features**

* Added support of generating OpenAPI documentation from url to an OpenAPI file.

**Technical Enhancements**

* Refactored code of generators.

**Bug Fixes**

* Components no longer appear in the sidebar if there are no components in the file.
* `components.md` no longer appear in the `content/api` folder  if there are no components in the file.

## 2.1.1
**Bug Fixes**

* Fixed initialization of `docs` folder for `generate` command. 


## 2.1.0
**New Features**

* Added support for `ref` parameters when parsing OpenAPI.

**Bug Fixes**

* Corrected problem with `examples` field when parsing OpenAPI.

**Other**

* Added colors for logs.
* Print stack trace to the console.

## 2.0.7
**Bug fixes**

* Added a message when generation of documentation done.
* OpenAPI
    * Fixed parsing of the ```required``` property.
    * Fixed parsing of the ```description``` property.
* JSDoc
    * Removed the ```<p>``` tag from the description section. 

**Other**

* Print validation errors.
* Switch the default order of the sidebar. The API section is below the SDK section now.

## 2.0.6
**Bug fixes**

* The ```generate``` command will now process hidden files with a ```.js``` suffix (e.g. ```.meta.js```).

## 2.0.5
**Bug fixes**

* The ```-j``` and ```-o``` flags fixed.
* Fixed an error: "jsdoc-babel" not found.

## 2.0.3
**Minor Bug Fixes**

* The ```-j``` and ```-o``` switches now work according to documentation, correctly allowing ```string``` or ```Boolean``` arguments.

## 2.0.2
**The first, formal release**

Features include:

* Site Generation via CLI (interactive or non-interactive)
* Content generation for:
  * JavaScript (JSDoc), and
  * OpenAPI
