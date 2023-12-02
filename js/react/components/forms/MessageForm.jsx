import { Button } from '@mantine/core';
import axios from 'axios';
import PropType from 'prop-types';
import { useState, useEffect } from 'react';

import CustomToast from '../../components/shared/CustomToast.jsx';

const MessageForm = ({ defaultMessages, wishcard, onMessageSend, user }) => {
	const [selectedMessage, setSelectedMessage] = useState('');
	const [toastMessage, setToastMessage] = useState('');
	const [toastType, setToastType] = useState('');
	const [showToast, setShowToast] = useState(false);

	useEffect(() => {
		setSelectedMessage(defaultMessages[0] || '');
	}, [defaultMessages]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const res = await axios.post('/wishcards/message', {
				messageFrom: user || {},
				messageTo: wishcard,
				message: selectedMessage,
			});
			const data = res.data.data;
			onMessageSend({ ...data, messageFrom: user });
			setToastMessage('Message sent successfully!');
			setToastType('success');
			setShowToast(true);
		} catch (error) {
			console.error('Error sending message:', error);
			setToastMessage(error.response?.data?.error?.msg || 'Error sending message');
			setToastType('error');
			setShowToast(true);
		}
	};

	return (
		<div className="col-md-6 col-lg-6 col-12">
			<form
				className="text-center d-flex flex-column justify-content-center"
				onSubmit={handleSubmit}
			>
				<div className="display-6 text-primary my-4">Send Message</div>
				<select
					id="messageSelect"
					className="form-select form-select-lg mb-3"
					aria-label="Select a message"
					value={selectedMessage}
					onChange={(e) => setSelectedMessage(e.target.value)}
				>
					{defaultMessages.map((message, index) => (
						<option key={index} value={message}>
							{message}
						</option>
					))}
				</select>
				<Button
					type="submit"
					className="btn btn-lg btn-primary mt-4 d-flex justify-content-center"
				>
					Send Message
				</Button>
			</form>
			{showToast && (
				<CustomToast message={toastMessage} type={toastType} delayCloseForSeconds={5} />
			)}
		</div>
	);
};

MessageForm.propTypes = {
	defaultMessages: PropType.arrayOf(PropType.string).isRequired,
	wishcard: PropType.object.isRequired,
	onMessageSend: PropType.func.isRequired,
	user: PropType.object,
};

export default MessageForm;
