import test from 'ava'
import { statusFinder, StatusTree } from './'

const singleNode: StatusTree<boolean, string> = [
  {
    status: 'i am the prettiest node',
    test: (amIPretty: boolean) => amIPretty,
    subStates: []
  }
]

interface CatDog {
  thisIsCat: boolean,
  thisIsDog: boolean
}

const simpleTree: StatusTree<CatDog, string> = [
  {
    status: 'CatDog---------cAT---D0G',
    test: (state: CatDog) => state.thisIsCat === true && state.thisIsDog === true,
    subStates: []
  },
  {
    status: 'Meow Meow',
    test: (state: CatDog) => state.thisIsCat === true,
    subStates: []
  },
  {
    status: 'Wan Wan Woof Woof',
    test: (state: CatDog) => state.thisIsDog === true,
    subStates: []
  }
]

test('UNKNOWN is returned when nothing is found', (t) => {
  const result = statusFinder<object, string>({}, simpleTree)

  t.is(result, 'UNKNOWN')
})

test('the first status can be retrieved', (t) => {
  const result = statusFinder(true, singleNode)

  t.is(result, 'i am the prettiest node')
})

test('the first matching status is retrieved', (t) => {
  const result = statusFinder(
    {
      thisIsCat: true,
      thisIsDog: true
    },
    simpleTree
  )

  t.is(result, 'CatDog---------cAT---D0G')
})

test('the last status can be retrieved', (t) => {
  const result = statusFinder(
    {
      thisIsDog: true
    },
    simpleTree
  )

  t.is(result, 'Wan Wan Woof Woof')
})
