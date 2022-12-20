const BaseHandler = require('./basehandler');

module.exports = class TeamHandler extends BaseHandler {
	constructor() {
		super();

		this.handleGetTeam = this.handleGetIndex.bind(this);
	}

	handleGetIndex(req, res, _next) {
		try {
			res.status(200).render('pages/team', { user: res.locals.user });
		} catch (error) {
			this.log.error(req, error);
		}
	}
};
