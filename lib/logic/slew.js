export default function slew({ slewGoingUp, slewGoingDown, defaultValue, slewFactor }) {
  let value = defaultValue;

  return (sample) => {
    if (!slewGoingUp && sample > value) {
      value = sample;
    } 
    else if (!slewGoingDown && sample < value) {
      value = sample;
    }
    else {
      value = (value * (slewFactor - 1) + sample) / slewFactor;
    }

    return value;
  }
}