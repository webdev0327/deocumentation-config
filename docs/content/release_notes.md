# Release Notes

## 3.3.0
**New Features**

* Added new flag to ignore OpenAPI optional fields in examples.
* Added support of Enum for OpenAPI components.

**Bug Fixes**

* Fixed a bug in the OpenAPI generator that led to the empty `required` property for fields with references to other components.


## 3.2.3
**Bug Fixes**

* Fixed `documentation generate` command for Windows operating systems.

## 3.2.2
**Bug Fixes**

* Fixed `documentation init` command for Windows operating systems.
* Updated OpenAPI document generation logic to include an "Example" section when responses are not JSON.

## 3.2.1
**Bug Fixes**

* Fixed a bug in OpenAPI when the array type was set for a schema with `$ref`.

## 3.2.0
**New Features**

* Added support of `oneOf`, `anyOf`, and `allOf` properties of OpenAPI specification.

## 3.1.0
**New Features**

* Added a possibility to provide a path to the folder with release notes.
* Added flag `-r` for `generate` command to provide a path to the folder with release notes.
* Added `cache` command to manage the cached path for current project.

## 3.0.6
**Bug Fixes**

* Fixed a bug where the **File** and **Import** sections were ignored when generating JSDocs documentation.

## 3.0.5
**Bug Fixes**

* Fixed a bug due to which HTML tags in OpenAPI description fields were forced to lower case.

## 3.0.4
**Bug Fixes**

* Changed the HTML to MD parser for OpenAPI documentation.
* Removed escaping of HTML tag in the path descriptions for OpenAPI file.

**Technical Enhancements**

* Added custom HTML to MD parser.


## 3.0.3
**Bug Fixes**

* Fixed conversion `<a>` HTML tags in path descriptions for OpenAPI file.
* Fixed escaping `|` (pipe) symbols in the description fields for OpenAPI file.


## 3.0.2
**Bug Fixes**

* Fixed `init` command. 


## 3.0.1
**Bug Fixes**

* `<a>` tags are now converted to markdown links for `description` fields.
* `description` fields are no longer merged into one line if the `|` (pipe) symbol was used at the beginning of the line.

**Technical Enhancements**

* Moved code from `cli.js` to the `lib/commands` folder.

## 3.0.0
**New Features**

* Added support of generating OpenAPI documentation from URL to an OpenAPI file.

**Bug Fixes**

* Components no longer appear in the sidebar if there are no components in the file.
* `components.md` no longer appear in the `content/api` folder if there are no components in the file.

**Technical Enhancements**

* Refactored code of generators.

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
