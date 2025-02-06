import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import methodOverride from "method-override";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    password: '12345678',
    database: 'booknotes',
    port: 5432
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let books = [];

// GET /books -> list of all books read sorted by title, date_read, rating
app.get(["/", "/books"], async (req, res) => {
    const sort = req.query.sort;
    let query = "SELECT * FROM books";  
    
    // Sorting the books
    if (sort == 'title') {
        query += " ORDER by title ASC";
    } else if (sort == 'date') {
        query += " ORDER by date_read DESC";
    } else if (sort == 'rating') {
        query += " ORDER by rating DESC";
    }

    try {
        const result = await db.query(query);
        books = result.rows;
    } catch (err) {
        console.log(err);
    }
    // console.log("result: ", books);
    res.render("index.ejs", {
        books: books
    });
});

// GET    /books/new      -> render a form to add a new book
app.get("/books/new", (req, res) => {
    res.render("newbook.ejs");
});

// POST /books-> add a new book to the database
app.post("/books", async (req, res) => {
    const {title, author, isbn, date_read, rating, notes} = req.body;

    try {
        const result = await db.query("INSERT INTO books (title, author, isbn, date_read, rating, notes) VALUES ($1, $2, $3, $4, $5, $6)", [title, author, isbn, date_read, rating, notes]);
    } catch (err) {
        console.log(err);
    }
    res.redirect("/books");
});

// GET /books/:id -> information about the book by id
app.get("/books/:id", async (req, res) => {
    const id = req.params.id;
    let book;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        book = result.rows[0];
    } catch (err) {
        console.log(err);
    }
    console.log("book: ", book);
    res.render("book.ejs", {
        book: book
    });
});

// GET    /books/:id/edit -> render a form to edit informations for the book
app.get("/books/:id/edit", async (req, res) => {
    const id = req.params.id;
    let book;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        book = result.rows[0];
    } catch (err) {
        console.log(err);
    }
    res.render("edit.ejs", {
        book: book
    });
});

// PUT    /books/:id      -> update information about the book
app.put("/books/:id/edit", async (req, res) => {
    const id = req.params.id;
    const {date_read, rating, notes} = req.body;

    try {
        const result = await db.query("UPDATE books SET date_read = $1, rating = $2, notes = $3 WHERE id = $4", [date_read, rating, notes, id]);
        res.redirect("/books");
    } catch (err) {
        console.log(err);
    }
});

// DELETE /books/:id      -> delete the entry from the database
app.delete("/books/:id/delete", async (req, res) => {
    const id = req.params.id;
    
    try {
        const result = await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/books");
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
