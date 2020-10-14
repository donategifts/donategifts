const superagent = require('superagent');

// check if captcha token is valid
// returns boolean 
async function validateReCaptchaToken(token) {
    let googleUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA_KEY}&response=${token}`;
    return (async () => {
        try {
            const res = await superagent.post(googleUrl);
            const responseBody = res.body;
            return responseBody.success;
        } catch (err) {
            return false;
        }
    })();
}

module.exports = {validateReCaptchaToken} 