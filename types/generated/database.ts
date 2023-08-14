import type { ColumnType } from "kysely";

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
  id: number;
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
  account_manager_id: number;
  image_id: number;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
}

export interface Children {
  id: number;
  first_name: string;
  last_name: string;
  birth_year: number;
  interest: string;
  story: string;
  image_id: number;
  created_at: Generated<Timestamp>;
}

export interface CommunityPosts {
  id: number;
  message: string;
  agency_id: number;
  image_id: number;
  created_at: Generated<Timestamp>;
}

export interface Images {
  id: number;
  url: string;
  meta_data: Json | null;
  created_at: Generated<Timestamp>;
}

export interface Items {
  id: number;
  name: string;
  price: Numeric;
  link: string;
  retailer: string;
  product_id: string;
  image_id: number;
  created_at: Generated<Timestamp>;
  meta_data: Json | null;
}

export interface Messages {
  id: number;
  content: string;
  sender: number;
  wishcard_id: number;
  created_at: Generated<Timestamp>;
}

export interface Orders {
  id: number;
  status: Generated<number>;
  delivery_date: Timestamp | null;
  tracking_info: string | null;
  donor_id: number;
  child_id: number;
  item_id: number;
  agency_id: number;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
}

export interface Users {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: number;
  login_mode: number;
  bio: string | null;
  verified: Generated<boolean>;
  image_id: number;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
}

export interface Verifications {
  id: number;
  email_verified: boolean;
  user_id: number;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
}

export interface VerificationTokens {
  id: number;
  token: string;
  type: number;
  expiration: Timestamp;
  user_id: number;
  created_at: Generated<Timestamp>;
}

export interface Wishcards {
  id: number;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  status: Generated<number>;
  created_by: number;
  agency_id: number;
  child_id: number;
  item_id: number;
  image_id: number;
  order_id: number;
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
