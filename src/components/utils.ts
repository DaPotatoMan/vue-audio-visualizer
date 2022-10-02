/**
 * Filters the AudioBuffer retrieved from an external source
 * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
 * @returns {Array} an array of floating point numbers
 */

export function filterData(audioBuffer: AudioBuffer, totalBars: number) {
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
  return filteredData
}

/**
 * Normalizes the audio data to make a cleaner illustration
 * @param {Array} filteredData the data from filterData()
 * @returns {Array} an normalized array of floating point numbers
 */
export function normalizeData(filteredData: number[]) {
  const multiplier = Math.max(...filteredData) ** -1
  // return filteredData.map(n => n * multiplier)
  return filteredData.map(n => +(n * multiplier).toFixed(2))
}

export async function visualize(src: string, totalBars = 100) {
  const audioContext = new AudioContext()
  const buffer = await fetch(src).then(i => i.arrayBuffer())
  const audioBuffer = await audioContext.decodeAudioData(buffer)

  const filtered = filterData(audioBuffer, totalBars)
  const normalised = normalizeData(filtered)

  return normalised
}
