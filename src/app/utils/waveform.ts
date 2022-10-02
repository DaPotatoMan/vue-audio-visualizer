import { getAudioBuffer } from './decoder'

function filterData(audioBuffer: AudioBuffer, totalBars: number) {
  const rawData = audioBuffer.getChannelData(0) // We only need to work with one channel of data
  const samples = totalBars // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples) // the number of samples in each subdivision
  const filteredData = []

  for (let i = 0; i < samples; i++) {
    const blockStart = blockSize * i // the location of the first sample in the block
    let sum = 0
    for (let j = 0; j < blockSize; j++)
      sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block

    filteredData.push(sum / blockSize) // divide the sum by the block size to get the average
  }

  // Normalizes the audio data to make a cleaner illustration
  const multiplier = Math.max(...filteredData) ** -1
  return filteredData.map(n => n * multiplier)
}

export async function getAudioData(src: string) {
  const ctx = new AudioContext({ sampleRate: 44100 })
  const buffer = await fetch(src).then(i => i.arrayBuffer())
  const audioBuffer = await getAudioBuffer(buffer, ctx)

  return (bars = 100) => filterData(audioBuffer, bars)
}
