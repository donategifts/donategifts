import PropType from 'prop-types';

import { formatPosterName } from '../../utils/helpers';

const MessageBoard = ({ messages, childName }) => {
	const defaultMessage = `No one signed ${childName}'s card yet. Log in and send a message.`;

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-us', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className="card-body bg-white p-4 mb-4 shadow-lg rounded-3 border border-1">
			<div className="row m-2">
				<div className="display-6 text-primary my-4">Message Board</div>
				{messages && messages.length > 0 ? (
					[...messages]
						.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
						.map((message, index) => (
							<div key={index} className="msg-each row px-3 py-4">
								<div className="col-12">
									<strong>{formatPosterName(message.messageFrom)}</strong>
									<p className="mt-0">{formatDate(message.createdAt)}</p>
									<p className="d-flex align-items-center">
										<i className="far fa-comment-dots text-secondary me-2 fs-4"></i>
										<span>{message.message}</span>
									</p>
								</div>
							</div>
						))
				) : (
					<p>{defaultMessage}</p>
				)}
			</div>
		</div>
	);
};

MessageBoard.propTypes = {
	messages: PropType.arrayOf(
		PropType.shape({
			messageFrom: PropType.shape({
				fName: PropType.string,
				lName: PropType.string,
			}),
			createdAt: PropType.string,
			message: PropType.string,
		}),
	),
	childName: PropType.string.isRequired,
};

export default MessageBoard;
