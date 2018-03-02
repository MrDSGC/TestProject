const Project = require('../models/Project');
var VoteHelper = require('../utils/voteHelper');

/********* Return Slo Projects *****************/
// app.get('/api/slohacks/projects'

exports.projectsGetSloHacksGet = function(req, res) {
  var queryParams = {
    publicStatus: true,
    techTags: "5a7436250ea8e900136164ed"
  };

  Project.find(queryParams)
  .populate('techTags')
  .populate('userProjectAssoc')
  .sort({ voteCount: "descending"})
  .populate(Project.getTagsAndCreators())
  .exec( (err, projects) =>  {
    if (!err && projects) {

      if (req.user) {
        // if logged in, add vote state to return object

        var returnProjects = projects.map( (project) => {
          return (project.projectWithBuildersJSON())
        })
        VoteHelper.checkVoteOnProjectsWithUser(returnProjects, req.user, (projectArrayWithVoteStatus) => {
          res.send(projectArrayWithVoteStatus);
        });

      } else {
        // not logged in. normal return
        var returnProjects = projects.map( (project) => {
          return (project.projectWithBuildersJSON())
        })
        res.send(returnProjects);
      }
    }
    else {
      res.status(404).send({msg: 'Sorry not found'});
    }
  })
};
