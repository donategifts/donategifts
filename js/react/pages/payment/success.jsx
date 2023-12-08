import { Textarea, Button } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

import PopOver from '../../components/shared/PopOver.jsx';
import WishCard from '../../components/shared/WishCard.jsx';
import Translations from '../../translations/en/profile.json';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function PaymentSuccess() {
	const [successInfo, setSuccessInfo] = useState({});
	const [suggestedCards, setSuggestedCards] = useState([]);
	const [message, setMessage] = useState('');
	const [messageError, setMessageError] = useState('');
	const [isMessageSent, setIsMessageSent] = useState(false);
	const messageRef = useRef();

	useEffect(() => {
		axios.get('/api/payment/success').then((res) => {
			if (res.data && res.data.data) {
				setSuccessInfo(res.data.data);
			}
		});
	}, []);

	useEffect(() => {
		// handle edge cases for when the suggested wishcards are donated
		if (successInfo && successInfo.suggestedCards) {
			setSuggestedCards(
				successInfo.suggestedCards.filter((card) => card?.status === 'published'),
			);
		}
	}, [successInfo]);

	const handleInput = (e) => {
		const value = e?.target?.value;
		if (value) {
			setMessage(value);
			setMessageError('');
		}
	};

	const handleReset = () => {
		messageRef.current.value = '';
		setIsMessageSent(true);
	};

	const handleClickSend = () => {
		if (!message || !message.length) {
			setMessageError('Please write a message before sending it. Message cannot be empty.');
		} else {
			handleSendMessage();
		}
	};

	const handleSendMessage = async () => {
		const toast = new window.DG.Toast();
		const data = {
			messageFrom: successInfo?.userId,
			messageTo: successInfo?.wishCardId,
			message,
		};
		try {
			await axios.post('/api/wishcards/message', data);
			toast.show('Your message was sent!');
			handleReset();
		} catch (error) {
			toast.show(
				error?.response?.data?.error?.msg ||
					error?.message ||
					'Error: Unable to send your message. Please try again or contact us.',
				toast.styleMap.danger,
			);
		}
	};

	return (
		<MantineProviderWrapper>
			<div id="payment-success" className="container">
				<div className="row justify-content-center">
					<div className="text-center mb-3">
						<h1 className="heading-primary my-4">
							Thank you for your donation<i className="far fa-check-circle mx-3"></i>
						</h1>
						<p>
							Your payment was successful, and we are currently processing your order.
							As a result of this donation, you have earned{' '}
							<b>{10 + Math.ceil(successInfo?.amount * 2)}</b> donation karma points.
							<PopOver
								text={Translations.DONATION_HISTORY.karmaPoints.popOverText}
								imageSource="/img/tshirt-2023.png"
							/>
						</p>
						<p>
							Please check your email at{' '}
							<span className="fw-bold">{successInfo?.email}</span> for the
							confirmation receipt.
						</p>
					</div>
					<hr />
					<div className="col-sm-12 col-md-6 mt-3 mb-sm-3">
						{isMessageSent ? (
							<p className="display-6">
								Message was sent to the agency and posted on
								<a
									href={`/wishcards/single/${successInfo?.wishCard?._id}`}
									target="_blank"
									className="text-secondary"
									rel="noreferrer"
								>{` ${successInfo?.wishCard?.childFirstName}'s wish page`}</a>
							</p>
						) : (
							<p className="display-6">
								Write a custom message to {successInfo?.wishCard?.childFirstName}
							</p>
						)}
						<Textarea
							size="lg"
							rows={7}
							name="message"
							placeholder={
								isMessageSent
									? 'Your message was successfully sent.'
									: 'Your message will appear on the wish card page. Please avoid sharing private information.'
							}
							error={messageError}
							ref={messageRef}
							onChange={handleInput}
							disabled={isMessageSent}
						/>
						<div className="d-flex justify-content-center my-3">
							<Button
								leftSection={<i className="fas fa-paper-plane"></i>}
								size="lg"
								fullWidth={true}
								onClick={handleClickSend}
								disabled={isMessageSent}
							>
								Send Message
							</Button>
						</div>
					</div>
					<div className="col-sm-12 col-md-6 holiday-bg d-flex flex-column justify-content-center align-items-center rounded-2">
						<p className="display-6">
							<a href="/profile/donations" target="_blank">
								Your Donation Summary
							</a>
						</p>
						<p>
							Donation Total: <span className="fw-bold">${successInfo?.amount}</span>
						</p>
						<p>
							Donation Date:{' '}
							<span className="fw-bold">{successInfo?.donationDate}</span>
						</p>
						<p>
							Donation Recipient:{' '}
							<span className="fw-bold">{successInfo?.wishCard?.childFirstName}</span>
						</p>
						<p>
							Donation Item:{' '}
							<span className="fw-bold">{successInfo?.wishCard?.wishItemName}</span>
						</p>
					</div>
					{suggestedCards.length > 0 ? (
						<>
							<hr className="mt-4" />
							<h4 className="heading-primary text-center mt-5">
								Other kids still awaiting gifts
							</h4>
							<div className="row justify-content-center my-5">
								{suggestedCards?.map((card) => (
									<div key={card._id} className="col-sm-12 col-md-4">
										<div className="mb-sm-3">
											<WishCard
												wishCard={card}
												attributes={{
													href: `/wishcards/donate/${card._id}`,
													target: `_blank`,
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</>
					) : null}
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

export default PaymentSuccess;
