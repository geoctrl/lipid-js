# Lipid

Simple state management using observables. 

## Install

```shell
# yarn
$ yarn add lipid
```

```shell
# NPM
$ npm install -S lipid
```


## Setting up your state

### Simple Example

Get started by instantiating the `Lipid` class:

```typescript
import { Lipid } from 'lipid';
  
const myState = new Lipid();
console.log(myState.get());
// => {}
```

Each instantiated state is a separate instance of the `Lipid` class.

### Default State

You can add a default state by passing in an object as the first argument:

```typescript
import { Lipid } from 'lipid';

const myState = new Lipid({
  firstName: 'John',
  lastName: 'Doe',
  age: 5,
});

console.log(myState.get().name);
// => 'John'
```

### Extend your state

You can extend the `Lipid` class with any sort of methods that you need:

```typescript
import { Lipid } from 'lipid';

class MyState extends Lipid {
  isAdult() {
    return this.state.age >= 18;
  }
  hasLastName() {
    return !!this.state.lastName;
  }
}

const myState = new MyState({ age: 5 });
console.log(myState.isAdult());
// => false
``` 

## API

### `set(state, [options])`

Set state.

**Args**

- `state: Record<string, any>` - next state. 

- `options: { emit?: boolean, clear?: boolean }` - options for setting state.

| Property | Description                | Type   | Default |
|----------|----------------------------|--------|---------|
| `emit`   | Emit to subscribers        | `bool` | `true`  |
| `clear`  | Empty state before setting | `bool` | `false` |

Set state within your extending class, or with your instantiated instance:

**inside your extended class:**

```typescript
import { Lipid } from 'lipid';

class MyState extends Lipid {
  updateName(name) {
    const fullName = name.split(' ');
    this.set({
      firstName: fullName[0],
      lastName: fullName[1],
    });
  }
}

const myState = new MyState();
myState.updateName('John Doe');
```

**from the instantiated instance:**

```typescript
import myState from './my-state';

myState.set({
  firstName: 'John',
  lastName: 'Doe',
});
```

### `get(key?: string)`

Get the entire state object with no arguments `get()`, or pass in a key to get
one property `get(key)`.

```typescript
import { Lipid } from 'lipid';

const myState = new Lipid({ age: 29 });
myState.get(); // => { age: 29 }
myState.get('age'); // => 29
```

### `on(string[])`

Lipid uses observables to emit events across your app. To create an observable you can subscribe to,
call the `.on()` method.

If the `props` argument is empty (`on()` or `on([])`), all props changes will emit to this
subscriber. You can also pass an array of strings to pick and choose what to listen to:

```typescript
const myObservable = myState.on(['age']);
```

And listen for those changes:

```typescript
myObservable.subscribe(({ state }) => {
  console.log(state.age);
  // only emits 'age' changes
});
```

### `revertToDefault(options: { emit?: true, clear?: true })`

Revert state back to the default state passed in during instantiation.

```typescript
import { Lipid } from 'lipid';

const myState = new Lipid({ age: 29 });
myState.set({ age: 32, show: true });
myState.reset();
myState.get(); // { age: 29 }
```

### `setDefault(State: Record<string, any>)`

Set default state, so everytime you call `revertToDefault()` it will use this
newly defined state. **Note:** This will not set state - you can follow up by
firing `revertToDefault()`.

```typescript
import { Lipid } from 'lipid';

const myState = new Lipid({ age: 29 });
myState.set({ age: 32, show: true });
myState.setDefault({ age: 35, show: false });
myState.get(); // { age: 29 }
```

## Internal state hooks

### `onSetBefore((currentState: Record<string, any>) => Record<string, any>` 

Manipulate state before `set` is called. Requires state to be returned.

#### Args

- `function(currentState, delta) => newState` - function that returns new state.

```typescript
class MyState extends Lipid {
  onSetBefore = (state) => {
    return {
      ...state,
      lastUpdated: new Date(),
    }
  }
}
const myState = new MyState();
myState.set({ age: 29 });
state.get();
// => { age: 29, lastUpdated: 1571291829316 }
```

### `onSetAfter(newState: Record<string, any>, delta: Record<string, any>)` 

Do side effect things after `set` is called.

**Args**

- `state` - all of state.
- `delta` - only the properties that were just changed.

```typescript
class MyState extends Lipid {
  onSetAfter(state) {
    updateStorage('myState', state).then(() => {});
  }
}
```

**Warning:** calling `this.set()` within a hook will result in an infinite loop and will crash your app 😨. Don't do that.


## `lipidReactHookGenerator(LipidState)`

This method will generate react hooks based off of changes made to your state.

```typescript jsx
import { Lipid, lipidReactHookGenerator } from 'lipid';

const myState = new Lipid({ message: 'Hello, world!' });
const useMyState = lipidReactHookGenerator(myState);
```

The generated hooks accept one argument: `string[]` - an array of property
"keys" to watch for changes:

```typescript jsx
import { useMyState } from './my-state';

function myComponent() {
  const { message } = useMyState(['message']);
  return (
    <div>
      {message}
    </div>
  );
}
```
