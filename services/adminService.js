const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  //瀏覽全部餐廳
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ 
      raw: true,  //轉換成 JS 原生物件
      nest: true, //轉換成 JS 原生物件
      include: [Category] //include 取得關聯資料
    }).then(restaurants => {
      callback({restaurants: restaurants})
      // return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
        include: [Category]
      })
      .then(restaurant => {
        callback({restaurant: restaurant.toJSON()})
      })
  },
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({status:'error', message:'name didn\'t exist'})
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
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          callback({status:'success', message:'restaurant was successfully created'})
        })
      })
    } else {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          callback({status:'success', message:'restaurant was successfully created'})
        })
      }
  },
  putRestaurant: (req, res, callback) => {
    if(!req.body.name){    // name 欄位的必填驗證
      callback({status:'error', message:'name didn\'t exist'})
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
              CategoryId: req.body.categoryId
            }).then((restaurant) => {
              callback({status:'success', message:'restaurant was successfully to update'})
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
            image: restaurant.image,
            CategoryId: req.body.categoryId
          }).then((restaurant) => {
            callback({status:'success', message:'restaurant was successfully to update'})
          })
        })
    }
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminService