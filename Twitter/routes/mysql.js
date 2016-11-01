/**
 * Created by Abhay on 08-03-2016.
 */
var ejs= require('ejs');
var mysql = require('mysql');
var pooling = require('./connectionestablish.js');



function fetchData(callback,sqlQuery)
{

    var  connection = pooling.getConnection();

    connection.query(sqlQuery, function(err,rows,fields){

            if(err)
            {
                console.log("Error :"+err.message);

            }
            else
            {
                pooling.returnConnection(connection);

                callback(err, rows);
            }
    })
}

exports.fetchData = fetchData;