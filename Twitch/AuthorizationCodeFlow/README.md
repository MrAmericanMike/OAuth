# Twitch - Authorization Code Flow

Set your own Client ID, Client Secret, Redirect URI and PORT in `.env.example` and save the file as `.env`

```
CLIENT_ID=<client_id here>
CLIENT_SECRET=<client_secret here>
REDIRECT_URI=http://localhost:3000/api/twitch/callback
PORT=3000
```

The link has `force_verify` set to `true` so we see the Twitch Prompt each time. Notice that if we remove this and the user previously authorized our application, it will be automatically redirected back to our application.

From within this folder:

```sh
vercel dev
```

To use a different PORT use:

```sh
vercel dev -l 8888
```

Connect to a new Vercel project.
Select your scope.
Name your project.
Leave the default for directory for the code.
Do not modify the settings when prompted.
Visit http://localhost:3000 on your browser.

In this case the Login link hits our API endpoint and the server takes care to redirect the user to Twitch. The server sets a `state` and stores it as a cookie also, so when Twitch redirects the user back to our application we can compare the values. At the same time (and this may be hacky) we are appending the page the user came from, so at the end we can send him back right where he came from (In this case we only have a main page, but it may be handy under some circumstances)

Using JavaScript we will detect when a user comes from the authorization and use the token to get their username and profile image.
