# @mishguru/status-finder #

The status-finder is a different way to represent a tree of many `if` statements when trying to figure out what state you are in.

I thought I was making a finite state machine… but that’s really something else. This is instead a little tool to simplify how a status of many paths can be derived from state.

## Install

```
npm install @mishguru/status-finder
```

## Goals

- Represent possible states as data instead
- Make domain knowledge easier to review, test and typecheck
- Encourage all related state to be found before deriving what the current status is
- Encourage a clear distinction between retrieving data and deriving information from the data

## Concepts

### Status

One of the possible outcomes from evaluating a Status Tree

### Status Tree

A hierarchy of statuses that we will test for. Each node contains a test function to decide if this is the current status.

Each node in the StatusTree can have an array of sub states that also need to be checked.

### State

A value that each status will be tested against. The state can be as simple or complex as your application requires.

### Status Finder

1. A recursive method that determines which `status` in the `StatusTree` matches the provided state. We start at the first position of the array (arrays start at zero) and evaluate one node at a time.

2. When a status match is found, we store the value of the current match and check if there are sub states we need to test against.

3. We repeat point 2. on the sub states until we have run out of sub states to check. 

4. When we have run out of sub states to check, we return the value of the latest match

5. When we have found a node that matches, the value of the `status` property of that node will be returned.

6. When a match is not found `'UNKNOWN'` is returned.

 

## Example ##

1. Import our parts. `StatusTree` is available in typescript.

```typescript
import { statusFinder, StatusTree } from './'
```

2. Specify the shape of the state we are going to be testing against

```typescript
interface CatDog {
  thisIsCat: boolean,
  thisIsDog: boolean,
  hasANastyBite: true
}
```

3. Create a type that represents our status tree

```typescript
type Tree = StatusTree<CatDog, string>

/* The StatusTree is a recursive type, the result of Tree will be this:
type Tree = {
  status: string,
  test: (state: CatDog) => boolean,
  subStates: Tree<CatDog, string>
}[]
*/
```

4. Create a tree to represent the statuses that you would like to tests against the state (CatDog)

```typescript
const simpleTree: Tree = [
  {
    status: 'Meow Meow',
    test: (state) => state.thisIsCat === true,
    subStates: [
      {
        status: 'CatDog---------cAT---D0G',
        test: (state) => state.thisIsCat === true && state.thisIsDog === true,
        subStates: []
      }
    ]
  },
  {
    status: 'SHOULD NEVER BE RETURNED',
    test: (state) => state.thisIsCat === true && state.thisIsDog === true,
    subStates: []
  },
  {
    status: 'Wan Wan Woof Woof',
    test: (state) => state.thisIsDog === true,
    subStates: [
      {
        status: 'Big Fluffy Dog that has a nasty bite',
        test: (state) => state.hasANastyBite === true,
        subStates: []
      }
    ]
  }
]
```

5. For our example, create some state to test against. Normally this would be a database or API result.


```typescript
const fakeState = {
  thisIsCat: false,
  thisIsDog: true
}
```

6. Give the state to the statusFinder and print out the result

```typescript
constole.log(statusFinder(fakeState, simpleTree)

// Outputs ->  'Wan Wan Woof Woof'
```

Funnily enough, the example I've written is longer than the implemntation of status-finder
