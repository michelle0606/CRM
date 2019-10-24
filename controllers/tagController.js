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

  deleteTag: async (req, res) => {
    const c = await CustomerDetail.count({ 
      where: { 
        TagId: Number(req.body.tagId)
      } 
    })

    if (c === 1) {
      await Tag.destroy({
        where: {
          id: Number(req.body.tagId),
        }
      })
    }

    await CustomerDetail.destroy({
      where: { 
        CustomerId: Number(req.params.customers_id), 
        TagId: Number(req.body.tagId)
      } 
    })

    return res.redirect(`/customers/${req.params.customers_id}`)
  }
}

module.exports = tagController
