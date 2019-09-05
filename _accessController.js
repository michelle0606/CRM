const helpers = require('./_helpers')

function permit(...allowed) {
	let reqUsersRole = ''
	const isAllowed = role => allowed.indexOf(role) > -1

  // return a middleware
  return (req, res, next) => {
  	if (!helpers.ensureAuthenticated(req)) return res.redirect('/login')

  	switch(helpers.getUser(req).role) {
		  case 0:
		    reqUsersRole = 'admin'
		    break
		  case 1:
		    reqUsersRole = 'mgr'
		    break
		  default:
		    reqUsersRole = 'salesperson'
		}

    if (helpers.getUser(req) && isAllowed(reqUsersRole)) next()// continue on the next middleware
    else return res.redirect('/')
  }
}

module.exports = {
  permit
}
