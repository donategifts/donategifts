const path = require('node:path');

require('dotenv').config({ path: path.join(path.resolve(), '../../config.env') });

const { db } = require('../../../dist/db/postgresconnection');

const { importSeederFile } = require('../utils');

const purgeDatabase = async () => {
    await db.transaction().execute(async (trx) => {
        // must be deleted in this order to prevent foreign key constraint errors
        await trx.deleteFrom('verification_tokens').execute();
        await trx.deleteFrom('verifications').execute();
        await trx.deleteFrom('community_posts').execute();
        await trx.deleteFrom('messages').execute();
        await trx.deleteFrom('orders').execute();
        await trx.deleteFrom('wishcards').execute();
        await trx.deleteFrom('items').execute();
        await trx.deleteFrom('children').execute();
        await trx.deleteFrom('agencies').execute();
        await trx.deleteFrom('users').execute();
        await trx.deleteFrom('images').execute();
    });
};

const seedUsers = async (trx) => {
    const data = await importSeederFile('users');
    
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
    
    const result = await trx
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

const seedAgencies = async (trx) => {
    const data = await importSeederFile('agencies');
    
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
    
    const result = await trx
        .insertInto('agencies')
        .values(formattedData)
        .returning(['id'])
        .execute();
    
    const agencies = result.map((row) => {
        const { id } = row;
        
        return {
            id,
        };
    });
    
    return agencies;
};

const seedChildren = async (trx) => {
    const data = await importSeederFile('children');
    
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
    
    const result = await trx
        .insertInto('children')
        .values(formattedData)
        .returning(['id'])
        .execute();
    
    const children = result.map((row) => {
        const { id } = row;
        
        return {
            id,
        };
    });
    
    return children;
};

const seedCommunityPosts = async (trx) => {
    const data = await importSeederFile('community_posts');
    
    const formattedData = data.map((communityPost) => {
        const {
            id,
            message,
            agency_id,
            image_id,
        } = communityPost;
        
        return {
            id,
            message,
            agency_id,
            image_id,
        };
    });
    
    const result = await trx
        .insertInto('community_posts')
        .values(formattedData)
        .returning(['id'])
        .execute();
    
    const communityPosts = result.map((row) => {
        const { id } = row;
        
        return {
            id,
        };
    });
    
    return communityPosts;
};

const seedItems = async (trx) => {
    const data = await importSeederFile('items');
    
    const formattedData = data.map((item) => {
        const {
            id,
            name,
            price,
            link,
            retailer_name,
            retailer_product_id,
            meta_data,
            image_id,
        } = item;
        
        return {
            id,
            name,
            price,
            link,
            retailer_name,
            retailer_product_id,
            meta_data,
            image_id,
        };
    });
    
    const result = await trx
        .insertInto('items')
        .values(formattedData)
        .returning(['id'])
        .execute();
    
    const items = result.map((row) => {
        const { id } = row;
        
        return {
            id,
        };
    });
    
    return items;
};

const seedDatabase = async () => {
    const {
        agencies,
        children,
        users,
        communityPosts,
        items,
    } = await db.transaction().execute(async (trx) => {
        const users = await seedUsers(trx);
        const agencies = await seedAgencies(trx);
        const children = await seedChildren(trx);
        const communityPosts = await seedCommunityPosts(trx);
        const items = await seedItems(trx);
        
        return {
            users,
            agencies,
            children,
            communityPosts,
            items,
        };
    });
    
    return {
        agencies,
        children,
        users,
        communityPosts,
        items,
    };
};

module.exports = {
    purgeDatabase,
    seedDatabase,
};