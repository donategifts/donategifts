import { Textarea, Button } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';

import WishCard from '../../components/shared/WishCard.jsx';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function PaymentSuccess() {
	const [successInfo, setSuccessInfo] = useState({});

	useEffect(() => {
		axios.get('/api/payment/success').then((res) => {
			if (res.data && res.data.data) {
				setSuccessInfo(res.data.data);
			}
		});
	}, []);

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
							<a href="/profile/donations" target="_blank">
								{10 + Math.ceil(successInfo?.amount * 2)} donation karma points.
							</a>
						</p>
						<p>
							Please check your email at{' '}
							<span className="fw-bold">{successInfo?.email}</span> for the
							confirmation receipt.
						</p>
					</div>
					<hr />
					<div className="col-sm-12 col-md-6 mt-3">
						<p className="display-6">
							Send a custom message to {successInfo?.wishCard?.childFirstName}
						</p>
						<Textarea
							size="lg"
							rows={6}
							name="message"
							placeholder="Write something here..."
						/>
						<div className="d-flex justify-content-center my-3">
							<Button
								leftSection={<i className="fas fa-paper-plane"></i>}
								size="lg"
								fullWidth={true}
							>
								Send Message
							</Button>
						</div>
					</div>
					<div className="col-sm-12 col-md-6 mt-3 p-5">
						<p>
							Donation Total: <span className="fw-bold">${successInfo?.amount}</span>
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
					<hr className="mt-5" />
					<h4 className="heading-primary text-center mt-5">
						Other kids still awaiting gifts
					</h4>
					<div className="row justify-content-center my-5">
						{successInfo?.suggestedCards?.map((card) => (
							<div key={card._id} className="col-sm-12 col-md-4">
								<div className="mb-sm-3">
									<WishCard wishCard={card} />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

export default PaymentSuccess;
