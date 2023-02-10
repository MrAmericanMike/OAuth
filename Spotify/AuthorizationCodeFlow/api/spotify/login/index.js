export default function handler(req, res) {
	const REFERER = req.headers.referer || "";
	const SCOPES = "user-read-private";
	const STATE = Buffer.from(generateRandomString(16) + REFERER).toString("base64");

	const PARAMS = new URLSearchParams({
		response_type: "code",
		client_id: process.env.CLIENT_ID,
		redirect_uri: process.env.REDIRECT_URI,
		scope: SCOPES,
		show_dialog: true,
		state: STATE
	}).toString();

	res.setHeader("Set-Cookie", [`spotify_auth_state=${STATE}; HttpOnly; Secure;`]);
	return res.redirect(`https://accounts.spotify.com/authorize?${PARAMS}`);
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
