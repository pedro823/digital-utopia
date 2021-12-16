import { useStateStorage } from '../../state/stateStorage'
import styles from '../../../styles/Home.module.css'

export default function SceneDropdown() {
  const scenesAvailable = useStateStorage(state => state.scenesAvailable)
  const sceneIndex = useStateStorage(state => state.sceneIndex)
  const setScene = useStateStorage(state => state.setScene)

  return (
    <>
    {scenesAvailable == 0 ? null :
    <select className={styles.midiSelect}
      value={sceneIndex}
      onChange={(event) => setScene(Number.parseInt(event.target.value))}>
      {Array(scenesAvailable).fill(0).map((_, i) => 
      <option key={`sceneDropdown-${i}`} value={i}>Scene {i}</option>)}
    </select>}
    </>
  )
}