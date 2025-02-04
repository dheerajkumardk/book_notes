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

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books");
        books = result.rows;
    } catch (err) {
        console.log(err);
    }
    console.log("result: ", books);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
