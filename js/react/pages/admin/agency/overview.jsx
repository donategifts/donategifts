import { Container, Table, Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';

import MantineProviderWrapper from '../../../utils/mantineProviderWrapper.jsx';

export default function Overview() {
	const basePath = '/api/admin';
	const [rows, setRows] = useState([]);
	const [value, setValue] = useState('unverified');

	const fetchAgencies = async (verified = false) => {
		const res = await fetch(`${basePath}/agencyOverview?getVerified=${verified}`);
		const { data } = await res.json();

		setRows(
			data.map((agency) => (
				<Table.Tr key={agency.id}>
					<Table.Td>{agency.name}</Table.Td>
					<Table.Td>{agency.phone}</Table.Td>
					<Table.Td>
						<a href={agency.website} target="_blank" rel="noreferrer">
							{agency.website}
						</a>
					</Table.Td>
					<Table.Td>{agency.joined}</Table.Td>
					<Table.Td>{agency.bio}</Table.Td>
					<Table.Td>{agency.accountManager}</Table.Td>
					<Table.Td>
						<a href={`/admin/agencyDetail/${agency.id}`}>Detail</a>
					</Table.Td>
				</Table.Tr>
			)),
		);
	};

	useEffect(() => {
		if (value === 'unverified') {
			fetchAgencies();
		} else {
			fetchAgencies(true);
		}
	}, [value]);

	const ths = (
		<Table.Tr>
			<Table.Th>Name</Table.Th>
			<Table.Th>Phone</Table.Th>
			<Table.Th>Website</Table.Th>
			<Table.Th>Joined</Table.Th>
			<Table.Th>Bio</Table.Th>
			<Table.Th>Account Manager</Table.Th>
			<Table.Th>Detail</Table.Th>
		</Table.Tr>
	);

	return (
		<MantineProviderWrapper>
			<Container fluid className="col-10 mt-3 p-4 border rounded-top shadow">
				<Tabs value={value} onChange={setValue}>
					<Tabs.List grow>
						<Tabs.Tab value="unverified" color="blue">
							To be verified Agencies
						</Tabs.Tab>
						<Tabs.Tab value="verified" color="teal">
							Already verified Agencies
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value={value}>
						<Table
							captionSide="top"
							striped
							highlightOnHover
							withTableBorder
							withColumnBorders
						>
							<Table.Caption className="text-center">
								Please check their website and details before you verify them
							</Table.Caption>
							<Table.Thead>{ths}</Table.Thead>
							<Table.Tbody>{rows}</Table.Tbody>
						</Table>
					</Tabs.Panel>
				</Tabs>
			</Container>
		</MantineProviderWrapper>
	);
}
