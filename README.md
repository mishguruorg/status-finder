# @mishguru/status-finder #

Business logic tends to have many `if` statements and embedded `if` statements to decide what the current status is.

This tool is an alternative for writing and reviewing business logic that needs to decide what status we are currently in.

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

### Status Tree

This is a data structure that represents the a hierarchy of logic to make sense of the state.

The Status Tree is made up of `Status Node`s and `subStates`. Each node contains a test function to decide if this is the current status.

Each node in the StatusTree can have an array of sub states that also need to be checked.

#### Status Node ####

One of the possible outcomes from evaluating a Status Tree

##### Status #####

The value of the `status` property on a `Status Node`. This value will be returned by the statusFinder

##### Test #####

The value of the `test` property on a `Status Node`.

This value is a function that will be proided the application `state` as an argument and returns a `boolean`.

This function has to decide whether the current Status Node is a match or not.

#### SubStates ####

In the same way we like to write nested `if` statements, subStates exist to reduce code duplication.

Each status node has the option to specify subStates. Each subState implements the same shape as the `Status Node`.

### State

A value that each `Status Node` will be tested against. The state should be designed by you and can be as simple or complex as your application requires.

### Status Finder ###

1. A recursive method that determines which `status` in the `StatusTree` matches the provided state. We start at the first position of the array (arrays start at zero) and evaluate one node at a time.

2. When a status match is found, we store the value of the current match and check if there are sub states we need to test against.

3. We repeat point 2 on the sub states until we have run out of sub states to check.

4. When we have run out of sub states to check, we return the value of the latest match

5. When we have found a node that matches, the value of the `status` property of that node will be returned.

## Example

I've put together an example that shows sub states being used. See [src/example.ts](src/example.ts)

## Author

[Brendon Muschamp](http://github.com/brendonjohn)


## License

Copyright 2019 Mish Guru Limited

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
