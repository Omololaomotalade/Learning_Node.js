const Joi = require('joi');
const {createPool} = require('mysql'); //importing database mysql
const express = require('express');
const router = express.Router();



// creating a function

function validateUser(user_bio){
  const schema = Joi.object({
    firstname: Joi.string().min(1).required(),
    lastname: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    occupation: Joi.string().required(),
    DOB : Joi.date().max('1-1-2008').iso(),
    phone : Joi.string().regex(/^\d{11}$/).required(),
    gender: Joi.string().required()
  });

  return schema.validate(user_bio);
};


// connect to the database
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_bio",
  connectionLimit: 10,
});

router.post('/',(req, res) =>{
  const { error } = validateUser(req.body); // result.error object destructure
  if (error){
  // 400 Bad Request
  res.status(400).send(error.details[0].message);
  return; 
  };
  pool.getConnection((err, connection) => {
  if(err) throw err
  connection.query(`INSERT INTO user_bio SET ?`, req.body, (err, rows) => {
  connection.release();
  if (!err) res.send(req.body)
  else throw err
  }); 
});

});

router.get('/',(req, res) =>{
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query(`Select * From user_bio`, (err, rows) => {
    connection.release();
    if (!err) res.send(rows)
    else throw err
    }); 
  });
});


router.get('/:id', (req, res)=>{
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query(`Select * From user_bio Where id = '${req.params.id}'`, (err, rows) => {
    
    if(err) throw err
    if(rows.length === 0) res.status(404).send('The user with the given first name was not found')
    else {
      const user = rows[0];
      connection.query(`Select * From courses Where user_id = '${user.id}'`, (err, rows) => {
        connection.release();
        user.courses = rows;
        res.send(user);
      }) 
    }
    }); 
  });
}); 


router.put('/:id', (req, res) => {
  // Look up the course
  // If the course doesnt exist, return 404
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query(`UPDATE user_bio SET occupation = '${req.body.occupation}' Where id = '${req.params.id}'`, (err, rows) => {
    connection.release();
    if(err) throw err
    if(rows.length === 0) res.status(404).send('The occupation with the given param was not found')
    else res.send(rows)
    }); 
  });
})


module.exports = router;// export route to have access to it in index.js



// fetch users
// add course for a user
// fetch a users with their courses