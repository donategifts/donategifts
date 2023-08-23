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
        
        const addAgencies = async (users) => {
            const data = require('../seeder-data/agencies.json');
            const adminUsers = users.filter((user) => user.role === 1);
            
            const [{
                id: adminUserId,
            }] = adminUsers;
            
            const formattedData = data.map((agency) => ({
                name: agency.agencyName,
                website: agency.agencyWebsite,
                bio: agency.agencyBio,
                email: agency.agencyEmail,
                phone: agency.agencyPhone,
                bio: agency.agencyBio,
                address_line_1: agency.agencyAddress.address1,
                address_line_2: agency.agencyAddress.address2,
                city: agency.agencyAddress.city,
                state: agency.agencyAddress.state,
                country: agency.agencyAddress.country,
                zip_code: agency.agencyAddress.zipcode,
                is_verified: agency.isVerified,
                account_manager_id: adminUserId,
                image_id: null,
            }));
            
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
            
            const users = await addUsers();
            await addAgencies(users);
        };
        
        await deleteDataAndImport();
    } catch (error) {
        console.log(error);
    }
})();