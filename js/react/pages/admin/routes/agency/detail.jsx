import { Group, TextInput, Textarea } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CustomButton from '../../../../components/shared/CustomButton.jsx';

export default function Detail() {
	const { agencyId } = useParams();
	const navigate = useNavigate();

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

	const [showVerifyLoader, setShowVerifyLoader] = useState(false);
	const [showUpdateLoader, setShowUpdateLoader] = useState(false);

	const name = useRef('');
	const phone = useRef('');
	const website = useRef('');
	const bio = useRef('');

	const toast = new window.DG.Toast();

	const verifyAgency = async () => {
		setShowVerifyLoader(true);

		const res = await fetch(`/api/admin/verifyAgency/${agency.id}`, {
			method: 'PUT',
		});

		const { error, data } = await res.json();

		setShowVerifyLoader(false);

		if (error) {
			toast.show(error, toast.styleMap.danger);
			return;
		}

		setAgency(data.agency);
		toast.show(data.message);
	};

	const updateAgencyData = async () => {
		setShowUpdateLoader(true);
		const res = await fetch(`/admin/api/updateAgencyData/${agency.id}`, {
			method: 'POST',
			body: JSON.stringify({
				name: name.current.value,
				phone: phone.current.value,
				website: website.current.value,
				bio: bio.current.value,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const { error, data } = await res.json();

		setShowUpdateLoader(false);

		if (error) {
			toast.show(error, toast.styleMap.danger);
			return;
		}

		toast.show(data.message);
	};

	const fetchAgency = async () => {
		const res = await fetch(`/api/admin/agencyDetail/${agencyId}`);
		const { data } = await res.json();
		setAgency(data);
	};

	useEffect(() => {
		fetchAgency();
	}, []);

	return (
		<>
			<div className="d-flex align-items-baseline justify-content-between">
				<div className="d-flex align-items-baseline">
					<h2 className="me-2">{agency.name}</h2>
					<small className={agency.verified ? 'text-success' : 'text-warning'}>
						{agency.verified ? 'Verified' : 'Not verified'}
					</small>
				</div>
				<button onClick={() => navigate(-1)} className="btn btn-link">
					Go back
				</button>
			</div>
			<div className="row mb-3">
				<TextInput ref={name} className="col-6" label="Name" defaultValue={agency.name} />
				<TextInput
					ref={phone}
					className="col-6"
					label="Phone"
					defaultValue={agency.phone}
				/>
			</div>
			<div className="row mb-3">
				<TextInput
					ref={website}
					className="col-6"
					label="Website"
					defaultValue={agency.website}
				/>
				<TextInput className="col-6" label="Joined" defaultValue={agency.joined} disabled />
			</div>
			<div className="row mb-3 center-elements">
				<Textarea
					ref={bio}
					className="col-6"
					label="Bio"
					rows={5}
					defaultValue={agency.bio}
				/>
			</div>
			<Group justify={'center'}>
				<CustomButton
					size="lg"
					onClick={verifyAgency}
					loading={showVerifyLoader}
					disabled={agency.verified || showVerifyLoader}
					text={agency.verified ? 'Verified' : 'Verify Agency'}
				/>
				<CustomButton
					size="lg"
					color="secondary.3"
					loading={showUpdateLoader}
					onClick={updateAgencyData}
					disabled={showUpdateLoader}
					text="Update Agency Data"
				/>
			</Group>
			<hr />
			<div className="d-flex align-items-baseline">
				<h3 className="me-2">Account Manager</h3>
				<small className={agency.accountManager.verified ? 'text-success' : 'text-warning'}>
					{agency.accountManager.verified ? 'Verified' : 'Not verified'}
				</small>
			</div>
			<div className="row mb-3">
				<TextInput
					className="col-6"
					label="First name"
					defaultValue={agency.accountManager.firstName}
					readOnly
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
					readOnly
				/>
				<TextInput
					className="col-6"
					label="Joined"
					defaultValue={agency.accountManager.joined}
					disabled
				/>
			</div>
		</>
	);
}
