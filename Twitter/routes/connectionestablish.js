/**
 * Created by Abhay on 10-03-2016.
 */
var mysql = require('mysql');

pool = null;
last = 0;
function createPool(connectionsNumber){

    pool = [];
    for(var i=0; i < connectionsNumber; ++i)
    {
        pool.push(mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '123456',
            dateStrings : true,
            database : 'twitter',
            port	 : 3306
        }));

    }
}

function getConnection ()
{
    if(!pool)
    {
        initializeConnection();
    }
    var connection = pool[last];
    last++;
    if (last == pool.length)
        last = 0;
    return connection;
}

function initializeConnection(){
    createPool(100);
}

function returnConnection(connection)
{
    pool.push(connection);
}
exports.initializeConnection = initializeConnection;
exports.getConnection = getConnection;
exports.returnConnection = returnConnection;