const fs = require('fs')
const readStream = fs.createReadStream('./research_paper.txt')
const writeStream = fs.createWriteStream('./uppercase_output.txt')

function get_uppercase(text) {
  return text.toUpperCase()
}

readStream.on('data', chunk => {
  const text = chunk.toString()
  const updateData = get_uppercase(text)
  writeStream.write(updateData)
})
readStream.on('end', () => {
  console.log('Data transformed and written successfully')
})
readStream.on('error', () => {
  console.log('Error transforming and writing data')
})
