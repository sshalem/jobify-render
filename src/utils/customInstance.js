import axios from 'axios';

/***********************************
 *   BASE_URL for custom instances
 ***********************************/

const BASE_URL = 'http://localhost:8080';

/*******************************
 *   custom Instances
 *******************************/

const jwtAuthController = axios.create({
  baseURL: `${BASE_URL}/auth`,
});

const refreshJwtTokenRequest = axios.create({
  baseURL: `${BASE_URL}/auth`,
});

const logoutRequest = axios.create({
  baseURL: `${BASE_URL}/auth`,
  headers: {
    Shabtay: `shalem`,
  },
});

const userController = axios.create({
  baseURL: `${BASE_URL}/api/users`,
});

const jobsController = axios.create({
  baseURL: `${BASE_URL}/api/jobs`,
});

export { jwtAuthController, refreshJwtTokenRequest, logoutRequest, userController, jobsController };
