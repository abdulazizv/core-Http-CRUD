const basicErrorHandler = require("../helpers/basicErrorHandler");
const createNewObjectBook = require("../helpers/createnewObjectbook");
const getBodyData = require("../helpers/getBodyData");
const notFoundfunc = require("../helpers/notFound.error");
const bookModel = require("../models/bookmodel");
const pool  = require("../database/connect");

async function getAllBook(req, res) {
  try {
    const results = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM region', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });  
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    const resp = {
      status: "OK",
      bookModel,
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    console.log(error)
    basicErrorHandler(res);
  }
}

async function createBook(req, res) {
  try {
    const data = await getBodyData(req);
    const { title, pages, author } = JSON.parse(data);
    const newBook = createNewObjectBook(title, pages, author);
    bookModel.push(newBook);
    res.writeHead(201, {
      "Content-type": "application/json charset utf-8",
    });
    const resp = {
      status: "Created",
      book: newBook,
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    console.log(error);
    basicErrorHandler(res);
  }
}

async function getBookById(req, res) {
  try {
    const id = req.url.split("/")[2];
    const book = bookModel.find((b) => b.id === id);
    if (!book) {
      notFoundfunc(res);
    }
    res.writeHead(200, {
      "Content-type": "application/json charset utf-8",
    });
    const resp = {
      status: 200,
      book: book,
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    basicErrorHandler(res);
  }
}

async function updateBook(req, res) {
  try {
    const id = req.url.split("/")[2];
    const body = await getBodyData(req);
    const { title, pages, author } = JSON.parse(body);
    const bookIndex = bookModel.findIndex((b) => (b.id = id));
    if (bookIndex == -1) {
      notFoundfunc(res);
    }
    res.writeHead(200, {
      "Content-type": "application/json charset utf-8",
    });
    const updatedBook = createNewObjectBook(title, pages, author);
    bookModel[bookIndex] = updatedBook;
    const resp = {
      status: 200,
      message: "Successfully updated",
      updatedBook: bookModel[bookIndex],
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    basicErrorHandler(res);
  }
}

async function deleteBook(req, res) {
  try {
    const id = req.url.split("/")[2];
    const book = bookModel.findIndex((b) => b.id == id);
    if (book == -1) {
      notFoundfunc(res)
    }
    bookModel.splice(book, 1);
    res.writeHead(200, {
      "Content-type": "application/json charset utf-8",
    });
    const resp = {
      status: 200,
      message: "Successfully deleted",
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    basicErrorHandler(res)
  }
}
module.exports = {
  getAllBook,
  createBook,
  getBookById,
  updateBook,
  deleteBook
};
