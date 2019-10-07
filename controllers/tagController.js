const db = require('../models')
const { Tag, CustomerDetail, Customer } = db
const helpers = require('../_helpers')

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

    Customer.findByPk(req.params.customers_id, { include: [{ model: Tag, as: 'associatedTags' }] })
      .then(customer => {
        customer.associatedTags.forEach(a => {
          if (a.tag === req.body.tagId) {
            Tag.destroy({ where: { id: a.id } }).then(() => {
            })
          }
        });
        return res.redirect(`/customers/${req.params.customers_id}`)
      })
  }
}

module.exports = tagController
