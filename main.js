import { UserManager } from "https://cdn.skypack.dev/oidc-client-ts";

const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_yC2rfcpje",
    client_id: "2l39pn13rfbasb0ht89i2fhpvq",
    redirect_uri: "https://harvestingheroes.com/",  // your site domain
    response_type: "code",
    scope: "email openid phone"
};

export const userManager = new UserManager({
    ...cognitoAuthConfig
});

export async function signOutRedirect () {
    const clientId = "2l39pn13rfbasb0ht89i2fhpvq";
    const logoutUri = "https://harvestingheroes.com/";
    const cognitoDomain = "https://us-east-1yc2rfcpje.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
}

