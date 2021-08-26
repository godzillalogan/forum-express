const db = require('../models')
const Restaurant = db.Restaurant

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
  return Restaurant.create({
    name: req.body.name,
    tel: req.body.tel,
    address: req.body.address,
    opening_hours: req.body.opening_hours,
    description: req.body.description
  })
    .then((restaurant) => {
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    })
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
    if(!req.body.name){
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
  
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description
        })
        .then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully to update')
          res.redirect('/admin/restaurants')
        })
      })
  },
}

module.exports = adminController