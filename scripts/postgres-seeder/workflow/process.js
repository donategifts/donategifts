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

module.exports = {
    processAgencies,
    processChildren,
    processCommunityPosts,
};