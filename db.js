var mysql = require('mysql');

class DbHandler {
    static MySQLConnection
    static async Connection() {
        return new Promise(async (resolve, reject) => {
            try {
                let connection = await mysql.createConnection(
                    {
                        host: process.env.host,
                        user: process.env.user,
                        password: process.env.password,
                        database:process.env.dbname,
                        port:process.env.port,
                        insecureAuth : true
                    })

                DbHandler.MySQLConnection = connection;
                resolve(connection)
            }
            catch (err) {
                reject(err)
            }
        })
    }
}
module.exports.DbHandler = DbHandler

module.exports.applyleave = async(leavedate,name) =>{
    return new Promise(async(resolve, reject)=>{
        await DbHandler.Connection();
        let sqlquery = `INSERT INTO leaves VALUES ("${name}", "${leavedate}")`;
        DbHandler.MySQLConnection.query(sqlquery, function (err, result) {
            if (err) { 
                reject(err) 
            }
            resolve(result);
        })
    })
}



