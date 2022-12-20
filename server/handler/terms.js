const BaseHandler = require('./basehandler');

module.exports = class TermsHandler extends BaseHandler {
	constructor() {
		super();

		this.handleGetTeam = this.handleGetIndex.bind(this);
	}

	handleGetIndex(req, res, _next) {
		try {
			res.status(200).render('pages/terms', { user: res.locals.user });
		} catch (error) {
			this.log.error(req, error);
		}
	}
};
