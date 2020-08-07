//TODO: delete, update

// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const path = require('path');

// '/users/'
// exports.getUsersRoot = (req, res) => {
//     const { userId } = req.session;
    
// 	// res.send(`
// 	// 	<h1>Welcome!</h1>
// 	// 	${userId ? `
// 	// 		<a href='/users/profile'>Profile</a>
// 	// 		<form method='post' action='/users/logout'>
// 	// 			<button>Logout</button>
// 	// 		</form>
// 	// 	` : `
// 	// 		<a href='/users/login'>Login</a>
// 	// 		<a href='/users/register'>Register</a>
// 	// 	`} 
// 	// `);
// 	res.sendFile('index.html', { root : './public'});
// }

// '/users/profile' (make sure to have redirectLogin)
// exports.getUsersProfile = (req, res) => {
// 	const { user } = res.locals;
// 	// res.send(`
// 	// 	<h1>Profile</h1>
// 	// 	<a href='/users'>Main</a>
// 	// 	<ul>
// 	// 		<li>Name: ${user.fName} ${user.lName}</li>
// 	// 		<li>Email: ${user.email}</li>
// 	// 	</ul>
// 	// `);
// 	res.render(__dirname + "/public/profile/profile.html", {
// 		username: user.fName
// 	});
// };

// '/users/login' (make sure to have redirectProfile)
// exports.getUsersLogin = async (req, res) => {
//     res.send(`
// 		<h1>Login</h1>
// 		<form method='post' action='/users/login'>
// 			<input type='email' name='email' placeholder='Email' required />
// 			<input type='password' name='password' placeholder='Password' required />
// 			<input type='submit' />
// 		</form>
// 		<a href='/users/register'>Register</a>
// 	`);
// 	// res.sendFile('profile.html', { root : './public'});
// };

// **ISSUE: CSS DOES NOT LOAD PROPERLY ON SIGNUP.HTML & NOT SURE WHY
// '/users/register' (make sure to have redirectProfile)
// exports.getUsersRegister = async (req, res) => {
// 	// res.send(`
// 	// 	<h1>Register</h1>
// 	// 	<form method='post' action='/users/register'>
// 	// 		<input name='fName' placeholder='fName' required />
// 	// 		<input name='lName' placeholder='lName' required />
// 	// 		<input type='email' name='email' placeholder='Email' required />
// 	// 		<input type='password' name='password' placeholder='Password' required />
// 	// 		<input type='submit' />
// 	// 	</form>
// 	// 	<a href='/users/login'>Login</a>
// 	// `);
// 	// res.sendFile(__dirname + '/public/signup.html');
// 	// res.sendFile('signup.html', { root : './public/signup/'});
// 	// res.sendFile('signup.html');
// };

// '/users/login' (make sure to have redirectProfile)
// exports.postUsersLogin = async (req, res) => {
// 	const { email, password } = req.body;
// 	const user = await User.findOne({ email: email });
// 	if (user) {
// 		if (await bcrypt.compare(password, user.password)) {
// 			req.session.userId = user.id;
// 			return res.redirect('/users/profile');
// 		}
// 	}
// 	res.redirect('/users/login');
// };

// '/users/register' (make sure to have redirectProfile)
// exports.postUsersRegister = async (req, res) => {
// 	const { email } = req.body;
// 	const result = await User.findOne({ email: email });
// 	// IF THERE IS AN EXISTING USER WITH THE SAME EMAIL, WE SHOULD PROB NOTIFY BEFORE REDIRECT
// 	// if (result) {
// 	// 	return res.redirect('/users/register');
// 	// }
// 	req.body.password = await bcrypt.hash(req.body.password, 10);
// 	const newUser = await User.create(req.body);
// 	req.session.userId = newUser._id;
// 	return res.redirect('/users/profile');
// };

// '/users/logout' (make sure to have redirectLogin)
// exports.postUsersLogout = (req, res) => {
// 	req.session.destroy(err => {
// 		if (err) {
// 			return res.redirect('/users/profile');
// 		}

// 		res.clearCookie(process.env.SESS_NAME);
// 		res.redirect('/users/login');
// 	});
// };