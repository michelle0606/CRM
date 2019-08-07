const db = require('../models')
const Tag = db.Tag
const CustomerDetail = db.CustomerDetail

const tagController = {
  postTag: async (req, res) => {
    const id = req.params.customers_id
    const tag = req.body.tag
    const existTag = await Tag.findOne({ where: { tag: tag } })

    if (existTag)
      return CustomerDetail.create({ CustomerId: id, TagId: existTag.id }).then(
        () => res.redirect(`/customers/${id}`)
      )
    else {
      Tag.create({
        tag: tag,
        ShopId: req.user.id
      })
        .then(newTag => {
          CustomerDetail.create({
            CustomerId: id,
            TagId: newTag.id
          })
        })
        .then(() => res.redirect(`/customers/${id}`))
    }
  },

  deleteTag: (req, res) => {
    return CustomerDetail.destroy({
      where: {
        CustomerId: req.params.customers_id,
        TagId: req.body.tagId
      }
    }).then(() => {
      res.redirect(`/customers/${req.params.customers_id}`)
    })
  }
}

module.exports = tagController
