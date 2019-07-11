CREATE TABLE book (
	id SERIAL PRIMARY KEY,
	name varchar NOT NULL,
	author varchar NOT NULL,
	ISBN INT UNIQUE NOT NULL
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	access_token varchar,
	username varchar UNIQUE NOT NULL,
	password varchar NOT NULL
);

CREATE TABLE copies(
	id SERIAL PRIMARY KEY,
	book_id INT REFERENCES book(book_id) NOT NULL,
	user_id INT REFERENCES users(id)
);

CREATE TABLE transactions (
	id SERIAL PRIMARY KEY,
	copy_id INT REFERENCES copies(id) NOT NULL,
	user_id INT REFERENCES users(id) NOT NULL,
	date_borrowed TIMESTAMP NOT NULL,
	date_returned TIMESTAMP,
	due_date TIMESTAMP NOT NULL
);