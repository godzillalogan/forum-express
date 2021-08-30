const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const passport = require('./config/passport')  
const helpers = require('./_helpers');

const app = express()
const port = process.env.PORT || 3000

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

app.use(bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', handlebars({ 
  defaultLayout: 'main' 
}))
app.set('view engine','handlebars')
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize()) //初始化 Passport
app.use(passport.session())  //啟動 session 功能，這組設定務必要放在 session() 之後
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))


app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)  //取代req.user
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
