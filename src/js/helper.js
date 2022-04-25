import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config';

//the timeout to compete with fetching
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//REFACTOR BOTH getJSON and sendJSON
export const AJAX = async function (url, uploadData = undefined) { //undefined by default
  try { 
//conditionally set the fetchPro variable (in case is a POST request) --> TERNARY OPERATOR
    const fetchPro = uploadData ? fetch(url, { //passing object of options
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', //tell the API that i'm sending JSON format data
      },
      body: JSON.stringify(uploadData), //content of request, should be in JSON format
    }) : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]); //note Promise.race
    const data = await res.json(); //await the data API send back

    //intercept and trhow an error (e.g. in case of wrong recipe ID)
    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`); //creating and throw the error
    }
//return the data. NOTE this is return of an async function, so a promise
    return data; 
  } catch (err) {
    throw err; //re-throw the error to be handled in model.js
  }
} //prettier-ignore

/* old separated helper function to GET or POST json
//getJSON helper function
export const getJSON = async function (url) { //passing a generic url, reusable function
  try { //note Promise.race
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]); //fetch generic url
    const data = await res.json();

    //intercept and trhow an error (e.g. in case of wrong recipe ID)
    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`); //creating and throw the error
    }
//return the data. NOTE this is return of an async function, so a promise
    return data; 
  } catch (err) {
    throw err; //re-throw the error to be handled in model.js
  }
} //prettier-ignore

////////
///////

//sendJSON helper function, to UPLOAD
export const sendJSON = async function (url, uploadData) { //passing a generic url, reusable function
  try { //note Promise.race
    const fetchPro = fetch(url, { //passing object of options
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' //tell the API that i'm sending JSON format data
      },
      body: JSON.stringify(uploadData) //content of request, should be in JSON format
    })

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]); 
    const data = await res.json(); //await the data API send back

    //intercept and trhow an error (e.g. in case of wrong recipe ID)
    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`); //creating and throw the error
    }
//return the data. NOTE this is return of an async function, so a promise
    return data; 
  } catch (err) {
    throw err; //re-throw the error to be handled in model.js
  }
} //prettier-ignore

*/
