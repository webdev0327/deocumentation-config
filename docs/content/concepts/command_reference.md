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
| ```--tryme```   | ```-t``` | none                        | Adds an interactive "try me" page for your web service API.                                     |

## Examples

* `barchart-documentation generate` — Interactive. Prompts for path to SDK files and OpenAPI file. Caches responses.
* `barchart-documentation generate -j false -o false` — Non-interactive. Skips SDK and API generation.
* `barchart-documentation generate -j lib/js -o false` — Non-interactive. Generates SDK reference from ```lib/js``` folder. Skips API generation.
* `barchart-documentation generate -j false -o lib/service.yaml` — Non-interactive. Generates SDK generation. Generates API from ```lib/service.yaml``` file.
* `barchart-documentation generate -j false -o lib/service.yaml -t` — Non-interactive. Generates SDK generation. Generates API from ```lib/service.yaml``` file. Adds a "try me" page.
