import { AppShell, Burger, Divider, Image } from '@mantine/core';
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
			navbar={{ width: 200, breakpoint: 'md', collapsed: { mobile: !opened } }}
			padding="lg"
		>
			<AppShell.Header className="d-flex justify-content-between align-items-center px-3">
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
				<Burger opened={opened} onClick={toggle} hiddenFrom="md" size="md" />
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<Link
					className="btn btn-link text-decoration-none w-100"
					onClick={toggle}
					to="/agency/overview"
				>
					Agencies
				</Link>
				<Divider my="md" />
				<Link
					className="btn btn-link text-decoration-none"
					onClick={toggle}
					to="/wishcards/administration"
				>
					Wishcards
				</Link>
				<Divider my="md" />
				<Link
					className="btn btn-link text-decoration-none"
					onClick={toggle}
					to="/donations"
				>
					Donations
				</Link>
				<Divider my="md" />
				<a className="btn btn-link text-decoration-none" href="/">
					Back to Home
				</a>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}

export default AdminLayout;
