# Release Notes

## 1.0.0
* Added new flags for the `generate` command. [Read more](content/quick_start#generateflags).
* Added support of `[.yml, .json]` extensions for the `OpenAPI` documentation.
* Refactored `cache` commands. [Read more](content/quick_start#cache).
    * A `clear-cache` command clears cache of current package.
    * Deleted a `clear-package-cache` command.
    * Added a new flag `-a` for the `clear-cache` command to clear the cache of all packages.
* Updated documentation.


## 0.2.0
* Added `Try Me` page for an Open API Documentation

## 0.1.5
* Renamed the package name

## 0.1.3
* Added support of `security` for an OpenAPI documentation

## 0.1.2
* Fixed `noCompileLinks` option for `index.html`

## 0.1.1
* Fixed sidebar generation
* Fixed links generation

## 0.1.0
* Added new command `barchart-documentation releases` which updates `release_notes.md` file by compiling all release notes from the `releases` folder.
* Sidebars are generated separately.
* Changed the initial folder structure and sidebar template.
* The `generate` command adds links to API and SDK documentation to the root sidebar if necessary.
