import { Input, Table } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';

import CustomButton from '../../../components/shared/CustomButton.jsx';

export default function Donations() {
	const [donations, setDonations] = useState([]);
	const [rows, setRows] = useState([]);

	const baseUrl = '/api/admin/donations';

	const updateStatus = async (id, status) => {
		try {
			const {
				data: { data },
			} = await axios(baseUrl, {
				method: 'PUT',
				data: { donationId: id, status },
			});

			new window.DG.Toast().show(data.message, window.DG.Toast.styleMap.success);

			//send shipping alert email to agency and donor
			// sendAgencyShippingAlert
			if (status === 'ordered') {
				console.log(id);
			}

			await fetchDonations();
		} catch (error) {
			console.error(error);
			new window.DG.Toast().show('Something went wrong', window.DG.Toast.styleMap.success);
		}
	};

	const updateTrackingInfo = async (id, tracking_info) => {
		if (tracking_info === '' || tracking_info === donations.tracking_info) {
			return;
		}

		try {
			const {
				data: { data },
			} = await axios(`${baseUrl}/tracking`, {
				method: 'PUT',
				data: { id, tracking_info },
			});

			new window.DG.Toast().show(data.message, window.DG.Toast.styleMap.success);

			await fetchDonations();
		} catch (error) {
			console.error(error);

			if (error.response?.data?.error) {
				new window.DG.Toast().show(
					error.response.data.error,
					window.DG.Toast.styleMap.success,
				);
			} else {
				new window.DG.Toast().show(
					'Error: Something went wrong',
					window.DG.Toast.styleMap.success,
				);
			}
		}
	};

	const fetchDonations = async () => {
		try {
			const {
				data: { data },
			} = await axios(baseUrl);
			setDonations(data);
		} catch (error) {
			console.error(error);
			new window.DG.Toast().show(
				'Could not fetch donations!',
				window.DG.Toast.styleMap.success,
			);
		}
	};

	const constructRows = () =>
		donations.map((donation) => (
			<Table.Tr key={donation.id}>
				<Table.Td>
					{donation.user.name?.length >= 20
						? `${donation.user.name?.slice(0, 20)}...`
						: donation.user.name}
				</Table.Td>
				{/* TODO: add wishcard page */}
				<Table.Td
					className={
						donation.wishCard.shippingAddress.includes('No address')
							? 'text-danger fw-semi-bold'
							: 'text-dark'
					}
				>
					{donation.wishCard.shippingAddress}
				</Table.Td>
				<Table.Td>
					<b>${donation.wishCard.itemPrice}</b>
				</Table.Td>
				<Table.Td>{donation.wishCard.productID ?? ''}</Table.Td>
				<Table.Td>
					<a href={donation.wishCard.itemURL} target="_blank" rel="noreferrer">
						{donation.wishCard.itemURL?.length >= 20
							? `${donation.wishCard.itemURL?.slice(0, 20)}...`
							: donation.wishCard.itemURL}
					</a>
				</Table.Td>
				<Table.Td>{donation.date}</Table.Td>
				<Table.Td
					bg={
						donation.status === 'delivered'
							? 'teal.9'
							: donation.status === 'ordered'
							? 'grape.9'
							: 'orange.9'
					}
					className="text-white"
				>
					<b>{donation.status}</b>
				</Table.Td>
				<Table.Td>
					<b>${donation.totalAmount}</b>
				</Table.Td>
				<Table.Td>
					<Input
						defaultValue={donation.tracking_info}
						placeholder="Tracking Info"
						onBlur={(event) =>
							updateTrackingInfo(donation.id, event.currentTarget.value)
						}
					/>
				</Table.Td>
				<Table.Td>
					{donation.status === 'confirmed' && (
						<CustomButton
							component="button"
							variant="outline"
							text="Set Ordered"
							onClick={() => updateStatus(donation.id, 'ordered')}
						/>
					)}
					{donation.status === 'ordered' && (
						<CustomButton
							component="button"
							variant="outline"
							text="Set Delivered"
							onClick={() => updateStatus(donation.id, 'delivered')}
						/>
					)}
					{donation.status === 'delivered' && (
						<CustomButton component="button" disabled text="Received" />
					)}
				</Table.Td>
			</Table.Tr>
		));

	useEffect(() => {
		(async () => {
			await fetchDonations();
		})();
	}, []);

	useEffect(() => {
		setRows(constructRows());
	}, [donations]);

	return (
		<Table.ScrollContainer minWidth={500}>
			<Table striped highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Donor Name</Table.Th>
						<Table.Th>Shipping Address</Table.Th>
						<Table.Th>Price</Table.Th>
						<Table.Th>Product ID</Table.Th>
						<Table.Th>Item URL</Table.Th>
						<Table.Th>Donated Date</Table.Th>
						<Table.Th>Status</Table.Th>
						<Table.Th>Total</Table.Th>
						<Table.Th>Tracking Info</Table.Th>
						<Table.Th>Actions</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
}
