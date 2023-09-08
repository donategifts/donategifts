const {
    generateAgencies,
    generateChildren,
    generateCommunityPosts,
    generateUsers,
} = require('./workflow/generate');

const {
    processAgencies,
    processCommunityPosts,
    processChildren,
} = require('./workflow/process');

const {
    seedAgencies,
    seedChildren,
    seedUsers,
} = require('./workflow/seed');

const workflowDefinitions = {
    generate: {
        enabled: true,
        tables: {
            agencies: generateAgencies,
            children: generateChildren,
            community_posts: generateCommunityPosts,
            contacts: null,
            donations: null,
            messages: null,
            users: generateUsers,
            wishcards: null,
        },
    },
    process: {
        enabled: false,
        tables: {
            agencies: processAgencies,
            children: processChildren,
            community_posts: processCommunityPosts,
            contacts: null,
            donations: null,
            messages: null,
            users: null,
            wishcards: null,
        },
    },
    seed: {
        enabled: false,
        tables: {
            agencies: seedAgencies,
            children: seedChildren,
            community_posts: null,
            contacts: null,
            donations: null,
            messages: null,
            users: seedUsers,
            wishcards: null,
        },
    },
};

const runWorkflowDefinition = (workflow, table) => {
    try {
        const workflowDefinition = workflowDefinitions[workflow].tables[table];
        
        if (!workflowDefinition) {
            console.log(`Skipping workflow '${workflow}' definition for table '${table}' because it is not defined`);
            return;
        }
        
        return workflowDefinition();
    } catch (error) {
        console.log('Error running workflow definition', {
            error,
            workflow,
            table,
        });
    }
};

const runWorkflows = (definitions) => {
    try {
        console.log('Running workflows');
        const workflows = Object.entries(definitions);
        
        const workflowRuns = workflows.reduce((runs, [workflow, workflowDefinition]) => {
            if (!workflowDefinition.enabled) {
                console.log(`Skipping '${workflow}' workflow because it is disabled`);
                return runs;
            }
            
            const tables = Object.keys(workflowDefinition.tables);
            
            tables.forEach((table) => {
                const run = runWorkflowDefinition(workflow, table);
                run && runs.push({
                    workflow,
                    table,
                    run,
                });
            });
            
            return runs;
        }, []);
        
        return workflowRuns;
    } catch (error) {
        console.log('Error running workflows', error);
    }
};

const workflowRuns = runWorkflows(workflowDefinitions);

console.log('workflowRuns', workflowRuns);

(async () => {
    for (const workflowRun of workflowRuns) {
        // wait 5 seconds before running next workflow
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const { workflow, table, run } = workflowRun;
        
        console.log(`Running workflow '${workflow}' for table '${table}'`);
        
        await run;
        console.log(`Finished running workflow '${workflow}' for table '${table}'`);
    }
})();