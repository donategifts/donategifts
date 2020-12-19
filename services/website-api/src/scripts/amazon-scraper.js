/* eslint-disable @typescript-eslint/no-var-requires */
// request Classic
const cheerio = require('cheerio');
const axios = require('axios');
const querystring = require('querystring');

const scrapeList = async url => {
	const urlParams = querystring.stringify({
		api_key: process.env.SCRAPINGBEE_APIKEY,
		url,
		render_js: 'false',
		premium_proxy: 'true',
		country_code: 'us',
	});

	console.log(url);

	const response = await axios.get(`https://app.scrapingbee.com/api/v1?${urlParams}`, {});

	const $ = cheerio.load(response.data);

	const results = [];
	$('.g-item-sortable').each((_index, item) => {
		const found = {
			title: $(item).find('.a-link-normal').first().attr('title'),
			url: $(item).find('.a-button-text').first().attr('href'),
			price: $(item).find('.a-offscreen').text(),
		};
		results.push(found);
	});

	if (results.length === 0) {
		if ($('#no-items-section').length > 0) {
			return [];
		}
		return false;
	}

	return results;
};

module.exports = scrapeList;
