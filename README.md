# Simple State

Simple state management that scales with your application. No dependencies. Less than 1kb gzipped.

## Install

```shell
# NPM
$ npm install -S @geoctrl/simple-state
```

```shell
# yarn
$ yarn add @geoctrl/simple-state
```

## Setting up your state

#### Simple Example

To use simple-state, just instantiate the `SimpleState` class:

```javascript
import SimpleState from '@geoctrl/simple-state';
  
const myState = new SimpleState();
console.log(myState.get()); // {}
```

Each instantiated state is a separate instance of the `simple-state` class, and contains all the methods needed
to use the state.

#### Default State

You can add a default state by passing in an object as the first argument:

```javascript
import SimpleState from '@geoctrl/simple-state';

const myState = new SimpleState({
  firstName: 'John',
  lastName: 'Doe',
  age: 5,
});

console.log(myState.get().name); // 'John'
```

You can also reset to your default state with the `reset()` method. Continue reading for details.

#### Extend your state

If you need to add complicated logic or ajax calls when you change state, we can extend the `SimpleState` class
with any sort of methods that we want:

```javascript
import SimpleState from '@geoctrl/simple-state';

class MyState extends SimpleState {
  isAdult() {
    return this.state.age >= 18;
  }
  hasLastName() {
    return !!this.state.lastName;
  }
}

const myState = new MyState({ age: 5 });
console.log(myState.isAdult()); // false
``` 

## Using your state

Using the example above, we can now use our `myState` in our app.

#### .set(state)

To set data on your state, you need to use the `.set()` method. This can be done within your extending class, or your
instantiated instance:

**inside your extending class:**

```javascript
import SimpleState from '@geoctrl/simple-state';

class MyState extends SimpleState {
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

```javascript
import myState from './my-state';

myState.set({
  firstName: 'John',
  lastName: 'Doe',
});
```

#### .get(key)

Get the entire state object with no arguments (`.get()`), or pass in a key to get one property (`.get(key)`):

```javascript
import SimpleState from '@geoctrl/simple-state';

const myState = new SimpleState({ age: 29 });
myState.get(); // { age: 29 }
myState.get('age'); // 29
```

#### .clear()

Completely clear state (empty object). This method will emit changes to all subscribers.

```javascript
import myState from './my-state';

const state = myState.get({ age: 29 });
state.clear();
state.get(); // {}
```

#### .reset()

Reset state back to `defaultState` (passed in during instantiation). This method will emit changes to all subscribers.

```javascript
import SimpleState from '@geoctrl/simple-state';

const myState = new SimpleState({ age: 29 });
myState.set({ age: 32, show: true });
myState.reset();
myState.get(); // { age: 29 }
```

#### .subscribe(next, props, error)

Subscribe allows us to get incremental changes over time. Much like how observables work, we subscribe to the state and pass
in a callback to be called on every change:

```javascript
// from the instantiated instance:
import myState from './my-state';

myState.subscribe((state) => console.log(state));
```

If your state is big, there's a good chance that not every observer will want all changes. To make sure we're being
smart with our updates, we can pass in key names into the `props` argument to tell our state what props to watch for and let us
know if any changes have occurred:

```javascript
import myState from './my-state';

myState.subscribe((state) => console.log(state), ['firstName', 'lastName']);
// only changes to 'firstName' and 'lastName' will fire an event here
```

The last argument `error` is a callback in case an error is thrown within the class.

```javascript
import myState from './my-state';

myState.subscribe((state) => console.log(state), [], (err) => {
  // handle error
  console.error(err);
});
```

## State set hooks

#### .onSetBefore(state) => state 

Manipulate state before `set` is called. Requires state to be returned.

```javascript
class MyState extends SimpleState {
  onSetBefore(state) {
    return {
      ...state,
      lastUpdated: new Date(),
    }
  }
}
const myState = new MyState();
myState.set({ age: 29 });
state.get(); // { age: 29, lastUpdated: 1571291829316 }
```

#### .onSetAfter(newState, delta) 

Do side-effect things after `set` is called.

**Args**

- `newState` - new state
- `delta` - new state passed in to `.set()`. This helps us perform specific operations based on the delta properties.

```javascript
class MyState extends SimpleState {
  onSetAfter(state) {
    updateStorage('myState', state).then(() => {});
  }
}
```

**Warning:** calling `this.set()` within a hook will result in an infinite loop and will crash your app 😨. Don't do that.


## Practical React Example

**my-state.js**

```javascript
import SimpleState from '@geoctrl/simple-state';

class MyState extends SimpleState {
  isAdult() {
    return this.state.age >= 18;
  }
}

export default new MyState();
```

**app.js**

```javascript
import React, { useState, useEffect } from 'react';
import myState from './my-state';

export function DisplayAge() {
  const [age, updateAge] = useState(myState.state.age);
  const [isAdult, updateIsAdult] = useState(myState.isAdult());
  
  useEffect(() => {
    const ageObserver = myState.subscribe(({ age }) => {
      updateAge(age);
      updateIsAdult(myState.isAdult());
    }, ['age'], (err) => {
      console.error(err);
    });
    return ageObserver.unsubscribe;
  }, []);  
  
  return (
    <div>
      <div>Age: {age}</div>
      <div>Is adult: {isAdult.toString()}</div>
    </div>
  );
}
```
