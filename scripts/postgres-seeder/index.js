const {
	generateAgencies,
	generateChildren,
	generateCommunityPosts,
	generateUsers,
	generateItems,
	generateMessages,
	generateOrders,
	generateWishcards,
	generateVerificationTokens,
	generateImages,
} = require('./workflow/generate');
const {
	processAgencies,
	processCommunityPosts,
	processChildren,
	processMessages,
	processOrders,
	processWishcards,
	processVerificationTokens,
	processImages,
	processUsers,
} = require('./workflow/process');
const { purgeDatabase, seedDatabase } = require('./workflow/seed');

const workflowDefinitions = {
	generate: {
		enabled: true,
		tables: {
			agencies: generateAgencies,
			children: generateChildren,
			community_posts: generateCommunityPosts,
			images: generateImages,
			items: generateItems,
			messages: generateMessages,
			orders: generateOrders,
			users: generateUsers,
			verification_tokens: generateVerificationTokens,
			wishcards: generateWishcards,
		},
	},
	process: {
		enabled: true,
		tables: {
			agencies: processAgencies,
			children: processChildren,
			community_posts: processCommunityPosts,
			images: processImages,
			items: null,
			messages: processMessages,
			orders: processOrders,
			users: processUsers,
			verification_tokens: processVerificationTokens,
			wishcards: processWishcards,
		},
	},
};

const generateWorkflowRuns = async (definitions) => {
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
				const workflowDefinition = workflowDefinitions[workflow].tables[table];

				if (!workflowDefinition) {
					console.log(
						`Skipping workflow '${workflow}' definition for table '${table}' because it is not defined`,
					);
					return;
				}

				runs.push({
					workflow,
					table,
					run: workflowDefinition,
				});

				return;
			});

			return runs;
		}, []);

		return workflowRuns;
	} catch (error) {
		console.log('Error running workflows', error);
	}
};

// TODO: Ensure that the workflows run in the correct order
(async () => {
	const workflowRuns = await generateWorkflowRuns(workflowDefinitions);
	for (const [index, workflowRun] of Object.entries(workflowRuns)) {
		const { workflow, table, run } = workflowRun;
		const runIndicator = `(${parseInt(index) + 1}/${workflowRuns.length})`;
		console.log(`${runIndicator} Running workflow '${workflow}' for table '${table}'`);

		await run();
	}

	console.log('Finished running workflows');

	console.log('Seeding database');
	await purgeDatabase();
	await seedDatabase();
})();
