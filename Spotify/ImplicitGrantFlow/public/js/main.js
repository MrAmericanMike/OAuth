import Credentials from "./credentials.js";
import { generateRandomString } from "./utils.js";
const LOGIN = document.querySelector("#login");

const AVATAR = document.querySelector("#avatar");
const USER = document.querySelector("#user");
const INFO = document.querySelector("#info");
const FOOTER = document.querySelector("#footer");

const CLIENT_ID = Credentials.CLIENT_ID;
const REDIRECT_URI = `http://localhost:${Credentials.PORT}`;
const STATE = generateRandomString(16);
const SCOPES = "user-read-private";

let LINK_URL = "https://accounts.spotify.com/authorize";
LINK_URL += "?response_type=token";
LINK_URL += "&show_dialog=true";
LINK_URL += "&client_id=" + encodeURIComponent(CLIENT_ID);
LINK_URL += "&scope=" + encodeURIComponent(SCOPES);
LINK_URL += "&redirect_uri=" + encodeURIComponent(REDIRECT_URI);
LINK_URL += "&state=" + encodeURIComponent(STATE);

LOGIN.setAttribute("href", LINK_URL);

const PARAMS = new URL(window.location.href.replace(/#/g, "?"));

// Check for token stored in localStorage while it's not a redirect from Spotify
if (window.localStorage.getItem("SpotifyAccessToken") && !PARAMS.searchParams.get("access_token")) {
	getUser(window.localStorage.getItem("SpotifyAccessToken"));
}

if (PARAMS.searchParams.get("access_token")) {
	const TOKEN = PARAMS.searchParams.get("access_token");
	const STATE = PARAMS.searchParams.get("state");
	const LOCAL_STATE = window.localStorage.getItem("SpotifyState");
	// This removed the params from the URL
	window.history.replaceState({}, document.title, window.location.pathname);

	if (STATE === LOCAL_STATE) {
		window.localStorage.removeItem("SpotifyState");
		// We could store this token on localStorage
		window.localStorage.setItem("SpotifyAccessToken", TOKEN);
		// Do something with the token
		getUser(TOKEN);
	}
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

localStorage.setItem("SpotifyState", STATE);
