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
    // return Restaurant.findAll({ 
    //   raw: true,  //轉換成 JS 原生物件
    //   nest: true, //轉換成 JS 原生物件
    //   include: [Category] //include 取得關聯資料
    // }).then(restaurants => {
    //   return res.json({ restaurants: restaurants })
    // })
  }
}

module.exports = adminController