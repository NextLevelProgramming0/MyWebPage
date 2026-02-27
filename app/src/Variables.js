// allow the base URL to be changed via an environment variable when the app is
// built for deployment.  The previous hard‑coded localhost address works during
// development but will always fail when the site is served from GitHub Pages or
// any other host that can't reach `127.0.0.1` on the user's machine.
//
// To override the value create an `.env` (or `.env.production`) file containing
// `REACT_APP_API_URL=https://your-production-api.example.com/` and rebuild the
// app.  The runtime code will fall back to localhost when the variable is not
// present, which keeps the development workflow unchanged.
const defaultApi = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/";

// browsers will block mixed‑content requests (https page → http endpoint) so
// warn the developer if the default value will certainly fail when the app is
// hosted over HTTPS.
if (window && window.location && window.location.protocol === 'https:' && defaultApi.startsWith('http://')) {
    console.warn(
        'Using insecure API_URL on a secure page; create/update requests may ' +
        'be blocked.  Set REACT_APP_API_URL to an https:// address when building.'
    );
}

export const variables = {
    API_URL: defaultApi,
    PHOTO_URL: process.env.REACT_APP_PHOTO_URL || "http://127.0.0.1:8000/Photos/"
}