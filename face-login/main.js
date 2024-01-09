const tokenServerURL= import.meta.env.VITE_TOKEN_SERVER_URL
let onBoarding;
let response;
const container = document.getElementById("container");

function showError(e=null) {
  container.innerHTML = "<h1>Something Went Wrong, see console for details</h1>";
  console.dir(e)
}

function identifyUser(){
  onBoarding.renderLogin(container,{
    onSuccess: async (response) => {
      const {token, transactionId, interviewToken, faceMatch, customerId, email} = response;
      if (faceMatch){
        // User has an Incode Identity.
        // Validate using your backend that the faceMatch was actually valid and not man in the middle attack
        const response = await fetch(`${tokenServerURL}/auth`,
          {
          method: "POST",
          mode: "cors", 
          body: JSON.stringify({token,transactionId: transactionId, interviewToken})
          }
        );
        const authAttempt = await response.json();
        if(authAttempt.verified===true){
          finish(customerId, email);
        } else {
          showError(new Error("FaceMatch is invalid."));
        }
      } else {
        showError(new Error("Face did not match any user."));
      }
    },
    onError: error => {
      showError(error)
      // User not found. Add rejection your logic here
    },
  });
}

function finish(customerId, email) {
  container.innerHTML = `<h1>Sucessfull Login:</h1>\n<p>CustomerId: ${customerId}</p>\n<p>Email: ${email}</p>`;
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
    showError(e);
  }
}

document.addEventListener("DOMContentLoaded", app);
