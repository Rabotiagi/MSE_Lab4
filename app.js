const DB = require("./db/db_api");
const proc = require("node:process");

function formatDate(date) {
    let dd = date.getDate();
    dd = dd < 10 ? '0' + dd : dd;
    let mm = date.getMonth() + 1;
    mm = mm < 10 ? '0' + mm : mm;
    let yyyy = date.getFullYear();
    return dd + '.' + mm + '.' + yyyy;
}

function unformatDate(dateStr) {
    const arr = dateStr.split('.');
    return new Date(arr[2], arr[1] - 1, arr[0]);
}

class App {

    constructor(db, args) {
        this.args = args;
        this.db = db;
    }

    show() {
        const items = this.db.get().filter((item) => {
            return item.completed == false;
        });
        const noDeadline = items.filter((item) => {
            return item.deadline == '';
        });
        const filtered = items.filter((item) => {
            return item.deadline !== '';
        }).sort((a, b) => {
            return unformatDate(a.deadline) - unformatDate(b.deadline);
        });
        console.log(filtered.concat(noDeadline));
    }

    all() {
        console.log(this.db.get());
    }

    complete() {
        this.db.update(+this.args.get('id'), {
            completed: formatDate(new Date())
        });
    }

    add() {
        try {
            if (!this.args.get('title')) {
                throw new Error();
            }
            this.db.insert({
                title: this.args.get('title'),
                desc: this.args.get('desc') ? this.args.get('desc') : '',
                deadline: this.args.get('deadline') ? this.args.get('deadline') : '',
            });
        } catch (err) {
            console.log('Syntax error');
            this.help();
        }
    }

    edit() {
        try {
            this.db.update(+this.args.get('id'), {
                title: this.args.get('title') ? this.args.get('title') : '',
                desc: this.args.get('desc') ? this.args.get('desc') : '',
                deadline: this.args.get('deadline') ? this.args.get('deadline') : '',
            });
        } catch (err) {
            console.log('Syntax error');
            this.help();
        }
    }

    burned() {
        const output = this.db.get().filter(item => {
            return (!item.completed && new Date() > unformatDate(item.deadline));
        });
        console.log(output);
    }

    delete() {
        try {
            this.db.delete(+this.args.get('id'));
        } catch (err) {
            console.log('Syntax error');
            this.help();
        }
    }

    help() {
        console.log('See documentation:\nhttps://github.com/Rabotiagi/MSE_Lab4/blob/master/README.md');
    }

    async run() {
        await this.db.config()
    
        if (this.args.get('action') == 'run') return;
        Object.getOwnPropertyNames(this.__proto__).forEach(name => {
            if (this.args.get('action') == name) {
                this[name]();
                return;
            }
        });
    
        await this.db.lockData()
    }
    
}


// (async () => {
//     const db = new DB();

//     const args = new Map();
//     args.set('action', proc.argv[2] ? proc.argv[2] : 'help');
//     for (let i = 3; i < proc.argv.length; i++) {
//         val = proc.argv[i];
//         args.set(val.split('=')[0], val.split('=')[1]);
//     }
    
//     const app = new App(db, args);
//     await app.run();
// })();

module.exports = App;