const path = require('node:path');

require('dotenv').config({ path: path.join(path.resolve(), '../../config.env') });

const { db } = require('../../../dist/db/postgresconnection');

const purgeDatabase = async () => {
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
};

const seedUsers = async () => {
    const data = require('../../seeder-data/users.json');
    
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

const seedAgencies = async () => {
    const data = require('../../seeder-data/agencies.json');
    
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

const seedChildren = async () => {
    const data = require('../../seeder-data/children.json');
    
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

module.exports = {
    purgeDatabase,
    seedUsers,
    seedAgencies,
    seedChildren,
};