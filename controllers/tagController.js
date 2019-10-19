const db = require('../models')
const { Tag, CustomerDetail, Customer } = db
const helpers = require('../_helpers')

const tagController = {
  postTag: async (req, res) => {
    const id = req.params.customers_id
    const tag = req.body.tag
    const existTag = await Tag.findOne({ where: { tag: tag } })

    if (existTag) {
      const customerDetail = await CustomerDetail.findOne({
        where: {
          CustomerId: id,
          TagId: existTag.id
        }
      })
      if (!customerDetail) {
        await CustomerDetail.create({ CustomerId: id, TagId: existTag.id })
      }
      return res.redirect(`/customers/${id}`)
    } else {
      Tag.create({
        tag: tag,
        ShopId: helpers.getUser(req).ShopId
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

    CustomerDetail.destroy({ where: { CustomerId: req.params.customers_id, TagId: req.body.tagId } }).then(() => {
      return res.redirect(`/customers/${req.params.customers_id}`)
    })
  }
}

module.exports = tagController
