import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import { render } from "ejs";

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

let books = [];

// GET /books -> list of all books read sorted by title, date_read, rating
app.get(["/", "/books"], async (req, res) => {
    const sort = req.query.sort;
    let query = "SELECT * FROM books";  
    console.log("sort: ", sort);
    
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
    res.send("<h2> Let's add a new book to the database </h2>");
});

// POST   /books          -> add a new book to the database

// GET /books/:id -> information about the book by id
app.get("/books/:id", async (req, res) => {
    const id = req.params.id;
    let book;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        book = result.rows;
    } catch (err) {
        console.log(err);
    }
    console.log("book: ", book);
});

// GET    /books/:id/edit -> render a form to edit informations for the book
// PUT    /books/:id      -> update information about the book
// DELETE /books/:id      -> delete the entry from the database

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
