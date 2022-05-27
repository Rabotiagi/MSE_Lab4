const DB = require('./db_api.js');
const fsp = require('fs').promises;
const fs = require('fs');

describe('database API testing', () => {
    const db = new DB();
    const fullTask = (task, id) => {
        return {
            ...task,
            completed: false,
            id: id,
            desc: task.desc || undefined,
            deadline: task.deadline || undefined
        };
    };

    beforeEach(async () => {
        await db.config();
        await fsp.rm('./db/data/tasks.json').catch(() => console.log('Nothing to be deleted'));
        await db.config();
    });

    afterEach(async () => {
        await db.lockData();
    });

    //In this tests we do not invoke .config() method directly, because
    //it was already invoked before these test in beforeEach()
    describe('.config() testing', () => {
        it('should create dir "data"', async () => {
            const testAccess = async () => {
                await fsp.access('./db/data')
            };
            expect(testAccess).not.toThrow();
        });

        it('should create file "./data/tasks.json"', async () => {
            const testAccess = async () => {
                await fsp.access('./db/data');
            };
            expect(testAccess).not.toThrow();
        });
    });

    describe('.insert() testing', () => {
        it('should add data to "tasks.json"', async () => {
            const task = {title: "1", deadline: 1};

            db.insert(task);
            await db.lockData();
            await db.config();

            const res = await fsp.readFile('./db/data/tasks.json');
            expect(res.toString()).toBe(JSON.stringify([
                {id: 1, ...task, completed: false}
            ]));
        });
    });

    describe('.find() testing', () => {
        const task1 = {title: "1"};
        const task2 = {title: "2", deadline: "2"};

        it('should find all tasks (one session)', () => {
            db.insert(task1);
            expect(db.find()).toEqual([
                fullTask(task1, 1)
            ]);
        });

        it('should find added element (different sessions)', async () => {
            db.insert(task1);
            db.insert(task2);
            await db.lockData();
            await db.config();

            expect(db.find()).toEqual([
                fullTask(task1, 1),
                fullTask(task2, 2)
            ])
        });
        
        it('should find task by id', () => {
            db.insert(task1);
            expect(db.find(fullTask(task1,1).id)).toEqual(fullTask(task1, 1));
        });

        //All the tasks were deleted before running this test
        it('should return undefined', () => {
            expect(db.find(1)).toBeUndefined();
        });
    });

    describe('.update() testing', () => {
        const task = {title: "3"};
        const newData = {title:"NEW"};

        it('should update certain task', () => {
            db.insert(task);
            db.update(1, newData);
            
            expect(db.find()).toEqual([fullTask(newData, 1)]);
            expect(db.find(1).title).toBe("NEW");
        });

        it('should not change task data', () => { 
            db.insert(task);
            
            const before = db.find();
            db.update(2, newData);
            const after = db.find();

            expect(after).toEqual(before);
        });

        it('should throw an error', () => {
            db.insert(task);
            const testUpdate = () => {
                db.update('123', {});
            };
            
            expect(testUpdate).toThrow('Invalid ID type');
        });
    });

    describe('.delete() testing', () => {
        const task1 = {title: "4"};
        const task2 = {title: "4.1"};

        it('should delete task by id', () => {
            db.insert(task1);
            db.insert(task2);
            db.delete(1);

            expect(db.find()).toEqual([fullTask(task2, 2)]);
        });

        it('should throw an error', () => {
            const testDelete = () => {
                db.delete(true);
            };

            expect(testDelete).toThrow('Invalid ID type');
        });

        it('should not change tasks data', () => {
            db.insert(task1);
            db.insert(task2);

            const before = db.find();
            db.delete(3);
            const after = db.find();

            expect(after).toEqual(before);
        });
    });

    afterAll(async () => {
        await fsp.rm('./db/data/tasks.json');
        await fsp.rmdir('./db/data');
    });
});