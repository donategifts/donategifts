const BaseController = require('./basecontroller');

module.exports = class ProofController extends BaseController {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(_req, res, _next) {
		this.renderView(res, 'proof');
	}
};
