const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}  //這是要傳給 findAll 的參數，需要包裝成物件格式
    let categoryId = ''  //這是要放在 whereQuery 裡的內容
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    //用 Restaurant.findAll 從 Restaurant model 裡取出資料，並運用 include 一併拿出關聯的 Category model
    Restaurant.findAll(({ 
      include: Category,
      where: whereQuery 
    })).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,  //展開的是第二層 dataValues 裡面的物件
        description: r.dataValues.description.substring(0, 50), //substring 來截斷文字
        categoryName: r.Category.name
      }))
      Category.findAll({ 
        raw: true,
        nest: true
      }).then(categories => { // 取出 categoies 
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId
        })
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
        include:  Category
      }).then(restaurant => {
        return res.render('restaurant', {
          restaurant: restaurant.toJSON() //和 findByPk 搭配時可以用 toJSON()
        })
      })
   }
}
module.exports = restController