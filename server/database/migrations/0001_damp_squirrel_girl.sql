PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_membershipToList` (
	`memberId` text NOT NULL,
	`list` text,
	`position` integer NOT NULL,
	`exclusions` text,
	PRIMARY KEY(`memberId`, `list`),
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`list`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_membershipToList`("memberId", "list", "position", "exclusions") SELECT "memberId", "list", "position", "exclusions" FROM `membershipToList`;--> statement-breakpoint
DROP TABLE `membershipToList`;--> statement-breakpoint
ALTER TABLE `__new_membershipToList` RENAME TO `membershipToList`;--> statement-breakpoint
PRAGMA foreign_keys=ON;