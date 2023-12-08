import { Button, Select, Textarea } from '@mantine/core';
import axios from 'axios';
import PropType from 'prop-types';
import { useState } from 'react';

import CustomToast from '../../components/shared/CustomToast.jsx';

const MessageForm = ({ defaultMessages, wishcard, onMessageSend, user, donorId }) => {
	const [selectedMessage, setSelectedMessage] = useState('');
	const [customMessage, setCustomMessage] = useState('');
	const [messageError, setMessageError] = useState('');
	const [toastMessage, setToastMessage] = useState('');
	const [toastType, setToastType] = useState('');
	const [showToast, setShowToast] = useState(false);
	const userId = `${user._id}`;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!selectedMessage && !customMessage) {
			setMessageError('Must contain a message.');
		} else {
			handlePost(customMessage || selectedMessage);
		}
	};

	const handlePost = async (msg) => {
		try {
			const res = await axios.post('/wishcards/message', {
				messageFrom: user || {},
				messageTo: wishcard,
				message: msg,
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

	const handleSelect = (value) => {
		setSelectedMessage(value);
		if (value) {
			setMessageError('');
		}
	};

	const handleInput = (e) => {
		const value = e?.target?.value;
		setCustomMessage(value);
		if (value) {
			setMessageError('');
		}
	};

	return (
		<div className="col-md-6 col-lg-6 col-12">
			<form className="d-flex flex-column justify-content-center" onSubmit={handleSubmit}>
				<div className="display-6 my-4">Send Message</div>
				<Select
					id="messageSelect"
					name="messageSelect"
					onChange={(value) => handleSelect(value)}
					size="lg"
					searchable
					placeholder="Select a greeting option"
					data={defaultMessages}
					disabled={customMessage}
					error={messageError}
				/>
				{donorId && userId === donorId ? (
					<Textarea
						size="lg"
						mt="sm"
						rows={6}
						name="messageCustom"
						placeholder={
							selectedMessage
								? 'To write a custom message, please unselect the greeting option first.'
								: 'Or write your custom message here'
						}
						onChange={handleInput}
						disabled={selectedMessage}
					/>
				) : null}
				<Button radius="md" className="w-sm-100" type="submit" mt="md" size="lg">
					Submit Message
				</Button>
			</form>
			<CustomToast
				message={toastMessage}
				type={toastType}
				isVisible={showToast}
				setIsVisible={setShowToast}
			/>
		</div>
	);
};

MessageForm.propTypes = {
	defaultMessages: PropType.arrayOf(PropType.string).isRequired,
	wishcard: PropType.object.isRequired,
	onMessageSend: PropType.func.isRequired,
	user: PropType.object,
	donorId: PropType.string,
};

export default MessageForm;
