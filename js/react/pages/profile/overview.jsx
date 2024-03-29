import { Button, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { useEffect, useState } from 'react';

import AccountBioEditModal from '../../components/profile/accountBioEditModal.jsx';
import AccountEditModal from '../../components/profile/accountEditModal.jsx';
import AgencyEditModal from '../../components/profile/agencyEditModal.jsx';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

export default function ProfileOverview() {
	const [accountStore, setAccountStore] = useState(null);
	const [agencyStore, setAgencyStore] = useState(null);
	const [isAgencyEditModalOpen, { open: openAgencyEditModal, close: closeAgencyEditModal }] =
		useDisclosure();
	const [refetchAgency, setRefetchAgency] = useState(false);
	const [refetchAccount, setRefetchAccount] = useState(false);
	const [isAccountEditModalOpen, { open: openAccountEditModal, close: closeAccountEditModal }] =
		useDisclosure();
	const [
		isAccountBioEditModalOpen,
		{ open: openAccountBioEditModal, close: closeAccountBioEditModal },
	] = useDisclosure();

	const agencyWishCardsManagement = () => {
		if (!agencyStore.isVerified) {
			return (
				<div className="my-3">
					<div
						className=" fa fa-exclamation-triangle me-2 text-secondary"
						aria-hidden={true}
					></div>
					Wish card creation feature is disabled for your account. It will be enabled
					after agency verification. This usually takes 1-2 business days. For a faster
					verification,{' '}
					<a className="text-secondary" href="/contact">
						contact us
					</a>
					.
				</div>
			);
		} else {
			return (
				<div className="card shadow mb-5 border-0 p-3 my-5">
					<div className=" card-body row justify-content-between align-content-center text-center">
						<div className="col-12 col-md-12 col-lg-4 p-2">
							<div className="mb-3">Ask for a specific wish item</div>
							<Button
								size="xl"
								className="button-accent button-width"
								component="a"
								href="/wishcards/create"
							>
								Create Wish Cards
							</Button>
						</div>
						<div className="col-12 col-md-12 col-lg-4 p-2">
							<div className="mb-3 mt-3 mt-md-0">Review your existing wish cards</div>
							<Button
								size="xl"
								className="button-primary button-width"
								component="a"
								href="/wishcards/manage"
							>
								Manage Wish Cards
							</Button>
						</div>
						<div className="col-12 col-md-12 col-lg-4 p-2">
							<div className="mb-3 mt-3 mt-md-0">Got any Questions?</div>
							<Button
								size="xl"
								className="button-secondary button-width"
								component="a"
								href="/contact"
							>
								Contact For Help
							</Button>
						</div>
					</div>
				</div>
			);
		}
	};

	const agencyDetails = () => {
		return (
			<div id="#agencyInfoCard" className="card shadow mb-5 border-0 p-3">
				<div className="card-title d-flex justify-content-between p-3">
					<div className="display-6">Agency Details</div>
					<div className="fas fa-edit" onClick={() => openAgencyEditModal()}></div>
				</div>
				<div className="card-body">
					<div className="row justify-content-center">
						<div className="mb-2 col-12 d-flex">
							<div className="text-muted">Agency name:</div>
							<span className="mx-1">{agencyStore.agencyName}</span>
							{agencyStore.isVerified ? (
								<div className="text-secondary fw-bold">
									Verified
									<div
										className="fas fa-check-circle text-secondary"
										aria-hidden={true}
									></div>
								</div>
							) : (
								<div className="text-secondary fw-bold">Not Verified</div>
							)}
						</div>
					</div>
					<div className="row justify-content-center my-4">
						<div className="col-12">
							<span className="text-muted">Agency description:</span>
							<span id="agencyBio" className="mx-2">
								{agencyStore.agencyBio || 'Not Provided'}
							</span>
						</div>
					</div>
					<div className="row justify-content-center my-4">
						<div className="col-12 col-md-6 mb-4 mb-md-0">
							<span className="text-muted">Number of existing wish cards:</span>
							<span id="agencyBio" className="mx-2">
								{agencyStore.wishCardsLength}
							</span>
						</div>
						<div className="col-12 col-md-6">
							<span className="text-muted">Partner since:</span>
							<span id="agencyBio" className="mx-2">
								{new Date(agencyStore.joined).toLocaleString().split(',')[0]}
							</span>
						</div>
					</div>
					<div className="row justify-content-center my-4">
						<div className="col-12 col-md-6 mb-4 mb-md-0">
							<span className="text-muted">Contact number:</span>
							<span id="agencyPhone" className="mx-2">
								{agencyStore.agencyPhone}
							</span>
						</div>
						<div className="col-12 col-md-6">
							<span className="text-muted">Website:</span>
							<span id="agencyWebsite" className="mx-2 text-wrap">
								{agencyStore.agencyWebsite || 'Not provided'}
							</span>
						</div>
					</div>
					{agencyStore.agencyAddress ? (
						<>
							<div className="row justify-content-center my-4">
								<div className="col-12 col-lg-6 mb-4 mb-md-0">
									<span className="text-muted">Address line 1:</span>
									<span id="address1" className="mx-2">
										{agencyStore.agencyAddress.address1}
									</span>
								</div>
								<div className="col-12 col-lg-6">
									<span className="text-muted">Address line 2:</span>
									<span id="address2" className="mx-2">
										{agencyStore.agencyAddress.address2 || 'Not provided'}
									</span>
								</div>
							</div>
							<div className="row justify-content-center my-4">
								<div className="col-12 col-lg-6 mb-4 mb-md-0">
									<span className="text-muted">City:</span>
									<span id="city" className="mx-2">
										{agencyStore.agencyAddress.city}
									</span>
								</div>
								<div className="col-12 col-lg-6">
									<span className="text-muted">State:</span>
									<span id="state" className="mx-2">
										{agencyStore.agencyAddress.state}
									</span>
								</div>
							</div>
							<div className="row justify-content-center my-4">
								<div className="col-12 col-lg-6 mb-4 mb-md-0">
									<span className="text-muted">Country</span>
									<span id="country" className="mx-2">
										{agencyStore.agencyAddress.country}
									</span>
								</div>
								<div className="col-12 col-lg-6">
									<span className="text-muted">Zipcode:</span>
									<span id="zipcode" className="mx-2">
										{agencyStore.agencyAddress.zipcode}
									</span>
								</div>
							</div>
						</>
					) : null}
				</div>
			</div>
		);
	};

	const agencyDashboard = () => {
		return (
			<>
				{agencyWishCardsManagement()}
				{agencyDetails()}
			</>
		);
	};

	const accountDetails = () => {
		return (
			<div className="card shadow mb-5 border-0 p-4">
				<div className="card-title d-flex justify-content-between p-3 pb-0">
					<div className="display-6">Account Details</div>
					<div className="fas fa-edit" onClick={() => openAccountEditModal()}></div>
				</div>
				<div className="card-body">
					<div className="row justify-content-center my-4">
						<div className="col-12 col-lg-6 mb-4 mb-md-0">
							<span className="text-muted">First Name:</span>
							<span id="fName" className="mx-2">
								{accountStore.fName}
							</span>
						</div>
						<div className="col-12 col-lg-6">
							<span className="text-muted">Last name:</span>
							<span id="lName" className="mx-2">
								{accountStore.lName}
							</span>
						</div>
					</div>
					<div className="row justify-content-center my-4">
						<div className="col-12 col-lg-6 mb-4 mb-md-0">
							<span className="text-muted">Your email:</span>
							<span className="mx-2">{accountStore.email}</span>
						</div>
						<div className="col-12 col-lg-6">
							<span className="text-muted">Your role:</span>
							<span className="mx-2">{accountStore.userRole}</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const accountManagement = () => {
		return (
			<>
				<div className="row mb-5 mb-md-3">
					<div className="col-md-6 mb-5 mb-md-0">
						<div className="card h-100 shadow border-0 p-3">
							<div className="card-title d-flex justify-content-between p-3">
								<div className="display-6">
									<div className="fa fa-user mx-2" aria-hidden={true}></div>
									<span>About Me</span>
								</div>
								<div
									className="fas fa-edit"
									onClick={() => openAccountBioEditModal()}
								></div>
							</div>
							{accountStore.aboutMe ? (
								<div className="y-scroll">
									<div id="about-me" className="p-4">
										{accountStore.aboutMe}
									</div>
								</div>
							) : (
								<div id="about-me" className="p-4">
									You have no description saved.
								</div>
							)}
						</div>
					</div>
					<div className="col-md-6">
						<div className="card h-100 shadow border-0 p-3">
							<div className="card-title p-3">
								<div className="display-6">
									<div className="fa fa-gift mx-2" aria-hidden={true}></div>
									<span>My Donations</span>
								</div>
							</div>
							<div className="row justify-content-center text-center">
								<div className="col-12">
									<Button
										size="xl"
										className="button-secondary"
										component="a"
										href="/profile/donations"
									>
										My Donation History
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row pb-5">
					<div className="col-md-6 mb-5 mb-md-0">
						<div className="card h-100 shadow border-0 p-3">
							<div className="card-title p-3">
								<div className="display-6">
									<div className="fa fa-cogs mx-2" aria-hidden={true}></div>
									<span>Settings</span>
								</div>
							</div>
							<div className="d-flex gap-2 flex-column justify-content-center text-center">
								<div className="row justify-content-center">
									<div className="col-12 col-lg-8">
										<Button
											size="xl"
											className="button-primary w-100"
											component="a"
											href="/profile/password/reset/"
										>
											Reset Password
										</Button>
									</div>
								</div>
								<div className="row justify-content-center">
									<div className="col-12 col-lg-8">
										<Button
											size="xl"
											className="button-secondary w-100"
											component="a"
											href="/profile/logout"
										>
											Log Out
										</Button>
									</div>
								</div>
								{!accountStore.emailVerified ? (
									<div className="row justify-content-center">
										<div className="col-12 col-lg-8">
											<Button
												size="xl"
												id="resend-verification-link"
												className="button-primary w-100"
												component="a"
												onClick={() => sendVerificationEmailLink()}
											>
												Resend Verification Link
											</Button>
										</div>
									</div>
								) : null}
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<div className="card h-100 shadow border-0 p-3">
							<div className="card-title p-3">
								<div className="display-6">
									<div className="fa fa-users mx-2" aria-hidden={true}></div>
									<span>Friends</span>
								</div>
							</div>
							<div className="p-4">You have invited 0 friends.</div>
						</div>
					</div>
				</div>
			</>
		);
	};

	const agencyModalSubmit = async (formData) => {
		try {
			await axios.put('/api/profile/agency/', formData);
			new window.DG.Toast().show('Updated Wishcard', window.DG.Toast.styleMap.success);
		} catch (error) {
			new window.DG.Toast().show(
				error?.response?.data?.error?.msg ||
					error?.response?.data?.error ||
					error?.message ||
					'Unable to update wish card',
				window.DG.Toast.styleMap.danger,
			);
		}
		setRefetchAgency((v) => !v);
		closeAgencyEditModal();
	};

	const accountEditModalSubmit = async (formData) => {
		try {
			await axios.put('/api/profile/account/', formData);
			new window.DG.Toast().show(
				'Updated Account Information',
				window.DG.Toast.styleMap.success,
			);
		} catch (error) {
			new window.DG.Toast().show(
				error?.response?.data?.error?.msg ||
					error?.response?.data?.error ||
					error?.message ||
					'Unable to update Account Details.',
				window.DG.Toast.styleMap.danger,
			);
		}
		setRefetchAccount((v) => !v);
		closeAccountEditModal();
	};

	const accountBioEditModalSubmit = async (formData) => {
		try {
			await axios.put('/api/profile/account/aboutMe', formData);
			new window.DG.Toast().show(
				'Updated Account Biography',
				window.DG.Toast.styleMap.success,
			);
		} catch (error) {
			new window.DG.Toast().show(
				error?.response?.data?.error?.msg ||
					error?.response?.data?.error ||
					error?.message ||
					'Unable to update Account Biography.',
				window.DG.Toast.styleMap.danger,
			);
		}
		setRefetchAccount((v) => !v);
		closeAccountBioEditModal();
	};

	const sendVerificationEmailLink = async () => {
		try {
			await axios.post('/api/profile/resend-verification-link', {
				userId: accountStore._id,
			});
			new window.DG.Toast().show(
				'Resent verification link!',
				window.DG.Toast.styleMap.success,
			);
		} catch (error) {
			new window.DG.Toast().show(
				error?.response?.data?.error?.msg ||
					error?.response?.data?.error ||
					error?.message ||
					'Could not resend verification link.',
				window.DG.Toast.styleMap.danger,
			);
		}
	};

	const fetchAccountDetails = () => {
		axios
			.get('/api/profile/account')
			.then((res) => setAccountStore(res.data.data))
			.catch(() =>
				new window.DG.Toast().show(
					'Could not fetch Account Details.',
					new window.DG.Toast().styleMap.danger,
				),
			);
	};

	const fetchAgencyDetails = () => {
		axios
			.get('/api/profile/agency')
			.then((res) => setAgencyStore(res.data.data))
			.catch(() => {
				new window.DG.Toast().show(
					'Could not fetch Agency Details.',
					new window.DG.Toast().styleMap.danger,
				);
			});
	};

	useEffect(() => {
		fetchAccountDetails();
	}, [refetchAccount]);

	useEffect(() => {
		if (accountStore && accountStore.userRole == 'partner') {
			fetchAgencyDetails();
		}
	}, [refetchAgency, accountStore]);

	return (
		<MantineProviderWrapper>
			{accountStore ? (
				<>
					{agencyStore ? (
						<AgencyEditModal
							agency={agencyStore}
							opened={isAgencyEditModalOpen}
							onClose={closeAgencyEditModal}
							formSubmit={agencyModalSubmit}
						/>
					) : null}
					<AccountEditModal
						user={accountStore}
						opened={isAccountEditModalOpen}
						onClose={closeAccountEditModal}
						formSubmit={accountEditModalSubmit}
					/>
					<AccountBioEditModal
						user={accountStore}
						opened={isAccountBioEditModalOpen}
						onClose={closeAccountBioEditModal}
						formSubmit={accountBioEditModalSubmit}
					/>
					<div id="profile">
						<div className="profile-welcome cool-font center-elements text-secondary">
							<h1 id="welcome-title">Welcome {accountStore.fName}</h1>
						</div>
						<Container size="xl" className="pt-5">
							{!accountStore.emailVerified ? (
								<div className="my-3">
									<div
										className="fa fa-exclamation-triangle me-2 text-secondary"
										aria-hidden={true}
									></div>
									Some features are disabled until email is verified. Please
									verify your email.
								</div>
							) : null}
							{accountStore.userRole == 'partner' && agencyStore
								? agencyDashboard()
								: null}
							{accountDetails()}
							{accountManagement()}
						</Container>
					</div>
				</>
			) : null}
		</MantineProviderWrapper>
	);
}
