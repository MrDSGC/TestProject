const Tag = require('../models/Tag');
const Project = require('../models/Project');

/**
 * Post /api/admin/tag
 */
exports.tagPost = function(req, res) {
  var tagToUpdate = req.body.tagToSubmit;

  Tag.findByIdAndUpdate(req.body.tagToSubmit.id, tagToUpdate)
  .exec( (findUpdateErr, tag) => {
    if (!findUpdateErr && !tag) {
      // Tag was not found, and therefore not updated. create a tag
      var createdTag = new Tag(tagToUpdate);
      createdTag.save( (err)=> {
        res.send({
          tag: createdTag,
          state: "newTag"
        });
      });
    } else if (!findUpdateErr && tag) {
      // Tag found and updated
      res.send({
        tag,
        state: "updated"
      });
    } else {
      // error
      res.status(404).send({msg: "Error"});
    }
  })
}

/**
 * GET /api/tags
 */
// Get all tags
exports.tagsGet = function(req, res) {
  Tag.find().exec((err, tags) => {
    res.send(tags);
  })
}

/**
 * GET /api/tags/search/:tagFriendlyNameSearchString
 */
// Get all tags
exports.tagsSearchGet = function(req, res) {
  Tag.find({
    "friendlyName": { "$regex": req.params.tagFriendlyNameSearchString, "$options": "i" }
  }).exec((err, tags) => {
    res.send(tags);
  })
}

/**
 * GET /api/tag, with a URL param
 */

 //app.get('/api/admin/tags/:tagSlug
exports.getTagProjectsPeople = function(req, res) {
  Tag.findOne({slug: req.params.tagSlug})
  .populate({
    path: 'projects',
    populate: Project.getTagsAndCreators()
  })
  .populate('users')
  .exec((err, tag) => {
    if (!err && tag) {
      var projectsWithBuilders = tag.projects.map( (project) => {
        return project.projectWithBuildersJSON();
      })

      res.send({
        tag,
        projects: projectsWithBuilders,
        people: tag.users,
      })
    } else {
      res.status(404).send({msg: "error!"})
    }
  })
}
