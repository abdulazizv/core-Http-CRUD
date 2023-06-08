function validationError(res) {
    res.writeHead(400, {
        'Content-type': 'application/json'
    })

    const resp = {
        status:400,
        message:'Give correct data to create book'
    }

    res.end(JSON.stringify(resp))
}

module.exports = validationError