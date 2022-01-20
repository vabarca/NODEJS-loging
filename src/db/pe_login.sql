/*
 * numismatist.sql	Beginner's database
 */

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

Create Table users(
	user TEXT,
	pass TEXT
);

Insert into users values(
	'dummy user',
	'dummy pass'
);

COMMIT;
