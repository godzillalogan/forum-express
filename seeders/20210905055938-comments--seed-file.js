'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        text: faker.lorem.text().substr(1,15),  //substr 避免自串太長
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: Math.floor(Math.random() * 100) + 1,   
        RestaurantId: Math.floor(Math.random() * 100) + 1
      })
      ), {})
    },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
