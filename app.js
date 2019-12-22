const express = require('express');
const app = express();
const session = require('express-session')
const bodyparser = require('body-parser')
const auth = require('./routes/auth')

const port = 5003
app.set('view engine', 'pug')
app.set('views','./views')

// middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({
	secret: 'abdul',
	resave: true,
	saveUninitialized: true
}))

app.use('/auth', auth)
app.use((req,res,next)=>!req.session.loggedIn ? res.redirect('/auth/login') : next())
app.get('/',(req,res)=>res.render('home',{username:req.session.username,fullname:req.session.fullname}))
app.get('*',(req,res)=>res.send('404 not found'))

app.listen(port,()=>console.log(`server running on http://localhost:${port}`))