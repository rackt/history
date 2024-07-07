# Installation

The history library is published to the public [npm](https://www.npmjs.com/)
registry. You can install it using:

    $ npm install --save history

## Using a Bundler

The best way to use the `history` library is with a bundler that supports
JavaScript modules (we recommend [Rollup](https://rollupjs.org)). Recent
versions of Webpack and Parcel are also good choices.

Then you can write your code using JavaScript `import` statements, like this:

```js
import { createBrowserHistory } from 'history';
// ...
```

If you're using a bundler that doesn't understand JavaScript modules and only
understands CommonJS, you can use `require` as you would with anything else:

```js
var createBrowserHistory = require('history').createBrowserHistory;
```

## Using `<script>` Tags

If you'd like to load the library in a browser via a `<script>` tag, you can
load it from [unpkg](https://unpkg.com). If you're in a browser that supports
[JavaScript
modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules),
just use the `history.production.min.js` build:

```html
<script type="module">
// Can also use history.development.js in development
import { createBrowserHistory } from 'https://unpkg.com/history/history.production.min.js';
// ...
</script>
```

The `history.development.js` build is also available for non-production apps.

In legacy browsers that do not yet support JavaScript modules, you can use one
of our UMD (global) builds:

```html
<!-- Can also use history.development.js in development -->
<script src="https://unpkg.com/history/umd/history.production.min.js"></script>
```

You can find the library on `window.HistoryLibrary`.
