const DB  = require('./db/db_api');
const App = require('./app');

describe('Testing CLI functions', () => {

    const db = new DB();
    const logSpy = jest.spyOn(console, 'log');

    beforeEach(() => {
        logSpy.mockReset();
    });

    describe('all() and add() functions testing', () => {
        test('should print the list with all 3 task', async () => {
            const args1 = new Map();
            args1.set('action', 'add');
            args1.set('title', 'New Task number 1');
            args1.set('desc', 'Description of the task');
            let app = new App(db, args1);
            await app.run();

            const args2 = new Map();
            args2.set('action', 'add');
            args2.set('title', 'New Task number 2');
            args2.set('deadline', '13.03.2123');
            app = new App(db, args2);
            await app.run();

            const args3 = new Map();
            args3.set('action', 'add');
            args3.set('title', 'New Task number 3');
            args3.set('deadline', '05.03.2123');
            app = new App(db, args3);
            await app.run();

            const args4 = new Map();
            args4.set('action', 'all');
            app = new App(db, args4);
            await app.run();

            expect(logSpy).toHaveBeenCalledWith([
                { id: 1, title: 'New Task number 1', desc: 'Description of the task', deadline: '', completed: false },
                { id: 2, title: 'New Task number 2', desc: '', deadline: '13.03.2123', completed: false },
                { id: 3, title: 'New Task number 3', desc: '', deadline: '05.03.2123', completed: false }
            ]);
        });

        test('should print an error because of no title', async () => {
            const args = new Map();
            args.set('action', 'add');
            args.set('desc', 'Description of the task');
            const app = new App(db, args);

            await app.run();

            expect(logSpy).toHaveBeenCalledWith("Syntax error");
        });
    });

    describe('show() function testing', () => {
        test('should print the list with all 3 tasks sorted by deadline', async () => {
            const args = new Map();
            args.set('action', 'show');
            const app = new App(db, args);
            await app.run();

            expect(logSpy).toHaveBeenCalledWith([
                { id: 3, title: 'New Task number 3', desc: '', deadline: '05.03.2123', completed: false },
                { id: 2, title: 'New Task number 2', desc: '', deadline: '13.03.2123', completed: false },
                { id: 1, title: 'New Task number 1', desc: 'Description of the task', deadline: '', completed: false }
            ]);
        });
    });

    describe('edit() function testing', () => {
        test('should change the deadline of the first task', async () => {
            const args1 = new Map();
            args1.set('action', 'edit');
            args1.set('id', '1');
            args1.set('deadline', '12.05.2022');
            let app = new App(db, args1);
            await app.run();

            const args2 = new Map();
            args2.set('action', 'all');
            app = new App(db, args2);
            await app.run();

            expect(logSpy).toHaveBeenCalledWith([
                { id: 1, title: 'New Task number 1', desc: 'Description of the task', deadline: '12.05.2022', completed: false },
                { id: 2, title: 'New Task number 2', desc: '', deadline: '13.03.2123', completed: false },
                { id: 3, title: 'New Task number 3', desc: '', deadline: '05.03.2123', completed: false }
            ]);
        });
    });

    describe('burned() function testing', () => {
        test('should print the tasks with missed deadline ', async () => {
            const args = new Map();
            args.set('action', 'burned');
            const app = new App(db, args);
            await app.run();

            expect(logSpy).toHaveBeenCalledWith([{ id: 1, title: 'New Task number 1', desc: 'Description of the task', deadline: '12.05.2022', completed: false }]);
        });
    });

    describe('delete() function testing', () => {
        test('should delete the second task', async () => {
            const args1 = new Map();
            args1.set('action', 'delete');
            args1.set('id', '2');
            let app = new App(db, args1);
            await app.run();

            const args2 = new Map();
            args2.set('action', 'all');
            app = new App(db, args2);
            await app.run();

            expect(logSpy).toHaveBeenCalledWith([
                { id: 1, title: 'New Task number 1', desc: 'Description of the task', deadline: '12.05.2022', completed: false },
                { id: 3, title: 'New Task number 3', desc: '', deadline: '05.03.2123', completed: false }
            ]);
        });
    });

});