const BaseHandler = require('./basehandler');

module.exports = class Mission extends BaseHandler {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(req, res, _next) {
		try {
			res.status(200).render('pages/mission', { user: res.locals.user });
		} catch (error) {
			this.log.error(req, error);
		}
	}
};
