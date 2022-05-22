const fsp = require('fs').promises;

const checkErrorCode = (err, code) => {
    if(err['errno'] !== code){
        console.log('Error while DB configuring:', res);
        process.exit(1);
    }
};

class DB {

    #DATA_DIR = './db/data';
    #DATA_FILE = 'tasks.txt';
    #DATA_PATH = `${this.#DATA_DIR}/${this.#DATA_FILE}`;
    #ISOLATE_CODE = 0o444;
    #RELEASE_CODE = 0o700;

    async config(){
        await fsp.chmod(this.#DATA_PATH, this.#RELEASE_CODE)

        await fsp.access(this.#DATA_DIR).catch(async (res) => {
            checkErrorCode(res, -2)
            await fsp.mkdir(this.#DATA_DIR);
        })
        
        await fsp.access(this.#DATA_PATH).catch(async (res) => {
            checkErrorCode(res, -2);
            await fsp.writeFile(this.#DATA_PATH, '');
        })
    }

    async lockData(){
        await fsp.chmod(this.#DATA_PATH, this.#ISOLATE_CODE);
    }    
}

module.exports = DB