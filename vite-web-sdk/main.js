
// Lets put all the variables needed for all modules in the global scope
const tokenServerURL= import.meta.env.VITE_TOKEN_SERVER_URL;
const localServerUrl= import.meta.env.VITE_LOCAL_SERVER_URL;
let incode;
let session;
const container = document.getElementById("camera-container");

async function startOnboardingSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get('uuid');

  let sessionStartUrl = `${tokenServerURL}/start`
  if (uuid) sessionStartUrl +=`?uuid=${uuid}`;
  
  const response = await fetch(sessionStartUrl);
  if (!response.ok){
    const sessionData = await response.json();
    throw new Error(sessionData.error);
  }

  return await response.json();
}

function showError(e=null) {
  container.innerHTML = "<h1>There was an error</h1>";
  console.log(e.message)
}

function renderRedirectToMobile(){
  if (incode.isDesktop()) {
    incode.renderRedirectToMobile(container, {
      onSuccess: () => {
        finish();
      },
      session: session,
      url: `${localServerUrl}?uuid=${session.uuid}`
    });
  } else {
    renderFrontIDCamera();
  }
}

function renderFrontIDCamera() {
  incode.renderCamera("front", container, {
    onSuccess: renderBackIDCamera,
    onError: showError,
    token: session,
    numberOfTries: -1,
    noWait: true
  });
}

function renderBackIDCamera() {
  incode.renderCamera("back", container, {
    onSuccess: processID,
    onError: showError,
    token: session,
    numberOfTries: -1,
    noWait: true
  });
}

async function  processID() {
  const results = await incode.processId({
    token: session.token,
  });
  console.log("processId results", results);
  renderSelfieCamera();
}

function renderSelfieCamera() {
  incode.renderCamera("selfie", container, {
    onSuccess: faceMatch,
    onError: showError,
    token: session,
    numberOfTries: -1,
    noWait: true
  });
}
function faceMatch() {
  incode.renderFaceMatch(container, {
    onSuccess: finish,
    onError: showError,
    token: session,
    liveness: true,
    existingUser: false,
  });
}

function finish() {
  // Finishing the session works along with the configuration in the flow
  // webhooks and business rules are ran here.
  const response = incode.getFinishStatus(import.meta.env.VITE_FLOW_ID, session);
  console.log(response);

  const container = document.getElementById("finish-container");
  container.innerHTML = "<h1>Finished</h1>";
}

async function app() {
  try {
    // Create the instance of incode linked to a client
    const apiURL = import.meta.env.VITE_API_URL;
    const clientId = import.meta.env.VITE_CLIENT_ID;
    incode = window.OnBoarding.create({
      clientId: clientId,
      apiURL: apiURL,
      theme: {},
    });
    
    // Incode web_sdk need to preload some core component before being usable
    container.innerHTML = "<h1>Warming up...</h1>";
    await incode.warmup();
    
    // Create the single session
    container.innerHTML = "<h1>Creating session...</h1>";
    try {
      session = await startOnboardingSession();
    } catch(e) {
      showError(e);
      return;
    }
    // Empty the container and starting the flow
    container.innerHTML = "";
    renderRedirectToMobile();
  } catch (e) {
    console.dir(e);
    container.innerHTML = "<h1>Something Went Wrong</h1>";
    throw e;
  }
}

document.addEventListener("DOMContentLoaded", app);
