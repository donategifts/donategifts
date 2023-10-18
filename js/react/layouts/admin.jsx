import { AppShell, Burger, Image, Accordion } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet } from 'react-router-dom';

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
						<Accordion.Panel>
							<Link
								className="btn btn-link text-decoration-none w-100"
								to="/agency/overview"
							>
								Overview
							</Link>
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
				<hr />
				<Link className="btn btn-link text-decoration-none" to="/users/overview">
					Users
				</Link>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}

export default AdminLayout;
