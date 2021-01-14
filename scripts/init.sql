CREATE TABLE IF NOT EXISTS address
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    address1  varchar(255) not null,
    address2  varchar(255) null,
    city      varchar(255) not null,
    country   varchar(255) not null,
    state     varchar(255) not null,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp ON UPDATE CURRENT_TIMESTAMP,
    deletedAt timestamp DEFAULT 0
);

CREATE TABLE IF NOT EXISTS child
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    birthday  date         not null,
    firstName varchar(255) not null,
    lastName  varchar(255) null,
    interest  varchar(255) not null,
    bio       varchar(255) null,
    addressId int          not null,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp ON UPDATE CURRENT_TIMESTAMP,
    deletedAt timestamp DEFAULT 0,
    FOREIGN KEY (addressId) REFERENCES address (id)
);

CREATE TABLE IF NOT EXISTS user
(
    id                        int PRIMARY KEY AUTO_INCREMENT,
    firstName                 varchar(255)                       not null,
    lastName                  varchar(255)                       not null,
    email                     varchar(255)                       not null,
    emailVerified             boolean                            not null,
    role                      enum ('donor', 'partner', 'admin') not null,
    password                  varchar(255)                       not null,
    passwordResetToken        varchar(255)                       null,
    passwordResetTokenExpires datetime                           null,
    agencyId                  int                                null,
    createdAt                 timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt                 timestamp ON UPDATE CURRENT_TIMESTAMP,
    deletedAt                 timestamp DEFAULT 0
);

CREATE TABLE IF NOT EXISTS agency
(
    id         int PRIMARY KEY AUTO_INCREMENT,
    name       varchar(255) not null,
    bio        varchar(255) null,
    isVerified boolean      not null,
    phone      varchar(255) not null,
    website    varchar(255) null,
    userId     int          not null,
    addressId  int          not null,
    createdAt  timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt  timestamp ON UPDATE CURRENT_TIMESTAMP,
    deletedAt  timestamp DEFAULT 0,
    UNIQUE (userId),
    UNIQUE (addressId)
);

CREATE TABLE IF NOT EXISTS wishcard
(
    id            int PRIMARY KEY AUTO_INCREMENT,
    image         varchar(255)                         not null,
    itemPrice     float                                not null,
    itemUrl       varchar(255)                         not null,
    childId       int                                  not null,
    agencyId      int                                  not null,
    createdBy     int                                  not null,
    isLockedBy    int                                  null,
    isLockedUntil datetime                             null,
    status        enum ('draft','published','donated') not null,
    occasion      varchar(255)                         null,
    createdAt     timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt     timestamp ON UPDATE CURRENT_TIMESTAMP,
    deletedAt     timestamp DEFAULT 0,
    FOREIGN KEY (agencyId) REFERENCES agency (id),
    FOREIGN KEY (createdBy) REFERENCES user (id),
    FOREIGN KEY (childId) REFERENCES child (id),
    # 1 to 1 relation for child
    UNIQUE (childId)
);

CREATE TABLE IF NOT EXISTS message
(
    id         int PRIMARY KEY AUTO_INCREMENT,
    userId     int          not null,
    wishcardId int          not null,
    message    varchar(255) not null,
    createdAt  timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt  timestamp ON UPDATE CURRENT_TIMESTAMP,
    deletedAt  timestamp DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES user (id),
    FOREIGN KEY (wishcardId) REFERENCES wishcard (id)
);

CREATE TABLE IF NOT EXISTS donation
(
    id            int PRIMARY KEY AUTO_INCREMENT,
    wishcardId    int                                        not null,
    userId        int                                        not null,
    donationPrice float                                      not null,
    status        enum ('confirmed', 'ordered', 'delivered') not null,
    createdAt     timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt     timestamp ON UPDATE CURRENT_TIMESTAMP,
    deletedAt     timestamp DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES user (id),
    FOREIGN KEY (wishcardId) REFERENCES wishcard (id)
);

ALTER TABLE user
    ADD FOREIGN KEY (agencyId) REFERENCES agency (id);

ALTER TABLE agency
    ADD FOREIGN KEY (userId) REFERENCES user (id),
    ADD FOREIGN KEY (addressId) REFERENCES address (id);