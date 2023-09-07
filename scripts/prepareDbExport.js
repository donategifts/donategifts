/* eslint-disable import/no-extraneous-dependencies */
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const randomNumber = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

const importSeederFile = async (name = '') => {
    const filePath = path.join(__dirname, `./seeder-data/${name}.json`);
    
    try {
        const fileData = await fs.promises.readFile(filePath, 'utf8');
        const JSONData = JSON.parse(fileData);
        
        return JSONData;
    } catch (error) {
        console.log('Error importing seeder file', { filePath, error });
    }
    
    return;
};

const saveSeederFile = async (name = '', data = []) => {
    const filePath = path.join(__dirname, `./seeder-data/${name}.json`);
    
    try {
        const fileData = JSON.stringify(data, null, 4);
        await fs.promises.writeFile(filePath, fileData, 'utf8');
        
        return;
    } catch (error) {
        console.log('Error saving seeder file', { filePath, error });
    }
    
    return;
};

(async () => {
	try {
		const prepareAgencies = async () => {
			const agencies = await importSeederFile('agencies');
			const agenciesData = agencies.map((agency) => {
				const {
                    id = randomUUID(),
					name = faker.company.name(),
					address_line_1 = faker.location.streetAddress(),
					address_line_2 = faker.location.secondaryAddress(),
					city = faker.location.city(),
					state = faker.location.state(),
					country_code = 'US',
					zip_code = faker.location.zipCode(),
					phone = faker.phone.number(),
					email = faker.internet.email(),
					bio = faker.lorem.paragraph(),
					is_verified = true,
					employer_identification_number = faker.number.int(),
					website = faker.internet.url(),
					account_manager_id = null,
					image_id = null,
				} = agency;
				
				return {
                    id,
					name,
					address_line_1,
					address_line_2,
					city,
					state,
					country_code,
					zip_code,
					phone,
					email,
					bio,
					is_verified,
					employer_identification_number,
					website,
					account_manager_id,
					image_id,
				};
			});
			
			await saveSeederFile('agencies', agenciesData);
            return agenciesData;
		};
		
		const prepareChildren = async () => {
			const children = await importSeederFile('children');
			const childrenData = children.map((child) => {
				const {
                    id = randomUUID(),
					first_name = faker.person.firstName(),
					last_name = faker.person.lastName(),
					birth_year = faker.date.past({ years: 15 }).getFullYear(),
					interest = faker.lorem.sentence(),
					story = faker.lorem.paragraph(),
					image_id = null,
					agency_id = null,
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
			
            await saveSeederFile('children', childrenData);
            return childrenData;
		};
		
		const prepareCommunityPosts = async () => {
			const communityPosts = await importSeederFile('community_posts');
			const communityPostsData = communityPosts.map((communityPost) => {
				const {
                    id = randomUUID(),
					message = faker.lorem.sentence(),
					agency_id = null,
					image_id = null,
				} = communityPost;
				
				return {
                    id,
					message,
					agency_id,
					image_id,
				};
			});
			
            await saveSeederFile('community_posts', communityPostsData);
            return communityPostsData;
		};
		
		const prepareUsers = async () => {
            const users = await importSeederFile('users');
			const salt = await bcrypt.genSalt(10);
			const saltedPassword = await bcrypt.hash('Hello1234!', salt);
			
			const loginModeEnum = {
				Email: 'email',
				Google: 'google',
				Facebook: 'facebook',
			};
			
			const userRoleEnum = {
				Admin: 'admin',
				Donor: 'donor',
				Partner: 'partner',
			};
            
            const staticUsers = [
                {
                    first_name: 'Admin',
                    last_name: 'User',
                    email: 'admin@donate-gifts.com',
                    password: saltedPassword,
                    role: userRoleEnum.Admin,
                    login_mode: loginModeEnum.Email,
                },
                {
                    first_name: 'Donor',
                    last_name: 'User',
                    email: 'donor@donate-gifts.com',
                    password: saltedPassword,
                    role: userRoleEnum.Donor,
                    login_mode: loginModeEnum.Email,
                },
                {
                    first_name: 'Partner',
                    last_name: 'User',
                    email: 'partner@donate-gifts.com',
                    password: saltedPassword,
                    role: userRoleEnum.Partner,
                    login_mode: loginModeEnum.Email,
                }
            ];
            
            const userExists = (email) => {
                return users.some((user) => user.email === email);
            };
            
            // only add static users if they don't already exist
            const newStaticUsers = staticUsers.filter((staticUser) => !userExists(staticUser.email));
            users.push(...newStaticUsers);
			
			const usersData = users.map((user) => {
				const {
                    id = randomUUID(),
					first_name = faker.person.firstName(),
					last_name = faker.person.lastName(),
					email = faker.internet.email(),
					password = saltedPassword,
					role = userRoleEnum.Donor,
					login_mode = loginModeEnum.Email,
					bio = faker.lorem.paragraph(),
					is_verified = true,
					image_id = null,
				} = user;
				
				return {
                    id,
					first_name,
					last_name,
					email,
					bio,
					login_mode,
					is_verified,
					role,
					password,
					image_id,
				};
			});
			
            await saveSeederFile('users', usersData);
            return usersData;
		};
		
        
		const createFiles = async () => {
			const users = await prepareUsers();
			const agencies = await prepareAgencies();
			const children = await prepareChildren();
			const communityPosts = await prepareCommunityPosts();
			// prepareContacts();
			// prepareDonations();
			// prepareMessages();
			// prepareWishCards();
            
            return {
                users,
                agencies,
                children,
                communityPosts,
            };
		};
        
        const processAgencies = async () => {
            const agencies = await importSeederFile('agencies');
            const users = await importSeederFile('users');
            
            const adminUsers = users.filter((user) => user.role === 'admin');
            
            const agenciesWithAccountManagers = agencies.reduce((acc, agency) => {
                // ignore if agency already has a valid account manager
                if (agency.account_manager_id && users.find((user) => user.id === agency.account_manager_id)) {
                    acc.push(agency);
                    return acc;
                }
                
                const randomAdminUserIndex = randomNumber(0, adminUsers.length - 1);
                const randomAdminUserId = adminUsers[randomAdminUserIndex].id || null;
                
                acc.push({
                    ...agency,
                    account_manager_id: randomAdminUserId,
                });
                
                return acc;
            }, []);
            
            await saveSeederFile('agencies', agenciesWithAccountManagers);
        };
        
        const processChildren = async () => {
            const children = await importSeederFile('children');
            const agencies = await importSeederFile('agencies');
            
            const childrenWithAgencies = children.reduce((acc, child) => {
                // ignore if child already has a valid agency
                if (child.agency_id && agencies.find((agency) => agency.id === child.agency_id)) {
                    acc.push(child);
                    return acc;
                }
                
                const randomAgencyIndex = randomNumber(0, agencies.length - 1);
                const randomAgencyId = agencies[randomAgencyIndex].id || null;
                
                acc.push({
                    ...child,
                    agency_id: randomAgencyId,
                });
                
                return acc;
            }, []);
            
            await saveSeederFile('children', childrenWithAgencies);
        };
        
        const processCommunityPosts = async () => {
            const communityPosts = await importSeederFile('community_posts');
            const agencies = await importSeederFile('agencies');
            
            const communityPostsWithAgencies = communityPosts.reduce((acc, communityPost) => {
                // ignore if community post already has a valid agency
                if (communityPost.agency_id && agencies.find((agency) => agency.id === communityPost.agency_id)) {
                    acc.push(communityPost);
                    return acc;
                }
                
                const randomAgencyIndex = randomNumber(0, agencies.length - 1);
                const randomAgencyId = agencies[randomAgencyIndex].id || null;
                
                acc.push({
                    ...communityPost,
                    agency_id: randomAgencyId,
                });
                
                return acc;
            }, []);
            
            await saveSeederFile('community_posts', communityPostsWithAgencies);
        };
        
		const {
            users,
            agencies,
            children,
            communityPosts,
        } = createFiles();
        
        const processFiles = async () => {
            await processAgencies();
            await processChildren();
            await processCommunityPosts();
        };
        
        await processFiles();
	} catch (error) {
		console.error(error);
	}
})();
