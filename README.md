# vue-components

A Vue 3/Nuxt 3 components library.

## Vue 3/Nuxt 3 Migration

This library has been migrated from Vue 2/Nuxt 2 to Vue 3/Nuxt 3. The following components have been migrated:

- Buttons
- Inputs
- wysiwyg
- MediaComponent
- Media
- IconsClose

## Build Setup Locally

```bash
# build the component library
$ npm run build

# create a pack tarball from the build
$ npm pack

# the above commands will result in creating a .tgz file for the component library which will be added to the main DIR

# copy the path reference of the last created .tgz file ex.: "/Users/YOUR_USER/Documents/Repositories/your-project/geeks.solutions-vue-components-1.0.0.tgz"

# in your host project, Add "@geeks.solutions/vue-components": "file://{paste here the file path you copied in the previous step}" to you package.json dependencies

# install the dependencies
$ npm install

# inside modules of your host project nuxt.config.js add '@geeks.solutions/vue-components/nuxt':
$ ex.: modules: [
    ...,
    '@geeks.solutions/vue-components/nuxt'
  ]

```

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [Nuxt 3 documentation](https://nuxt.com/docs).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxt.com/docs/guide/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxt.com/docs/guide/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxt.com/docs/guide/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxt.com/docs/guide/directory-structure/pages).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use plugins, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxt.com/docs/guide/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxt.com/docs/guide/directory-structure/public).

### `stores`

Nuxt 3 uses Pinia for state management. The stores directory contains your Pinia store files.

More information about the usage of this directory in [the documentation](https://nuxt.com/docs/guide/directory-structure/stores).

## Testing

This library uses Vitest for testing. You can run the tests with:

```bash
# run tests
$ npm run test

# run tests in watch mode
$ npm run test:watch

# run tests with coverage
$ npm run test:coverage
```
