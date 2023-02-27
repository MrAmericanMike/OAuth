function handler(req, res) {
	const { refresh_token } = JSON.parse(req.body);
	if (!refresh_token) {
		return res.status(400).json({
			error: "No refresh token"
		});
	}

	fetch("https://id.twitch.tv/oauth2/token", {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded;charset=utf-8"
		},
		body: new URLSearchParams({
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			grant_type: "refresh_token",
			refresh_token: refresh_token
		})
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			return res.json(data);
		})
		.catch((error) => {
			return res.status(400).json({
				error: error
			});
		});
}

export default handler;
