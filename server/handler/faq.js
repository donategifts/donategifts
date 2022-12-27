const BaseHandler = require('./basehandler');

module.exports = class FaqHandler extends BaseHandler {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(_req, res, _next) {
		try {
			res.status(200).render('pages/faq', { user: res.locals.user });
		} catch (error) {
			return this.handleError({ res, code: 400, error });
		}
	}
};
