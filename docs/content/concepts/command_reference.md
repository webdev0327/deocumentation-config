The ```documentation``` program requies a **command** argument. Some commands accept flags. Usage follows this general syntax:

```shell
documentation [command] [flags]
```

## Commands

| Command           | Interactive | Has Options         | Description                                                                                                       |
| :---------------- | :---------: | :-----------------: | :---------------------------------------------------------------------------------------------------------------- |
| ```init```        | No          | No                  | Creates ```docs``` folder and suggested page skeleton.                                                            |
| ```serve```       | No          | No                  | Runs a local web server from the ```docs``` folder.                                                               |
| ```generate```    | Depends     | Optional            | Rebuilds auto-generated content (e.g. SDK Reference section, API Reference section, sidebars, and release notes). |
| ```clear-cache``` | No          | Optional            | Clears saved data (e.g. forgets the path to your code files and the path to your OpenAPI file).                   |

## Flags


The ```generate``` command is path sensitvie. It is also interactive, by default. However, the following flags can be used to suppress interactive prompts:

| Flag            | Alias    | Argument                    | Description                                                                                     |
| :-------------- | :------: | :-------------------------: | :---------------------------------------------------------------------------------------------- |
| ```--jsdoc```   | ```-j``` | ```string``` or ```false``` | Rebuilds your SDK Reference (for JavaScript). Argument is relative path to your code directory. |
| ```--openapi``` | ```-o``` | ```string``` or ```false``` | Rebuilds your API Reference (for web services). Argument is relative path or url to OpenAPI file.      |
| ```--tryme```   | ```-t``` | none                        | Adds an interactive "try me" page for your web service API.                                     |

The ```clear-cache``` command accepts the following flag:

| Flag            | Alias    | Argument                    | Description                                                                                     |
| :-------------- | :------: | :-------------------------: | :---------------------------------------------------------------------------------------------- |
| ```--all```     | ```-a``` | none                        | Clears the cache for all projects (i.e. each folder you've used the command in).                |



## Examples

Interactive. Prompts for a path to JavaScript files. Prompts for a path (or url) to an OpenAPI file. Caches responses. Depending on responses, generates ```SDK Reference``` and ```API Reference``` sections.

```shell
documentation generate
```

Non-interactive. The```SDK Reference``` and ```API Reference``` sections are not generated.

```shell
documentation generate -j false -o false
```

Non-interactive. Generates ```SDK Reference``` section, based on the contents of the ```lib/js``` folder. The ```API Reference``` section is not generated.

```shell
documentation generate -j lib/js -o false
```

Non-interactive. Generates ```API Reference``` section, based on the ```lib/service.yaml``` file. The ```SDK Reference``` section is not generated.

```shell
documentation generate -j false -o lib/service.yaml
```

Non-interactive. Generates ```API Reference``` section based on contents of ```lib/service.yaml``` file. Also adds a ```Try Me``` page for the API. The ```SDK Reference``` section is not generated.

```shell
documentation generate -j false -o lib/service.yaml -t
```

Non-interactive. Generates ```API Reference``` section based on contents of ```https://example.com/service.yaml``` file. The ```SDK Reference``` section is not generated.

```shell
documentation generate -j false -o https://example.com/service.yaml
```
