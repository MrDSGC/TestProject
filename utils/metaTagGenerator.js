var User = require('../models/User');
var Project = require('../models/Project'); // used for project tags
var UrlRedirect = require('../models/UrlRedirect'); // used for project tags

/* returnObject for reference
returnObject = {
  status: "found",
  title: project.title,
  image: project.heroImageUrl,
  description: "Checkout " + project.title + " on HackHive."
}
*/

exports.returnMetaTagsFromObjects = (urlToParse, callBack) => {
  // only for errorcase
  var returnObject = {};
  // check if it's profile URL
  if ( getSlugFromURL(urlToParse, '/profile/') ) {
    getProfileMetaTags(getSlugFromURL(urlToParse, '/profile/' ), callBack)

  // check if it's project URL
  } else if ( getSlugFromURL(urlToParse, '/project/') ) {
    getProjectMetaTags( getSlugFromURL(urlToParse, '/project/'), callBack)
  } else if (urlToParse.indexOf('/slohacks') != -1 ) {
    callBack({
      status: "found",
      title: "Slo Hacks on HackHive",
      image: "https://www.theHackHive.com/assets/img/misc/hackhive-slo-cal-poly-village-2.jpg",
      description: "Vote on SloHack Projects on HackHive!"
    })

  } else if (urlToParse.indexOf('/careers') != -1 ) {
    callBack({
      status: "found",
      title: "HackHive Careers",
      image: "https://www.theHackHive.com/assets/img/misc/hackHiveCareersShare.jpg",
      description: "Career opportunities in the Bay Area and around the US"
    })

  // check url redirects
  } else {
    getRedirectObjectMetaTags(getSlugFromURL(urlToParse, '/'), callBack)
  }
}

var getSlugFromURL = (urlToParse, paramToMatch) => {
  var outputSlug = '';
  if ( urlToParse.indexOf(paramToMatch) != -1 ) {
    var locationOfSlugInString = urlToParse.indexOf(paramToMatch) + paramToMatch.length;
    outputSlug = urlToParse.slice(locationOfSlugInString);

    // check if there is another slash after the slash.
    if (outputSlug.indexOf('/') != -1) {
      // there is anothe slash in the string, return 404.
      return null;
    } else {
      // clean up parse string - remove url params. remove question.
      if ( outputSlug.indexOf('?') != -1 ) {
        // remove url params
        return outputSlug.slice(0, outputSlug.indexOf('?'));
      } else {
        // no url params
        return outputSlug;
      }
    }
  }
}

var getProjectMetaTags = (projectSlug, callBack) => {
  var returnObject = {};
  if (!projectSlug) {
    returnObject.status = "error"
    callBack(returnObject);
  }

  Project.findOne({slug: projectSlug}).exec( (err, project) => {
    if (!err && project) {
      returnObject = {
        status: "found",
        title: project.title,
        image: project.heroImageUrl,
        description: "Checkout " + project.title + " on HackHive."
      }
      callBack(returnObject);
    } else {
      returnObject.status = "error"
      callBack(returnObject);
    }
  })
}

var getProfileMetaTags = (profileSlug, callBack) => {
  var returnObject = {};
  if (!profileSlug) {
    returnObject.status = "error"
    callBack(returnObject);
  }

  User.findOne({slug: profileSlug}).exec( (err, userProfile)=> {
    if (!err && userProfile && !userProfile.isSuspended) {
      returnObject = {
        status: "found",
        title: userProfile.firstName + " "+ userProfile.lastName + " on HackHive.",
        image: userProfile.profilePicUrl,
        description: "Checkout " + userProfile.firstName + " "+ userProfile.lastName + "'s projects and profile on HackHive!"
      }
      callBack(returnObject);
    } else {
      returnObject.status = "error"
      callBack(returnObject);
    }
  });
};

var getRedirectObjectMetaTags = (redirectSlug, callBack) => {
  // ignore paths
  var returnObject = {};
  if (
      !redirectSlug ||
      (redirectSlug.length < 3) ||
      (redirectSlug.indexOf("__webpack_hmr") != -1) ||
      (redirectSlug.indexOf("OneSignalSDKWorker.js") != -1) ||
      (redirectSlug.indexOf("favicon.ico") != -1)
    ) {
    returnObject.status = "error"
    callBack(returnObject);
  } else {
    UrlRedirect.findOne({redirectSlug}).exec( (err, urlRedirectObject)=> {
      if (!err && urlRedirectObject) {
        returnObject = {
          status: "found",
          title: urlRedirectObject.metaTagTitle,
          image: urlRedirectObject.metaTagImageURL,
          description: urlRedirectObject.metaTagDescription
        }
        callBack(returnObject);
      } else {
        returnObject.status = "error"
        callBack(returnObject);
      }
    });
  }
};
