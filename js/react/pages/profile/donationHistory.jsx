import { Table } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';

import CustomToast from '../../components/shared/CustomToast.jsx';
import PopOver from '../../components/shared/PopOver.jsx';
import Translations from '../../translations/en/profile.json';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function DonationHistory() {
	const [donations, setDonations] = useState([]);
	const [totalDonation, setTotalDonation] = useState(0.0);
	const [totalGifts, setTotalGifts] = useState(0);
	const [showToast, setShowToast] = useState(false);
	const dateConfig = { year: 'numeric', month: 'short', day: '2-digit' };

	useEffect(() => {
		axios
			.get('/api/profile/donations')
			.then((res) => {
				if (res.data && res.data.data) {
					setDonations(res.data.data);
				}
			})
			.catch((err) => {
				console.error(err);
				setShowToast(true);
			});
	}, []);

	useEffect(() => {
		if (donations) {
			setTotalGifts(donations.length);

			let newTotalDonation = 0.0;

			donations.forEach((data) => {
				if (data?.donationPrice) {
					newTotalDonation += parseFloat(data?.donationPrice);
				}
			});

			newTotalDonation = parseFloat(newTotalDonation.toFixed(2));
			setTotalDonation(newTotalDonation);
		}
	}, [donations]);

	return (
		<MantineProviderWrapper>
			<CustomToast
				message="Failed to fetch donations!"
				type="error"
				isVisible={showToast}
				setIsVisible={setShowToast}
			/>
			<div className="container mt-3" id="donation-history">
				<div className="row p-4">
					<div className="col-md-4 mb-sm-3">
						<div className="card rounded shadow">
							<div className="card-body d-flex justify-content-around align-items-center">
								<div>
									<i className="fas fa-hand-holding-usd"></i>
								</div>
								<div className="border-left px-4">
									<h1>${totalDonation}</h1>
									<p>
										your total donation amount{' '}
										<PopOver
											text={
												Translations.DONATION_HISTORY.totalDonation
													.popOverText
											}
										/>
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-4 mb-sm-3">
						<div className="card rounded shadow">
							<div className="card-body d-flex justify-content-around align-items-center">
								<div>
									<i className="fas fa-gifts"></i>
								</div>
								<div className="border-left px-4">
									<h1>{totalGifts}</h1>
									<p>gifts donated from you</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className="card rounded shadow">
							<div className="card-body d-flex justify-content-around align-items-center">
								<div>
									<i className="fas fa-crown"></i>
								</div>
								<div className="border-left px-4">
									<h1>{10 + Math.ceil(totalDonation * 2)}</h1>
									<p>
										donation karma points{' '}
										<PopOver
											text={
												Translations.DONATION_HISTORY.karmaPoints
													.popOverText
											}
											imageSource="/img/tshirt-2023.png"
										/>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Table className="my-5 pb-2" striped highlightOnHover>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Donated to</Table.Th>
							<Table.Th>Item Price</Table.Th>
							<Table.Th>Item Name</Table.Th>
							<Table.Th>Date</Table.Th>
							<Table.Th>Status</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{donations.length
							? donations.map((data) => (
									<Table.Tr key={data?._id}>
										<Table.Td>
											{data?.donationCard?.childFirstName ?? 'Unknown'}
										</Table.Td>
										<Table.Td>
											${data?.donationCard?.wishItemPrice ?? 'Unknown'}
										</Table.Td>
										<Table.Td>
											{data?.donationCard?.wishItemName ?? 'Unknown'}
										</Table.Td>
										<Table.Td>
											{data?.donationDate
												? new Date(data?.donationDate).toLocaleDateString(
														'en-US',
														dateConfig,
												  )
												: 'Unknown'}
										</Table.Td>
										<Table.Td>{data?.status ?? 'Unknown'}</Table.Td>
									</Table.Tr>
							  ))
							: null}
					</Table.Tbody>
				</Table>
				{!donations.length ? (
					<p className="d-flex justify-content-center">
						{Translations.DONATION_HISTORY.noRecords}
					</p>
				) : null}
			</div>
		</MantineProviderWrapper>
	);
}

export default DonationHistory;
