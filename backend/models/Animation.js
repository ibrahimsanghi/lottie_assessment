const mongooseSchema = require('mongoose');

const animationSchema = new mongooseSchema.Schema({
  title: String,
  body: String,
  tags: String,
  link: String,
  mimeType: String,
});

const Animation = mongooseSchema.models.Animation || mongooseSchema.model('Animation', animationSchema);

module.exports = Animation;
