const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => { //序列化」這個技術的用意就是只存 user id，不存整個 user
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {  //反序列化」就是透過 user id，把整個 user 物件實例拿出來。
  User.findByPk(id).then(user => {
    user = user.toJSON() // 此處與影片示範不同
    return cb(null, user) 
  })
})

module.exports = passport