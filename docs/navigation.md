# Navigation

`history` objects may be used to programmatically change the current location
using the following methods:

- [`history.push(to: To, state?: State)`](api-reference.md#history.push)
- [`history.replace(to: To, state?: State)`](api-reference.md#history.replace)
- [`history.go(delta: number)`](api-reference.md#history.go)
- [`history.back()`](api-reference.md#history.back)
- [`history.forward()`](api-reference.md#history.forward)

An example:

```js
// Push a new entry onto the history stack.
history.push('/home');

// Push a new entry onto the history stack with a query string
// and some state. Location state does not appear in the URL.
history.push('/home?the=query', { some: 'state' });

// If you prefer, use a location-like object to specify the URL.
// This is equivalent to the example above.
history.push({
  pathname: '/home',
  search: '?the=query'
}, {
  some: state
});

// Go back to the previous history entry. The following
// two lines are synonymous.
history.go(-1);
history.back();
```
