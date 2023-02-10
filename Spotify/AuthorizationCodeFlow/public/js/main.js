import Credentials from "./credentials.js";

const AVATAR = document.querySelector("#avatar");
const USER = document.querySelector("#user");
const INFO = document.querySelector("#info");
const FOOTER = document.querySelector("#footer");

const PARAMS = new URL(window.location.href.replace(/#/g, "?"));

// Check for token stored in localStorage while it's not a redirect from Spotify
if (window.localStorage.getItem("SpotifyAccessToken") && !PARAMS.searchParams.get("access_token")) {
	getUser(window.localStorage.getItem("SpotifyAccessToken"));
}

if (PARAMS.searchParams.get("access_token")) {
	const ACCESS_TOKEN = PARAMS.searchParams.get("access_token");
	const REFRESH_TOKEN = PARAMS.searchParams.get("refresh_token");
	// This removes the params from the URL
	window.history.replaceState({}, document.title, window.location.pathname);

	// We could store this token on localStorage
	window.localStorage.setItem("SpotifyAccessToken", ACCESS_TOKEN);
	window.localStorage.setItem("SpotifyRefreshToken", REFRESH_TOKEN);
	// Do something with the token
	getUser(ACCESS_TOKEN);
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
