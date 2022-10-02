// All the useful bits of code copied from here:
// https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/

import styles from "./waveformGenerator.module.css"

export const WaveformGenerator = ({
  currTime,
  totalSeconds,
  totalBars,
  onClick
}) => {
  const [waveformData, setWaveformData] = useState(null)

  const durationPerBar = totalSeconds / totalBars

  useEffect(() => {
    const audioContext = new AudioContext()

    fetch("./the-wient.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => visualize(audioBuffer))

    const visualize = (audioBuffer) => {
      const filtered = filterData(audioBuffer, totalBars)
      const normalised = normalizeData(filtered)

      setWaveformData(normalised)
    }
  }, [totalBars])

  return (
    <div>
    <h1>WaveformGenerator < /h1>
      {
    waveformData && (
      <div className={ styles.waveform }>
      {
        waveformData.map((wd, i) => (
          <Bar
              key= { i }
              size = { wd }
              index = { i }
              onClick = { onClick }
              currTime = { currTime }
              durationPerBar = { durationPerBar }
          />
          ))
      }
        < /div>
      )}
</div>
  );
};

const Bar = ({ currTime, durationPerBar, size, index, onClick }) => {
  const barStartTime = durationPerBar * index
  const barEndTime = barStartTime + durationPerBar
  const hasBeenPlayed = barEndTime <= currTime
  const isBeingPlayed = currTime > barStartTime && currTime < barEndTime
  let currBarDuration = 0
  if (isBeingPlayed) {
    currBarDuration = (currTime - barStartTime) / durationPerBar
  }

  const onBarClick = () => onClick(barStartTime + durationPerBar / 2)

  const background = hasBeenPlayed ? "red" : "blue"
  const fullBarHeight = size * 100

  return (
    <div className= { styles.barHolder } onClick = { onBarClick } >
      <div
        className={ styles.bar }
  style = {{ height: fullBarHeight, background }
}
/>
{
  isBeingPlayed && (
    <div className={ styles.barOverHolder }>
      <div
            className={ styles.barOver }
  style = {{ height: currBarDuration * fullBarHeight }
}
/>
  < /div>
      )}
</div>
  );
};

