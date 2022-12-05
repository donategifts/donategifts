const BaseHandler = require('./basehandler');

module.exports = class HowToHandler extends BaseHandler {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(req, res) {
		try {
			res.status(200).render('pages/howto', { user: res.locals.user });
		} catch (error) {
			this.handleError(req, 400, error);
		}
	}
};
