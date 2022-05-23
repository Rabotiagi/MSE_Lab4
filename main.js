const DB = require("./db/db_api");

const db = new DB();

(async () => {
    await db.config()
    await db.lockData()
})();