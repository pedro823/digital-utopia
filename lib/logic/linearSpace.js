export const linearSpace = (startValue, endValue, nPoints) => {
  const distance = endValue - startValue
  const step = distance / (nPoints - 1)
  const listOfPoints = []

  let x = startValue
  for (let i = 0; i < nPoints; i++) {
    listOfPoints.push(x)

    x += step
  }

  return listOfPoints
}
