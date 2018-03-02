const User = require('../models/User');
const Project = require('../models/Project');

// app.get('/api/search/:searhString'
exports.searchGet = function(req, res) {
  Project.find({
    "title": { "$regex": req.params.searchString, "$options": "i" }
  })
  .limit(5)
  .populate('userProjectAssoc')
  .populate(Project.getTagsAndCreators())
  .exec( (err, projects) =>  {
    if (!err && projects && projects.length) {
      var returnProjects = projects.map( (project) => {
        return (project.projectWithBuildersJSON())
      })
      res.send(returnProjects);
    }
    else {
      res.status(404).send({msg: 'Sorry not found'});
    }
  });
};
