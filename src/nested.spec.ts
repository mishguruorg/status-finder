import test from 'ava'
import { statusFinder, StatusTree } from './'

interface CatDog {
  thisIsCat: true
  thisIsDog: true
  hasANastyBite: true
}

const simpleTree: StatusTree<CatDog, string> = [
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

test('UNKNOWN is returned when nothing is found', (t) => {
  const result = statusFinder({}, simpleTree, 'UNKNOWN')

  t.is(result, 'UNKNOWN')
})

test('a nested status can be found', (t) => {
  const result = statusFinder(
    {
      thisIsCat: true,
      thisIsDog: true
    },
    simpleTree,
    'FAILED'
  )

  t.is(result, 'CatDog---------cAT---D0G')
})

test('A parent node is the fallback result if none of the subStates match', (t) => {
  const dogResult = statusFinder(
    {
      thisIsDog: true
    },
    simpleTree,
    'FAILED'
  )

  const catResult = statusFinder(
    {
      thisIsCat: true
    },
    simpleTree,
    'FAILED'
  )

  t.is(dogResult, 'Wan Wan Woof Woof')
  t.is(catResult, 'Meow Meow')
})
