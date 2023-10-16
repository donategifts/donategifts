import { AppShell } from '@mantine/core';

export default function Navigation() {
	return (
		<AppShell.Navbar p="md">
			<a className="btn btn-link text-decoration-none" href="/admin/wishcards">
				Wishcards
			</a>
			<hr />
			<a className="btn btn-link text-decoration-none" href="/admin/agencyOverview">
				Agency Overview
			</a>
			<hr />
			<a className="btn btn-link text-decoration-none" href="/admin/users">
				Users
			</a>
		</AppShell.Navbar>
	);
}
