export type StatusTree<A, B> = {
  status: B,
  test: (state: A) => boolean,
  subStates: StatusTree<A, B>
}[]

const statusFinder = <A, B>(
  state: A,
  statusTree: StatusTree<A, B>,
  parentStatus: B | 'UNKNOWN' = 'UNKNOWN'
): B | 'UNKNOWN' => {
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
    return parentStatus
  } else {
    return statusFinder(state, remainingStatuses, parentStatus)
  }
}

export { statusFinder }
