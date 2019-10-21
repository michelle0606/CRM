const db = require('../models')
const { Shop, Tag, MailTemplate } = db
const nodemailer = require('nodemailer')
const imgur = require('imgur-node-api')

const marketingController = {
  getMarketingPage: async (req, res) => {
    const template = await MailTemplate.findOne({ where: { id: 1 } })

    const originTags = await Tag.findAll()

    const array = originTags.map(a => a.tag)

    const tags = []

    array.forEach(item => {
      tags.includes(item) ? false : tags.push(item)
    })
    res.render('marketing', { title: '廣告行銷', template, tags })
  },

  sendEmail: async (req, res) => {
    const { email, subject, message } = req.body
    let data = { subject: subject, message: message }
    const shopInfo = await Shop.findByPk(req.user.ShopId)

    if (typeof email !== 'string') {
      let trueMail = email.filter(mail => mail !== 'null')
      trueMail.forEach(mail => {
        async function main() {
          let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS
            }
          })

          res.render(
            'email/hello',
            { layout: 'email/layout', data, shopInfo },
            (err, html) => {
              if (err) return console.log('error in email template')
              transporter.sendMail({
                from: `"${shopInfo.name}" <waromen2019@gmail.com>`,
                to: mail,
                subject: subject,
                html: html
              })
            }
          )
        }
        main()
          .then(() => {})
          .catch(console.error)
      })
    } else {
      async function main() {
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        })
        res.render(
          'email/hello',
          { layout: 'email/layout', data, shopInfo },
          (err, html) => {
            if (err) return console.log('error in email template')
            transporter.sendMail({
              from: `"${shopInfo.name}" <waromen2019@gmail.com`,
              to: email,
              subject: subject,
              html: html
            })
          }
        )
      }
      main()
        .then(() => {
          req.flash('top_messages', '信件成功發送！')
          res.redirect('/marketing')
        })
        .catch(console.error)
    }
  },

  updateTemplate: (req, res) => {
    const { template, title, message } = req.body
    const { file } = req

    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        MailTemplate.findOne({ where: { id: template } }).then(t => {
          t.update({
            title,
            message,
            image: file ? img.data.link : t.image
          }).then(t => {
            res.redirect('back')
          })
        })
      })
    } else {
      MailTemplate.findOne({ where: { id: template } }).then(t => {
        t.update({
          title,
          message,
          image: null
        }).then(t => {
          res.redirect('back')
        })
      })
    }
  },

  APIGetAllMailTemplate: (req, res) => {
    MailTemplate.findAll().then(template => {
      res.send(template)
    })
  }
}

module.exports = marketingController
