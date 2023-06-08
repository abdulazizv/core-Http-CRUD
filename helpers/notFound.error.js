function notFoundfunc(res,message = 'Not found') {
    res.writeHead(404,{
        "Content-type":"application/json"
    })
    const resp = {
        status: 404,
        message: `${message}`,
      };
      res.end(JSON.stringify(resp));
}

module.exports = notFoundfunc;