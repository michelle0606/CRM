// function ensureAuthenticated(req) {
//   return req.isAuthenticated();
// }

// function getUser(req) {
//   return req.user;
// }

function permit(...allowed) {
	let reqUsersRole = ''
	const isAllowed = role => allowed.indexOf(role) > -1

  // return a middleware
  return (req, res, next) => {
  	if (!req.isAuthenticated()) res.redirect('/login')

  	switch(req.user.role) {
		  case 0:
		    reqUsersRole = 'admin'
		    break
		  case 1:
		    reqUsersRole = 'mgr'
		    break
		  default:
		    reqUsersRole = 'salesperson'
		}

    if (req.user && isAllowed(reqUsersRole)) next()// continue on the next middleware
    else res.redirect('/')
  }
}

module.exports = {
  // ensureAuthenticated,
  // getUser,
  permit
};
