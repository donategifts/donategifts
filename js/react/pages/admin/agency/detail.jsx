import { Container, TextInput, Textarea } from '@mantine/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import MantineProviderWrapper from '../../../utils/mantineProviderWrapper.jsx';

export default function Detail({ agencyId }) {
	const basePath = '/api/admin';
	const [agency, setAgency] = useState({
		name: '',
		phone: '',
		website: '',
		joined: '',
		bio: '',
		verified: false,
		accountManager: {
			firstName: '',
			lastName: '',
			email: '',
			joined: '',
			verified: false,
		},
	});

	const setData = (value) => {
		setAgency({
			...agency,
			...value,
		});
	};

	const verifyAgency = async () => {
		const res = await fetch(`${basePath}/verifyAgency/${agency.id}`, {
			method: 'PUT',
		});

		const { error, data } = await res.json();

		if (error) {
			window.showToast(error);
			return;
		}

		setAgency(data.agency);
		window.showToast(data.message, true);
	};

	const updateAgencyData = async () => {
		const res = await fetch(`${basePath}/updateAgencyData/${agency.id}`, {
			method: 'POST',
			body: JSON.stringify({
				name: agency.name,
				phone: agency.phone,
				website: agency.website,
				bio: agency.bio,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const { error, data } = await res.json();

		if (error) {
			window.showToast(error);
			return;
		}

		window.showToast(data.message, true);
	};

	const fetchAgency = async () => {
		const res = await fetch(`${basePath}/agencyDetail/${agencyId}`);
		const { data } = await res.json();
		setAgency({
			...data,
			joined: moment(data.joined).format('DD-mm-yyyy').toString(),
			accountManager: {
				...data.accountManager,
				joined: moment(data.accountManager.joined).format('DD-mm-yyyy').toString(),
			},
		});
	};

	useEffect(() => {
		fetchAgency();
	}, []);

	return (
		<MantineProviderWrapper>
			<Container fluid className="col-8 mt-3 p-4 border rounded shadow">
				<div className="d-flex align-items-baseline">
					<h2 className="me-2">{agency.name}</h2>
					<small className={agency.verified ? 'text-success' : 'text-warning'}>
						{agency.verified ? 'Verified' : 'Not verified'}
					</small>
				</div>
				<div className="row mb-3">
					<TextInput
						onChange={(event) => setData({ name: event.target.value })}
						className="col-6"
						label="Name"
						defaultValue={agency.name}
					/>
					<TextInput
						onChange={(event) => setData({ phone: event.target.value })}
						className="col-6"
						label="Phone"
						defaultValue={agency.phone}
					/>
				</div>
				<div className="row mb-3">
					<TextInput
						onChange={(event) => setData({ website: event.target.value })}
						className="col-6"
						label="Website"
						defaultValue={agency.website}
					/>
					<TextInput
						className="col-6"
						label="Joined"
						defaultValue={agency.joined}
						disabled
					/>
				</div>
				<div className="row mb-3 center-elements">
					<Textarea
						onChange={(event) => setData({ bio: event.target.value })}
						className="col-6"
						label="Bio"
						defaultValue={agency.bio}
					/>
				</div>
				<div className="row center-elements">
					<div className="col-4">
						<button
							type="button"
							className="btn btn-lg btn-primary w-100"
							onClick={verifyAgency}
							disabled={agency.verified}
						>
							Verify Agency
						</button>
					</div>
					<div className="col-4">
						<button
							type="button"
							className="btn btn-lg btn-secondary w-100"
							onClick={updateAgencyData}
						>
							Update Agency Data
						</button>
					</div>
				</div>
				<hr />
				<div className="d-flex align-items-baseline">
					<h3 className="me-2">Account Manager</h3>
					<small
						className={agency.accountManager.verified ? 'text-success' : 'text-warning'}
					>
						{agency.accountManager.verified ? 'Verified' : 'Not verified'}
					</small>
				</div>
				<div className="row mb-3">
					<TextInput
						className="col-6"
						label="First name"
						defaultValue={agency.accountManager.firstName}
						disabled
					/>
					<TextInput
						className="col-6"
						label="Last name"
						defaultValue={agency.accountManager.lastName}
						disabled
					/>
				</div>
				<div className="row">
					<TextInput
						className="col-6"
						label="Email"
						defaultValue={agency.accountManager.email}
						disabled
					/>
					<TextInput
						className="col-6"
						label="Joined"
						defaultValue={agency.accountManager.joined}
						disabled
					/>
				</div>
			</Container>
		</MantineProviderWrapper>
	);
}

Detail.propTypes = {
	agencyId: PropTypes.string.isRequired,
};
