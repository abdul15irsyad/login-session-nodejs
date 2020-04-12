const express = require('express')
const app = express()
const crypto = require('crypto')
const db = require('../connect')
const { getConnectionUrl, getUserDetails } = require('../utils/googleapis')

// logout action
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

// middleware
app.use((req, res, next) => req.session.loggedIn ? res.redirect('/') : next())

// login form
app.get('/login', async (req, res) => {
  return res.render('login', {
    titlePage: 'Login',
    googleurl: await getConnectionUrl()
  })
})

// signup form
app.get('/signup', (req, res) => {
  return res.render('signup', {
    titlePage: 'Sign Up'
  })
})

// google auth
app.get('/login/google', async (req, res) => {
  let googleurl = await getConnectionUrl()
  res.redirect(googleurl)
})

// redirect after login
app.get('/google-redirect', async (req, res) => {
  let user = await getUserDetails(req.query.code)
  req.session.loggedIn = true
  req.session.fullname = user.data.name
  req.session.username = user.data.email
  res.redirect('/')
})

// login action
app.post('/login', (req, res) => {
  var username = req.body.username
  var password = req.body.password
  if (username && password) {
    password = crypto.createHash('sha256').update(password).digest('hex')
    db.query("SELECT * FROM tb_user WHERE username=? AND password=?", [username, password], (err, result) => {
      if (result.length > 0) {
        req.session.loggedIn = true
        req.session.fullname = result[0].fullname
        req.session.username = result[0].username
        // res.cookie('userData', result[0])
        console.log(`${result[0].username} has logged in`)
        res.redirect('/')
      } else {
        res.redirect('login')
      }
    })
  } else {
    res.redirect('login')
  }
})

// sign up action
app.post('/signup', (req, res) => {
  var fullname = req.body.fullname
  var username = req.body.username
  var password = req.body.password
  if (fullname && username && password) {
    password = crypto.createHash('sha256').update(password).digest('hex')
    db.query("INSERT INTO tb_user(fullname,username,password) VALUES(?,?,?)", [fullname, username, password], (err, result) => {
      if (!err) {
        req.session.loggedIn = true
        req.session.fullname = fullname
        req.session.username = username
        console.log(`${req.session.username} has signed up`)
        res.redirect('/')
      } else {
        console.log(err)
        res.redirect('/auth/signup')
      }
    })
  } else {
    res.redirect('/auth/login')
  }
})

module.exports = app