-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address1` VARCHAR(255) NOT NULL,
    `address2` VARCHAR(255),
    `city` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `deletedAt` DATETIME(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agency` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `bio` VARCHAR(255),
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `phone` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255),
    `addressId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `deletedAt` DATETIME(0),

    UNIQUE INDEX `agency.addressId_unique`(`addressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agency_members` (
    `agencyId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `role` ENUM('admin', 'member') NOT NULL,

    INDEX `userId`(`userId`),
    PRIMARY KEY (`agencyId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `child` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `birthday` DATE NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255),
    `interest` VARCHAR(255) NOT NULL,
    `bio` VARCHAR(255),
    `addressId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `deletedAt` DATETIME(0),

    INDEX `addressId`(`addressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wishcardId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `amount` FLOAT NOT NULL,
    `status` ENUM('confirmed', 'ordered', 'delivered') NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `deletedAt` DATETIME(0),

    INDEX `userId`(`userId`),
    INDEX `wishcardId`(`wishcardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `wishcardId` INTEGER NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `deletedAt` DATETIME(0),

    INDEX `userId`(`userId`),
    INDEX `wishcardId`(`wishcardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `profileImage` VARCHAR(255),
    `email` VARCHAR(255) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `emailVerificationHash` VARCHAR(255),
    `role` ENUM('donor', 'partner', 'admin', 'developer') NOT NULL,
    `loginMode` ENUM('Facebook', 'Google', 'Default') NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `passwordResetToken` VARCHAR(255),
    `passwordResetTokenExpires` DATETIME(0),
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `deletedAt` DATETIME(0),

    UNIQUE INDEX `user.email_unique`(`email`),
    UNIQUE INDEX `user.emailVerificationHash_unique`(`emailVerificationHash`),
    UNIQUE INDEX `user.passwordResetToken_unique`(`passwordResetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wish_card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `itemPrice` FLOAT NOT NULL,
    `itemUrl` VARCHAR(255) NOT NULL,
    `childId` INTEGER NOT NULL,
    `agencyId` INTEGER NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `isLockedBy` INTEGER,
    `isLockedUntil` DATETIME(0),
    `status` ENUM('draft', 'published', 'donated') NOT NULL,
    `occasion` VARCHAR(255),
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `deletedAt` DATETIME(0),

    INDEX `agencyId`(`agencyId`),
    INDEX `childId`(`childId`),
    INDEX `createdBy`(`createdBy`),
    INDEX `isLockedBy`(`isLockedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agency` ADD FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agency_members` ADD FOREIGN KEY (`agencyId`) REFERENCES `agency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agency_members` ADD FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `child` ADD FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation` ADD FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation` ADD FOREIGN KEY (`wishcardId`) REFERENCES `wish_card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD FOREIGN KEY (`wishcardId`) REFERENCES `wish_card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wish_card` ADD FOREIGN KEY (`agencyId`) REFERENCES `agency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wish_card` ADD FOREIGN KEY (`childId`) REFERENCES `child`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wish_card` ADD FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wish_card` ADD FOREIGN KEY (`isLockedBy`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
