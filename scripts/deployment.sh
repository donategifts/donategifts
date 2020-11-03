 pwd
 rm config.test
 echo \"$MONGODB\" >> config.test
 echo NODE_ENV=development >> config.test
 echo SESS_NAME=sid >> config.test
 echo $SESS_SECRET >> config.test
 echo SESS_LIFE=3600000 >> config.test
 echo MAILGUN_API_KEY=onlyneededforproduction >> config.test
 echo MAILGUN_DOMAIN=onlyneededforproduction >> config.test
 echo USE_AWS=true >> config.test
 echo $AWS_KEY >> config.test
 echo $AWS_SECRET >> config.test
 echo S3BUCKET=donategifts >> config.test
 echo DEFAULT_EMAIL=no-reply@donate-gifts.com >> config.test
 echo BASE_URL=https://dev.donate-gifts.com:8081 >> config.test
 echo GOOGLE_CAPTCHA_KEY= >> config.test
 echo LOCAL_DEVELOPMENT=false >> config.test
 echo SOCKET_URL=wss://dev.donate-gifts.com >> config.test
 echo $G_CLIENT_ID >> config.test
 echo $FB_APP_ID >> config.test
 echo $SLACK_INTEGRATION >> config.test
 echo $SCRAPINGBEE_APIKEY >> config.test
 echo WISHCARD_LOCK_IN_MINUTES=1 >> config.test
