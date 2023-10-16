import { AppShell, Burger, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import PropTypes from 'prop-types';

import Navigation from '../components/admin/Navigation.jsx';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

const styles = {
	position: 'absolute',
	left: '5.5rem',
	fontWeight: 'bold',
	fontSize: '17pt',
};

function AdminLayout({ children }) {
	const [opened, { toggle }] = useDisclosure();

	return (
		<MantineProviderWrapper>
			<AppShell
				header={{ height: 100 }}
				navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
				padding="lg"
			>
				<AppShell.Header className="d-flex justify-content-between align-items-center px-3">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<a href="/" className="d-flex align-items-baseline text-decoration-none">
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
					</a>
					<a className="btn btn-link text-decoration-none nav-link" href="/">
						<i className="fas fa-sign-out-alt fs-2"></i>
					</a>
				</AppShell.Header>

				<Navigation />

				<AppShell.Main>{children}</AppShell.Main>
			</AppShell>
		</MantineProviderWrapper>
	);
}

AdminLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AdminLayout;
