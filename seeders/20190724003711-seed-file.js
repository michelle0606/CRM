'use strict'

const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
const genders = ['female', 'male']

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      'Customers',
      Array.from({ length: 30 }).map(d => ({
        email: faker.internet.email(),
        phoneNr: faker.phone.phoneNumber(),
        name: faker.name.findName(),
        address: faker.address.streetAddress(),
        gender: faker.random.arrayElement(genders),
        age: Math.floor(Math.random() * 60) + 15,
        note: faker.lorem.text(),
        avatar: faker.image.avatar(),
        ShopId: Math.floor(Math.random() * 2) + 2,
        birthday: faker.date.past(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )

    queryInterface.bulkInsert(
      'Users',
      [
        {
          password: bcrypt.hashSync('12345', bcrypt.genSaltSync(10), null),
          name: 'admin',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 0,
          ShopId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          password: bcrypt.hashSync('12345', bcrypt.genSaltSync(10), null),
          name: 'shop2_mgr',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 1,
          ShopId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          password: bcrypt.hashSync('12345', bcrypt.genSaltSync(10), null),
          name: 'shop2_salesperson',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 2,
          ShopId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          password: bcrypt.hashSync('12345', bcrypt.genSaltSync(10), null),
          name: 'shop3_mgr',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 1,
          ShopId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          password: bcrypt.hashSync('12345', bcrypt.genSaltSync(10), null),
          name: 'shop3_salesperson',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 2,
          ShopId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )

    queryInterface.bulkInsert(
      'Shops',
      [
        {
          id: 1,
          email: 'shop1@example.com',
          phoneNr: '02 2720 1230',
          name: '平台自身',
          address: '台北市羅斯福路三段 283 巷 17 號',
          logo: faker.image.imageUrl(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          email: 'shop2@example.com',
          phoneNr: '02 2363 8009',
          name: '保養品專櫃',
          address: '台北市中山區林森北路 107 巷 8 號',
          logo: faker.image.imageUrl(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          email: 'shop3@example.com',
          phoneNr: '02 2521 2813',
          name: '咖啡食品材料行',
          address: '台北市信義區松壽路 2 號',
          logo: faker.image.imageUrl(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )

    queryInterface.bulkInsert(
      'MailTemplates',
      [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )

    return queryInterface.bulkInsert(
      'Products',
      Array.from({ length: 20 }).map(d => ({
        name: faker.commerce.productName(),
        manufacturer: '',
        category: '',
        purchasePrice: Math.floor(Math.random() * 200) + 100,
        salePrice: Math.floor(Math.random() * 200) + 300,
        image: faker.image.imageUrl(),
        inventory: Math.floor(Math.random() * 20),
        ShopId: Math.floor(Math.random() * 2) + 2,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )


  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Customers', null, {})
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Shops', null, {})
    queryInterface.bulkDelete('MailTemplates', null, {})
    return queryInterface.bulkDelete('Products', null, {})
  }
}
