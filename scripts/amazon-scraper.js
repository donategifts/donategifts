// request Classic
const cheerio = require('cheerio')
const axios = require('axios');
const querystring = require('querystring');

const scrapeList = async url => {

  const urlParams = querystring.stringify({
    'api_key': process.env.SCRAPINGBEE_APIKEY,
    'url': url,
    'render_js': 'false',
    'premium_proxy': 'true',
    "country_code":"us"
  })

  console.log(url)

  const response = await axios.get('https://app.scrapingbee.com/api/v1?'+urlParams, {});

  const $ = cheerio.load(response.data);

  let results = [];
  $('.g-item-sortable').each((index, item) => {
    let found = {
      title: $(item).find('.a-link-normal').first().attr('title'),
      url: $(item).find('.a-button-text').first().attr('href'),
      price: $(item).find('.a-offscreen').text(),
    };
    results.push(found)
  });

  if (results.length === 0) {

    if ($('#no-items-section').length > 0) {
      return [];
    } else {
      return false
    }
  }

  return results

};

module.exports = scrapeList;