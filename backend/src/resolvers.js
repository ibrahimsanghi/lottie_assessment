const mongooseSchema = require('mongoose');

const Animation = mongooseSchema.model('Animation', new mongooseSchema.Schema({
  title: String,
  body: String,
  tags: String,
  link: String,
}));

module.exports = {
  animations: async () => {
    return await Animation.find();
  },
  searchAnimations: async ({ searchQuery }) => {
    const regex = new RegExp(searchQuery, 'i');
    return await Animation.find({
      $or: [
        { title: regex },
        { body: regex },
        { tags: regex }
      ],
    });
  },
  uploadAnimation: async ({ title, body, tags, link }) => {
    const newAnimationObject = new Animation({ title, body, tags, link });
    return await newAnimationObject.save();
  },
};
