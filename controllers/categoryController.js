const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService.js')
let categoryController = {
  getCategories: (req, res) => {
    // return Category.findAll({ 
    //   raw: true,
    //   nest: true
    // }).then(categories => {
    //   if (req.params.id) {
    //     Category.findByPk(req.params.id)
    //       .then((category) => {
    //         return res.render('admin/categories', { 
    //           categories: categories, 
    //           category: category.toJSON() 
    //         })
    //       })
    //   } else {
    //     return res.render('admin/categories', { categories: categories })
    //   }
    // })
    categoryService.getCategories(req, res ,(data)=>{
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })

  },
  deleteCategory: (req, res) => {
     categoryService.deleteCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/categories')
      }
    })
  }
}
module.exports = categoryController