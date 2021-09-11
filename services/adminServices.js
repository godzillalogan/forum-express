const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

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
  }
}

module.exports = adminService