import BaseController from './basecontroller';

export default class HowToController extends BaseController {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(req, res) {
		this.renderView(res, 'howto');
	}
}
