import _ from "lodash";

export default function profiles(state = {profilesLoading: true, profileData: {}}, action) {
  switch (action.type) {

    case 'PROFILE_LOADING':
      return {
        profilesLoading: true,
        profileData: {}
      };

    case 'FETCH_PROFILE':
      console.log("fetch profile")
      const fetchProfileReturn = {
				profilesLoading: false,
				profileData: {
          [action.payload.slug] : action.payload
        }
  		};
      return fetchProfileReturn;
    default:
      return state;
  }
}
