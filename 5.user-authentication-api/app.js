const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const dbPath = path.join(__dirname, 'userData.db')
const app = express()
app.use(express.json())
let db = null
const intialliseDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running on port 3000')
    })
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}
intialliseDBAndServer()

app.post('/register', async (req, res) => {
  const {username, name, password, gender, location} = req.body
  if (password.length < 5) {
    res.status(400)
    return res.send('Password is too short')
  }

  const a = `
    select 
    *
    from
    user
    where
    username="${username}"
    `
  const hashedPassword = await bcrypt.hash(password, 10)
  const aa = await db.get(a)

  if (aa === undefined) {
    const b = `
        insert into user(username,name,password,gender,location)
        values
        ('${username}','${name}','${hashedPassword}','${gender}','${location}')`
    const aa = await db.run(b)
    res.status(200)
    res.send('User created successfully')
  } else {
    res.status(400)
    res.send('User already exists')
  }
})

app.post('/login', async (req, res) => {
  const {username, password} = req.body
  const a = `
    select 
    *
    from
    user
    where
    username="${username}"
    `
  const aa = await db.get(a)
  if (aa === undefined) {
    res.status(400)
    return res.send('Invalid user')
  }
  const isPasswordMatched = await bcrypt.compare(password, aa.password)
  if (isPasswordMatched) {
    res.status(200)
    return res.send('Login success!')
  }
  res.status(400)
  return res.send('Invalid password')
})
app.put('/change-password', async (req, res) => {
  const {username, oldPassword, newPassword} = req.body

  if (newPassword.length < 5) {
    return res.status(400).send('Password is too short')
  }

  const a = `
    SELECT *
    FROM user
    WHERE username = "${username}"
  `

  const aa = await db.get(a)

  if (aa === undefined) {
    return res.status(400).send('Invalid user')
  }

  const isMatched = await bcrypt.compare(oldPassword, aa.password)

  if (!isMatched) {
    return res.status(400).send('Invalid current password')
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10)

  const b = `
  update
  user
  set
  password="${hashedNewPassword}"
  where
  username="${username}"`

  await db.run(b)

  return res.status(200).send('Password updated')
})

module.exports = app
