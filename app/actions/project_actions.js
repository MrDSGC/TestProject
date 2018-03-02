import axios from 'axios';

export const projectLoading = () => dispatch => {
  dispatch({type: 'PROJECT_LOADING', payload: {}})
}

export const getAllProjects = (slug, errorCallBack) => dispatch => {
  axios.get(`/api/projects`)
  .then(
    (response) => {
      dispatch({type: 'FETCH_ALL_PROJECT', payload: response.data})
    }
  ).catch( error => {
    errorCallBack(error)
  });
}

export const getProject = (slug, errorCallBack) => dispatch => {
  axios.get(`/api/project/${slug}`)
  .then(
    (response) => {
      dispatch({type: 'FETCH_PROJECT', payload: response.data})
    }
  ).catch( error => {
    errorCallBack(error)
  });
}

export const getProjectsForUserSlug = (slug) => dispatch => {
  axios.get('/api/user/vbhartia/projects')
  .then(
    (response) => {
      dispatch({type: 'FETCH_USER_PROJECTS', payload: response.data})
    }
  )
}

export const createProject = (projectData, token, callBack) => dispatch => {
  var axiosParams = {
    url: "/api/project",
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: projectData
  }

  axios(axiosParams).then( (response) => {
      callBack(response.data)
      dispatch({type: 'CREATE_PROJECT', payload: response.data})
    }
  )
}

export const updateProject = (projectData, token, callBack) => dispatch => {
  var axiosParams = {
    url: "/api/project",
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: projectData
  }

  axios(axiosParams).then( (response) => {
      callBack(response.data)
      dispatch({type: 'UPDATE_PROJECT', payload: response.data})
    }
  )
}
