import _ from "lodash";

export default function projects(state = {projectsLoading: true, projectData: {}}, action) {
  switch (action.type) {
    case 'PROJECT_LOADING':
      return {
        projectsLoading: true,
        projectData: {}
      };

    case 'FETCH_PROJECT':
      const fetchProjectsReturn = {
				projectsLoading: false,
				projectData: {
          [action.payload.slug] : action.payload
        }
  		};
      return fetchProjectsReturn;

    case 'FETCH_ALL_PROJECT':
      var returnObject = {};
      action.payload.map( (project) => {
        returnObject[project.slug] = project;
      })

      const fetchAllProjectsReturn = {
        projectsLoading: false,
        projectData: returnObject
      };
      return fetchAllProjectsReturn;

    default:
      return state;
  }
}
