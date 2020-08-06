//TODO: delete, update

const User = require('../models/User');
const bcrypt = require('bcrypt');

// '/users/'
exports.getUsersRoot = (req, res) => {
    const { userId } = req.session;
    
	res.send(`
		<h1>Welcome!</h1>
		${userId ? `
			<a href='/users/home'>Home</a>
			<form method='post' action='/users/logout'>
				<button>Logout</button>
			</form>
		` : `
			<a href='/users/login'>Login</a>
			<a href='/users/register'>Register</a>
		`} 
	`);
}

// '/users/home' (make sure to have redirectLogin)
exports.getUsersHome = (req, res) => {
	const { user } = res.locals;
	res.send(`
		<h1>Home</h1>
		<a href='/users'>Main</a>
		<ul>
			<li>Name: ${user.fName} ${user.lName}</li>
			<li>Email: ${user.email}</li>
		</ul>
	`);
};

// '/users/login' (make sure to have redirectHome)
exports.getUsersLogin = async (req, res) => {
    res.send(`
		<h1>Login</h1>
		<form method='post' action='/users/login'>
			<input type='email' name='email' placeholder='Email' required />
			<input type='password' name='password' placeholder='Password' required />
			<input type='submit' />
		</form>
		<a href='/users/register'>Register</a>
	`);
};

// '/users/register' (make sure to have redirectHome)
exports.getUsersRegister = async (req, res) => {
	res.send(`
		<h1>Register</h1>
		<form method='post' action='/users/register'>
			<input name='fName' placeholder='fName' required />
			<input name='lName' placeholder='lName' required />
			<input type='email' name='email' placeholder='Email' required />
			<input type='password' name='password' placeholder='Password' required />
			<input type='submit' />
		</form>
		<a href='/users/login'>Login</a>
	`);
};

// '/users/login' (make sure to have redirectHome)
exports.postUsersLogin = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email });
	if (user) {
		if (await bcrypt.compare(password, user.password)) {
			req.session.userId = user.id;
			return res.redirect('/users/home');
		}
	}
	res.redirect('/users/login');
};

// '/users/register' (make sure to have redirectHome)
exports.postUsersRegister = async (req, res) => {
	const { email } = req.body;
	const result = await User.findOne({ email: email });
	if (result) {
		return res.redirect('/users/register');
	}
	req.body.password = await bcrypt.hash(req.body.password, 10);
	const newUser = await User.create(req.body);
	req.session.userId = newUser._id;
	return res.redirect('/users/home');
};

// '/users/logout' (make sure to have redirectLogin)
exports.postUsersLogout = (req, res) => {
	req.session.destroy(err => {
		if (err) {
			return res.redirect('/users/home');
		}

		res.clearCookie(process.env.SESS_NAME);
		res.redirect('/users/login');
	});
};