# Simple State Changelog

## v2.0.0

#### Changes

- tree-shaking lodash with `lodash-es`.
- converted module to typescript.
- upgraded dependencies.
- added react hook generator.
- added `setDefault()` method that will override the passed-in default state.
- updated README.


#### Breaking

- renamed `reset()` method to `revertToDefault()`.
- removed `state` property.
- internal lipid properties `__defaultState`, `__obs`, and `__state` are now
private properties inaccessible outside the definition.

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
