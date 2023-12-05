import {
	TextInput,
	Radio,
	Group,
	Checkbox,
	Select,
	Switch,
	Flex,
	Button,
	Menu,
	Grid,
} from '@mantine/core';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function SearchBar({
	searchTextRef,
	fetchSearchResults,
	searchQueryParams,
	setSearchQueryParams,
	agencies,
}) {
	const [isMobile, setIsMobile] = useState(false);

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const resizeWidth = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		if (windowWidth > 992) {
			setIsMobile(false);
		} else {
			setIsMobile(true);
		}

		window.addEventListener('resize', resizeWidth);

		return () => window.removeEventListener('resize', resizeWidth);
	}, [windowWidth]);

	const clearFilters = () => {
		setSearchQueryParams({
			showDonated: 'yes',
			ageGroups: [],
			agencyFilter: '',
			sortOrder: [],
		});

		searchTextRef.current.value = '';
	};

	return (
		<Grid
			display="flex"
			justify="center"
			pos={isMobile ? 'sticky' : 'inherit'}
			top={50}
			style={{ zIndex: 2000 }}
		>
			<Grid.Col span={{ baseLine: 12, md: 10 }}>
				<Flex justify="end">
					<Menu
						shadow="md"
						width={340}
						position="top"
						offset={10}
						withArrow
						arrowPosition="center"
					>
						<Menu.Target>
							<Button
								variant="outline"
								size="lg"
								color="#333a64"
								className="bg-white"
								fullWidth={isMobile}
								my={10}
								mx={20}
								style={{
									boxShadow:
										'0 4px 8px 0 rgba(0,0,0,0.3), 0 3px 10px 0 rgba(0,0,0,0.2)',
								}}
							>
								Search / Filter<i className="fas fa-filter mx-2"></i>
							</Button>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>Options</Menu.Label>
							<Menu.Item closeMenuOnClick={false}>
								<TextInput
									placeholder="Search"
									ref={searchTextRef}
									aria-label="Search"
									onChange={() => fetchSearchResults(true)}
								/>
							</Menu.Item>
							<Menu.Item closeMenuOnClick={false}>
								<Radio.Group
									name="donationStatus"
									label="Show donated cards"
									value={searchQueryParams.showDonated}
									onChange={(value) =>
										setSearchQueryParams({
											...searchQueryParams,
											showDonated: value,
										})
									}
								>
									<Group mt="xs">
										<Radio value="yes" label="Yes" />
										<Radio value="no" label="No" />
									</Group>
								</Radio.Group>
							</Menu.Item>
							<Menu.Item closeMenuOnClick={false}>
								<Checkbox.Group
									label="Filter by age group"
									value={searchQueryParams.ageGroups}
									onChange={(value) =>
										setSearchQueryParams({
											...searchQueryParams,
											ageGroups: value,
										})
									}
								>
									<Group mt="xs">
										<Checkbox value="younger" label="0 - 15" />
										<Checkbox value="older" label="15+" />
									</Group>
								</Checkbox.Group>
							</Menu.Item>
							<Menu.Item closeMenuOnClick={false}>
								<Select
									label="Filter by agency"
									data={agencies.map((agency) => agency.agencyName)}
									value={searchQueryParams.agencyFilter}
									onChange={(value) =>
										setSearchQueryParams({
											...searchQueryParams,
											agencyFilter: value,
										})
									}
									clearable
								/>
							</Menu.Item>
							<Menu.Item closeMenuOnClick={false}>
								<Switch.Group
									label="Sort by most recent"
									value={searchQueryParams.sortOrder}
									onChange={(value) =>
										setSearchQueryParams({
											...searchQueryParams,
											sortOrder: value,
										})
									}
								>
									<Group mt="xs">
										<Switch value="1" aria-label="Most Recent" />
									</Group>
								</Switch.Group>
							</Menu.Item>

							<Menu.Divider />

							<Menu.Item
								color="danger"
								leftSection={<i className="far fa-trash-alt" />}
								onClick={clearFilters}
							>
								Clear filters
							</Menu.Item>
							<Menu.Item color="blue" leftSection={<i className="fas fa-times" />}>
								Close
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Flex>
			</Grid.Col>
		</Grid>
	);
}

SearchBar.propTypes = {
	searchTextRef: PropTypes.object,
	fetchSearchResults: PropTypes.func,
	searchQueryParams: PropTypes.object,
	setSearchQueryParams: PropTypes.func,
	agencies: PropTypes.array,
};

export default SearchBar;
