const express = require('express');
const app = express();
const session = require('express-session')
const bodyparser = require('body-parser')
const auth = require('./routes/auth')
const db = require('./connect')

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
app.get('/',async (req,res)=>{
	db.query("SELECT * FROM tb_user WHERE username=?",[req.session.username],(err,result)=>{
		var user = result[0]
		res.render('home',{user})
	})
})
app.get('*',(req,res)=>res.send(`<h1>404 not found</h1><a href='/'>back to home</a>`))

app.listen(port,()=>console.log(`server running on http://localhost:${port}`))