SET check_function_bodies = false;

CREATE TABLE
    IF NOT EXISTS agencies(
        id integer NOT NULL,
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
        employer_identification_number varchar(255) NOT NULL,
        account_manager_id integer NOT NULL,
        image_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp,
        CONSTRAINT agencies_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS children(
        id integer NOT NULL,
        first_name varchar(255) NOT NULL,
        last_name varchar(255) NOT NULL,
        birth_year integer NOT NULL,
        interest varchar(255) NOT NULL,
        story varchar(255) NOT NULL,
        image_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT children_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS community_posts(
        id integer NOT NULL,
        message varchar(255) NOT NULL,
        agency_id integer NOT NULL,
        image_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT community_posts_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS images(
        id integer NOT NULL,
        url varchar(255) NOT NULL,
        meta_data json,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT images_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS items(
        id integer NOT NULL,
        "name" varchar(255) NOT NULL,
        price numeric(10, 2) NOT NULL,
        link varchar(2000) NOT NULL,
        retailer varchar(255) NOT NULL,
        product_id varchar(255) NOT NULL,
        image_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT items_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS messages(
        id integer NOT NULL,
        "content" varchar(500) NOT NULL,
        sender integer NOT NULL,
        wishcard_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT messages_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS orders(
        id integer NOT NULL,
        status integer NOT NULL DEFAULT 0,
        delivery_date timestamp,
        tracking_info varchar(500),
        donor_id integer NOT NULL,
        child_id integer NOT NULL,
        item_id integer NOT NULL,
        agency_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp,
        CONSTRAINT orders_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS users(
        id integer NOT NULL,
        first_name varchar(255) NOT NULL,
        last_name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        "password" varchar(100) NOT NULL,
        "role" integer NOT NULL,
        login_mode integer NOT NULL,
        bio varchar(500),
        verified boolean NOT NULL DEFAULT false,
        image_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp,
        deleted_at timestamp,
        CONSTRAINT users_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS verification_tokens(
        id integer NOT NULL,
        token varchar(255) NOT NULL,
        "type" integer NOT NULL,
        expiration timestamp NOT NULL,
        user_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT verification_tokens_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS verifications(
        id integer NOT NULL,
        email_verified boolean NOT NULL,
        user_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp,
        CONSTRAINT verifications_pkey PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS wishcards(
        id integer NOT NULL,
        address_line_1 varchar(255) NOT NULL,
        address_line_2 varchar(255),
        city varchar(100) NOT NULL,
        state varchar(100) NOT NULL,
        country varchar(100) NOT NULL,
        zip_code varchar(50) NOT NULL,
        status integer NOT NULL DEFAULT 0,
        created_by integer NOT NULL,
        agency_id integer NOT NULL,
        child_id integer NOT NULL,
        item_id integer NOT NULL,
        image_id integer NOT NULL,
        order_id integer NOT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp,
        CONSTRAINT wishcards_pkey PRIMARY KEY(id)
    );

-- constraints

ALTER TABLE verifications
ADD
    CONSTRAINT verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE Cascade;

ALTER TABLE
    verification_tokens
ADD
    CONSTRAINT verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE Cascade;

ALTER TABLE agencies
ADD
    CONSTRAINT agencies_account_manager_id_fkey FOREIGN KEY (account_manager_id) REFERENCES users (id);

ALTER TABLE messages
ADD
    CONSTRAINT messages_sender_fkey FOREIGN KEY (sender) REFERENCES users (id);

ALTER TABLE community_posts
ADD
    CONSTRAINT community_posts_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE Cascade;

ALTER TABLE wishcards
ADD
    CONSTRAINT wishcards_child_id_fkey FOREIGN KEY (child_id) REFERENCES children (id);

ALTER TABLE wishcards
ADD
    CONSTRAINT wishcards_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE Cascade;

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

-- functions
CREATE OR REPLACE FUNCTION public.TRIGGER_SET_UPDATED_DATE()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS $function$
	BEGIN
		NEW.updated_at = NOW();
		RETURN NEW;
	END;
$function$;

-- triggers

CREATE OR REPLACE TRIGGER SET_UPDATED_AT
    before update
    on public.verifications
    for each row
	execute procedure public.TRIGGER_SET_UPDATED_DATE();
    
CREATE OR REPLACE TRIGGER SET_UPDATED_AT
    before update
    on public.messages
    for each row
	execute procedure public.TRIGGER_SET_UPDATED_DATE();

CREATE OR REPLACE TRIGGER SET_UPDATED_AT
    before update
    on public.agencies
    for each row
	execute procedure public.TRIGGER_SET_UPDATED_DATE();

CREATE OR REPLACE TRIGGER SET_UPDATED_AT
    before update
    on public.users
    for each row
	execute procedure public.TRIGGER_SET_UPDATED_DATE();
    
CREATE OR REPLACE TRIGGER SET_UPDATED_AT
    before update
    on public.wishcards
    for each row
	execute procedure public.TRIGGER_SET_UPDATED_DATE();

CREATE OR REPLACE TRIGGER SET_UPDATED_AT
    before update
    on public.orders
    for each row
	execute procedure public.TRIGGER_SET_UPDATED_DATE();
