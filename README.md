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
  
const userState = new SimpleState();
console.log(userState.get()); // {}
```

Each instantiated state is a separate instance of the `simple-state` class, and contains all the methods needed
to use the state.

#### Default State

You can add a default state by passing in an object as the first argument:

```javascript
import SimpleState from '@geoctrl/simple-state';

const userState = new SimpleState({
  firstName: 'John',
  lastName: 'Doe',
  age: 5,
});

console.log(userState.get().name); // 'John'
```

#### Extend State

If you need to add complicated logic or ajax calls when you change state, we can extend the `SimpleState` class
with any sort of methods that we want:

```javascript
import SimpleState from '@geoctrl/simple-state';

class UserState extends SimpleState {
  isAdult() {
    return this.state.age >= 18;
  }
  hasLastName() {
    return !!this.state.lastName;
  }
}

const userState = new UserState({ age: 5 });
console.log(userState.isAdult()); // false
``` 

## Using your state

Using the example above, we can now use our `userState` in our app.

#### .set(state)

To set data on your state, you need to use the `.set()` method. This can be done within your extending class, or your
instantiated instance:

**inside your extending class:**

```javascript
import SimpleState from '@geoctrl/simple-state';

class UserState extends SimpleState {
  updateName(name) {
    const fullName = name.split(' ');
    this.set({
      firstName: fullName[0],
      lastName: fullName[1],
    });
  }
}

const userState = new UserState();
userState.updateName('John Doe');
```

**from the instantiated instance:**

```javascript
import userState from './user-state';

userState.set({
  firstName: 'John',
  lastName: 'Doe',
});
```

#### .get()

Get the entire state object with the `.get()` method.

```javascript
import userState from './user-state';

const state = userState.get();
const age = userState.get().age;
const { name } = userState.get();
```

#### .subscribe(next [, ...props])

Subscribe allows us to get incremental changes over time. Much like how observables, we subscribe to the state and pass
in a callback to be called on every change:

```javascript
// from the instantiated instance:
import userState from './user-state';

userState.subscribe((state) => console.log(state));
```

If your state is big, there's a good chance that not every observer will want all changes. To make sure we're being
smart with our updates, we can pass in key names to tell our state what props to watch for and let us
know if any changes have occurred:

```javascript
import userState from './user-state';

userState.subscribe((state) => console.log(state), 'firstName', 'lastName');
// only changes to 'firstName' and 'lastName' will fire an event here
```

## Practical React Example

**user-state.js**

```javascript
import SimpleState from '@geoctrl/simple-state';

class UserState extends SimpleState {
  isAdult() {
    return this.state.age >= 18;
  }
}

export default new UserState();
```

**app.js**

```javascript
import React, { useState, useEffect } from 'react';
import userState from './user-state';

export DisplayAge() {
  const [age, updateAge] = useState(userState.state.age);
  const [isAdult, updateIsAdult] = useState(userState.isAdult());
  
  useEffect(() => {
    const ageObservable = userState.subscribe(({ age }) => {
      updateAge(age);
      updateIsAdult(userState.isAdult());
    }, 'age');
    return ageObservable.unsubscribe;
  }, []);  
  
  return (
    <div>
      <div>Age: {age}</div>
      <div>Is adult: {isAdult.toString()}</div>
    </div>
  );
}
```
