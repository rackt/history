<a name="top"></a>

# history API Reference

This is the API reference for [the history JavaScript library](https://github.com/remix-run/history).

The history library provides an API for tracking application history using [location](#location) objects that contain URLs and state. This reference includes type signatures and return values for the interfaces in the library. Please read the [getting started guide](getting-started.md) if you're looking for explanations about how to use the library to accomplish a specific task.

<a name="overview"></a>

## Overview

<a name="environments"></a>

### Environments

The history library includes support for three different "environments", or modes of operation.

- [Browser history](#createbrowserhistory) is used in web apps
- [Hash history](#createhashhistory) is used in web apps where you don't want to/can't send the URL to the server for some reason
- [Memory history](#creatememoryhistory) - is used in native apps and testing

Just pick the right mode for your target environment and you're good to go.

<a name="listening"></a>

### Listening

To read the current location and action, use [`history.location`](#history.location) and [`history.action`](#history.action). Both of these properties are mutable and automatically update as the location changes.

To be notified when the location changes, setup a listener using [`history.listen`](#history.listen).

<a name="navigation"></a>

### Navigation

To change the current location, you'll want to use one of the following:

- [`history.push`](#history.push) - Pushes a new location onto the history stack
- [`history.replace`](#history.replace) - Replaces the current location with another
- [`history.go`](#history.go) - Changes the current index in the history stack by a given delta
- [`history.back`](#history.back) - Navigates one entry back in the history stack
- [`history.forward`](#history.forward) - Navigates one entry forward in the history stack

<a name="confirming-navigation"></a>

### Confirming Navigation

To prevent the location from changing, use [`history.block`](#history.block). This API allows you to prevent the location from changing so you can prompt the user before retrying the transition.

<a name="creating-hrefs"></a>

### Creating `href` values

If you're building a link, you'll want to use [`history.createHref`](#history.createhref) to get a URL you can use as the value of `<a href>`.

---

<a name="reference"></a>

## Reference

The [source code](https://github.com/remix-run/history/tree/main/packages/history) for the history library is written in TypeScript, but it is compiled to JavaScript before publishing. Some of the function signatures in this reference include their TypeScript type annotations, but you can always refer to the original source as well.

<a name="action"></a>

### Action

An `Action` represents a type of change that occurred in the history stack. `Action` is an `enum` with three members:

- <a name="action.pop"></a> `Action.Pop` - A change to an arbitrary index in the stack, such as a back or forward navigation. This does not describe the direction of the navigation, only that the index changed. This is the default action for newly created history objects.
- <a name="action.push"></a> `Action.Push` - Indicates a new entry being added to the history stack, such as when a link is clicked and a new page loads. When this happens, all subsequent entries in the stack are lost.
- <a name="action.replace"></a> `Action.Replace` - Indicates the entry at the current index in the history stack being replaced by a new one.

See [the Getting Started guide](getting-started.md) for more information.

<a name="createbrowserhistory"></a>
<a name="browserhistory"></a>

### `History`

A `History` object represents the shared interface for `BrowserHistory`, `HashHistory`, and `MemoryHistory`.

<details>
  <summary>Type declaration</summary>

```ts
interface History {
  readonly action: Action;
  readonly location: Location;
  createHref(to: To): string;
  push(to: To, state?: any): void;
  replace(to: To, state?: any): void;
  go(delta: number): void;
  back(): void;
  forward(): void;
  listen(listener: Listener): () => void;
  block(blocker: Blocker): () => void;
}
```

</details>

### `createBrowserHistory`

<details>
  <summary>Type declaration</summary>

```tsx
function createBrowserHistory(options?: { window?: Window }): BrowserHistory;

interface BrowserHistory extends History {}
```

</details>

A browser history object keeps track of the browsing history of an application using the browser's built-in history stack. It is designed to run in modern web browsers that support the HTML5 history interface including `pushState`, `replaceState`, and the `popstate` event.

`createBrowserHistory` returns a `BrowserHistory` instance. `window` defaults to [the `defaultView` of the current `document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView).

```ts
import { createBrowserHistory } from 'history';
let history = createBrowserHistory();
```

See [the Getting Started guide](getting-started.md) for more information.

<a name="createpath"></a>
<a name="parsepath"></a>
<a name="createpath-and-parsepath"></a>

### `createPath` and `parsePath`

<details>
  <summary>Type declaration</summary>

```ts
function createPath(partialPath: Partial<Path>): string;
function parsePath(path: string): Partial<Path>;

interface Path {
  pathname: string;
  search: string;
  hash: string;
}
```

</details>

The `createPath` and `parsePath` functions are useful for creating and parsing URL paths.

```ts
createPath({ pathname: '/login', search: '?next=home' }); // "/login?next=home"
parsePath('/login?next=home'); // { pathname: '/login', search: '?next=home' }
```

<a name="createhashhistory"></a>
<a name="hashhistory"></a>

### `createHashHistory`

<details>
  <summary>Type declaration</summary>

```ts
createHashHistory({ window?: Window }): HashHistory;

interface HashHistory extends History {}
```

</details>

A hash history object keeps track of the browsing history of an application using the browser's built-in history stack. It is designed to be run in modern web browsers that support the HTML5 history interface including `pushState`, `replaceState`, and the `popstate` event.

`createHashHistory` returns a `HashHistory` instance. `window` defaults to [the `defaultView` of the current `document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView).

The main difference between this and [browser history](#createbrowserhistory) is that a hash history stores the current location in the [`hash` portion of the URL](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash#:~:text=The%20hash%20property%20of%20the,an%20empty%20string%2C%20%22%22%20.), which means that it is not ever sent to the server. This can be useful if you are hosting your site on a domain where you do not have full control over the server routes, or e.g. in an Electron app where you don't want to configure the "server" to serve the same page at different URLs.

```ts
import { createHashHistory } from 'history';
let history = createHashHistory();
```

See [the Getting Started guide](getting-started.md) for more information.

<a name="creatememoryhistory"></a>
<a name="memoryhistory"></a>

### `createMemoryHistory`

<details>
  <summary>Type declaration</summary>

```ts
function createMemoryHistory({
  initialEntries?: InitialEntry[],
  initialIndex?: number
}): MemoryHistory;

type InitialEntry = string | Partial<Location>;

interface MemoryHistory extends History {
  readonly index: number;
}
```

</details>

A memory history object keeps track of the browsing history of an application using an internal array. This makes it ideal in situations where you need complete control over the history stack, like React Native and tests.

`createMemoryHistory` returns a `MemoryHistory` instance. You can provide initial entries to this history instance through the `initialEntries` property, which defaults to `['/']` (a single location at the root `/` URL). The `initialIndex` defaults to the index of the last item in `initialEntries`.

```ts
import { createMemoryHistory } from 'history';
let history = createMemoryHistory();
// Or, to pre-seed the history instance with some URLs:
let history = createMemoryHistory({
  initialEntries: ['/home', '/profile', '/about']
});
```

See [the Getting Started guide](getting-started.md) for more information.

<a name="history.action"></a>

### `history.action`

The current (most recent) [`Action`](#action) that modified the history stack. This property is mutable and automatically updates as the current location changes.

See also [`history.listen`](#history.listen).

<a name="history.back"></a>

### `history.back()`

Goes back one entry in the history stack. Alias for `history.go(-1)`.

See [the Navigation guide](navigation.md) for more information.

<a name="history.block"></a>

### `history.block(blocker: Blocker)`

<details>
  <summary>Type declaration</summary>

```ts
interface Blocker {
  (tx: Transition): void;
}

interface Transition {
  action: Action;
  location: Location;
  retry(): void;
}
```

</details>

Prevents changes to the history stack from happening. This is useful when you want to prevent the user navigating away from the current page, for example when they have some unsaved data on the current page.

```ts
// To start blocking location changes...
let unblock = history.block(({ action, location, retry }) => {
  // A transition was blocked!
});

// Later, when you want to start allowing transitions again...
unblock();
```

See [the guide on Blocking Transitions](blocking-transitions.md) for more information.

<a name="history.createhref"></a>

### `history.createHref(to: To)`

Returns a string suitable for use as an `<a href>` value that will navigate to
the given destination.

<a name="history.forward"></a>

### `history.forward()`

Goes forward one entry in the history stack. Alias for `history.go(1)`.

See [the Navigation guide](navigation.md) for more information.

<a name="history.go"></a>

### `history.go(delta: number)`

Navigates back/forward by `delta` entries in the stack.

See [the Navigation guide](navigation.md) for more information.

<a name="history.index"></a>

### `history.index`

The current index in the history stack.

> [!Note:]
>
> This property is available only on [memory history](#memoryhistory) instances.

<a name="history.listen"></a>

### `history.listen(listener: Listener)`

<details>
  <summary>Type declaration</summary>

```ts
interface Listener {
  (update: Update): void;
}

interface Update {
  action: Action;
  location: Location;
}
```

</details>

Starts listening for location changes and calls the given callback with an `Update` when it does.

```ts
// To start listening for location changes...
let unlisten = history.listen(({ action, location }) => {
  // The current location changed.
});

// Later, when you are done listening for changes...
unlisten();
```

See [the Getting Started guide](getting-started.md#listening) for more information.

<a name="history.location"></a>

### `history.location`

The current [`Location`](#location). This property is mutable and automatically updates as the current location changes.

Also see [`history.listen`](#history.listen).

<a name="history.push"></a>

### `history.push(to: To, state?: any)`

Pushes a new entry onto the stack.

See [the Navigation guide](navigation.md) for more information.

<a name="history.replace"></a>

### `history.replace(to: To, state?: any)`

Replaces the current entry in the stack with a new one.

See [the Navigation guide](navigation.md) for more information.

<a name="location"></a>

### Location

<details>
  <summary>Type declaration</summary>

```ts
interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}
```

</details>

A `location` is a particular entry in the history stack, usually analogous to a "page" or "screen" in your app. As the user clicks on links and moves around the app, the current location changes.

<a name="location.pathname"></a>

### `location.pathname`

The `location.pathname` property is a string that contains an initial `/` followed by the remainder of the URL up to the `?`.

See also [`URL.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname).

<a name="location.search"></a>

### `location.search`

The `location.search` property is a string that contains an initial `?` followed by the `key=value` pairs in the query string. If there are no parameters, this value may be the empty string (i.e. `''`).

See also [`URL.search`](https://developer.mozilla.org/en-US/docs/Web/API/URL/search).

<a name="location.hash"></a>

### `location.hash`

The `location.hash` property is a string that contains an initial `#` followed by fragment identifier of the URL. If there is no fragment identifier, this value may be the empty string (i.e. `''`).

See also [`URL.hash`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash).

<a name="location.state"></a>

### `location.state`

The `location.state` property is a user-supplied [`State`](#state) object that is associated with this location. This can be a useful place to store any information you do not want to put in the URL, e.g. session-specific data.

> [!Note:]
>
> In web browsers, this state is managed using the browser's built-in
> `pushState`, `replaceState`, and `popstate` APIs. See also
> [`History.state`](https://developer.mozilla.org/en-US/docs/Web/API/History/state).

<a name="location.key"></a>

### `location.key`

The `location.key` property is a unique string associated with this location. On the initial location, this will be the string `default`. On all subsequent locations, this string will be a unique identifier.

This can be useful in situations where you need to keep track of 2 different states for the same URL. For example, you could use this as the key to some network or device storage API.

<a name="state"></a>

### State

A `State` value is an arbitrary value that holds extra information associated with a [`Location`](#location) but does not appear in the URL. This value is always associated with that location.

See [the Navigation guide](navigation.md) for more information.

<a name="to"></a>

### To

<details>
  <summary>Type declaration</summary>

```ts
type To = string | Partial<Path>;

interface Path {
  pathname: string;
  search: string;
  hash: string;
}
```

</details>

A [`To`](https://github.com/remix-run/history/blob/main/packages/history/index.ts#L178) value represents a destination location, but doesn't contain all the information that a normal [`location`](#location) object does. It is primarily used as the first argument to [`history.push`](#history.push) and [`history.replace`](#history.replace).

See [the Navigation guide](navigation.md) for more information.
