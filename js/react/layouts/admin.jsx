import { AppShell, Burger, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet } from 'react-router-dom';

import Navigation from '../components/admin/Navigation.jsx';

const styles = {
	position: 'absolute',
	left: '5.5rem',
	fontWeight: 'bold',
	fontSize: '17pt',
};

function AdminLayout() {
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell
			header={{ height: 100 }}
			navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
			padding="lg"
		>
			<AppShell.Header className="d-flex justify-content-between align-items-center px-3">
				<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
				<Link to="/" className="d-flex align-items-baseline text-decoration-none">
					<Image
						src="/img/new-donate-gifts-logo-2.png"
						h={100}
						w="auto"
						fit="contain"
						alt="logo"
					/>
					<small className="text-success" style={styles}>
						Admin
					</small>
				</Link>
				<a className="btn btn-link text-decoration-none nav-link" href="/">
					<i className="fas fa-sign-out-alt fs-2"></i>
				</a>
			</AppShell.Header>

			<Navigation />

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}

export default AdminLayout;
