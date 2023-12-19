
let onBoarding;
let response;
const container = document.getElementById("camera-container");

function showError(e=null) {
  container.innerHTML = "<h1>There was an error</h1>";
  console.log(e)
}

function identifyUser(){
  onBoarding.renderLogin(container,{
    onSuccess: response => {
      console.log(response);
      finish(response)
      // User has an Incode Identity. Add success your logic here
    },
    onError: error => {
      showError(error)
      // User not found. Add rejection your logic here
    },
  });
}

function finish(response) {
  const container = document.getElementById("finish-container");
  container.innerHTML = "<pre>"+JSON.stringify(response, undefined, 2);+"</pre>";
}

async function app() {
  try {
    // Create the instance of incode linked to a client
    const apiURL = import.meta.env.VITE_API_URL;
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const apiKey =import.meta.env.VITE_API_KEY;
    
    onBoarding = window.OnBoarding.create({clientId,apiURL,apiKey});
    
    // Incode web_sdk need to preload some core component before being usable
    container.innerHTML = "<h1>Warming up...</h1>";
    await onBoarding.warmup();
    
    // Empty the container and starting the flow
    container.innerHTML = "";
    identifyUser();
  } catch (e) {
    console.dir(e);
    container.innerHTML = "<h1>Something Went Wrong</h1>";
    throw e;
  }
}

document.addEventListener("DOMContentLoaded", app);
