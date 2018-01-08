const getAuthRedirectUri = () => {
  if (process.env.APP_ENVIRONMENT === 'local') {
    return 'https://localhost/callback';
  } else {
    return 'https://ec2-54-200-6-228.us-west-2.compute.amazonaws.com/callback';
  }
};

const getHorizonHost = () => {
  if (process.env.APP_ENVIRONMENT === 'local') {
    return 'localhost:80';
  } else {
    return 'ec2-54-200-6-228.us-west-2.compute.amazonaws.com:80';
  }
};

module.exports = {
  getAuthRedirectUri,
  getHorizonHost
};
