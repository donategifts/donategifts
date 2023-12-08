import { Loader } from '@mantine/core';
import axios from 'axios';
import PropType from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import React from 'react';

import MessageForm from '../../components/forms/MessageForm.jsx';
import CustomToast from '../../components/shared/CustomToast.jsx';
import MessageBoard from '../../components/shared/MessageBoard.jsx';
import AboutChild from '../../components/wishcard/AboutChild.jsx';
import IntroduceChild from '../../components/wishcard/IntroduceChild.jsx';
import WishDetails from '../../components/wishcard/WishDetails.jsx';
import { formatAddress, getLastUrlSegment } from '../../utils/helpers';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

export default function WishCardSingle({ user }) {
	const id = getLastUrlSegment();
	const [wishcard, setWishcard] = useState(null);
	const [agency, setAgency] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [messages, setMessages] = useState([]);
	const [defaultMessages, setDefaultMessages] = useState([]);
	const [toastMessage, setToastMessage] = useState('');
	const [toastType, setToastType] = useState('');
	const [showToast, setShowToast] = useState(false);
	const [donorId, setDonorId] = useState('');

	const addNewMessage = useCallback((newMessage) => {
		setMessages((prevMessages) => [...prevMessages, newMessage]);
	}, []);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`/api/wishcards/single/${id}`);
			const { wishcard, agency, messages, defaultMessages, donationFrom } =
				response.data.data;

			if (donationFrom && donationFrom.length) {
				setDonorId(donationFrom);
			}
			setWishcard(wishcard);
			setAgency(agency);
			setMessages(messages);
			setDefaultMessages(defaultMessages);
		} catch (error) {
			console.error('Error fetching data:', error);
			setToastMessage(error.response?.data?.error?.msg || 'Error sending message');
			setToastType('error');
			setShowToast(true);
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
									wishItemInfo={wishcard.wishItemInfo}
								/>
								{user && Object.keys(user).length > 0 ? (
									<MessageForm
										defaultMessages={defaultMessages}
										wishcard={wishcard}
										user={user}
										onMessageSend={addNewMessage}
										donorId={donorId}
									/>
								) : (
									<div className="col-md-6 col-lg-6 col-12">
										<div className="d-flex flex-column justify-content-center">
											<div className="display-6 my-4">Send Message</div>
											<p>
												Please log in to access the message sending feature.
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
						<MessageBoard childName={wishcard.childFirstName} messages={messages} />
					</div>
				</div>
				<CustomToast
					message={toastMessage}
					type={toastType}
					delayCloseForSeconds={5}
					isVisible={showToast}
					setIsVisible={setShowToast}
				/>
			</div>
		</MantineProviderWrapper>
	);
}

WishCardSingle.propTypes = {
	user: PropType.object,
};
