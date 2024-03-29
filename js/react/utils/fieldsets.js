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
					validateFn: (value) => /^\([2-9]\d{2}\) \d{3}-\d{4}$/.test(value),
				},
				{
					name: 'agencyEIN',
					isRequired: true,
					defaultValue: '',
					inputType: 'textInput',
					validateFn: (value) => /^\d{2}-\d{7}$/.test(value),
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
					isRequired: true,
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
					sizeFn: (value) => value.length < 2 || value.length > 250,
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
					sizeFn: (value) => value.length < 2 || value.length > 250,
				},
			],
			[
				{
					name: 'state',
					isRequired: true,
					defaultValue: '',
					inputType: 'select',
					searchable: true,
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
					searchable: false,
				},
			],
		],
	},
];

export { AGENCY_SIGNUP_FIELDSETS };
