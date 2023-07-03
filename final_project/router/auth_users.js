const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"abhishek","password":"123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login",(req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Find the user by username
  const user = users.find(user => user.username === username);
 
  // Check if user exists and password is correct
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }
  // User authentication successful, generate JWT token
  const token = jwt.sign({ username: user.username }, 'fingerprint_customer', { expiresIn: "1h" });
  req.session.authorization = {
    token
}

   res.json({token});
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
 
  const {isbn} =req.params;
  
  const review=req.body.review;
  const username = req.body.username;

  if (!isbn || !review) {
    return res.status(400).json({ success: false, message: 'ISBN and review are required' });
  }

  // Find the book in the database
  const book = books[isbn];
  console.log(books);
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  if (book.reviews[username]) {
    // If the user already posted a review, modify the existing review
    book.reviews[username] = review;
    res.json({ success: true, message: 'Review modified successfully' });
  } else {
    // If the user has not posted a review, add a new review
    book.reviews[username] = review;
    res.json({ success: true, message: 'Review added successfully' });
  }
});
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const { username } = req.user;
  
    // Find the book in the database
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
  
    // Check if the user has posted a review for the given ISBN
    if (book.reviews[username]) {
      // Delete the user's review
      delete book.reviews[username];
      return res.json({ success: true, message: 'Review deleted successfully' });
    } else {

        return res.status(404).json({ success: false, message: 'Review not found' });
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;