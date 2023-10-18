import { AppShell, Accordion } from '@mantine/core';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter } from '../../utils/helpers';

export default function Navigation() {
	const agencyLinks = ['overview'].map((item) => (
		<Link className="btn btn-link text-decoration-none w-100" to={`/agency/${item}`} key={item}>
			{capitalizeFirstLetter(item)}
		</Link>
	));
	return (
		<AppShell.Navbar p="md">
			<Link className="btn btn-link text-decoration-none" to="/wishcards/administration">
				Wishcards
			</Link>
			<hr />
			<Accordion variant="filled" chevronPosition="right">
				<Accordion.Item value="agencies">
					<Accordion.Control className="text-center text-dark">
						Agencies
					</Accordion.Control>
					<Accordion.Panel>{agencyLinks}</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
			<hr />
			<Link className="btn btn-link text-decoration-none" to="/users/overview">
				Users
			</Link>
		</AppShell.Navbar>
	);
}
