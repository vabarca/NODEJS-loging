const sqlite3 = require('sqlite3');
sqlite3.verbose();

let db = new sqlite3.Database(__dirname + '/pe_loging.db', sqlite3.OPEN_READWRITE, (err) => {
    
    if(err){
        console.error(err.message);
        return;
    }
    console.log('Connected to the pe_loging DB')

});

module.exports = db