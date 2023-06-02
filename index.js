const http = require("http");
const getBodyData = require("./helpers/getBodyData");
const { v4 } = require("uuid");
const { getAllBook, createBook, getBookById, updateBook, deleteBook } = require("./services/books.service");
const basicErrorHandler = require("./helpers/basicErrorHandler");
const {getAllOrder} = require("./services/order.service")
const server = http.createServer(async (req, res) => {
  if (req.url === "/books" && req.method === "GET") {
    getAllBook(req,res);
  } else if (req.url === "/books" && req.method === "POST") {
      createBook(req,res)
  } else if (req.url.match(/\/books\/\w+/) && req.method === "GET") {
      getBookById(req,res)
  } else if (req.url.match(/\/books\/\w+/) && req.method === "DELETE") {
      deleteBook(req,res)
  } else if (req.url.match(/\/books\/\w+/) && req.method === "PUT") {
      updateBook(req,res)
  } else if(req.url === "/order" && req.method === "GET") {
    getAllOrder(req,res)
  }
  else {
    res.writeHead(404, {
      "Content-type": "application/json charset utf-8",
    });
    const resp = {
      status: 404,
      message: "Endpoint or method not found",
    };
    res.end(JSON.stringify(resp));
  }
});

server.listen(3000, () => {
  console.log("Server is running at 3000");
});
