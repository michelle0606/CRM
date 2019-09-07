const db = require('../models')
const Customer = db.Customer
const Tag = db.Tag
const CustomerDetail = db.CustomerDetail
const nodemailer = require('nodemailer')
const credentials = require('../credentials')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const MailTemplate = db.MailTemplate

const marketingController = {
  getMarketingPage: async (req, res) => {
    const template = await MailTemplate.findOne({ where: { id: 1 } })

    const originTags = await Tag.findAll()

    const array = originTags.map(a => a.tag)

    const tags = []

    array.forEach(item => {
      tags.includes(item) ? false : tags.push(item);
    })
    res.render('marketing', { title: '廣告行銷', template, tags })

  },

  sendEmail: (req, res) => {
    const { name, email, subject, message } = req.body

    let data = { name: name, message: message }

    if (typeof email !== 'string') {
      email.forEach(mail => {
        async function main() {
          let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: credentials.gmail.user,
              pass: credentials.gmail.pass
            }
          })

          res.render('email/hello', { layout: null, data }, (err, html) => {
            if (err) return console.log('error in email template')
            transporter.sendMail({
              from: '"Lancome蘭蔻" <lancome@gmail.com>',
              to: mail,
              subject: subject,
              html: html
            })
          })
        }
        main()
          .then(() => {})
          .catch(console.error)
      })
      res.render('marketing', { msg: '信件成功發送！' })
    } else {
      async function main() {
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: credentials.gmail.user,
            pass: credentials.gmail.pass
          }
        })

        res.render('email/hello', { layout: null, data }, (err, html) => {
          if (err) return console.log('error in email template')
          transporter.sendMail({
            from: '"Lancome蘭蔻" <lancome@gmail.com>',
            to: email,
            subject: subject,
            html: html
          })
        })
      }
      main()
        .then(() => {
          res.render('marketing', { msg: '信件成功發送！' })
        })
        .catch(console.error)
    }
  },

  updateTemplate: (req, res) => {
    const { template, title, message } = req.body
    const { file } = req

    console.log(req.body)

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
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
          message
        }).then(t => {
          res.redirect('back')
        })
      })
    }
  }
}

module.exports = marketingController
