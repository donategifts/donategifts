const BaseHandler = require('./basehandler');

module.exports = class FaqHandler extends BaseHandler {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(_req, res, _next) {
		this.renderView(res, 'pages/faq');
	}
};
