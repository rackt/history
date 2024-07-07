<a name="top"></a>
<a name="intro"></a>

# Intro

The history library provides history tracking and navigation primitives for JavaScript applications that run in browsers and other stateful environments.

If you haven't yet, please take a second to read through [the Installation guide](installation.md) to get the library installed and running on your system.

We provide 3 different methods for working with history, depending on your environment:

- A "browser history" is for use in modern web browsers that support the [HTML5 history API](http://diveintohtml5.info/history.html) (see [cross-browser compatibility](http://caniuse.com/#feat=history))
- A "hash history" is for use in web browsers where you want to store the location in the [hash](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash) portion of the current URL to avoid sending it to the server when the page reloads
- A "memory history" is used as a reference implementation that may be used in non-browser environments, like [React Native](https://facebook.github.io/react-native/) or tests

The main bundle exports one method for each environment: [`createBrowserHistory`](api-reference.md#createbrowserhistory) for browsers, [`createHashHistory`](api-reference.md#createhashhistory) for using hash history in browsers, and [`createMemoryHistory`](api-reference.md#creatememoryhistory) for creating an in-memory history.

In addition to the main bundle, the library also includes `history/browser` and `history/hash` bundles that export singletons you can use to quickly get a history instance for [the current `document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) (web page).

## Basic Usage

Basic usage looks like this:

```js
// Create your own history instance.
import { createBrowserHistory } from 'history';
let history = createBrowserHistory();

// ... or just import the browser history singleton instance.
import history from 'history/browser';

// Alternatively, if you're using hash history import
// the hash history singleton instance.
// import history from 'history/hash';

// Get the current location.
let location = history.location;

// Listen for changes to the current location.
let unlisten = history.listen(({ location, action }) => {
  console.log(action, location.pathname, location.state);
});

// Use push to push a new entry onto the history stack.
history.push('/home', { some: 'state' });

// Use replace to replace the current entry in the stack.
history.replace('/logged-in');

// Use back/forward to navigate one entry back or forward.
history.back();

// To stop listening, call the function returned from listen().
unlisten();
```

If you're using memory history you'll need to create your own `history` object
before you can use it.

```js
import { createMemoryHistory } from 'history';
let history = createMemoryHistory();
```

If you're using browser or hash history with a `window` other than that of the
current `document` (like an iframe), you'll need to create your own browser/hash
history:

```js
import { createBrowserHistory } from 'history';
let history = createBrowserHistory({
  window: iframe.contentWindow
});
```

<a name="properties"></a>

## Properties

Each `history` object has the following properties:

- [`history.location`](api-reference.md#history.location) - The current location (see below)
- [`history.action`](api-reference.md#history.action) - The current navigation action (see below)

Additionally, memory history provides `history.index` that tells you the current index in the history stack.

<a name="listening"></a>

## Listening

You can listen for changes to the current location using `history.listen`:

```js
history.listen(({ action, location }) => {
  console.log(
    `The current URL is ${location.pathname}${location.search}${location.hash}`
  );
  console.log(`The last navigation action was ${action}`);
});
```

The [`location`](api-reference.md#location) object implements a subset of [the `window.location` interface](https://developer.mozilla.org/en-US/docs/Web/API/Location), including:

- [`location.pathname`](api-reference.md#location.pathname) - The path of the URL
- [`location.search`](api-reference.md#location.search) - The URL query string
- [`location.hash`](api-reference.md#location.hash) - The URL hash fragment
- [`location.state`](api-reference.md#location.state) - Some extra state for this
  location that does not reside in the URL (may be `null`)
- [`location.key`](api-reference.md#location.key) - A unique string representing this location

The [`action`](api-reference.md#action) is one of `Action.Push`, `Action.Replace`, or `Action.Pop` depending on how the user got to the current location.

- `Action.Push` means one more entry was added to the history stack
- `Action.Replace` means the current entry in the stack was replaced
- `Action.Pop` means we went to some other location already in the stack

<a name="cleaning-up"></a>

## Cleaning up

When you attach a listener using `history.listen`, it returns a function that can be used to remove the listener, which can then be invoked in cleanup logic:

```js
let unlisten = history.listen(myListener);

// Later, when you're done...
unlisten();
```

<a name="utilities"></a>

## Utilities

The main history bundle also contains both `createPath` and `parsePath` methods that may be useful when working with URL paths.

```js
let pathPieces = parsePath('/the/path?the=query#the-hash');
// pathPieces = {
//   pathname: '/the/path',
//   search: '?the=query',
//   hash: '#the-hash'
// }

let path = createPath(pathPieces);
// path = '/the/path?the=query#the-hash'
```
