const path = require('node:path');
const fs = require('node:fs');

require('dotenv').config({ path: path.join(path.resolve(), '../../config.env') });

const { db } = require('../../dist/db/postgresconnection');

// const agenciesData = require('./seeder-data/agencies.json');
// const contactsData = require('./seeder-data/contacts.json');
// const donationsData = require('./seeder-data/donations.json');
// const messagesData = require('./seeder-data/messages.json');
// const postsData = require('./seeder-data/posts.json');
// const usersData = require('./seeder-data/users.json');
// const wishCardsData = require('./seeder-data/wishcards.json');


(async () => {
    try {
        const addUsers = async () => {
            const data = require('../seeder-data/users.json');
            
            const formattedData = data.map((user) => ({
                first_name: user.fName,
                last_name: user.lName,
                email: user.email,
                password: user.password,
                role: user.userRole,
                login_mode: user.loginMode,
                bio: user.bio,
                is_verified: user.emailVerified,
                image_id: null,
            }));
            
            await db.insertInto('users').values(formattedData).execute();
        };
        
        
        // const addAgencies = async () => {
        //     const agenciesData = require('./seeder-data/agencies.json');
        //     const formattedData = agenciesData.map((agency) => ({
                
        //     }));
        // };
        // const result = await db.selectFrom('agencies').where('name', '=', 'test').selectAll().execute();
        
        // console.log(result);
        
        const deleteDataAndImport = async () => {
            await db.transaction().execute(async (trx) => {
                // must be deleted in this order to prevent foreign key constraint errors
                await trx.deleteFrom('wishcards').execute();
                await trx.deleteFrom('verification_tokens').execute();
                await trx.deleteFrom('verifications').execute();
                await trx.deleteFrom('orders').execute();
                await trx.deleteFrom('items').execute();
                await trx.deleteFrom('children').execute();
                await trx.deleteFrom('community_posts').execute();
                await trx.deleteFrom('agencies').execute();
                await trx.deleteFrom('messages').execute();
                await trx.deleteFrom('users').execute();
                await trx.deleteFrom('images').execute();
            });
            
            await addUsers();
        };
        
        await deleteDataAndImport();
    } catch (error) {
        console.log(error);
    }
})();