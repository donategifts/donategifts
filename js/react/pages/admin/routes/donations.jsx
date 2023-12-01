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
					'Something went wrong',
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
				<Table.Td>{donation.user.name}</Table.Td>
				<Table.Td>{donation.agency.name?.slice(0, 50)}...</Table.Td>
				<Table.Td>
					<b>${donation.wishCard.itemPrice}</b>
				</Table.Td>
				<Table.Td>
					<a href={donation.wishCard.itemURL} target="_blank" rel="noreferrer">
						{donation.wishCard.itemURL?.slice(0, 80)}...
					</a>
				</Table.Td>
				<Table.Td>{donation.date}</Table.Td>
				<Table.Td
					style={{ textAlign: 'center' }}
					bg={donation.status === 'delivered' ? 'teal.7' : 'yellow.3'}
				>
					{donation.status}
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
				<Table.Td style={{ textAlign: 'center' }}>
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
						<Table.Th style={{ textAlign: 'center' }}>Donator</Table.Th>
						<Table.Th style={{ textAlign: 'center' }}>Agency</Table.Th>
						<Table.Th style={{ textAlign: 'center' }}>Price</Table.Th>
						<Table.Th style={{ textAlign: 'center' }}>URL</Table.Th>
						<Table.Th style={{ textAlign: 'center' }}>Date</Table.Th>
						<Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
						<Table.Th style={{ textAlign: 'center' }}>Total</Table.Th>
						<Table.Th style={{ textAlign: 'center' }}>Tracking Info</Table.Th>
						<Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
}
