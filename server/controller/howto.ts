import BaseController from './basecontroller';

module.exports = class HowToController extends BaseController {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(req, res) {
		this.renderView(res, 'howto');
	}
};
