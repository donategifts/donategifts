import { Loader } from '@mantine/core';
import axios from 'axios';
import PropType from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import React from 'react';

import MessageForm from '../../components/forms/MessageForm.jsx';
import MessageBoard from '../../components/shared/MessageBoard.jsx';
import AgencyDetails from '../../components/wishcard/AgencyDetails.jsx';
import IntroduceChild from '../../components/wishcard/IntroduceChild.jsx';
import WishDetails from '../../components/wishcard/WishDetails.jsx';
import { formatAddress, getLastUrlSegment } from '../../utils/helpers';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

const ChildDetails = React.memo(
	({ firstName, age = 'Not Provided', interest = 'Not Provided', story = 'Not Provided' }) => {
		return (
			<div className="col-md-6 col-lg-6 col-12">
				<div className="display-6 text-primary my-4">About {firstName}</div>
				<p>
					<span className="fw-bold">My Age:</span>
					<span className="mx-2">{age}</span>
				</p>
				<p>
					<span className="fw-bold">My Interest:</span>
					<span className="mx-2">{interest}</span>
				</p>
				<p>
					<span className="fw-bold">My Story:</span>
					<span className="mx-2">{story}</span>
				</p>
			</div>
		);
	},
);

ChildDetails.displayName = 'ChildDetails';
ChildDetails.propTypes = {
	firstName: PropType.string,
	age: PropType.number,
	interest: PropType.string,
	story: PropType.string,
};

const AboutChild = ({ childData, agencyData }) => (
	<div className="card-body bg-white p-4 mb-4 shadow-lg rounded-3 border border-1">
		<div className="row m-2">
			<ChildDetails {...childData} />
			<AgencyDetails {...agencyData} />
		</div>
	</div>
);

AboutChild.propTypes = {
	childData: PropType.shape({
		age: PropType.number,
		interest: PropType.string,
		story: PropType.string,
	}),
	agencyData: PropType.shape({
		name: PropType.string,
		address: PropType.string,
		phone: PropType.string,
		website: PropType.string,
		bio: PropType.string,
	}),
};

export default function WishCardSingle({ user }) {
	const id = getLastUrlSegment();
	const [wishcard, setWishcard] = useState(null);
	const [agency, setAgency] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [messages, setMessages] = useState([]);
	const [defaultMessages, setDefaultMessages] = useState([]);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`/api/wishcards/single/${id}`);
			const { wishcard, agency, messages, defaultMessages } = response.data.data;
			setWishcard(wishcard);
			setAgency(agency);
			setMessages(messages);
			setDefaultMessages(defaultMessages);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		setIsLoading(false);
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (isLoading || !wishcard || !agency) {
		return (
			<MantineProviderWrapper>
				<div className="w-full row justify-content-center">
					<Loader type="dots" />
				</div>
			</MantineProviderWrapper>
		);
	}
	return (
		<MantineProviderWrapper>
			<div className="single">
				<div className="row justify-content-center align-items-start">
					<IntroduceChild
						childName={wishcard.childFirstName}
						childId={wishcard._id}
						user={user}
						status={wishcard.status}
						image={{
							src: wishcard.wishCardImage || wishcard.childImage,
							alt: wishcard.wishItemName,
						}}
					/>
					<div className="col-md-8 col-12 mt-4 p-4">
						<AboutChild
							childData={{
								firstName: wishcard.childFirstName,
								age: wishcard.age,
								story: wishcard.childStory,
								interest: wishcard.childInterest,
							}}
							agencyData={{
								name: agency.agencyName,
								address: formatAddress(agency.agencyAddress),
								phone: agency.agencyPhone,
								website: agency.agencyWebsite,
								bio: agency.agencyBio,
							}}
						/>
						<div className="card-body bg-white p-4 mb-4 shadow-lg rounded-3 border border-1">
							<div className="row m-2">
								<WishDetails
									wishItemName={wishcard.wishItemName}
									wishItemImage={wishcard.wishItemImage}
									wishItemPrice={wishcard.wishItemPrice}
								/>
								{user && Object.keys(user).length > 0 && (
									<MessageForm
										defaultMessages={defaultMessages}
										wishcard={wishcard}
										user={user}
										onMessageSend={fetchData}
									/>
								)}
							</div>
						</div>
						<MessageBoard childName={wishcard.childFirstName} messages={messages} />
					</div>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

WishCardSingle.propTypes = {
	user: PropType.object,
};
