import Credentials from "./credentials.js";

const AVATAR = document.querySelector("#avatar");
const USER = document.querySelector("#user");
const INFO = document.querySelector("#info");
const FOOTER = document.querySelector("#footer");
const REFRESH = document.querySelector("#refresh");

REFRESH.addEventListener("click", refreshToken);

const PARAMS = new URL(window.location.href.replace(/#/g, "?"));

// Check for token stored in localStorage while it's not a redirect from Spotify
if (window.localStorage.getItem("TwitchAccessToken") && !PARAMS.searchParams.get("access_token")) {
	processUser(window.localStorage.getItem("TwitchAccessToken"));
}

if (PARAMS.searchParams.get("access_token")) {
	const ACCESS_TOKEN = PARAMS.searchParams.get("access_token");
	const REFRESH_TOKEN = PARAMS.searchParams.get("refresh_token");
	// This removes the params from the URL
	window.history.replaceState({}, document.title, window.location.pathname);

	// We could store this token on localStorage
	window.localStorage.setItem("TwitchAccessToken", ACCESS_TOKEN);
	window.localStorage.setItem("TwitchRefreshToken", REFRESH_TOKEN);
	// Do something with the token
	processUser(ACCESS_TOKEN);
}

function processUser(token) {
	getUser(token)
		.then((user) => {
			if (user.profile_image_url) {
				AVATAR.setAttribute("src", user.profile_image_url);
			}
			USER.innerText = user.display_name;
			INFO.innerText = user.description;
			FOOTER.innerText = `Login: ${user.login}`;
		})
		.catch((error) => {
			console.log(error);
		});
}

async function getUser(token) {
	return new Promise((resolve, reject) => {
		fetch("https://api.twitch.tv/helix/users", {
			headers: {
				"Authorization": `Bearer ${token}`,
				"Client-Id": Credentials.CLIENT_ID
			}
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					reject(response.status);
					return;
				}
			})
			.then((data) => {
				if (data && data.data) {
					resolve({
						login: data.data[0].login,
						display_name: data.data[0].display_name,
						description: data.data[0].description,
						profile_image_url: data.data[0].profile_image_url
					});
				} else {
					reject();
				}
			})
			.catch((error) => {
				console.log(error);
				reject(error);
			});
	});
}

function refreshToken() {
	fetch("/api/twitch/refresh", {
		method: "POST",
		body: JSON.stringify({
			refresh_token: window.localStorage.getItem("TwitchRefreshToken")
		})
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			window.localStorage.setItem("TwitchAccessToken", data.access_token);
			window.localStorage.setItem("TwitchRefreshToken", data.refresh_token);
		})
		.catch((error) => {
			console.log(error);
		});
}
