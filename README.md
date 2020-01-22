# Lipid

Lipid is simple state management. 

## Install

```shell
# NPM
$ npm install -S lipid
```

```shell
# yarn
$ yarn add lipid
```

## Setting up your state

### Simple Example

Get started by instantiating the `Lipid` class:

```javascript
import Lipid from 'lipid';
  
const myState = new Lipid();
console.log(myState.get()); // {}
```

Each instantiated state is a separate instance of the `Lipid` class, and contains all the methods needed
to use the state.

### Default State

You can add a default state by passing in an object as the first argument:

```javascript
import Lipid from 'lipid';

const myState = new Lipid({
  firstName: 'John',
  lastName: 'Doe',
  age: 5,
});

console.log(myState.get().name); // 'John'
```

You can also reset to your default state with the `reset()` method. Continue reading for details.

### Extend your state

If you need to add complicated logic or ajax calls when you change state, we can extend the `Lipid` class
with any sort of methods that we want:

```javascript
import Lipid from 'lipid';

class MyState extends Lipid {
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

### .set(state, [options])

#### `state` (object)

Object to append to state.

#### `options` (object)

| Property | Description | Type | Default |
| --- | --- | --- | --- 
| `emit` | Emit to subscribers | `bool` | `true` |
| `clear` | Clear state before setting | `bool` | `false` |

Set state within your extending class, or with your instantiated instance:

**inside your extending class:**

```javascript
import Lipid from 'lipid';

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

```javascript
import myState from './my-state';

myState.set({
  firstName: 'John',
  lastName: 'Doe',
});
```

### .get(key)

Get the entire state object with no arguments (`.get()`), or pass in a key to get one property (`.get(key)`):

```javascript
import Lipid from 'lipid';

const myState = new Lipid({ age: 29 });
myState.get(); // { age: 29 }
myState.get('age'); // 29
```

### .reset()

Reset state back to `defaultState` (passed in during instantiation). This method will emit changes to all subscribers.

```javascript
import Lipid from 'lipid';

const myState = new Lipid({ age: 29 });
myState.set({ age: 32, show: true });
myState.reset();
myState.get(); // { age: 29 }
```

### .on([props])

Lipid uses observables to emit events across your app. To create an observable you can subscribe to,
call the `.on()` method.

If the `props` argument is empty (`.on()` or `.on([])`), all props changes will emit to this
subscriber. You can also pass an array of strings to pick and choose what to listen to:

```javascript
const myObservable = myState.on(['age']);
```

Observables use the latest version of rxjs, so feel free to pipe to your heart's content:

```javascript
myObservable.subscribe(({ state }) => {
  console.log(state.age);
  // only emits 'age' changes
});
```

## Internal state hooks

### .onSetBefore(state) => state 

Manipulate state before `set` is called. Requires state to be returned.

```javascript
class MyState extends Lipid {
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

### .onSetAfter(newState, delta) 

Do side-effect things after `set` is called.

**Args**

- `newState` - new state
- `delta` - new state passed in to `.set()`. This helps us perform specific operations based on the delta properties.

```javascript
class MyState extends Lipid {
  onSetAfter(state) {
    updateStorage('myState', state).then(() => {});
  }
}
```

**Warning:** calling `this.set()` within a hook will result in an infinite loop and will crash your app 😨. Don't do that.


## Practical React Example

**my-state.js**

```javascript
import Lipid from 'lipid';

class MyState extends Lipid {
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
