const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    //用 Restaurant.findAll 從 Restaurant model 裡取出資料，並運用 include 一併拿出關聯的 Category model
    Restaurant.findAll({ include: Category }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,  //展開的是第二層 dataValues 裡面的物件
        description: r.dataValues.description.substring(0, 50), //substring 來截斷文字
        categoryName: r.Category.name
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}
module.exports = restController