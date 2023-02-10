export default function handler(req, res) {
	const CODE = req.query.code || null;
	const STATE = req.query.state || null;
	const STORED_STATE = req.cookies ? req.cookies["spotify_auth_state"] : null;

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

	res.setHeader("Set-Cookie", [`spotify_auth_state=null; HttpOnly; Secure; Max-Age=0`]);

	const REFERER = Buffer.from(STATE, "base64").toString("ascii").slice(16);

	fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			"Authorization": "Basic " + new Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")
		},
		body: new URLSearchParams({
			code: CODE,
			redirect_uri: process.env.REDIRECT_URI,
			grant_type: "authorization_code"
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
