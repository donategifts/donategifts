SET check_function_bodies = false ;

CREATE TABLE agencies(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" varchar(255) NOT NULL,
    website varchar(255) NOT NULL,
    phone varchar(100) NOT NULL,
    bio varchar(500),
    address_line_1 varchar(255) NOT NULL,
    address_line_2 varchar(255),
    city varchar(100) NOT NULL,
    state varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    zip_code varchar(50) NOT NULL,
    verified boolean NOT NULL DEFAULT false,
    employer_identification_number varchar(255),
    account_manager_id uuid NOT NULL,
    image_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    CONSTRAINT agencies_pkey PRIMARY KEY(id),
    UNIQUE(employer_identification_number)
);

CREATE TABLE children(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    birth_year integer NOT NULL,
    interest varchar(255) NOT NULL,
    story varchar(255) NOT NULL,
    image_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT children_pkey PRIMARY KEY(id)
);

CREATE TABLE community_posts(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    message varchar(255) NOT NULL,
    agency_id uuid NOT NULL,
    image_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT community_posts_pkey PRIMARY KEY(id)
);

CREATE TABLE images(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    url varchar(255) NOT NULL,
    meta_data json,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT images_pkey PRIMARY KEY(id)
);

CREATE TABLE items(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" varchar(255) NOT NULL,
    price numeric(10, 2) NOT NULL,
    link varchar(2000) NOT NULL,
    retailer varchar(255) NOT NULL,
    retailer_product_id varchar(255) NOT NULL,
    meta_data json,
    image_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT items_pkey PRIMARY KEY(id)
);

CREATE TABLE messages(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "content" varchar(500) NOT NULL,
    sender_id uuid NOT NULL,
    wishcard_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT messages_pkey PRIMARY KEY(id)
);

CREATE TABLE orders(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    status integer NOT NULL DEFAULT 0,
    delivery_date timestamp,
    tracking_info varchar(500),
    donor_id uuid NOT NULL,
    child_id uuid NOT NULL,
    item_id uuid NOT NULL,
    agency_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    CONSTRAINT orders_pkey PRIMARY KEY(id)
);

CREATE TABLE users(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    "password" varchar(100) NOT NULL,
    "role" integer NOT NULL,
    login_mode integer NOT NULL,
    bio varchar(500),
    is_verified boolean NOT NULL DEFAULT false,
    image_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    deleted_at timestamp,
    CONSTRAINT users_pkey PRIMARY KEY(id)
);

CREATE TABLE verification_tokens(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    token varchar(255) NOT NULL,
    "type" integer NOT NULL,
    expiration timestamp NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT verification_tokens_pkey PRIMARY KEY(id)
);

CREATE TABLE verifications(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email_verified boolean NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    CONSTRAINT verifications_pkey PRIMARY KEY(id)
);

CREATE TABLE wishcards(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    address_line_1 varchar(255) NOT NULL,
    address_line_2 varchar(255),
    city varchar(100) NOT NULL,
    state varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    zip_code varchar(50) NOT NULL,
    status integer NOT NULL DEFAULT 0,
    created_by uuid NOT NULL,
    agency_id uuid NOT NULL,
    child_id uuid NOT NULL,
    item_id uuid NOT NULL,
    image_id uuid NOT NULL,
    order_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    CONSTRAINT wishcards_pkey PRIMARY KEY(id)
);

ALTER TABLE verifications
ADD
    CONSTRAINT verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT;

ALTER TABLE
    verification_tokens
ADD
    CONSTRAINT verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT;

ALTER TABLE agencies
ADD
    CONSTRAINT agencies_account_manager_id_fkey FOREIGN KEY (account_manager_id) REFERENCES users (id);

ALTER TABLE messages
ADD
    CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users (id);

ALTER TABLE community_posts
ADD
    CONSTRAINT community_posts_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE RESTRICT;

ALTER TABLE wishcards
ADD
    CONSTRAINT wishcards_child_id_fkey FOREIGN KEY (child_id) REFERENCES children (id);

ALTER TABLE wishcards
ADD
    CONSTRAINT wishcards_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE RESTRICT;

ALTER TABLE wishcards
ADD
    CONSTRAINT wishcards_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (id);

ALTER TABLE wishcards
ADD
    CONSTRAINT wishcards_item_id_fkey FOREIGN KEY (item_id) REFERENCES items (id);

ALTER TABLE messages
ADD
    CONSTRAINT messages_wishcard_id_fkey FOREIGN KEY (wishcard_id) REFERENCES wishcards (id);

ALTER TABLE wishcards
ADD
    CONSTRAINT wishcards_image_id_fkey FOREIGN KEY (image_id) REFERENCES images (id);

ALTER TABLE children
ADD
    CONSTRAINT children_image_id_fkey FOREIGN KEY (image_id) REFERENCES images (id);

ALTER TABLE items
ADD
    CONSTRAINT items_image_id_fkey FOREIGN KEY (image_id) REFERENCES images (id);

ALTER TABLE agencies
ADD
    CONSTRAINT agencies_image_id_fkey FOREIGN KEY (image_id) REFERENCES images (id);

ALTER TABLE community_posts
ADD
    CONSTRAINT community_posts_image_id_fkey FOREIGN KEY (image_id) REFERENCES images (id);

ALTER TABLE users
ADD
    CONSTRAINT users_image_id_fkey FOREIGN KEY (image_id) REFERENCES images (id);

ALTER TABLE orders
ADD
    CONSTRAINT orders_donor_id_fkey FOREIGN KEY (donor_id) REFERENCES users (id);

ALTER TABLE orders
ADD
    CONSTRAINT orders_child_id_fkey FOREIGN KEY (child_id) REFERENCES children (id);

ALTER TABLE orders
ADD
    CONSTRAINT orders_item_id_fkey FOREIGN KEY (item_id) REFERENCES items (id);

ALTER TABLE orders
ADD
    CONSTRAINT orders_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES agencies (id);

ALTER TABLE wishcards
ADD
    CONSTRAINT wishcards_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id);

CREATE OR REPLACE FUNCTION TRIGGER_SET_UPDATED_DATE()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;


CREATE TRIGGER SET_UPDATED_AT
    before update
    on verifications
    for each row
	execute procedure TRIGGER_SET_UPDATED_DATE();


CREATE TRIGGER SET_UPDATED_AT
    before update
    on agencies
    for each row
	execute procedure TRIGGER_SET_UPDATED_DATE();


CREATE TRIGGER SET_UPDATED_AT
    before update
    on messages
    for each row
	execute procedure TRIGGER_SET_UPDATED_DATE();


CREATE TRIGGER SET_UPDATED_AT
    before update
    on orders
    for each row
	execute procedure TRIGGER_SET_UPDATED_DATE();


CREATE TRIGGER SET_UPDATED_AT
    before update
    on users
    for each row
	execute procedure TRIGGER_SET_UPDATED_DATE();


CREATE TRIGGER SET_UPDATED_AT
    before update
    on wishcards
    for each row
	execute procedure TRIGGER_SET_UPDATED_DATE();
