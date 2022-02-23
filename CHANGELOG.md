# Simple State Changelog

## v2.0.0

#### Changes

- tree-shaking lodash with `lodash-es`
- convert module to typescript
- upgrade dependencies
- add react hook generator


#### Breaking

- removed `.state` property

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
