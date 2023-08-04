const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

let bookarray = Object.values(books);

public_users.post('/register', (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: 'User created successfully!' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const result = books[isbn];
  return res.status(200).send(JSON.stringify(result));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksbyauthor = [];
  for (let key in books) {
    const item = books[key];
    if (item.author === author) {
      booksbyauthor.push(item);
    }
  }
  return res.status(200).send(JSON.stringify({ booksbyauthor: booksbyauthor }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksbytitle = [];
  for (let key in books) {
    const item = books[key];
    if (item.title === title) {
      booksbytitle.push(item);
    }
  }
  return res.status(200).send(JSON.stringify({ booksbytitle: booksbytitle }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const reviews = book['reviews'];
  return res.status(200).send(JSON.stringify(reviews));
});

const connectToURL = (url) => {
  const req = axios.get(url);
  console.log(req);
  req
    .then((resp) => {
      let listOfWork = resp.data.work;
      listOfWork.forEach((work) => {
        console.log(work.titleAuth);
      });
    })
    .catch((err) => {
      console.log(err.toString());
    });
};
console.log('Before connect URL');
connectToURL('/isbn/:isbn');
console.log('After connect URL');

module.exports.general = public_users;
