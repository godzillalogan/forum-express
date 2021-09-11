const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = require('../../services/adminServices.js')

const adminController = {
  //瀏覽全部餐廳
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req,res ,(data)=>{
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req,res ,(data)=>{
      return res.json(data)
    })
  }
}

module.exports = adminController