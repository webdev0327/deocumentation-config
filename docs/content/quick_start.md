## Setup

This CLI has been published to the Node Package Manager (NPM). The package is named `@barchart/barchart-documentation`; install as follows:

```shell script
npm install @barchart/barchart-documentation -S
```

## How to use

!> WARNING: The CLI is **context sensitive**. All commands will be executed for the **current path**. 

To show help, use the `--help` flag.

```shell script
barchart-documentation --help
```

### Initializing

To initialize documentation folder run the following command:

```shell script
barchart-documentation init
```

> The `init` command is a part of the `barchart-documentation generate` command.

Learn more about the documentation folder structure [here](/content/product_overview#release-notes).

### Creating documentation

The CLI support `JSDoc` and `OpenAPI` v3 specification. 

To generate documentation run the following command:

```shell script
barchart-documentation generate
```

The `generate` command generates documentation from `JSDoc`, `OpenAPI`, and updates sidebars and compile release notes. 

During the generation process, the CLI **will ask** (if flags weren't provided) from which sources to create documentation, and ask paths to these sources. All paths will be cached for each package so CLI will ask for them only once.

!> The CLI supports generating documentation for `OpenAPI` only from `[.yml, .yaml, .json]` files.

#### Flags :id=generateflags

|        Flag       |   Type   |   Default  |                                    Description                                      |
| ----------------- | :------: | :--------: | ----------------------------------------------------------------------------------- |
|  `-h` `--help`    |     -    |  will ask  | Prints help for generate command.                                                   |
|  `-j` `--jsdoc`   | `bool`   |  will ask  | Generates documentation from a JavaScript source code                               |
|  `-o` `--openapi` | `bool`   |  will ask  | Generates documentation from a OpenAPI file                                         |
|  `-t` `--tryme`   | `bool`   |   `false`  | Includes [Try Me](content/api/try) page for an OpenAPI documentation (works only with `-o` flag) |
|  `--openapiPath`  | `string` |      -     | A relative path to a OpenAPI file. e.g.: (../api/swagger.yaml)                      |
|  `--jsdocPath`    | `string` |      -     | A relative path to a JavaScript source code. e.g.: (lib)                            |

> - If `--openapiPath` flag wasn't provided, the CLI will ask you for a path to a OpenAPI file, or get it from the cache.
> - If `--jsdocPath` flag wasn't provided, the CLI will ask you for a path to a JavaScript source code, or get it from the cache.

**Examples**:

- `barchart-documentation generate` — asks for sources and generates documentation for those sources. 
- `barchart-documentation generate -o -j` — generates documentation for OpenAPI and JSDoc.
- `barchart-documentation generate -o -j false` — generates documentation only from a OpenAPI file.
- `barchart-documentation generate -o false -j` — generates documentation only for OpenAPI.
- `barchart-documentation generate -o` — generates documentation for OpenAPI and will ask about JSDoc.
- `barchart-documentation generate -o -t` — includes documentation for OpenAPI and generates Try Me page.
- `barchart-documentation generate -o --openapiPath swagger.yaml` — generates OpenAPI documentation from provided path.


### Run documentation locally

The CLI allows you to run a local web server to host documentation. By default, the web server will use port `3000`, if the port is busy, any free port will be used. 

To run the documentation locally, use the following command:

```shell script
barchart-documentation serve
```

### Cache

The CLI caches paths to source code, and an OpenAPI file of each project. To clear cache use the following commands:

* `barchart-documentation clear-cache` —  clears cached paths for current package.

#### Flags :id=cacheflags

|      Flag      |              Description              |
| -------------- | ------------------------------------- |
|  `-h` `--help` | Prints help for clear-cache command.  |
|  `-a` `--all`  | Clears cached paths for all packages. |


### Deploy

The CLI uses Docsify which allows to deploy the documentation to the **GitHub Pages**. Learn more about how to deploy documentation to the **GitHub Pages** [here](https://docsify.js.org/#/deploy?id=github-pages). 

### Example

An example of Open API documentation can be found here: [API Reference](content/api_reference)