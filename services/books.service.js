const basicErrorHandler = require("../helpers/basicErrorHandler");
const createNewObjectBook = require("../helpers/createnewObjectbook");
const getBodyData = require("../helpers/getBodyData");
const notFoundfunc = require("../helpers/notFound.error");
const validationError = require("../helpers/validationError")
const pool = require("../config/database/connect")

async function getAllBook(req, res) {
  try {
    const results = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM book',(error,results) => {
        if(error) {
          reject(error);
        } else {
          resolve(results)
        }
      })
    });

    if(results.length < 1) {
      notFoundfunc(res,'No content! Books table is empty')
    }

    res.writeHead(200, {
      "Content-type": "application/json",
    });
    const resp = {
      status: "OK",
      results,
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
    const { bookname } = JSON.parse(data);

    if(!bookname || typeof bookname !== "string") {
      return validationError(res)
    }
    const query = 'INSERT INTO book(bookname) VALUES(?)';
    const nBook = await new Promise((resolve, reject) => {
      pool.query(query,bookname, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    console.log(nBook);
    res.writeHead(201, {
      "Content-type": "application/json charset utf-8",
    });
    const resp = {
      status: "Created",
      book: nBook,
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
    const query = "SELECT * FROM book WHERE id=?";
    const oneBook = await new Promise((resolve,reject) => {
        pool.query(query,id,(error,result) => {
          if(error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
    });

    if(oneBook.length < 1) {
      notFoundfunc(res,'No book found with this id')
    }

    res.writeHead(200, {
      "Content-type": "application/json charset utf-8",
    });
    const resp = {
      status: 200,
      book: oneBook,
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    basicErrorHandler(res);
  }
}

async function updateBook(req, res) {
  try {
    const id = req.url.split("/")[2];
    const check = await checkNotFound(id);

    if(check.length < 1) {
      notFoundfunc(res,'With id Book not found')
    }

    const body = await getBodyData(req);
    const { bookname } = JSON.parse(body);
    const query = "UPDATE book SET bookname=? WHERE id=?";
    const values = [bookname,id]
    const updatedBook = await new Promise((resolve,reject) => {
      pool.query(query,values,(error,result) => {
        if(error){
          reject(error)
        } else {
          resolve(result)
        }
      })
    });


    res.writeHead(200, {
      "Content-type": "application/json charset utf-8",
    });
    const resp = {
      status: 200,
      message: "Successfully updated",
      updatedBook: updatedBook,
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    console.log(error)
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


async function checkNotFound(id) {
  try {
    const query = 'SELECT * FROM book WHERE id = ?';
    const result = await new Promise((resolve, reject) => {
      pool.query(query,id,(error,result) => {
        if(error){
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
    return result;
  } catch(e) {
    console.error(e)
  }

}

module.exports = {
  getAllBook,
  createBook,
  getBookById,
  updateBook,
  deleteBook
};
