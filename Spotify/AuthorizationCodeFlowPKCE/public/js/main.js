import Credentials from "./credentials.js";
import { generateRandomString, generateCodeChallenge } from "./utils.js";
const LOGIN = document.querySelector("#login");

const AVATAR = document.querySelector("#avatar");
const USER = document.querySelector("#user");
const INFO = document.querySelector("#info");
const FOOTER = document.querySelector("#footer");

const CLIENT_ID = Credentials.CLIENT_ID;
const REDIRECT_URI = `http://localhost:${Credentials.PORT}`;
const CODE_VERIFIER = window.sessionStorage.getItem("code_verifier") || generateRandomString(64);
const CODE_CHALLENGE = await generateCodeChallenge(CODE_VERIFIER);
const SCOPES = "user-read-private";

window.sessionStorage.setItem("code_verifier", CODE_VERIFIER);

let LINK_URL = "https://accounts.spotify.com/authorize";
LINK_URL += "?response_type=code";
LINK_URL += "&show_dialog=true";
LINK_URL += "&client_id=" + encodeURIComponent(CLIENT_ID);
LINK_URL += "&scope=" + encodeURIComponent(SCOPES);
LINK_URL += "&redirect_uri=" + encodeURIComponent(REDIRECT_URI);
LINK_URL += "&code_challenge=" + encodeURIComponent(CODE_CHALLENGE);
LINK_URL += "&code_challenge_method=" + encodeURIComponent("S256");

LOGIN.setAttribute("href", LINK_URL);

const PARAMS = new URL(window.location.href.replace(/#/g, "?"));

// Check for token stored in localStorage while it's not a redirect from Spotify
if (window.localStorage.getItem("SpotifyAccessToken") && !PARAMS.searchParams.get("access_token")) {
	getUser(window.localStorage.getItem("SpotifyAccessToken"));
}

if (PARAMS.searchParams.get("code")) {
	const SESSION_CODE_VERIFIER = window.sessionStorage.getItem("code_verifier");
	const CODE = PARAMS.searchParams.get("code");

	// This removes the params from the URL
	window.history.replaceState({}, document.title, window.location.pathname);

	fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
		},
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			grant_type: "authorization_code",
			code: CODE,
			redirect_uri: REDIRECT_URI,
			code_verifier: SESSION_CODE_VERIFIER
		})
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			window.sessionStorage.removeItem("code_verifier");
			const ACCESS_TOKEN = data.access_token;
			const REFRESH_TOKEN = data.refresh_token;
			// We could store this token on localStorage
			window.localStorage.setItem("SpotifyAccessToken", ACCESS_TOKEN);
			window.localStorage.setItem("SpotifyRefreshToken", REFRESH_TOKEN);
			// Do something with the token
			getUser(ACCESS_TOKEN);
		})
		.catch((error) => {
			console.log(error);
		});
}

function getUser(token) {
	fetch("https://api.spotify.com/v1/me", {
		method: "get",
		headers: {
			"Authorization": "Bearer " + token
		},
		json: true
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.error) {
				console.log("Token expired");
			} else {
				console.log(data);
				if (data.images[0]) {
					AVATAR.setAttribute("src", data.images[0].url);
				}
				USER.innerText = data.display_name;
				INFO.innerHTML = `<a target="_blank" href="${data.external_urls.spotify}">Profile</a>`;
				FOOTER.innerText = `Country: ${data.country}`;
			}
		})
		.catch((error) => {
			console.log(error);
		});
}
