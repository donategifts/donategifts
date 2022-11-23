# Steps I took to run v1 again (2022 update)

1. uninstall and reinstall Docker
2. add the config.env file under the config directory (get this from Stacy)
3.  Use these commands in order
- docker run -d -p 80:80 docker/getting-started
- docker-compose up -d
- node server/db/seeder.js
- npm install && npm run start (might need to delete node_modules and package-lock before install if you run into npm issues)