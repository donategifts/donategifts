const AGENCY_SIGNUP_FIELDSETS = [
	{
		header: 'Information about your non-profit agency',
		inputsPerRow: [
			[
				{
					name: 'agencyName',
					isRequired: true,
					defaultValue: '',
					inputType: 'textInput',
					sizeFn: (value) => value.length < 2 || value.length > 250,
				},
				{
					name: 'agencyWebsite',
					isRequired: false,
					defaultValue: '',
					inputType: 'textInput',
				},
			],
			[
				{
					name: 'agencyPhone',
					isRequired: true,
					defaultValue: '',
					inputType: 'textInput',
				},
				{
					name: 'agencyEIN',
					isRequired: true,
					defaultValue: '',
					inputType: 'textInput',
				},
			],
			[
				{
					name: 'agencyBio',
					isRequired: true,
					defaultValue: '',
					inputType: 'textArea',
					sizeFn: (value) => value.length < 5 || value.length > 500,
				},
				{
					name: 'agencyImage',
					isRequired: false, //TODO make it back to true after testing
					defaultValue: null,
					inputType: 'image',
				},
			],
		],
	},
	{
		header: 'Information about your agency address',
		instruction:
			'Donated wish items will be delivered to this default address. You may change the shipping address for each wish item later.',
		inputsPerRow: [
			[
				{
					name: 'address1',
					isRequired: true,
					defaultValue: '',
					inputType: 'textInput',
				},
				{
					name: 'address2',
					isRequired: false,
					defaultValue: '',
					inputType: 'textInput',
				},
				{
					name: 'city',
					isRequired: true,
					defaultValue: '',
					inputType: 'textInput',
				},
			],
			[
				{
					name: 'state',
					isRequired: true,
					defaultValue: '',
					inputType: 'select',
				},
				{
					name: 'zipcode',
					isRequired: true,
					defaultValue: '',
					inputType: 'textInput',
				},
				{
					name: 'country',
					isRequired: true,
					defaultValue: '',
					inputType: 'select',
				},
			],
		],
	},
];

export { AGENCY_SIGNUP_FIELDSETS };
