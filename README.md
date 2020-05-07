# barchart-documentation

> WARNING: CLI is context sensitive. All commands will be executed for the current path.

CLI for creating documentation from JSDoc or OpenAPI.

## Cache

CLI caches paths to source code, and an OpenAPI file of each project. To clear the cache, use the [clear-cache](#clear-cache) or [clear-package-cache](#clear-package-cache) commands.

## Commands

CLI provides following commands:

## generate

Creates `docs` folder if it doesn't exist and generates documentation from JSDoc or OpenAPI. 

**Example**:
```bash
barchart-documentation generate
```

## init

Creates `docs` folder with following structure:
```text
├── docs
│   ├── content
│   │   ├── api
│   │   ├── concepts
│   │   ├── releases
│   │   └── sdk
│   ├── static
│   └── styles
```

**Example**:
```bash
barchart-documentation init
```

## serve

**Example**:
```bash
barchart-documentation serve
```

## clear-cache

Clears cached paths for each package.

**Example**:
```bash
barchart-documentation clear-cache
```

## clear-package-cache

Clears cached paths for current package.

**Example**:
```bash
barchart-documentation clear-package-cache
```