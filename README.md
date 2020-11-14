# TypeScript Node Script Starter

The main purpose of this repository is to have a working starter project template that has good integration with VS Code for writing Node scripts in TypeScript.

Most parts of this file were copied from:
[Microsoft Starter Project](https://raw.githubusercontent.com/microsoft/TypeScript-Node-Starter/master/README.md)

It depends only on winston logger library.

## Table of contents:

- [Pre-reqs](#pre-reqs)
- [Getting started](#getting-started)
- [TypeScript + Node](#typescript--node)
- [Project Structure](#project-structure)
  - [Building the project](#building-the-project)
  - [Debugging](#debugging)
  - [ESLint](#eslint)
  - [Deploying the app](#deploying-the-app)
- [Dependencies](#dependencies)
  - [`dependencies`](#dependencies-1)
  - [`devDependencies`](#devdependencies)

## Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [VS Code](https://code.visualstudio.com/)

## Getting started

- Clone the repository

```sh
git clone --depth=1 https://github.com/DariuszOstolski/typescript-starter.git <project_name>
```

- Install dependencies

```sh
cd <project_name>
npm install
```

- Build and run the project

```sh
npm run build
npm start
```

If you're using VS Code, you can use `cmd + shift + b` to run the default build task (which is mapped to `npm run build`), and then you can use the command palette (`cmd + shift + p`) and select `Tasks: Run Task` > `npm: start` to run `npm start` for you.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **.vscode**              | Contains VS Code specific settings                                                            |
| **dist**                 | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**         | Contains all your npm dependencies                                                            |
| **src**                  | Contains your source code that will be compiled to the dist dir                               |
| **src**/main.ts          | Entry point to your script app                                                                |
| package.json             | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)                          |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| .eslintrc                | Config settings for ESLint code style checking                                                |
| .eslintignore            | Config settings for paths to exclude from linting                                             |
| webpack.config.js        | Config file for module bundler                                                                |

### Configuring TypeScript compilation

TypeScript uses the file `tsconfig.json` to adjust project compile options.
See this project's `tsconfig.json`, starting with the `compilerOptions` which details how your project is compiled.

The project context is basically a set of options that determine which files are compiled when the compiler is invoked with a specific `tsconfig.json`.
In this case, we use the following to define our project context:

```json
"include": [
    "src/**/*"
]
```

`include` takes an array of glob patterns of files to include in the compilation.
This project is fairly simple and all of our .ts files are under the `src` folder.
For more complex setups, you can include an `exclude` array of glob patterns that removes specific files from the set defined with `include`.
There is also a `files` option which takes an array of individual file names which overrides both `include` and `exclude`.

### Running the build

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple individual build scripts.
Below is a list of all the scripts this template has available:

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `build`                   | Full build. Runs ALL build tasks (`build-ts`, `lint`)                                             |
| `start`                   | Runs node on `dist/main.js` which is the apps entry point                                         |
| `watch-node`              | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task         |
| `build-ts`                | Compiles all source `.ts` files to `.js` files in the `dist` folder in development mode           |
| `build-prod`              | Compiles all source `.ts` files to `.js` files in the `dist` folder in production mode            |
| `watch-ts`                | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed               |
| `lint`                    | Runs ESLint on project files                                                                      |
| `debug`                   | Performs a full build and then serves the app in watch mode                                       |
| `serve-debug`             | Runs the app with the --inspect flag                                                              |
| `watch-debug`             | The same as `watch` but includes the --inspect flag so you can attach a debugger                  |

## Debugging

Debugging TypeScript is exactly like debugging JavaScript with one caveat, you need source maps.

### Source maps

Source maps allow you to drop break points in your TypeScript source code and have that break point be hit by the JavaScript that is being executed at runtime.

> **Note!** - Source maps aren't specific to TypeScript.
Anytime JavaScript is transformed (transpiled, compiled, optimized, minified, etc) you need source maps so that the code that is executed at runtime can be _mapped_ back to the source that generated it.

The best part of source maps is when configured correctly, you don't even know they exist! So let's take a look at how we do that in this project.

#### Configuring source maps

First you need to make sure your `tsconfig.json` has source map generation enabled:

```json
"compilerOptions" {
    "sourceMap": true
}
```

With this option enabled, next to every `.js` file that the TypeScript compiler outputs there will be a `.map.js` file as well.
This `.map.js` file provides the information necessary to map back to the source `.ts` file while debugging.

> **Note!** - It is also possible to generate "inline" source maps using `"inlineSourceMap": true`.
This is more common when writing client side code because some bundlers need inline source maps to preserve the mapping through the bundle.
Because we are writing Node.js code, we don't have to worry about this.

### Using the debugger in VS Code

Debugging is one of the places where VS Code really shines over other editors.
Node.js debugging in VS Code is easy to setup and even easier to use.
This project comes pre-configured with everything you need to get started.dsa

When you hit `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.

You can debug in the following ways:

- **Launch Program** - transpile typescript to javascript via npm build, then launch the app with the debugger attached on startup
- **Attach by Process ID** - run the project in debug mode. This is mostly identical to the "Node.js: Attach by Process ID" template with one 
minor change.

We added `"protocol": "inspector"` which tells VS Code that we're using the latest version of Node which uses a new debug protocol.

With this file in place, you can hit `F5` to attach a debugger.
You will probably have multiple node processes running, so you need to find the one that shows `node dist/server.js`.
Now just set your breakpoints and go!

## ESLint

ESLint is a code linter which mainly helps catch quickly minor code quality and style issues.

### ESLint rules

Like most linters, ESLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `.eslintrc` configuration file.
In this project, we are using a fairly basic set of rules with no additional custom rules.

### Running ESLint

Like the rest of our build steps, we use npm scripts to invoke ESLint.
To run ESLint you can call the main build script or just the ESLint task.

```sh
npm run build   // runs full build including ESLint
npm run lint    // runs only ESLint
```

Notice that ESLint is not a part of the main watch task.

If you are interested in seeing ESLint feedback as soon as possible, I strongly recommend the [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## Deploying the app

Deploying an application is as simple as distributing dist/main.js file to some folder or remote machine. In this template we are using [webpack](https://webpack.js.org/) that takes care of bundling all dependencies and in case of production build source code minification.

## Dependencies

Dependencies are managed through `package.json`.
In that file you'll find two sections:

## `dependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| winston                         | Logging library                                                       |

## `devDependencies`

| Package                         | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| @types                          | Dependencies in this folder are `.d.ts` files used to provide types    |
| ts-node                         | Enables directly running TS files.                                     |
| eslint                          | Linter for JavaScript and TypeScript files                             |
| nodemon                         | An utility to restart nodejs                                           |
| rimraf                          | An utility to remove directories recursively                           |
| typescript                      | JavaScript compiler/type checker that boosts JavaScript productivity   |
| webpack                         | Webpack is module bundler for JavaScript apps                          |
| webpack-cli                     | CLI for Webpack                                                        |

To install or update these dependencies you can use `npm install` or `npm update`.

## License

Licensed under the [MIT](LICENSE.txt) License.
