const fsp = require('fs').promises;

const checkErrorCode = (err, code) => {
    if (err['errno'] !== code) {
        console.log('Error: DB configuring crashed\n', res);
        process.exit(1);
    }
};

const checkIdType = (id) => {
    if(typeof id !== 'number' || id === NaN){
        throw new Error('Invalid ID type');
    }
};

class DB {

    #DATA_DIR = './db/data';
    #DATA_FILE = 'tasks.json';
    #DATA_PATH = `${this.#DATA_DIR}/${this.#DATA_FILE}`;
    #ISOLATE_CODE = 0o444;
    #RELEASE_CODE = 0o700;
    #CURRENT_ID;
    #TASKS;

    async config() {
        await fsp.access(this.#DATA_DIR).catch(async (res) => {
            checkErrorCode(res, -2)
            await fsp.mkdir(this.#DATA_DIR);
        })

        await fsp.access(this.#DATA_PATH).catch(async (res) => {
            checkErrorCode(res, -2);
            await fsp.writeFile(this.#DATA_PATH, JSON.stringify([]));
        })

        await fsp.chmod(this.#DATA_PATH, this.#RELEASE_CODE)
        this.#TASKS = JSON.parse(await fsp.readFile(this.#DATA_PATH));

        const lastAddedTask = this.#TASKS[this.#TASKS.length - 1];
        this.#CURRENT_ID = lastAddedTask ? lastAddedTask.id : 0;
    }

    insert(taskData) {
        this.#TASKS.push({
            id: ++this.#CURRENT_ID,
            title: taskData.title,
            desc: taskData.desc,
            deadline: taskData.deadline,
            completed: false
        });
    }

    get() {
        return this.#TASKS;
    }

    find(id) {
        if(!id && id !== NaN) return this.#TASKS;
        checkIdType(id);
        return this.#TASKS.find(task => task.id === id);
    }

    update(id, newData) {
        checkIdType(id);
        const task = this.#TASKS.find(task => task.id === id);
        if(!task) return;
        const index = this.#TASKS.indexOf(task);

        for(let prop in newData){
            task[prop] = newData[prop] ? newData[prop] : task[prop]
        }

        this.#TASKS[index] = task
    }

    delete(id) {
        checkIdType(id);
        const taskToDelete = this.#TASKS.find(task => task.id === id);
        const index = this.#TASKS.indexOf(taskToDelete);

        this.#TASKS.splice(index, index != -1 ? 1 : 0);
    }

    async lockData() {
        await fsp.writeFile(this.#DATA_PATH, JSON.stringify(this.#TASKS))
        await fsp.chmod(this.#DATA_PATH, this.#ISOLATE_CODE);
    }
}

module.exports = DB