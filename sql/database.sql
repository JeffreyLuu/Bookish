CREATE TABLE book (
	id SERIAL PRIMARY KEY,
	name varchar NOT NULL,
	author varchar NOT NULL,
	ISBN INT NOT NULL
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	access_token varchar NOT NULL,
	name_of_user varchar NOT NULL
);

CREATE TABLE copies(
	id SERIAL PRIMARY KEY,
	book_id INT REFERENCES book(id),
	user_id INT REFERENCES users(id)
);

CREATE TABLE transactions (
	id SERIAL PRIMARY KEY,
	copy_id INT REFERENCES copies(id),
	user_id INT REFERENCES users(id),
	date_borrowed TIMESTAMP NOT NULL,
	date_returned TIMESTAMP NOT NULL,
	due_date TIMESTAMP NOT NULL
);