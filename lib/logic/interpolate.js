export const interpolate = (startState, endState) => {
  let currentState = { ...startState }

  const interpolation = {}
  for (let property in endState) {
    interpolation[property] = endState[property] - startState[property]
  }

  return t => {
    for (let property in currentState) {
      currentState[property] = startState[property] + interpolation[property] * t
    }
    return currentState
  }
}
