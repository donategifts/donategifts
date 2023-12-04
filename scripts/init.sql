CREATE TYPE UserRole AS ENUM ('admin', 'donor', 'partner');
CREATE TYPE LoginMode AS ENUM ('email', 'facebook', 'google');
CREATE TYPE OrderStatus AS ENUM ('pending', 'ordered', 'cancelled');
CREATE TYPE WishcardStatus AS ENUM ('draft', 'published', 'donated');
CREATE TYPE VerificationType AS ENUM ('email', 'phone');

CREATE TABLE "agencies" (
    "id" uuid PRIMARY KEY NOT NULL    DEFAULT (gen_random_uuid()),
    "name" varchar(255) NOT NULL,
    "website" varchar(255) NOT NULL,
    "phone" varchar(100) NOT NULL,
    "bio" text,
    "address_line_1" varchar(255) NOT NULL,
    "address_line_2" varchar(255),
    "city" varchar(100) NOT NULL,
    "state" varchar(100) NOT NULL,
    "country_code" varchar(100) NOT NULL,
    "zip_code" varchar(50) NOT NULL,
    "is_verified" boolean NOT NULL    DEFAULT false,
    "employer_identification_number" varchar(100) UNIQUE,
    "account_manager_id" uuid NOT NULL,
    "image_id" uuid,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamptz
);

CREATE TABLE "children" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "name" varchar(255) NOT NULL,
    "birth_year" integer NOT NULL,
    "interest" text NOT NULL,
    "story" text NOT NULL,
    "image_id" uuid,
    "agency_id" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "community_posts" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "message" text NOT NULL,
    "agency_id" uuid NOT NULL,
    "image_id" uuid,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "images" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "url" varchar(255) NOT NULL,
    "meta_data" json,
    "is_art_image" BOOLEAN NOT NULL DEFAULT false,
    "created_by" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "items" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "name" varchar(255) NOT NULL,
    "price" numeric(10, 2) NOT NULL,
    "link" varchar(2000) NOT NULL,
    "retailer_name" varchar(255) NOT NULL,
    "retailer_product_id" varchar(255) NOT NULL,
    "meta_data" json,
    "image_id" uuid,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "messages" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "content" text NOT NULL,
    "sender_id" uuid NOT NULL,
    "wishcard_id" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "orders" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "status" OrderStatus NOT NULL DEFAULT ('pending'::OrderStatus),
    "delivery_date" timestamptz,
    "tracking_info" varchar(500),
    "donor_id" uuid NOT NULL,
    "wishcard_id" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamptz
);

CREATE TABLE "users" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "first_name" varchar(255) NOT NULL,
    "last_name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "role" UserRole NOT NULL,
    "login_mode" LoginMode NOT NULL,
    "bio" varchar(500),
    "is_verified" boolean NOT NULL DEFAULT false,
    "is_disabled" boolean NOT NULL DEFAULT false,
    "image_id" uuid,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamptz
);

CREATE TABLE "verification_tokens" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "token" varchar(255) NOT NULL,
    "type" VerificationType NOT NULL,
    "user_id" uuid NOT NULL,
    "expires_at" timestamptz NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "wishcards" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
    "address_line_1" varchar(255) NOT NULL,
    "address_line_2" varchar(255),
    "city" varchar(100) NOT NULL,
    "state" varchar(100) NOT NULL,
    "country_code" varchar(100) NOT NULL,
    "zip_code" varchar(50) NOT NULL,
    "status" WishcardStatus NOT NULL DEFAULT ('draft'::WishcardStatus),
    "child_id" uuid NOT NULL,
    "item_id" uuid NOT NULL,
    "image_id" uuid,
    "created_by" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamptz
);

-- express session table
CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
    WITH (OIDS = FALSE);

ALTER TABLE "agencies" ADD CONSTRAINT "agencies_account_manager_id_fkey" FOREIGN KEY ("account_manager_id") REFERENCES "users" ("id");
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id");

ALTER TABLE "children" ADD CONSTRAINT "children_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id");
ALTER TABLE "children" ADD CONSTRAINT "children_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id");

ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE RESTRICT;
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id");

ALTER TABLE "images" ADD CONSTRAINT "images_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "items" ADD CONSTRAINT "items_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id");

ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users" ("id");
ALTER TABLE "messages" ADD CONSTRAINT "messages_wishcard_id_fkey" FOREIGN KEY ("wishcard_id") REFERENCES "wishcards" ("id");

ALTER TABLE "orders" ADD CONSTRAINT "orders_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD CONSTRAINT "orders_wishcard_id_fkey" FOREIGN KEY ("wishcard_id") REFERENCES "wishcards" ("id");

ALTER TABLE "users" ADD CONSTRAINT "users_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id");

ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT;

ALTER TABLE "wishcards" ADD CONSTRAINT "wishcards_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children" ("id");
ALTER TABLE "wishcards" ADD CONSTRAINT "wishcards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "wishcards" ADD CONSTRAINT "wishcards_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id");
ALTER TABLE "wishcards" ADD CONSTRAINT "wishcards_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id");

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

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

CREATE OR REPLACE FUNCTION UPDATE_WISHCARD_STATUS()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$
BEGIN
CASE
        WHEN (NEW.status = 'ordered'::OrderStatus) THEN
UPDATE wishcards SET status = 'donated'::WishcardStatus WHERE id = NEW.wishcard_id;
WHEN (NEW.status = 'cancelled'::OrderStatus) THEN
UPDATE wishcards SET status = 'published'::WishcardStatus WHERE id = NEW.wishcard_id;
END CASE;
RETURN NEW;
END;
$function$
;

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

CREATE TRIGGER UPDATE_WISHCARD_STATUS_ON_ORDER_CHANGE
    after update
    on orders
    for each row
    execute procedure UPDATE_WISHCARD_STATUS();