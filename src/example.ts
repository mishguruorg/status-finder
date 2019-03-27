/*
  Purpose: Demonstrate how to use @mishguru/status-finder with
  a somewhat realistic example.
*/

// 1. Import the function and generic type
import { statusFinder, StatusTree } from './'

// 2. Define the possible statuses that our state can represent
enum session {
  REQUIRES_CORRECT_PASSWORD,
  REQUIRES_CORRECT_USERNAME,
  REQUIRES_VERIFICATION,
  IS_ACTIVE_SESSION,
  AWAITING_VERIFICATION_TOKEN,
  ATTEMPTING_VERIFICATION,
  ERROR_STATE
}

// 3. Define the shape of the state we will be testing against
interface SessionState {
  isInvalid: boolean
  hasBadPassword: boolean
  hasBadUsername: boolean
  verification?: {
    isComplete: boolean
    attempt?: {
      token?: string
    }
  }
}

/* 4. Use the generic StatusTree to specify what the shape the statusTree will be

  `StatusTree<SessionState, session>`
  In our example:
  - the state being passed each test function will be SessionState
  - the possible outcomes will be one of the session enums
*/
type SessionTree = StatusTree<SessionState, session>

/* 5. Define the hierarchy of different statuses

   Once we have a succesful match, this will be returned.
 */
const statusTree: SessionTree = [
  {
    status: session.REQUIRES_CORRECT_PASSWORD,
    test: (state) => state.hasBadPassword === true,
    subStates: []
  },
  {
    status: session.REQUIRES_CORRECT_USERNAME,
    test: (state) => state.hasBadUsername === true,
    subStates: []
  },
  {
    status: session.IS_ACTIVE_SESSION,
    test: (state) => state.isInvalid === false,
    subStates: [
      {
        status: session.REQUIRES_VERIFICATION,
        test: ({ verification }) =>
          verification != null && verification.isComplete === false,
        subStates: [
          {
            status: session.AWAITING_VERIFICATION_TOKEN,
            test: ({ verification: { attempt } }) =>
              attempt != null && attempt.token == null,
            subStates: []
          },
          {
            status: session.ATTEMPTING_VERIFICATION,
            test: ({ verification: { attempt } }) =>
              attempt != null && attempt.token != null,
            subStates: []
          }
        ]
      }
    ]
  }
]

/*
  6. Retrieve the application state.

  In this example I have made up a value that's
  similar to what you can expect from querying
  a database with three SQL joins.

  I encourage you to experiment with changing the
  value of different properties to see how
  statusFinder produces different results.
 */
const state: SessionState = {
  isInvalid: false,
  hasBadPassword: false,
  hasBadUsername: false,
  verification: {
    isComplete: false,
    attempt: {
      token: null
    }
  }
}

// Use the statusFinder to determine what status we currently have
const result = statusFinder(state, statusTree, session.ERROR_STATE)

// Print out the result so we can see what the current status is
console.log(session[result])
