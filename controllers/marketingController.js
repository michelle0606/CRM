const db = require('../models')
const Customer = db.Customer
const Tag = db.Tag
const CustomerDetail = db.CustomerDetail
const nodemailer = require('nodemailer')
const imgur = require('imgur-node-api')
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
          .then(() => { })
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
        .then(() => { })
        .catch(console.error)
    }
    req.flash('top_messages', '信件成功發送！')
    res.redirect('/marketing')
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
  }
}

module.exports = marketingController
