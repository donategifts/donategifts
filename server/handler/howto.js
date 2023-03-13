const BaseHandler = require('./basehandler');

module.exports = class HowToHandler extends BaseHandler {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(req, res) {
		this.renderView(res, 'howto');
	}
};
