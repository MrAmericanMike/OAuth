export default function handler(req, res) {
	const CODE = req.query.code || null;
	const STATE = req.query.state || null;
	const STORED_STATE = req.cookies ? req.cookies["twitch_auth_state"] : null;

	if (STATE === null || STATE !== STORED_STATE) {
		return res.status(406).json({
			message: "Something went wrong with the state"
		});
	}

	if (CODE === null) {
		return res.status(406).json({
			message: "Something went wrong with the code"
		});
	}

	res.setHeader("Set-Cookie", [`twitch_auth_state=null; HttpOnly; Secure; Max-Age=0`]);

	const REFERER = Buffer.from(STATE, "base64").toString("ascii").slice(16);

	fetch("https://id.twitch.tv/oauth2/token", {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded;charset=utf-8"
		},
		body: new URLSearchParams({
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: CODE,
			grant_type: "authorization_code",
			redirect_uri: process.env.REDIRECT_URI
		})
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const ACCESS_TOKEN = data.access_token || null;
			const REFRESH_TOKEN = data.refresh_token || null;
			const EXPIRES_IN = data.expires_in || null;
			const TOKEN_TYPE = data.token_type || null;

			const PARAMS = new URLSearchParams({
				access_token: ACCESS_TOKEN,
				refresh_token: REFRESH_TOKEN,
				expires_in: EXPIRES_IN,
				token_type: TOKEN_TYPE
			}).toString();

			return res.redirect(`${REFERER}?${PARAMS}`);
		})
		.catch((error) => {
			return res.status(400).json({
				error: error
			});
		});
}
