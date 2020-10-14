# DonateGifts Project

> Overview: This project enables users to donate holiday & birthday gifts to the foster children and homeless youth --simply by clicking one button-- which will automatically add the child's wish item to the user's Amazon cart & deliver to the child's address.

# Live Production: 
> https://donate-gifts.com/ 

> https://donate-gifts.org

# Dev Server: 
> https://dev.donate-gifts.com

## Author

> Stacy Sealky Lee

## Collaborators

  
> Patric  
> Ivan Repusic  
> Jacob Jeevan  
> Jordan Huang  
> Maria Nguyen  

## Usage

Install Mongo or use Docker to spin up a Docker container
start container with:
`docker-compose up`

App will not run without config.env

Dev server uses a separate db 

public dir has all the static components and assets 

We are saving media files to AWS S3

add more test files in __tests__ dir

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npx nodemon app.js  ||  npm run dev 

# Run in prod mode
node app.js ||  npm start 
```

## Demo

https://youtu.be/KhgQV0MTxlA

- Version: 1.0
- Copyrights: Stacy Sealky Lee
- Do not distribute this code without permission
