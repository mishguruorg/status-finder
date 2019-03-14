export type StatusTree<A, B> = {
  status: B,
  test: (state: A) => boolean,
  subStates: StatusTree<A, B>
}[]

const statusFinder = <A, B>(
  state: A,
  statusTree: StatusTree<A, B>,
  fallbackStatus: B
): B=> {
  const [currentStatus, ...remainingStatuses] = statusTree

  const doesTestPass = currentStatus.test(state)

  if (doesTestPass === true) {
    const { subStates, status } = currentStatus
    if (subStates.length === 0) {
      return status
    } else {
      return statusFinder(state, subStates, status)
    }
  } else if (remainingStatuses.length === 0) {
    return fallbackStatus
  } else {
    return statusFinder(state, remainingStatuses, fallbackStatus)
  }
}

export { statusFinder }
