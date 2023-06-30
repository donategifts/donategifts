import mongoose from 'mongoose';

interface Contact {
	name: string;
	email: string;
	subject: string;
	message: string;
	sentDate: Date;
}

const { Schema } = mongoose;
const ContactSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		sentDate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: 'contacts',
	},
);

const Contact = mongoose.model<Contact>('Contact', ContactSchema);

export default Contact;
