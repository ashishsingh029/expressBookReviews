const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username
    const password = req.body.password
    if(username && password) {
        if(isValid(username)) {
            users.push({username : username, password : password})
            return res.status(200).json({ message: "Username already exists." }).json({
                    message: "User successfully registred. Now you can login",
                })
        } else {
            return res.status(400).json({ message: "Username already exists." })
        }
    } else {

    }
    return res.status(404).json({ message: "Username or password not provided." })
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//     //Write your code here
//     return res.status(200).json(books);
// });
public_users.get("/", async function (req, res) {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject(new Error("Books not found"));
        }
    })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error: error.message }));
});


// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//     //Write your code here
//     const { isbn } = req.params;
//     const filteredBooks = Object.values(books).filter(
//         (book) => book.isbn === isbn
//     );
//     return res.status(200).json(filteredBooks);
// });
public_users.get("/isbn/:isbn",async function (req, res) {
    const isbn = req.params.isbn
    return new Promise((resolve, reject) => {
        if (books) {
            const filteredBooks = Object.values(books).filter(book => book.isbn === isbn)
            resolve(filteredBooks);
        } else {
            reject(new Error("Books not found"));
        }
    })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error: error.message }));
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//     //Write your code here
//     const { author } = req.params;
//     const filteredBooks = Object.values(books).filter(
//         (book) => book.author === author
//     );
//     return res.status(200).json(filteredBooks);
// });
public_users.get("/author/:author",async function (req, res) {
    const author = req.params.author
    return new Promise((resolve, reject) => {
        if (books) {
            const filteredBooks = Object.values(books).filter(book => book.author === author)
            resolve(filteredBooks);
        } else {
            reject(new Error("Books not found"));
        }
    })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error: error.message }));
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//     //Write your code here
//     const { title } = req.params;
//     const filteredBooks = Object.values(books).filter(
//         (book) => book.title === title
//     );
//     return res.status(200).json(filteredBooks);
// });
public_users.get("/title/:title",async function (req, res) {
    const title = req.params.title
    return new Promise((resolve, reject) => {
        if (books) {
            const filteredBooks = Object.values(books).filter(book => book.title === title)
            resolve(filteredBooks);
        } else {
            reject(new Error("Books not found"));
        }
    })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error: error.message }));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    //Write your code here
    const { isbn } = req.params;
    const filteredBook = Object.values(books).filter(
        (book) => book.isbn === isbn
    );
    return res.status(200).json(filteredBook.map((book) => book.reviews));
});

module.exports.general = public_users;
