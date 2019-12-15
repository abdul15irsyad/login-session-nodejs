const express = require('express')
const app = express()
const path = require('path')
let db = require('../connect')

// logout action
app.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

// middleware
app.use((req,res,next)=>req.session.loggedIn ? res.redirect('/') : next())

// login form
app.get('/login',(req,res)=>res.render('login'))

// signup form
app.get('/signup',(req,res)=>res.render('signup'))

// login action
app.post('/login',(req,res)=>{
  var username = req.body.username
  var password = req.body.password
  if(username&&password){
    db.query("SELECT * FROM tb_user WHERE username=? AND password=?",[username,password],(err,result)=>{
      if(result.length > 0){
        req.session.loggedIn = true
        req.session.username = username
        res.redirect('/')
      }else{
        res.redirect('/auth/login')
      }
    })
  }else{
    res.redirect('/auth/login')
  }
})

// sign up action
app.post('/signup',(req,res)=>{
  var fullname = req.body.fullname
  var username = req.body.username
  var password = req.body.password
  if(fullname&&username&&password){
    db.query("INSERT INTO tb_user(fullname,username,password) VALUES(?,?,?)",[fullname,username,password],(err,result)=>{
      if(!err){
        req.session.loggedIn = true
        req.session.username = username
        res.redirect('/')
      }else{
        console.log(err)
        res.redirect('/auth/signup')
      }
    })
  }else{
    res.redirect('/auth/login')
  }
})

module.exports = app