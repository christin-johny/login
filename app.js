const express = require("express");
const hbs = require("hbs");
const session = require("express-session");
const nocache = require("nocache");
const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "thor-thunder",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(nocache()); 

const userName = "admin";
const password = "123";

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/"); 
  }
};
let count=0
app.use((req,res,next)=>{
  count++;
  next();
})

app.get('/count',(req,res)=>{
  res.end(`${count}`);
})



// Routes
app.get("/", (req, res) => {
  res.render("login", { msg: null });
});

app.post("/verify", (req, res) => {
  if (req.body.userName === userName && req.body.password === password) {
    req.session.isAuthenticated = true; 
    res.redirect("/homepage");
  } else {
    res.render("login", { msg: "Invalid username or password!" });
  }
});

app.get("/homepage", isAuthenticated, (req, res) => {
  res.render("homepage", { userName });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.redirect("/homepage");
    } else {
      res.render("login", { msg: "User Logged Out Successfully" });
    }
  });
});

 
app.listen(port, () => console.log(`Server running on localhost:${port}`));