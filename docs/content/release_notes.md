# Release Notes

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

* Generator JSDoc were ignored hidden files (e.g. ```.meta.js```).

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
