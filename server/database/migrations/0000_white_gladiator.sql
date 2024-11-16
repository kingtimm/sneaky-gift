CREATE TABLE `lists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`owner` text NOT NULL,
	`currentScenario` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lists_id_unique` ON `lists` (`id`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` integer NOT NULL,
	`clerkId` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_id_unique` ON `members` (`id`);--> statement-breakpoint
CREATE TABLE `membershipToList` (
	`memberId` text,
	`list` text,
	`position` integer NOT NULL,
	`exclusions` text,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`list`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `membershipToList_position_unique` ON `membershipToList` (`position`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`created_at` integer NOT NULL
);
