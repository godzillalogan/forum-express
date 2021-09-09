const express = require('express');
const router = express.Router();

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const apiAdminController = require('../controllers/api/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers');

const passport = require('../config/passport')


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

// 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
router.get('/api/admin/restaurants', apiAdminController.getRestaurants)


//如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) =>  res.redirect('restaurants')) 
//在 /restaurants 底下則交給 restController.getRestaurants 來處理
router.get('/restaurants', authenticated, restController.getRestaurants)
//Feeds
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
//top 10
router.get('/restaurants/top',authenticated, restController.getTopRestaurants)
//前台個別餐廳
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
//dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
// 連到 /admin 頁面就轉到 /admin/restaurants
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

// 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
//註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', upload.single('image'), userController.signUp)
//登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
//users top
router.get('/users/top', authenticated, userController.getTopUser)
//user profile
router.get('/users/:id', authenticated, userController.getUser)
//user edit
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)


//create
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
//Read
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
//Update
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
//Delete
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
//users
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)
//categories
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
//categories,Create
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
//categories,Update
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
//categories,delete
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)
//comments,create
router.post('/comments', authenticated, commentController.postComment)
//comments,delete
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
//favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
//like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
//following
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)


module.exports = router
