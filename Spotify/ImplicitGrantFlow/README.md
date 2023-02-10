# Spotify - Implicit Grant Flow

Set your own Client ID and PORT in `js/credentials.example.js` and save the file as `js/credentials.js`

Notice that setting the `href` for the Login link using JavaScript isn't necessary but just something I'm doing to not distribute the Client ID with this repo. (Even when they can be public)

The link has `show_dialog` set to `true` so we see the Spotify Prompt each time. Notice that if we remove this and the user previously authorized our application, it will be automatically redirected back to our application.

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

For this example after login we are redirected back to the main page, but we could redirect to a different page if we so desire.

Using JavaScript we will detect when a user comes from the authorization and use the token to get their username and profile image.
