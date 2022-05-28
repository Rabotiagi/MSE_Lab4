# Methodologies of Software Development Lab #4

A simple console-based application for task managment. You can use it for convenient managing of the tasks that need to be done. With this app you will be able to create, view and edit your tasks through command line interface

## Installation
1. You need [NodeJs](https://nodejs.org/) and [NPM](https://www.npmjs.com/) installed 
```
sudo yum install nodejs
sudo yum install npm
```
2. Clone the repository to your machine
```
git clone https://github.com/Rabotiagi/MSE_Lab4.git
```
3. To run the app, uncomment lines 116-128 in app.js file, and in root directory type
```
node app.js [options]
```

## Usage
To use the application you need to run it with one of the options. There are 8 different options avialable. Some of them can be used only with several values provided. Also for using some commands you will need to identify the task with its id. You can see all tasks id`s by using such commands as: show, all, burned.

### Options list:
1. **show**
<br>To see all unfinished tasks sorted by deadline distance
```
node app.js show
```
2. **all**
<br>To see all the tasks
```
node app.js all
```
3. **complete**
<br>To mark the task as complete (id - required)
```
node app.js complete id="[id]"
```
4. **add**
<br>To add the new task (title - required, desc - optional, deadline - optional)
```
node app.js add title="[title]" desc="[desc]" deadline="[deadline]"
```
5. **edit**
<br>To edit an existing task (id - required, title - optional, desc - optional, deadline - optional)
```
node app.js edit id="[id]" title="[title]" desc="[desc]" deadline="[deadline]"
```
6. **burned**
<br>To see the tasks with a missed deadline
```
node app.js burned
```
7. **delete**
<br>To delete a task (id - required)
```
node app.js id="[id]"
```
8. **help**
<br>Provides a link for documentation (this page)
```
node app.js help
```

## Tests
For tests to work properly make sure that lines 116-128 in app.js file are commented out

At first, install dependencies by runnig command in the project root directory
```
npm install
```
Then you can run tests by typing
```
npm test
```