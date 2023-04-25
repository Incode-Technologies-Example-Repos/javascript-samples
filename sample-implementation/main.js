import "./styles.css";
import sessionMock from './session-mock.js'; 
let incode;
let session;

const container = document.querySelector("#incode-container");

function initializeIncodeSDK() {
  return window.OnBoarding.create({
    apiURL: import.meta.env.VITE_SDK_ENDPOINT,
  });
}

function createIncodeSession() {
  //emulate backend request
  return sessionMock;
}

function captureIdFrontSide() {
  incode.renderCamera("front", container, {
    onSuccess: captureIdBackSide,
    onError: console.log,
    token: session,
    numberOfTries: 3,
    showTutorial: true,
    showCustomCameraPermissionScreen: true,
  });
}

function captureIdBackSide() {
  incode.renderCamera("back", container, {
    onSuccess: processId,
    onError: console.log,
    token: session,
    numberOfTries: 3,
    showTutorial: true,
    showCustomCameraPermissionScreen: true,
  });
}

function processId() {
  return incode
    .processId({ token: session.token })
    .then(() => {
      captureSelfie();
    })
    .catch((error) => {
      console.log(error);
    });
}

function captureSelfie() {
  incode.renderCamera("selfie", container, {
    onSuccess: finishOnboarding,
    onError: console.log,
    token: session,
    numberOfTries: 3,
    showCustomCameraPermissionScreen: true,
  });
}

//add then & catch
function finishOnboarding() {
  incode
    .getFinishStatus(null, { token: session.token })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function app() {
  incode = initializeIncodeSDK();
  session = await createIncodeSession();
  await incode.sendGeolocation({ token: session.token }).catch((error) => {
    console.log(error);
  });

  captureIdFrontSide();
}

document.addEventListener("DOMContentLoaded", app);
