
module.exports = require('mysql').createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'nsw0311',
    database: 'test'
});