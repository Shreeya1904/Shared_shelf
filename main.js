const express = require("express");
const main = express();
const multer = require("multer");

const students = require("./loginschema");
const bookdropschema = require("./bookschema");
const cartbookschema = require("./cartschema");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./views/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

main.use(express.json());
main.set("view engine", "ejs");
main.use(express.urlencoded({ extended: false }));

main.use(express.static("./views"));

main.get("/", (req, res) => {
  res.render("getstarted");
});

main.get("/register", (req, res) => {
  res.render("register");
});

main.get("/signin", (req, res) => {
  res.render("signin");
});

main.get("/donate", (req, res) => {
  res.render("donate");
});


main.post("/register", async (req, res) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    outlook: req.body.outlook,
    contact: req.body.contact,
    hostel: req.body.hostel,
    password: req.body.password,
  };

  try {
    await students.insertMany([user]);
    const books = await bookdropschema.find();
    res.render("home", { user ,books});
  } catch (err) {
    if (err.code === 11000) {
      return res.render("signin2");
    } else {
      console.error("Error inserting data into MongoDB:", err);
      return res.status(500).send("Internal Server Error");
    }
  }
});

main.get('/book/:id/:outlook', async (req, res) => {
  try {
      const book = await bookdropschema.findById(req.params.id);
      if (!book) {
          return res.status(404).render('404');
      }
    const owner = await students.findOne({ outlook: book.outlook });
    const activeuser = await students.findOne({ outlook: req.params.outlook });
      res.render('bookdescription', {book,owner,activeuser,genres: book.genre});
  } catch (error) {
      console.error(error);
      res.status(500).render('500'); 
  }
});


main.post("/signin", async (req, res) => {
  try {
    const user = await students.findOne({ outlook: req.body.outlook });
    if (user.password === req.body.password) {
      const books = await bookdropschema.find();
      res.render("home", {user,books});
    } else {
      res.render("signin1");
    }
  } catch {
    res.render("register1");
  }
});

main.post("/donate", upload.single("bookimage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const book = new bookdropschema({
      title: req.body.title,
      author: req.body.author,
      outlook: req.body.outlook,
      description: req.body.description,
      sold: false,
      genre: req.body.genre,
      bookimage: req.file.filename,
      password: req.body.password,
    });

    try {
      const user = await students.findOne({ outlook: req.body.outlook });
      if (user.password === req.body.password) {
        await book.save();
        const books = await bookdropschema.find();
        res.render("home", { user ,books});
      } else {
        res.render("donate1");
      }
    } catch {
      res.render("donate2");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occured while uploading the image.");
  }
});

main.post("/borrow", async (req, res) => {
  const book = await bookdropschema.findOne({ _id: req.body.id });
  const activeuser = await students.findOne({ outlook: req.body.active });
  const owner = await students.findOne({ outlook: book.outlook });
  if (activeuser.outlook === owner.outlook) {
    return res.send("you're already the owner");
  }
  book.outlook = activeuser.outlook;
  book.sold = true;
  await book.save();
  return res.render('thankyou');
})

main.post("/borrowcart", async (req, res) => {
  const book = await cartbookschema.findOne({ _id: req.body.id });
  const activeuser = await students.findOne({ outlook: req.body.active });
  const owner = await students.findOne({ outlook: book.outlook });
  book.outlook = activeuser.outlook;
  book.sold = true;
  await book.save();
  return res.render('thankyou');
})

main.post("/cartadd", async (req, res) => {
  const cartbook = await bookdropschema.findOne({ _id: req.body.id });
  const user = await students.findOne({outlook: req.body.active});
  const owner = await students.findOne({ outlook: cartbook.outlook });
  const cart = new cartbookschema({
    title: cartbook.title,
    author: cartbook.author,
    cartoutlook: user.outlook,
    sold: cartbook.sold,
    bookimage: cartbook.bookimage,
  });
  if (user.outlook === owner.outlook) {
    return res.send("you're already the owner");
  }
  await cart.save();
  const books = await bookdropschema.find();
  res.render("home", { user, books });
})

main.post("/opencart", async (req, res) => {
  const user = await students.findOne({ outlook: req.body.outlook });
  const books = await bookdropschema.find();
  const cartbooks = await cartbookschema.find({ cartoutlook: req.body.outlook });
  res.render("homecart", {user,books,cartbooks})
})

main.post('/delete', async (req, res) => {
  try {
    await cartbookschema.deleteOne({ _id: req.body.id });
    const user = await students.findOne({ outlook: req.body.outlook });
  const books = await bookdropschema.find();
  const cartbooks = await cartbookschema.find({ cartoutlook: req.body.outlook });
  res.render("homecart", {user,books,cartbooks})    
      
  } catch (error) {
      console.error(error);
      res.status(500).send('Failed to delete book from cart.');
  }
});

main.listen(3000, () => {
  console.log("port connected");
});
