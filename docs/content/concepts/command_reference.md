**Command Reference**

You must provide a **command** when executing the ```documentation``` program. Some commands accept flags. Usage will follow this general syntax:

```shell
documentation [command] [flags]
```

## Commands

| Command           | Interactive | Has Options         | Description                                                                                     |
| :---------------- | :---------: | :-----------------: | :---------------------------------------------------------------------------------------------- |
| ```init```        | No          | No                  | Creates ```docs``` folder and suggested page skeleton.                                          |
| ```serve```       | No          | No                  | Runs a local web server from the ```docs``` folder.                                             |
| ```generate```    | Depends     | Optional            | Rebuilds auto-generated content (e.g. SDK, API, sidebars, and release notes).                   |
| ```clear-cache``` | No          | No                  | Clears saved data (e.g. path to your code, path to your OpenAPI file).                          |

## Flags

The ```generate``` command is interactive, by default. If you want to suppress interactive prompts, use the following flags:

| Flag            | Alias    | Argument                    | Description                                                                                     |
| :-------------- | :------: | :-------------------------: | :---------------------------------------------------------------------------------------------- |
| ```--jsdoc```   | ```-j``` | ```string``` or ```false``` | Rebuilds your SDK Reference (for JavaScript). Argument is relative path to your code directory. |
| ```--openapi``` | ```-o``` | ```string``` or ```false``` | Rebuilds your API Reference (for web services). Argument is relative path to OpenAPI file.      |
| ```--tryme```   | ```-t``` | ```boolean```               | Adds an interactive "try me" page for your web service API.                                     |

## Examples

* `barchart-documentation generate` — asks for sources and generates documentation for those sources.
* `barchart-documentation generate -o -j` — generates documentation for OpenAPI and JSDoc.
* `barchart-documentation generate -o -j false` — generates documentation only from a OpenAPI file.
* `barchart-documentation generate -o false -j` — generates documentation only for OpenAPI.
* `barchart-documentation generate -o` — generates documentation for OpenAPI and will ask about JSDoc.
* `barchart-documentation generate -o -t` — includes documentation for OpenAPI and generates Try Me page.
* `barchart-documentation generate -o service.yaml` — generates OpenAPI documentation from
