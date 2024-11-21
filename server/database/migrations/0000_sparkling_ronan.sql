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
	`memberId` text NOT NULL,
	`list` text,
	`position` integer NOT NULL,
	`exclusions` text,
	PRIMARY KEY(`memberId`, `list`),
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`list`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE no action
);
