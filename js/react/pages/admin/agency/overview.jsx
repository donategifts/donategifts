import { Table } from '@mantine/core';
import { useEffect } from 'react';

import MantineProviderWrapper from '../../../utils/mantineProviderWrapper.jsx';

export default function Overview() {
	const basePath = '/api/admin';
	let rows = [];

	const fetchAgencies = async () => {
		const res = await fetch(`${basePath}/agencyOverview`);
		const { data } = await res.json();
		console.log(data);
		rows = data.map((agency) => (
			<Table.Tr key={agency._id}>
				<Table.Td>{agency.agencyName}</Table.Td>
			</Table.Tr>
		));
	};

	useEffect(() => {
		fetchAgencies();
	}, []);

	const ths = (
		<Table.Tr>
			<Table.Th>Name</Table.Th>
		</Table.Tr>
	);

	return (
		<MantineProviderWrapper>
			<Table striped highlightOnHover withTableBorder withColumnBorders>
				<Table.Thead>{ths}</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</MantineProviderWrapper>
	);
}
