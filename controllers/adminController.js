const db = require('../models')
// const User = db.User
const Shop = db.Shop
const imgur = require('imgur-node-api')

const adminController = {
	createShop: (req, res) => {
		return res.render('advance/create')
	},

	postShop: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需要有店名')
  		return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Shop.create({
          name: req.body.name,
          phoneNr: req.body.phoneNr,
          email: req.body.email,
          address: req.body.address,
          logo: file ? img.data.link : null,
        }).then((shop) => {
          req.flash('success_messages', '新增成功')
					res.redirect('/advance/shops')
        })
      })
    } else {
      return Shop.create({
        name: req.body.name,
        phoneNr: req.body.phoneNr,
        email: req.body.email,
        address: req.body.address,
      })
      .then((shop) => {
        req.flash('success_messages', '新增成功')
        res.redirect('/advance/shops')
      })
    }
  },

	getShops: (req, res) => {
		return Shop
			.findAll()
			.then(shops => {
				res.render('advance/shops', { shops })
	    })
	},

	getShop: (req, res) => {
		return Shop
		  .findByPk(req.params.id)
		  .then(shop => {
		  	res.render('advance/shop', { shop })
		  })
	},

  editShop: (req, res) => {
		return Shop
			.findByPk(req.params.id)
			.then(shop => {
				return res.render('advance/create', { shop })
   		})
  },

  putShop: (req, res) => {
  	if (!req.body.name) {
      req.flash('error_messages', '需填店名');
      return res.redirect('back');
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        Shop
          .findByPk(req.params.id)
          .then((shop) => {
            shop
              .update({
                name: req.body.name,
                phoneNr: req.body.phoneNr,
                email: req.body.email,
                address: req.body.address,
                logo: file ? img.data.link : shop.logo,
              })
              .then(() => {
                req.flash('success_messages', '修改成功');
                res.redirect('/advance/shops')
                // res.redirect(`/advance/shops/${req.params.id}`);
              });
          });
      });
    } else {
      Shop
        .findByPk(req.params.id)
        .then((shop) => {
          shop
            .update({
              name: req.body.name,
              phoneNr: req.body.phoneNr,
              email: req.body.email,
              address: req.body.address,
              logo: shop.logo,
            })
            .then(() => {
              req.flash('success_messages', '修改成功');
              res.redirect('/advance/shops')
              // res.redirect(`/advance/shops/${req.params.id}`);
            });
        });
    }
  },

  deleteShop: (req, res) => {
  	return Shop
  		.destroy({ 
  			where: {
  				id: Number(req.params.id) 
  			}
  		})
      .then(() => {
        return res.redirect('/advance/shops')
      })
  },
}

module.exports = adminController
