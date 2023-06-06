const Joi = require('joi');
const {createPool} = require('mysql');
const express = require('express');
const router = express.Router()

// creating a function

function validateCourse(course){
  const schema = Joi.object({
    course_name: Joi.string().min(3).required(),
  });

 return schema.validate(course);
}


const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_bio",
    connectionLimit: 10,
});

router.get('/',(req, res) =>{
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query(`Select * From courses`, (err, rows) => {
    connection.release();
    if (!err) res.send(rows)
    else throw err
    }); 
  });
});

router.get('/:course_name', (req, res)=>{
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query(`Select * From courses Where course_name = '${req.params.course_name}'`, (err, rows) => {
    connection.release();
    if(err) throw err
    if(rows.length === 0) res.status(404).send('The course with the given param was not found')
    else res.send(rows)
    }); 
  });
}); 
// query params are sotored in an object with a bunch of key value pairs
// router.get('/api/posts/:year/:month', (req, res)=>{
//     res.send(req.params);
// });
//http post request
router.post('/',(req, res) =>{
    const { error } = validateCourse(req.body); // result.error object strubture
    if (error){
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return; 
    };

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(`INSERT INTO courses SET ?`, req.body, (err, rows) => {
      connection.release();
      if (!err) res.send(rows)
      else throw err
      }); 
    });
  
});





router.put('/:id', (req, res) => {
  // Look up the course
  // If the course doesnt exist, return 404
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query(`UPDATE courses SET course_name = '${req.body.course_name}' Where id = '${req.params.id}'`, (err, rows) => {
    connection.release();
    if(err) throw err
    if(rows.length === 0) res.status(404).send('The course with the given param was not found')
    else res.send(rows)
    }); 
  });
})
  
//assigning course to a user
router.put('/assign/:id', (req, res) => {
  // Look up the course
  // If the course doesnt exist, return 404
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query(`UPDATE courses SET user_id = ${req.body.user_id} Where id = ${req.params.id}`, (err, rows) => {
    connection.release();
    if(err) throw err
    if(rows.length === 0) res.status(404).send('The course with the given param was not found')
    else res.send(rows)
    }); 
  });
})



  // const course = courses.find(c => c.name === req.params.name);
  // if(!course){
  //   res.status(404).send('The course with the given param was not found');
  //   return;    
  // }
  // //Validate
  // // If invalid, return 400 - Bad request
  // const result = validateCourse(req.body);
  // const { error } = validateCourse(req.body); // result.error object strubture
  // if (error){
  //   // 400 Bad Request
  //     res.status(400).send(result.error.details[0].message);
  //     return;
  // }
  // // Update course
  // course.name = req.body.name;
  // // Return the updated course
  // res.send(course);

//http Delete request
// router.delete('/:name', (req, res) =>{
//   pool.getConnection((err, connection) => {
//     if(err) throw err
//     connection.query(`Delete From courses Where name = '${req.params.name}'`, (err, rows) => {
//     connection.release();
//     if(err) throw err
//     else res.send(rows)
//     })
//   })
// }); 


// Deleting by id
router.delete('/:id', (req, res) =>{
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query(`Delete From courses Where id =${req.params.id}`, (err, rows) => {
    connection.release();
    if(err) throw err
    else res.send(rows)
    })
  })
}); 
  
    // Look up the course
  // Not existing, return 404
//     if(!course){
//       res.status(404).send('The course with the given param was not found');
//       return;
//     }

//   //Delete
//   const index = courses.indexOf(course);
//   courses.splice(index, 1);
//       // Return the same course 
//       res.send(course);
// });

module.exports = router;// export route


//create a rest api for managing user info data(firstname, lastname, email, phone, gender, date of birth, address,occupation)
//also a postman collection
//on your courses table, every course should belong to a user. Realtionships in database
//attach a course to a user