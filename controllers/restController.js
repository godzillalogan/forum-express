const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const Favorite = db.Favorite
const User = db.User
const helpers = require('../_helpers');

//分頁
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}  //這是要傳給 findAll 的參數，需要包裝成物件格式
    let categoryId = ''  //這是要放在 whereQuery 裡的內容
    if (req.query.page) { //如果有傳進來page的話
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll(({ // findAndCountAll 必須知道有多少筆資料
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,  //展開的是第二層 dataValues 裡面的物件
        description: r.dataValues.description.substring(0, 50), //substring 來截斷文字
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll({ 
        raw: true,
        nest: true
      }).then(categories => { // 取出 categoies 
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
        include:  [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' },
          { model: Comment, include: [User] }
        ]
      }).then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id) // 找出收藏此餐廳的 user
        const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id) // 找出like此餐廳的 user
        restaurant.increment('viewCounts',{ by:1 })
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(), //和 findByPk 搭配時可以用 toJSON()
          isFavorited: isFavorited,  // 將資料傳到前端
          isLiked: isLiked
        })
      })
   },
   getFeeds: (req, res) => {
    return Promise.all([    //同時完成Restaurant.findAll和Comment.findAll，才進入then
        Restaurant.findAll({
          limit: 10,                 //十筆資料
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],  //最新的
          include: [Category]
        }),
        Comment.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant]
        })
      ]).then(([restaurants,comments]) => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })
      })
  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      return res.render('dashboard', { restaurant: restaurant.toJSON() })
    })
  },
  getTopRestaurants:(req, res) => {
    Restaurant.findAll({
      include:
      [ {model: User, as: 'FavoritedUsers'}]
    }).then(restaurants =>{
      restaurants = restaurants.map(r =>({
        ...r.dataValues,
        description: r.description.substring(0, 50), //substring 來截斷文字
        favoriteCounts: r.FavoritedUsers.length, //計算有幾個收藏此餐廳的使用者
        isFavorited : helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      restaurants = restaurants.sort((a, b) => b.favoriteCounts - a.favoriteCounts)
      restaurants = restaurants.slice(0, 10)
      return res.render('topRestaurants',{restaurants})
    })
  }
}
module.exports = restController