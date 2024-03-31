const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "Ashish",
        password: "singh",
    },
    {
        username: "babusahab",
        password: "br07",
    }
];

const isValid = (username) => {
    let usersWithSameName = users.filter(user => user.username === username);
    if (usersWithSameName.length > 0) 
        return false;
    return true;
};

const authenticatedUser = (username, password) => {
    let validUsers = users.filter(
        user => user.username === username && user.password === password
    );
    if (validUsers.length > 0) return true;
    return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 * 60 }
        );
        req.session.authorization = {
            accessToken,
            username,
        };
        // console.log(req.session.username)
        return res.status(200).send(`User successfully logged in, ${username}`);
    } else {
        return res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.session.authorization.username;
    console.log(username);
    const review = req.body.review;
    Object.keys(books).forEach((key) => {
        const book = books[key];
        if (book.isbn === isbn) {
            if (book.reviews[username]) {
                book.reviews[username] = review;
                return res
                    .status(200)
                    .json({ message: "Review modified successfully" });
            } else {
                book.reviews[username] = review;
                return res
                    .status(200)
                    .json({ message: "Review added successfully" });
            }
        }
    });
    return res.status(404).json({ message: "Book not found" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    Object.keys(books).forEach((key) => {
        const book = books[key];
        if (book.isbn === isbn) {
            if (book.reviews[username]) {
                delete book.reviews[username];
                return res
                    .status(200)
                    .json({ message: "Review deleted successfully" });
            }
        }
    });
    return res.status(404).json({ message: "Review not found for the user" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
