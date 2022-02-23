# Simple State Changelog

## v2.0.0

- Module rewritten in typescript.

### BREAKING

- The `.state` property was removed. You can still get your state synchronously
by using `.get()`.
- 37kb

## v0.0.2

- Validation of idea

## v0.0.3

- README typo

## v0.1.0

#### Breaking
- `.get()` no longer takes in an argument
- Changed prop checks from an array to arguments: `observer.subscribe(callback, ...props)`

#### Updates

- 100% code coverage
- Removed all dependencies
- When no prop arguments are added, always emit changes
