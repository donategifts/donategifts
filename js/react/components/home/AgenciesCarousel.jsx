import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { chunkArray } from '../../utils/helpers';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function AgenciesCarousel({ agencies }) {
	const agenciesListData = [
		{
			website: 'https://centraltexastableofgrace.org/',
			logoSrc: '/img/central-texas-table-of-grace-logo.jpg',
			logoAlt: 'Central Texas Table of Grace logo',
		},
		{
			website: 'https://onehopeunited.org/',
			logoSrc: '/img/onehopeunited.png',
			logoAlt: 'One Hope United logo',
		},
		{
			website: 'https://www.newalternativesnyc.org/',
			logoSrc: '/img/new-alternatives-logo.png',
			logoAlt: 'New Alternatives logo',
		},
		{
			website: '',
			logoSrc: '/svg/childrens-aid-logo.svg',
			logoAlt: 'Childrens Aid NYC Agency logo',
		},
		{
			website: 'http://www.lacasanorte.org/',
			logoSrc: '/img/la-casa-norte-logo.png',
			logoAlt: 'La casa norte logo',
		},
		{
			website: 'https://www.yos.org/',
			logoSrc: '/img/yos-logo-2.jpeg',
			logoAlt: 'Youth Outreach Services logo',
		},
		{
			website: '',
			logoSrc: '/img/partner-coalition-nyc.jpg',
			logoAlt: 'Partner Coalition of NewYork City logo',
		},
		{
			website: 'https://www.fosteringhopefoundation.org',
			logoSrc: '/img/fostering-hope-logo.jpg',
			logoAlt: 'Fostering Hope logo',
		},
		{
			website: '',
			logoSrc: '/img/you-gotta-believe-logo.jpg',
			logoAlt: 'You gotta believe logo',
		},
		{
			website: '',
			logoSrc: '/img/penny-lane-logo.png',
			logoAlt: 'Penny Lane Agency logo',
		},
		{
			website: '',
			logoSrc: '/img/epworth-tran-logo.png',
			logoAlt: 'Epworth Village logo',
		},
		{
			website: 'https://www.echoesofhope.org/',
			logoSrc: '/img/echoes-of-hope-logo.png',
			logoAlt: 'Echoes of Hope logo',
		},
		{
			website: 'https://www.blueskiesforchildren.org/',
			logoSrc: '/img/blue-sky-agency-logo.png',
			logoAlt: 'Blue Skies for Children logo',
		},
		{
			website: 'https://casala.org/',
			logoSrc: '/img/casa-la-logo.png',
			logoAlt: 'CASA of Los Angeles logo',
		},
		{
			website: 'https://www.hartdistrict.org/',
			logoSrc: '/img/hart-district-logo.png',
			logoAlt: 'William Hart district logo',
		},
		{
			website: 'https://www.nyap.org/',
			logoSrc: '/img/nyap-logo.png',
			logoAlt: 'National Youth Advocate Program logo',
		},
	];
	const displayedAgencies = agencies.length > 0 ? agencies : agenciesListData;
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [chunkedAgencies, setChunkedAgencies] = useState(chunkArray(displayedAgencies, 6));
	const [colStyle, setColStyle] = useState('col-2');

	const resizeWidth = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		if (windowWidth > 1400) {
			setChunkedAgencies(chunkArray(displayedAgencies, 6));
			setColStyle('col-1');
		} else if (windowWidth > 992 && windowWidth < 1400) {
			setChunkedAgencies(chunkArray(displayedAgencies, 4));
			setColStyle('col-2');
		} else if (windowWidth > 768 && windowWidth < 992) {
			setChunkedAgencies(chunkArray(displayedAgencies, 3));
			setColStyle('col-3');
		} else if (windowWidth < 768) {
			setChunkedAgencies(chunkArray(displayedAgencies, 2));
			setColStyle('col-4');
		}
		window.addEventListener('resize', resizeWidth);

		return () => window.removeEventListener('resize', resizeWidth);
	}, [windowWidth]);
	return (
		<MantineProviderWrapper>
			<div className="my-5 py-3">
				<div className="heading-primary text-center mb-3 py-2">Our Partner Agencies</div>
				<div className="container-fluid pb-5">
					<div className="d-flex justify-content-center d-lg-none">
						<button
							title="previous"
							className="btn btn-sm btn-light bg-transparent border-0 p-4"
							type="button"
							data-bs-target="#desktop-cards-carousel"
							data-bs-slide="prev"
						>
							<div className="fa-solid fa-chevron-left fa-2xl text-dark"></div>
						</button>
						<div
							className="carousel slide w-100"
							id="desktop-cards-carousel"
							data-bs-ride="carousel"
						>
							<div className="carousel-inner" role="listbox">
								{chunkedAgencies?.map((chunk, index) => (
									<div
										key={index}
										id="partner-carousel"
										className={`carousel-item ${index === 0 ? 'active' : ''}`}
										data-bs-interval="5000"
									>
										<ul className="row align-items-center px-0">
											{chunk.map((currentAgency) => {
												return (
													<li className={`${colStyle}`} key={index}>
														{currentAgency?.website ? (
															<a
																href={currentAgency?.website}
																target="_blank"
																rel="noreferrer"
															>
																<img
																	src={currentAgency?.logoSrc}
																	alt={currentAgency?.logoAlt}
																	loading="lazy"
																/>
															</a>
														) : (
															<span>
																<img
																	src={currentAgency?.logoSrc}
																	alt={currentAgency?.logoAlt}
																	loading="lazy"
																/>
															</span>
														)}
													</li>
												);
											})}
										</ul>
									</div>
								))}
							</div>
						</div>
						<button
							title="next"
							className="btn btn-sm btn-light bg-transparent border-0 p-4"
							type="button"
							data-bs-target="#desktop-agency-carousel"
							data-bs-slide="next"
						>
							<div className="fa-solid fa-chevron-right fa-2xl text-dark"></div>
						</button>
					</div>
					<div className="d-flex justify-content-center d-lg-none">
						<div
							className="carousel slide w-100"
							id="mobile-cards-carousel"
							data-bs-ride="carousel"
						>
							<div className="carousel-inner p-4">
								{displayedAgencies?.map((currentAgency, index) => (
									<div
										key={index}
										id="partner-carousel"
										className={`carousel-item ${index === 0 ? 'active' : ''}`}
										data-bs-interval="5000"
									>
										<ul className="row justify-content-center">
											<li className="col-12" key={`agency-${index}`}>
												{currentAgency?.website ? (
													<a
														href={currentAgency?.website}
														target="_blank"
														rel="noreferrer"
													>
														<img
															src={currentAgency?.logoSrc}
															alt={currentAgency?.logoAlt}
															loading="lazy"
														/>
													</a>
												) : (
													<span>
														<img
															src={currentAgency?.logoSrc}
															alt={currentAgency?.logoAlt}
															loading="lazy"
														/>
													</span>
												)}
											</li>
										</ul>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

AgenciesCarousel.propTypes = {
	agencies: PropTypes.arrayOf(PropTypes.object),
};

export default AgenciesCarousel;
