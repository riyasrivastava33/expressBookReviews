const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ error: 'Username and password are required.' });
  }

  if (users.find(user => user.username === username)) {
    return res.json({ error: 'Username already exists.' });
  }

  const newUser = {
    username,
    password
  };

  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully.' });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books));
// });
let promise1=new Promise(function(resolve,reject){
  public_users.get("/",(req,res)=>{
  resolve({req,res});
  
  })
  
  
  })
  promise1.then(({req,res})=>{
    res.send(JSON.stringify(books));
  })

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn=req.params.isbn;
//   function getBookByISBN(isbn) {
//     const book = books[isbn];
//     if (book) {
//       return book;
//     }
//     return null; // Book not found
//   }  
        
//   const book = getBookByISBN(isbn);
// if (book) {
// res.json(book);
// } else {
// console.log("Book not found.");
// }  
//  });

let promise2=new Promise(function(resolve,reject){
  public_users.get('isbn/:isbn',(req,res)=>{
  const isbn=req.params.isbn;
  function getBookByISBN(isbn) {
    const book = books[isbn];
    if (book) {
      return book;
    }
    return null; // Book not found
  } 

  const book=books[isbn];
  if(book){
    resolve({req,res,book});
  }
  else{
    reject({req,res});
  }
  })
  
  
  })
    promise2.then(({req,res,book})=>{
      res.json(book);
    }).catch(({req,res})=>res.json({error:"No book found"}));
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const foundBooks = [];

//   for (const ke in books) {
//     if (books.hasOwnProperty(ke)) {
//       const book = books[ke];
//       if (book.author === author) {
//         foundBooks.push(book);
//       }
//     }
//   }

//   if (foundBooks.length > 0) {
//     res.json(foundBooks);
//   } else {
//     res.json({ error: 'No books found for the author.' });
// }

// });
let promise3=new Promise(function(resolve,reject){
public_users.get('author/:author',(req,res)=>{
const author=req.params.author;
const foundBooks=[];

for (const ke in books) {
    if (books.hasOwnProperty(ke)) {
      const book = books[ke];
      if (book.author === author) {
        foundBooks.push(book);
      }
    }

}
if(foundBooks.length>0){
  resolve({req,res,foundBooks});
}else{
  reject({req,res});
}
});
})
promise3.then(({req,res,foundBooks})=>res.json(foundBooks)).catch(({req,res})=>res.json({error:"No books found for the author"}));

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const foundBooks = [];

//   for (const ke in books) {
//     if (books.hasOwnProperty(ke)) {
//       const book = books[ke];
//       if (book.title === title) {
//         foundBooks.push(book);
//       }
//     }
//   }

//   if (foundBooks.length > 0) {
//     res.json(foundBooks);
//   } else {
//     res.json({ error: 'No books found for the title.' });
//   }
// });
let promise4=new Promise(function(resolve,reject){
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const foundBooks = [];

  for (const ke in books) {
    if (books.hasOwnProperty(ke)) {
      const book = books[ke];
      if (book.title === title) {
        foundBooks.push(book);
      }
    }
  }
  if(foundBooks.length>0){
    resolve({req,res,foundBooks});
  }else{
    reject({req,res});
  }


});
})
promise4.then(({req,res,foundBooks})=>res.json(foundBooks)).catch(({req,res})=>res.json({error:"No books found for the title"}));

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const reviews = book.reviews;
    res.json(reviews);
  } else {
    res.json({ error: 'Book not found.' });
  }
});