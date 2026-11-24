const fs = require('fs')
const readStream = fs.createReadStream('./document.txt')

function getWordCount(text) {
  const words = text.split(' ')
  const ans = words.filter(word => word === 'Node')
  return ans.length
}
let word_count = 0

readStream.on('data', chunk => {
  const text = chunk.toString()
  word_count += getWordCount(text)
})
readStream.on('end', () => {
  console.log(`Word count for 'Node': ${word_count}`)
})
readStream.on('error', () => {
  console.log('Error counting words.')
})
