# Vite Web SDK example
This examples runs the basic create session -> frontId -> backID -> processId -> Selfie -> faceMatch -> getFinishStatus flow, the code is simple enough to insert or remove any step
for testing or creating proof of concepts.

# Requirements
Vite requires Node.js version 14.18+, 16+. some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

# Install
Run `npm install`
# Config
Copy `.env.example` to `.env.local` and add your local values
```
VITE_API_URL=https://demo-api.incodesmile.com
VITE_SDK_URL=https://sdk.incode.com/sdk/onBoarding-1.60.0.js
VITE_CLIENT_ID=
VITE_FLOW_ID=
```
Remember the Flow holds the backend counter part of the process, some configurations there might affect the behavior of the WebSDK here.

# Run
Vite is configured to serve the project using https and and expose him self, so you can easily test with your mobile phone on the local network.

run `npm run dev`

A new server will be exposed, the data will be in the terminal

# Build
run `npm run build`

A new build will be created in `/dist` you can serve that build everywhere just remember to serve with https.

# Testing especific versions locally
You can save the specific version needed under `/public` and change the `VITE_SDK_URL` variable on `.env.local` to something like:

```
VITE_SDK_URL=/name-of-the-js-file.js
```

