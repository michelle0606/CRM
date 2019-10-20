'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
const genders = ['female', 'male']
const numOfCustomersGenerated = 30
const numOfProductsGenerated = 20
const numOfSalesRecordsGenerated = 150
const numOfMaximumDistinctItemsPurchased = 3
const numOfMaximumQtyPickedPerItem = 5
const dateStart = '2019-09-01'
const dateEnd = '2019-10-22'
const categories = ['美妝達人', '服飾達人', '美食達人']
let k = 1
const customers = Array.from({ length: numOfCustomersGenerated }).map(d => ({
  email: faker.internet.email(),
  phoneNr: faker.phone.phoneNumber(),
  name: faker.name.findName(),
  address: faker.address.streetAddress(),
  gender: faker.random.arrayElement(genders),
  age: Math.floor(Math.random() * 60) + 15,
  note: faker.lorem.text(),
  avatar: faker.image.avatar(),
  ShopId: k++ <= Math.floor(numOfCustomersGenerated / 2) ? 2 : 3,
  birthday: faker.date.past(),
  createdAt: new Date(),
  updatedAt: new Date()
}))
k = 1
const products = Array.from({ length: numOfProductsGenerated }).map(d => ({
  name: faker.commerce.productName(),
  manufacturer: '',
  category:
    k <= Math.floor(numOfProductsGenerated / 2)
      ? faker.random.arrayElement(categories)
      : faker.commerce.productAdjective(),
  purchasePrice: Math.floor(Math.random() * 200) + 100,
  salePrice: Math.floor(Math.random() * 200) + 300,
  image: faker.image.imageUrl(),
  inventory: Math.floor(Math.random() * 20),
  ShopId: k++ <= Math.floor(numOfProductsGenerated / 2) ? 2 : 3,
  createdAt: new Date(),
  updatedAt: new Date()
}))
const salesDetails = []
const sales = []

function shuffle(arr) {
  let i = arr.length,
    j = 0,
    tmp

  while (i--) {
    j = Math.floor(Math.random() * (i + 1))

    // swap randomly chosen element with current element
    tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

function generateSalesRecords() {
  let qty
  let productArrIdxs = Array.from(
    { length: Math.ceil(numOfProductsGenerated / 2) },
    (v, k) => k + Math.floor(numOfProductsGenerated / 2)
  )
  let randomProductArrIdxs
  let total
  let date
  let salesDetailsId = 1
  let salesId = 1

  for (let i = 0; i < numOfSalesRecordsGenerated; i++) {
    let tmp = Math.floor(Math.random() * numOfMaximumDistinctItemsPurchased) + 1
    randomProductArrIdxs = shuffle(productArrIdxs)
    // date = faker.date.past(1)// return a date within the past year
    date = faker.date.between(dateStart, dateEnd)
    total = 0

    for (let j = 0; j < tmp; j++) {
      qty = Math.floor(Math.random() * numOfMaximumQtyPickedPerItem) + 1
      total += products[randomProductArrIdxs[j]].salePrice * qty

      salesDetails.push({
        quantity: qty,
        ProductId: randomProductArrIdxs[j] + 1,// the id of the products happens to be the index of the array plus 1
        SaleId: sales.length + 1,
        createdAt: date,
        updatedAt: date
      })
    }
    sales.push({
      total: total,
      CustomerId:
        Math.floor(Math.random() * Math.ceil(numOfCustomersGenerated / 2)) +
        (Math.floor(numOfCustomersGenerated / 2) + 1),
      UserId: 5,
      ShopId: 3,
      createdAt: date,
      updatedAt: date
    })
  }
}

// generateSalesRecords()

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      'Customers',
      [
        {
          name: '非會員交易紀錄',
          ShopId: 2,
          receiveEmail: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: '非會員交易紀錄',
          ShopId: 3,
          receiveEmail: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
    queryInterface.bulkInsert('Customers', customers, {})
    queryInterface.bulkInsert(
      'Users',
      [
        {
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'admin',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 0,
          ShopId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'shop2_mgr',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 1,
          ShopId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'shop2_salesperson',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 2,
          ShopId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'shop3_mgr',
          avatar: 'https://i.imgur.com/Uzs2ty3.jpg',
          role: 1,
          ShopId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
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
          email: 'shop1@example.com',
          phoneNr: '02 2720 1230',
          name: '平台自身',
          address: '台北市羅斯福路三段 283 巷 17 號',
          logo: faker.image.imageUrl(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'shop2@example.com',
          phoneNr: '02 2363 8009',
          name: '保養品專櫃',
          address: '台北市中山區林森北路 107 巷 8 號',
          logo: faker.image.imageUrl(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
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

    queryInterface.bulkInsert('Products', products, {})

    queryInterface.bulkInsert(
      'SaleDetails',
      salesDetails,
      {}
    )

    queryInterface.bulkInsert(
      'Sales',
      sales,
      {}
    )

    return queryInterface.bulkInsert(
      'MailTemplates',
      [
        {
          title: '',
          message: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: '',
          message: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: '',
          message: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Customers', null, {})
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Shops', null, {})
    queryInterface.bulkDelete('Products', null, {})
    queryInterface.bulkDelete('SaleDetails', null, {})
    queryInterface.bulkDelete('Sales', null, {})
    return queryInterface.bulkDelete('MailTemplates', null, {})
  }
}
