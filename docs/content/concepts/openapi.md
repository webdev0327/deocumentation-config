# OpenAPI

The OpenAPI Specification, originally known as the Swagger Specification, is a specification for machine-readable interface files for describing, producing, consuming, and visualizing RESTful web services. 

Learn more about OpenAPI Specification [here](https://swagger.io/docs/specification/about/) and [here](https://swagger.io/specification/).

## Plugins

You can use following plugins for IDEs to work with `OpenAPI` files:

* VS Code - [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)
* WebStorm - [openapi-editor](https://plugins.jetbrains.com/plugin/12887-openapi-editor)


## Structure

### Metadata

Every API definition **must include** the version of the OpenAPI Specification that this definition is based on:

```yaml
openapi: 3.0.0
```

### Info

The info section contains API information: `title`, `description`, `version`:

```yaml
info:
  title: Sample API
  description: Optional multiline or single-line description.
  version: 0.1.9
```

### Servers

The servers section specifies the API server and base URL. You can define one or several servers, such as production and sandbox.

```yaml
servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing
```

### Paths

The paths section defines individual endpoints (paths) in your API, and the HTTP methods (operations) supported by these endpoints. For example, ```GET /users``` can be described as:

```yaml
paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML
      responses:
        '200':
          description: A JSON array of user names
          content:
            application/json:
              schema: 
                type: array
                items: 
                  type: string
```

## Example

An example of OpenAPI specification can be found here: [OpenAPI Example](/static/example.yaml)