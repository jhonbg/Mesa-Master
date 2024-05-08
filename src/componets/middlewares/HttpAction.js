import axios from "axios";
import { generalEvent } from "../events/general.event";

// axios instance for making requests
const HttpAction = axios.create();

const requestHandler = (request) => {
  // add token to request headers
  generalEvent.emit("shield-on", {});
  // request.headers["Access-Control-Allow-Origin"] = "*";
  request.headers["Content-Type"] = `application/json`;
  request.headers["X-Requested-With"] = `XMLHttpRequest`;
  return request;
};

const responseHandler = (response) => {
  // if (response.status === 401) {
  //   localStorage.removeItem("token");
  //   window.location = "/login";
  // }
  generalEvent.emit("shield-off", {});
  return response;
};

const errorHandler = (error) => {
  if (error.response) {
    responseHandler(error.response);
  }
  // return Promise.reject(error);
  console.log(error);
  generalEvent.emit("shield-off", {});
  throw axios.error;
};

// Request interceptor
HttpAction.interceptors.request.use(
  (request) => {
    requestHandler(request);
    return request;
  },
  (err) => {
    errorHandler(err);
  }
);

// Response interceptor
HttpAction.interceptors.response.use(
  (response) => {
    responseHandler(response);
    return response;
  },
  (err) => {
    errorHandler(err);
  }
);

export default HttpAction;
