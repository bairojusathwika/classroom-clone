const express = require("express");
const db = require("./routes/dbcon");
const bodyParser = require("body-parser");
const app = express();
const encoder = bodyParser.urlencoded({ extended: true });
const router = express.Router();
var user_idstu = 0;
var user_idpro = 0;
const session = require('express-session');


app.use(express.static(__dirname + '/public'));
app.use("/css", express.static(__dirname + './public/css'));
app.use("/htmlfiles", express.static(__dirname + './public/htmlfiles'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

//Login Page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/htmlfiles/student.html");
})


//Student Login Validation
app.post("/students", encoder, function (req, res) {
  const username_st = req.body.username_st;
  const password_st = req.body.password_st;
  db.query("select * from student where user_id  = ? and password = ?", [username_st, password_st], function (error, results, fields) {
    if (results.length > 0) {
      userid_st = results[0].studentid;
      req.session.user_idstu = username_st;
      res.redirect("/studenthomepage");
    } else {
      res.send(
        '<script>alert( "Invalid username or password"); window.location.href="/";</script>'
      );
    }
  })
});

//Join Class Button
app.post('/joinclass', encoder, (req, res) => {
  const classcode = req.body.classcode;
  db.query("select * from classopt_pr where classcode  = ? ", [classcode], function (error, results, fields) {
    if (results.length > 0) {
      req.session.user_idstu = classcode;
      var class_name = req.body.classcode;
      console.log('Class Code: ' + class_name);
      const query = `INSERT INTO classopt_st (classcode, studentid) VALUES ( ?, ?)`;
      db.query(query, [class_name, userid_st], (err, result) => {
        if (err) {
          console.error('Error inserting data into database:', err);
          res.sendStatus(500);
        } else {
          console.log('Data inserted into database');
          res.redirect("/studenthomepage");
        }
      });
    } else {
      res.send(
        '<script>alert( "Invalid username or password"); window.location.href="/studenthomepage";</script>'
      );
    }
  })
});

// Assignment Page Button
app.get("/to_do", function (req, res) {
   res.render("todo");
 })

//Student Home Page
app.get("/studenthomepage", function (req, res) {
  db.query("SELECT * FROM classopt_st INNER JOIN classopt_pr ON classopt_st.classcode = classopt_pr.classcode where studentid =?;", [userid_st], function (err, results, fields) {
    if (err) {
      console.log('Error retrieving data from SQL table:', err);
      res.send('Error retrieving data from SQL table.');
    } else {
      var x = results.length;
      res.render('studenthomepage', { user: results, x: x });
    }
  });
})

//Student Profile Page
app.get("/stuprofile", function (req, res) {
  console.log(req.session.user_idstu);
  db.query("select * from student where user_id = ?", [req.session.user_idstu], function (error, results, fields) {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.length > 0) {
      res.render("profile", { user: results[0] });
    } else {
      res.status(404).send("User not found");
    }
  });
});

app.get('/logoutst', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal server error');
    } else {
      res.redirect('/');
    }
  });
});


//Professor Login Validation
app.post("/professor", encoder, function (req, res) {
  var username_pr = req.body.username_pr;
  var password_pr = req.body.password_pr;
  db.query("select * from Instructors where email_id  = ? and password = ?", [username_pr, password_pr], function (error, results, fields) {
    if (results.length > 0) {
      req.session.user_idpro = username_pr;
      userid_pr = results[0].Inst_Id;
      console.log(userid_pr);
      res.redirect("/teacherhomepage");
    } else {
      res.send(
        '<script>alert( "Invalid username or password"); window.location.href="/";</script>'
      );
    }
  })
})

//Teacher Homepage
app.get("/teacherhomepage", function (req, res) {
  db.query("SELECT * FROM classopt_pr WHERE Inst_Id = ?", [userid_pr], function (err, results, fields) {
    if (err) {
      console.log('Error retrieving data from SQL table:', err);
      res.send('Error retrieving data from SQL table.');
    } else {
      var x = results.length;
      res.render('teacherhomepage', { user: results, x: x });
    }
  });
})

//Create class Button
app.post('/createclass', encoder, (req, res) => {
  var class_name = req.body.class_name;
  var sectionstu = req.body.sectionstu;
  var description = req.body.description;
  var subject = req.body.subject;
  console.log('Class Name: ' + class_name);
  console.log('Class Section: ' + sectionstu);
  console.log('Class Description: ' + description);
  console.log('Class Subject: ' + subject);
  // Generate a random class code between 100000 and 900000
  const classcode = Math.floor(Math.random() * 800000) + 100000;
     console.log(userid_pr);
  const query = `INSERT INTO classopt_pr (classname, section, description, subject, classcode, Inst_id) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [class_name, sectionstu, description, subject, classcode,userid_pr], (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      res.sendStatus(500);
    } else {
      console.log('Data inserted into database');
      res.redirect("/teacherhomepage");
    }
  });
});

//Teacher Profile Page
app.get("/teaprofile", function (req, res) {
  console.log(req.session.user_idpro);
  db.query("select * from Instructors where email_id  = ? ", [req.session.user_idpro], function (error, results, fields) {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.length > 0) {
      res.render("teacherprofile", { user: results[0] });
    } else {
      res.status(404).send("User not found");
    }
  });
});

//Localhost call
app.listen(5008);