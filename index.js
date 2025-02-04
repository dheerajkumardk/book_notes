import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

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
    console.log("result: ", books);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
