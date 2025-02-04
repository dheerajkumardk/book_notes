## Project - Book Notes

### Features:
- Shows the list of books read by the user
- Includes book cover, title, author, date read on, reader rating, and summary notes

### API Integration:
- Using Open Library covers API for fetching book covers

### Front-end:
- Display book details and covers
- Sort the books by ratings, date or title
- Providing forms for adding, editing, deleting book entries

3 pages required ->
HomePage -> displays all the books
ReadPage -> displays contents of selected book


### Routes:

- get the list of books read
- add a book to the list of books
- update content w.r.t. the book read, update previous reviews
- delete entries from the list
- be able to sort the book entries by ratings or recency


### Database:

TABLE books_read
id SERIAL PRIMARY KEY
isbn INTEGER NOT NULL
title VARCHAR(100) NOT NULL
author VARCHAR (50) NOT NULL
read_date DATE
rating INTEGER CHECK (rating > 0 AND rating <= 10) ->  (should be b/t 0-10)
notes TEXT

-> Create Table
```sql
CREATE TABLE books (
	id SERIAL NOT NULL,
	isbn VARCHAR(13) UNIQUE NOT NULL,
	title VARCHAR(150) NOT NULL,
	author VARCHAR(150) NOT NULL,
	date_read DATE,
	rating INTEGER CHECK (rating > 0 AND rating <= 10),
	notes TEXT
);
```
-> Adding an entry
```sql
INSERT INTO books (isbn, title, author, date_read, rating, notes)
VALUES (9780385533225, 'The Particular Sadness of Lemon Cake', 'Aimee Bender', '2025-02-04', 3, 'This book is written by the author of the Girl in the flammable skirt!');
```

### How to get the book cover?

`https://covers.openlibrary.org/b/$key/$value-$size.jpg`

-> $key-isbn, $size-M

Ex: https://covers.openlibrary.org/b/isbn/9780385533225-M.jpg


### Defining Routes

- GET    /books          -> list of all books read
- GET    /books/new      -> render a form to add a new book
- POST   /books          -> add a new book to the database
- GET    /books/:id      -> information about the book by id
- GET    /books/:id/edit -> render a form to edit informations for the book
- PUT    /books/:id      -> update information about the book
- DELETE /books/:id      -> delete the entry from the database

