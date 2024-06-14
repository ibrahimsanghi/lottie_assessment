// backend/src/index.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongooseDB = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const schema = require('./schema');
const resolvers = require('./resolvers');
const Animation = require('../models/Animation');
const mime = require('mime'); // Import the 'mime' module
require('dotenv').config();

const app = express();

app.use(cors());

mongooseDB.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.post('/upload', upload.single('file'), async (req, res) => {
  const { body, tags } = req.body;
  const filePath = req.file.path;
  const fileTitle = req.file.filename;
  const fileLink = `http://localhost:4000/uploads/${fileTitle}`;
  const mimeType = req.file.mimetype;

  // Save the file details to the database
  const newAnimation = new Animation({
    title: fileTitle,
    body,
    tags,
    link: fileLink,
    mimeType,
  });

  try {
    await newAnimation.save();
    res.send('File uploaded and saved.');
  } catch (error) {
    res.status(500).send('Error saving to database');
  }
});

app.get('/download/:id', async (req, res) => {
  const animation = await Animation.findById(req.params.id);

  if (!animation) {
    return res.status(404).send('File not found');
  }

  const filePath = path.join(__dirname, '../uploads', animation.title);

  const mimeType = mime.getType(filePath);

  res.setHeader('Content-Disposition', `attachment; fileTitle="${animation.title}"`);
  res.setHeader('Content-Type', mimeType); // Set the MIME type in the response header
  res.sendFile(filePath);
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
