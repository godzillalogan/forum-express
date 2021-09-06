const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const app = require('../app')
const routes = require('../routes/index')
const db = require('../models')
const helpers = require('../_helpers');

describe('# A21: Like / Unlike', function() {
    
  context('# Q1: 使用者可以 Like 餐廳', () => {
    before(async() => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Followings: []});

      await db.User.create({name: 'User1'})
      await db.Category.create({
        name: 'name'
      })
      await db.Restaurant.create({
        name: 'name',
        tel: 'tel',
        address: 'address',
        opening_hours: 'opening_hours',
        description: 'description',
        CategoryId: 1
      })
    })

    it(" POST /like/:restaurantId ", (done) => {
        request(app)
          .post('/like/1')
          .end(function(err, res) {
            return request(app)
              .get('/restaurants/1')
              .end(function(err, res) {
                res.text.should.include('Unlike')
                done()
            });
        });
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.Category.destroy({where: {},truncate: true, force: true,})
      await db.Restaurant.destroy({where: {},truncate: true, force: true,})
      await db.User.destroy({where: {},truncate: true, force: true,})
      await db.Like.destroy({where: {},truncate: true, force: true,})
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
    })
  })

    
  context('# Q2: 使用者可以 Unlike 餐廳', () => {
    before(async() => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Followings: []});

      await db.User.create({name: 'User1'})
      await db.Category.create({
        name: 'name'
      })
      await db.Restaurant.create({
        name: 'name',
        tel: 'tel',
        address: 'address',
        opening_hours: 'opening_hours',
        description: 'description',
        CategoryId: 1
      })
      await db.Like.create({
        UserId: 1,
        RestaurantId: 1
      })
    })

    it(" DELETE /like/:restaurantId ", (done) => {
        request(app)
          .delete('/like/1')
          .end(function(err, res) {
            return request(app)
              .get('/restaurants/1')
              .end(function(err, res) {
                res.text.should.include('Like')
                done()
            });
        });
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.Category.destroy({where: {},truncate: true, force: true,})
      await db.Restaurant.destroy({where: {},truncate: true, force: true,})
      await db.User.destroy({where: {},truncate: true, force: true,})
      await db.Like.destroy({where: {},truncate: true, force: true,})
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
    })

  })


})