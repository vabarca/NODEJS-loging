/*
 * numismatist.sql	Beginner's database
 */

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

Create Table users(
	user TEXT,
	pass TEXT,
	name TEXT,
	rol TEXT
);

Insert into users values(
	'pe',
	'power',
	'PowerElectronics user',
	'Staff'
);

COMMIT;
