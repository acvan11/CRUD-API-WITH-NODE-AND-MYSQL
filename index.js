const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
var PORT = process.env.PORT || 3000;

var app = express();

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Seattle-123',
	database: 'EmployeeDB',
	multipleStatements: true
});

mysqlConnection.connect(err => {
	if(!err){
		console.log('DB connection succedded');
	}else{
		console.log('DB connect FAIL ', JSON.stringify(err));
	}
});


// Get all employees
app.get('/employees', (req, res) => {
	mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
		if (!err){
			res.send(rows)
			
		}else{
			console.log(err);
		}
	})
});

//Get an employee
app.get('/employees/:id', (req, res) => {
	mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?',[req.params.id], (err, rows, fields) => {
		if(!err){
			res.send(rows);
		}else {
			res.send(err);
		}
	});
});

//DELETE an employee
app.delete('/employees/:id', (req, res) => {
	mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
		if(!err){
			res.send('Deleted successfully')
		}else {
			res.send(err)
		}
	});
});

// Insert an employees
app.post('/employees', (req, res) => {
	let emp = req.body;
	var sql = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary =?; \
	CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);"

	mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
		if(!err){
			rows.forEach(element => {
				if(element.constructor == Array)
				res.send('Inserted employee id :' + element[0].EmpID);
			});
		}else {
			res.send(err)
		}
	});
});

// Update an employees
app.put('/employees', (req, res) => {
	let emp = req.body;
	var sql = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary =?; \
	CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);"

	mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
		if(!err){
			res.send('Update successfully');
		}else {
			res.send(err);
		}
	});
});

app.listen(PORT, ()=> {
	console.log('listen to the ', PORT);
});