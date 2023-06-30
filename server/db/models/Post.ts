import mongoose from 'mongoose';

interface Post {
	message: string;
	image: string | null;
	belongsTo: string;
	createdAt: Date;
}

const { Schema } = mongoose;
const PostSchema = new Schema(
	{
		message: {
			type: String,
		},
		image: {
			type: String,
		},
		belongsTo: {
			type: Schema.Types.ObjectId,
			ref: 'Agency',
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: 'posts',
	},
);

const Post = mongoose.model<Post>('Post', PostSchema);

export default Post;
