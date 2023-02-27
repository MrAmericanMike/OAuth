# OAuth

> ## **All examples should be checked by experts and don't imply proper implementation**

Examples and implementation for different OAuth flows.

This repo is just as a reference and also as a practice on how to implement different authorization flows. I'm not expert whatsoever and my implementation may have many flaws.

Please feel free to contribute to the project by pointing out mistakes, errors, corrections, better documentation, etc.

Notice that the provided examples also have minimal to none error handling.

---

## Spotify

Pre-requisites:

-   Spotify APP Registered in the [Developers Dashboard](https://developer.spotify.com/dashboard/applications)
-   Client-ID (This is ok to be public)
-   Client-Secret (This is meant to be private and used only server side) Not all flows require it
-   On the Edit Settings for your App add `http://localhost:3000` and `http://localhost:3000/api/spotify/callback` to your Redirect URIs. (Don't forget to Save and adjust the port to fit your needs) We will be using [Vercel](https://vercel.com) to test locally and as a deployed application. When deployed add the corresponding URIs from the App Dashboard.

> ### Implicit Grant Flow

-   No server needed
-   No recommended this days

> Example in folder: `Spotify/ImplicitGrantFlow`

[OAuth Documentation](https://oauth.net/2/grant-types/implicit/)

[Spotify Documentation](https://developer.spotify.com/documentation/general/guides/authorization/implicit-grant/)

PS: Use [Authorization Code](https://oauth.net/2/grant-types/authorization-code/) with [PKCE](https://oauth.net/2/pkce/) instead.

---

> ### Authorization Code Flow

-   Server needed

> Example in folder: `Spotify/AuthorizationCodeFlow`

[OAuth Documentation](https://oauth.net/2/grant-types/authorization-code/)

[Spotify Documentation](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/)

---

> ### Authorization Code Flow PKCE

-   No server needed
-   Safer than Implicit Grant Flow

> Example in folder: `Spotify/AuthorizationCodeFlowPKCE`

[OAuth Documentation](https://oauth.net/2/pkce/)

[Spotify Documentation](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/)

---

> ### Authorization Code Flow PKCE (With Server) Example pending

---

## Twitch

Pre-requisites:

-   Twitch APP Registered in the [Developers Dashboard](https://dev.twitch.tv/console)
-   Client-ID (This is ok to be public)
-   Client-Secret (This is meant to be private and used only server side) Not all flows require it
-   On the Edit Settings for your App add `http://localhost:3000` and `http://localhost:3000/api/twitch/callback` to your Redirect URIs. (Don't forget to Save and adjust the port to fit your needs) We will be using [Vercel](https://vercel.com) to test locally and as a deployed application. When deployed add the corresponding URIs from the App Dashboard.
