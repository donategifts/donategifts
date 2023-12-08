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

export type Loginmode = "email" | "facebook" | "google";

export type Numeric = ColumnType<string, string | number, string | number>;

export type Orderstatus = "cancelled" | "ordered" | "pending";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Userrole = "admin" | "donor" | "partner";

export type Verificationtype = "email" | "phone";

export type Wishcardstatus = "donated" | "draft" | "published";

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
  country_code: string;
  zip_code: string;
  is_verified: Generated<boolean>;
  employer_identification_number: string | null;
  account_manager_id: string;
  image_id: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
}

export interface Children {
  id: Generated<string>;
  name: string;
  birth_year: number;
  interest: string;
  story: string;
  image_id: string | null;
  agency_id: string;
  created_at: Generated<Timestamp>;
}

export interface CommunityPosts {
  id: Generated<string>;
  message: string;
  agency_id: string;
  image_id: string | null;
  created_at: Generated<Timestamp>;
}

export interface Images {
  id: Generated<string>;
  url: string;
  meta_data: Json | null;
  is_art_image: Generated<boolean>;
  created_by: string;
  created_at: Generated<Timestamp>;
}

export interface Items {
  id: Generated<string>;
  name: string;
  price: Numeric;
  link: string;
  retailer_name: string;
  retailer_product_id: string;
  meta_data: Json | null;
  image_id: string | null;
  created_at: Generated<Timestamp>;
}

export interface Messages {
  id: Generated<string>;
  content: string;
  sender_id: string;
  wishcard_id: string;
  created_at: Generated<Timestamp>;
}

export interface Orders {
  id: Generated<string>;
  status: Generated<Orderstatus>;
  delivery_date: Timestamp | null;
  tracking_info: string | null;
  donor_id: string;
  wishcard_id: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
}

export interface Session {
  sid: string;
  sess: Json;
  expire: Timestamp;
}

export interface Users {
  id: Generated<string>;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Userrole;
  login_mode: Loginmode;
  bio: string | null;
  is_verified: Generated<boolean>;
  is_disabled: Generated<boolean>;
  image_id: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
}

export interface VerificationTokens {
  id: Generated<string>;
  token: string;
  type: Verificationtype;
  user_id: string;
  expires_at: Timestamp;
  created_at: Generated<Timestamp>;
}

export interface Wishcards {
  id: Generated<string>;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  country_code: string;
  zip_code: string;
  status: Generated<Wishcardstatus>;
  child_id: string;
  item_id: string;
  image_id: string | null;
  created_by: string;
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
  session: Session;
  users: Users;
  verification_tokens: VerificationTokens;
  wishcards: Wishcards;
}
