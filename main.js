const DB = require("./db/db_api");
const proc = require("node:process");

const db = new DB();

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

(async () => {
    await db.config()

    const args = new Map();
    args.set('action', proc.argv[2] ? proc.argv[2] : 'help');
    for (let i = 3; i < proc.argv.length; i++) {
        val = proc.argv[i];
        args.set(val.split('=')[0], val.split('=')[1]);
    }

    const commands = {
        show() {
            const items = db.get().filter((item) => {
                return item.complete == false;
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
        },
        all() {
            console.log(db.get());
        },
        complete() {
            db.update(+args.get('id'), {
                complete: formatDate(new Date())
            });
        },
        add() {
            if (!args.get('title')) {
                throw new Error();
            }
            db.insert({
                title: args.get('title'),
                desc: args.get('desc') ? args.get('desc') : '',
                deadline: args.get('deadline') ? args.get('deadline') : '',
            });
        },
        edit() {
            db.update(+args.get('id'), {
                title: args.get('title') ? args.get('title') : '',
                desc: args.get('desc') ? args.get('desc') : '',
                deadline: args.get('deadline') ? args.get('deadline') : '',
            });
        },
        burned() {
            const output = db.get().filter(item => {
                return (!item.complete && new Date() > unformatDate(item.deadline));
            });
            console.log(output);
        },
        delete() {
            db.delete(+args.get('id'));
        },
        help() {
            console.log('See documentation:\nhttps://github.com/Rabotiagi/MSE_Lab4/blob/master/README.md');
        }
    }

    try {
        commands[args.get('action')]();
    } catch (err) {
        console.log('Syntax error. See help');
    }

    await db.lockData()
})();