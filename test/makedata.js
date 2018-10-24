//import axios from 'axios'
let axios = require('../node_modules/axios')

const fetchMethod = (_config) => {
  return new Promise((resolve, reject) => {
    axios(_config)
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error);
      })
  })
};

let fetchApi = (url, fetchType, bodyParams) => {
  config = {
    data: bodyParams,
    method: fetchType,
    headers: {
      "url": url,
      "Content-Type": "application/json"
    }
  };
  return fetchMethod(config);
}

let token = "96436c1dc58546589410bc98da01e8e1";
let getFront = "http://172.16.2.8:8989/JiFu_Project/work/baseSaveFront"

fetchApi(getFront, "post", {token}).then(res => {
  console.log(res);
})
