import { Table } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';

import CustomButton from '../../../components/shared/CustomButton.jsx';

export default function Donations() {
	const [donations, setDonations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [rows, setRows] = useState([]);

	const updateStatus = async (id, status) => {
		setLoading(true);

		try {
			const {
				data: { data },
			} = await axios('/api/admin/donations/', {
				method: 'PUT',
				data: { donationId: id, status },
			});

			new window.DG.Toast().show(data.message, window.DG.Toast.styleMap.success);

			await fetchDonations();
		} catch (error) {
			console.error(error);
			new window.DG.Toast().show('Something went wrong', window.DG.Toast.styleMap.success);
		}

		setLoading(false);
	};

	const fetchDonations = async () => {
		try {
			const {
				data: { data },
			} = await axios('/api/admin/donations');
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
				<Table.Td>{donation.agency.name}</Table.Td>
				{/* <Table.Td>{donation.wishCard.itemName}</Table.Td> */}
				<Table.Td>
					<b>${donation.wishCard.itemPrice}</b>
				</Table.Td>
				<Table.Td>
					<a href={donation.wishCard.itemURL} target="_blank" rel="noreferrer">
						{donation.wishCard.itemURL?.slice(0, 100)}...
					</a>
				</Table.Td>
				<Table.Td>{donation.date}</Table.Td>
				<Table.Td bg={donation.status === 'delivered' ? 'teal.7' : 'yellow.3'}>
					{donation.status}
				</Table.Td>
				<Table.Td>
					<b>${donation.totalAmount}</b>
				</Table.Td>
				<Table.Td>
					{donation.status === 'confirmed' && (
						<CustomButton
							variant="outline"
							loading={loading}
							text="Set Ordered"
							onClick={() => updateStatus(donation.id, 'ordered')}
						/>
					)}
					{donation.status === 'ordered' && (
						<CustomButton
							variant="outline"
							loading={loading}
							text="Set Delivered"
							onClick={() => updateStatus(donation.id, 'delivered')}
						/>
					)}
					{donation.status === 'delivered' && <CustomButton disabled text="Received" />}
				</Table.Td>
			</Table.Tr>
		));

	useEffect(() => {
		fetchDonations();
	}, []);

	useEffect(() => {
		setRows(constructRows());
	}, [donations]);

	return (
		<Table.ScrollContainer minWidth={500}>
			<Table striped highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Donator</Table.Th>
						<Table.Th>Agency</Table.Th>
						{/* <Table.Th>Item</Table.Th> */}
						<Table.Th>Price</Table.Th>
						<Table.Th>URL</Table.Th>
						<Table.Th>Date</Table.Th>
						<Table.Th>Status</Table.Th>
						<Table.Th>Total</Table.Th>
						<Table.Th>Actions</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
}
