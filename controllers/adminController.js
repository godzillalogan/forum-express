const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService.js')


const adminController = {
  //瀏覽全部餐廳
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res,(data) =>{
      return res.render('admin/restaurants', data)
    })
  },
  //Create
  createRestaurant: (req, res) => {
    Category.findAll({ 
      raw: true,
      nest: true
    }).then(categories =>{
      return res.render('admin/create',{
        categories: categories
      })
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  //Read,新增瀏覽餐廳頁面,名詞是單數
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res,(data) =>{
      return res.render('admin/restaurant', data)
    })
  },
  //update,Restaurant.findByPk(req.params.id)透過網址列上的id找出餐廳資料，再把資料放到 restaurant 變數裡傳給view
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories:categories, 
          restaurant: restaurant.toJSON()
        } )
      })
    })
  },
  //Update
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  //Delete
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
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