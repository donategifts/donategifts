import axios from 'axios';
import { useState } from 'react';

function Contact() {
	const [formState, setFormState] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});

	function handleChange(e) {
		setFormState((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	}

	function handleSubmit(e) {
		e.preventDefault();
		const toast = new window.DG.Toast();
		axios
			.post('/contact/customer-service', {
				...formState,
			})
			.then((_res) => {
				toast.show('Message sent, thank you for your feedback!');
				setFormState({
					name: '',
					email: '',
					subject: '',
					message: '',
				});
			})
			.catch((err) => {
				toast.show(
					err.response.data.error.msg || err.response.data.error,
					toast.styleMap.danger,
				);
			});
	}

	return (
		<div className="gradient-form h-100" id="contact">
			<div className="container">
				<div className="container py-5">
					<div className="d-flex flex-column justify-content-center align-items-center">
						<h1 className="text-center text-primary cool-font mb-3">Get In Touch</h1>
						<p className="mb-2">
							Please fill out the contact form and we will be in touch with you as
							soon as possible.
						</p>
						<p>
							In the meantime, please check if your question has been answered in our
							<a className="text-secondary ms-1 text-underline" href="/faq">
								FAQs page.
							</a>
						</p>
					</div>
					<form className="p-5 rounded-4" onSubmit={handleSubmit}>
						<div className="col-md-8 mx-auto text-white">
							<div className="py-2">
								<label className="form-label" htmlFor="name">
									Name
								</label>
								<input
									className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
									id="name"
									name="name"
									type="text"
									required="required"
									value={formState.name}
									onChange={handleChange}
								/>
							</div>
							<div className="py-2">
								<label className="form-label" htmlFor="email">
									Email
								</label>
								<input
									className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
									id="email"
									name="email"
									type="email"
									required="required"
									value={formState.email}
									onChange={handleChange}
								/>
							</div>
							<div className="py-2">
								<label className="form-label" htmlFor="subject">
									Subject
								</label>
								<input
									className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
									id="subject"
									name="subject"
									type="text"
									required="required"
									value={formState.subject}
									onChange={handleChange}
								/>
							</div>
							<div className="py-2">
								<label className="form-label" htmlFor="contact-message">
									Message
								</label>
								<textarea
									className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
									id="contact-message"
									name="message"
									type="text"
									required="required"
									value={formState.message}
									onChange={handleChange}
								/>
							</div>
							<div className="row py-2 justify-content-center">
								<div className="col-md-6">
									<button
										className="btn btn-lg btn-primary w-100"
										id="submit-btn"
										type="submit"
									>
										Contact Us
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Contact;
