The ```documentation``` program requies a **command** argument. Some commands accept flags. Usage follows this general syntax:

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

Interactive. Prompts for path to SDK files and OpenAPI file. Caches responses. Optionally generates ```SDK Reference``` and ```API Reference``` sections:

```shell
documentation generate
```

Non-interactive. Sections for ```SDK Reference``` and ```API Reference``` are not generated:

```shell
documentation generate -j false -o false
```

Non-interactive. Generates ```SDK Reference``` based on contents of ```lib/js``` folder. The ```API Reference``` section is not generated:

```shell
documentation generate -j lib/js -o false
```

Non-interactive. Generates ```API Reference``` based on contents of ```lib/service.yaml``` file. The ```SDK Reference``` section is not generated:

```shell
documentation generate -j false -o lib/service.yaml
```

Non-interactive. Generates ```API Reference``` based on contents of ```lib/service.yaml``` file. Also adds a ```Try Me``` page for the API. The ```SDK Reference``` section is not generated:

```shell
documentation generate -j false -o lib/service.yaml -t
```
