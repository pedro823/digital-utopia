export const distanceToSquared = ({ xA, yA, zA }, { xB, yB, zB }) => {
  return Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2) + Math.pow(zB - zA, 2)
}

export const distanceTo = (a, b) => Math.sqrt(distanceToSquared(a, b))
