import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
	[K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Numeric = ColumnType<string, string | number, string | number>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Agencies {
	id: Generated<string>;
	name: string;
	website: string;
	phone: string;
	bio: string | null;
	address_line_1: string;
	address_line_2: string | null;
	city: string;
	state: string;
	country: string;
	zip_code: string;
	verified: Generated<boolean>;
	employer_identification_number: string;
	account_manager_id: string;
	image_id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp | null;
}

export interface Children {
	id: Generated<string>;
	first_name: string;
	last_name: string;
	birth_year: number;
	interest: string;
	story: string;
	image_id: string;
	created_at: Generated<Timestamp>;
}

export interface CommunityPosts {
	id: Generated<string>;
	message: string;
	agency_id: string;
	image_id: string;
	created_at: Generated<Timestamp>;
}

export interface Images {
	id: Generated<string>;
	url: string;
	meta_data: Json | null;
	created_at: Generated<Timestamp>;
}

export interface Items {
	id: Generated<string>;
	name: string;
	price: Numeric;
	link: string;
	retailer: string;
	product_id: string;
	image_id: string;
	created_at: Generated<Timestamp>;
}

export interface Messages {
	id: Generated<string>;
	content: string;
	sender: string;
	wishcard_id: string;
	created_at: Generated<Timestamp>;
}

export interface Orders {
	id: Generated<string>;
	status: Generated<number>;
	delivery_date: Timestamp | null;
	tracking_info: string | null;
	donor_id: string;
	child_id: string;
	item_id: string;
	agency_id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp | null;
}

export interface Users {
	id: Generated<string>;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	role: number;
	login_mode: number;
	bio: string | null;
	verified: Generated<boolean>;
	image_id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp | null;
	deleted_at: Timestamp | null;
}

export interface Verifications {
	id: Generated<string>;
	email_verified: boolean;
	user_id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp | null;
}

export interface VerificationTokens {
	id: Generated<string>;
	token: string;
	type: number;
	expiration: Timestamp;
	user_id: string;
	created_at: Generated<Timestamp>;
}

export interface Wishcards {
	id: Generated<string>;
	address_line_1: string;
	address_line_2: string | null;
	city: string;
	state: string;
	country: string;
	zip_code: string;
	status: Generated<number>;
	created_by: string;
	agency_id: string;
	child_id: string;
	item_id: string;
	image_id: string;
	order_id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp | null;
}

export interface DB {
	agencies: Agencies;
	children: Children;
	community_posts: CommunityPosts;
	images: Images;
	items: Items;
	messages: Messages;
	orders: Orders;
	users: Users;
	verification_tokens: VerificationTokens;
	verifications: Verifications;
	wishcards: Wishcards;
}
