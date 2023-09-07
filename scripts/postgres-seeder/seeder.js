const path = require('node:path');
const fs = require('node:fs');

require('dotenv').config({ path: path.join(path.resolve(), '../../config.env') });

const { db } = require('../../dist/db/postgresconnection');

// const agenciesData = require('./seeder-data/agencies.json');
// const contactsData = require('./seeder-data/contacts.json');
// const donationsData = require('./seeder-data/donations.json');
// const messagesData = require('./seeder-data/messages.json');
// const postsData = require('./seeder-data/posts.json');
// const wishCardsData = require('./seeder-data/wishcards.json');


(async () => {
    try {
        const addUsers = async () => {
            const data = require('../seeder-data/users.json');
            
            const formattedData = data.map((user) => {
                const {
                    id,
                    first_name,
                    last_name,
                    email,
                    password,
                    role,
                    login_mode,
                    bio,
                    is_verified,
                    is_disabled,
                    image_id,
                } = user;
                
                return {
                    id,
                    first_name,
                    last_name,
                    email,
                    password,
                    role,
                    login_mode,
                    bio,
                    is_verified,
                    is_disabled,
                    image_id,
                };
            });
            
            const result = await db
                .insertInto('users')
                .values(formattedData)
                .returning(['id', 'role'])
                .execute();
            
            const users = result.map((row) => {
                const { id, role } = row;
                
                return {
                    id,
                    role,
                };
            });
            
            return users;
        };
        
        const addAgencies = async () => {
            const data = require('../seeder-data/agencies.json');
            
            const formattedData = data.map((agency) => {
                const {
                    id,
                    name,
                    website,
                    phone,
                    bio,
                    address_line_1,
                    address_line_2,
                    city,
                    state,
                    country_code,
                    zip_code,
                    is_verified,
                    employer_identification_number,
                    account_manager_id,
                    image_id,
                } = agency;
                
                return {
                    id,
                    name,
                    website,
                    phone,
                    bio,
                    address_line_1,
                    address_line_2,
                    city,
                    state,
                    country_code,
                    zip_code,
                    is_verified,
                    employer_identification_number,
                    account_manager_id,
                    image_id,
                };
            });
            
            const result = await db
                .insertInto('agencies')
                .values(formattedData)
                .returning(['id'])
                .execute();
            
            const agencies = result.rows.map((row) => {
                const { id } = row;
                
                return {
                    id,
                };
            });
            
            return agencies;
        };
        
        const addChildren = async (agencies) => {
            const data = require('../seeder-data/children.json');
            
            const formattedData = data.map((child) => {
                const {
                    id,
                    first_name,
                    last_name,
                    birth_year,
                    interest,
                    story,
                    image_id,
                    agency_id,
                } = child;
                
                return {
                    id,
                    first_name,
                    last_name,
                    birth_year,
                    interest,
                    story,
                    image_id,
                    agency_id,
                };
            });
            
            const result = await db
                .insertInto('children')
                .values(formattedData)
                .returning(['id'])
                .execute();
            
            const children = result.rows.map((row) => {
                const { id } = row;
                
                return {
                    id,
                };
            });
            
            return children;
        };
        
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
            
            const users = await addUsers();
            const agencies = await addAgencies();
        };
        
        await deleteDataAndImport();
    } catch (error) {
        console.log(error);
    }
})();