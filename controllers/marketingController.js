const db = require('../models')
const Customer = db.Customer
const Tag = db.Tag
const CustomerDetail = db.CustomerDetail
const nodemailer = require('nodemailer')
const credentials = require('../credentials')
// const imgur = require('imgur-node-api')

const marketingController = {
  getMarketingPage: (req, res) => {
    res.render('marketing', { title: '廣告行銷' })
  },

  sendEmail: (req, res) => {

    const { name, email, subject, message } = req.body

    let data = { name: name, message: message }
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
        .then(() => {

        })
        .catch(console.error)
    });
    res.render('marketing', { msg: '信件成功發送！' })

  },

}

module.exports = marketingController
