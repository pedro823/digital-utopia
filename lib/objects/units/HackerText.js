import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useRef, useEffect } from "react";
import mergeRefs from "react-merge-refs";
import { randomSentence } from "../../logic/hackerTextGenerator";
import { useStateStorage } from "../../state/stateStorage";

export default forwardRef(function HackerText(props, textElementRef) {
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const innerRef = useRef()
  const totalInterval = useRef(0)
  const { useBeat, refreshInterval, wordCount } = props
  const text = useRef(randomSentence(wordCount ?? 5))

  useEffect(() => useStateStorage.subscribe(
    isBeatFrame => (beatFrameRef.current = isBeatFrame),
    state => state.isBeatFrame
  ), [])

  useFrame((_state, delta) => {
    if (!useBeat && !refreshInterval) return

    if ((totalInterval.current >= refreshInterval) || (useBeat && beatFrameRef.current)) {
      text.current = randomSentence(wordCount ?? 5)
      totalInterval.current = 0

      if (innerRef.current) { 
        innerRef.current.text = text.current
      }
    } else {
      totalInterval.current += delta
    }
  })

  return (
    <Text
      {...props}
      ref={mergeRefs([innerRef, textElementRef])}
      text={text.current}
      font="https://fonts.gstatic.com/s/tomorrow/v5/WBLmrETNbFtZCeGqgSXV.ttf"
    />
  )
});