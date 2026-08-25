const apiHost = window.location.hostname || '127.0.0.1';

export const variables = {
    API_URL: `http://${apiHost}:8000/`,
    PHOTO_URL: `http://${apiHost}:8000/Photos/`
}
