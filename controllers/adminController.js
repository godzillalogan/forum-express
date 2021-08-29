const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  //瀏覽全部餐廳
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },
  //Create
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
  if (!req.body.name) {
    req.flash('error_messages', "name didn't exist")
    return res.redirect('back')
  }
  const { file } = req // equal to const file = req.file
  if (file) {
    imgur.setClientID(IMGUR_CLIENT_ID);
    imgur.upload(file.path, (err, img) => {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: file ? img.data.link : null,
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    })
  } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  //Read,新增瀏覽餐廳頁面,名詞是單數
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant
      })
    })
  },
  //update,Restaurant.findByPk(req.params.id)透過網址列上的id找出餐廳資料，再把資料放到 restaurant 變數裡傳給view
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw:true}).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant } )
    })
  },
  //Update
  putRestaurant: (req, res) => {
    if(!req.body.name){    // name 欄位的必填驗證
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
  
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
            }).then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },
  //Delete
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },
  //Users
  getUsers:(req,res) =>{
    return User.findAll({raw:true}).then(users =>{
      return res.render('admin/users',{ users:users })
    })   
  },
  toggleAdmin:(req,res) =>{
    const id = req.params.id

    return User.findByPk(id)
      .then(user =>{
        user.isAdmin = user.isAdmin? false:true
        req.flash('success_messages', `${user.name} 成功變更為 ${user.isAdmin?'admin':'user'}`)
        return user.save()
      })
      .then(()=>{
        return res.redirect('/admin/users')
      })
  }
}

module.exports = adminController