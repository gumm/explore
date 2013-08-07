goog.provide('exp.userUrls');

goog.require('exp.routes.user');
goog.require('exp.urlMap');

exp.userUrls = function(app) {

    var route = exp.routes.user;

    // Auto Login
    app.get(exp.urlMap.AUTO_LOGIN, route.autoLogin);

    // Intro pages
    app.get(exp.urlMap.INTRO, route.intro);

    // Persistent elements
    app.get(exp.urlMap.HEADER, route.header);
    app.post(exp.urlMap.LOGOUT, route.header);

    // Login
    app.get(exp.urlMap.LOGIN, route.login);
    app.post(exp.urlMap.LOGIN, route.login);
    app.get(exp.urlMap.LOGIN_HEADER, route.loginHeader);

    // Account Creation
    app.get(exp.urlMap.SIGNUP, route.signUp);
    app.post(exp.urlMap.SIGNUP, route.signUp);

    // Password Management
    app.get(exp.urlMap.PW.LOST, route.lostPassword);
    app.post(exp.urlMap.PW.LOST, route.lostPassword);

    // Reset Password
    app.get(exp.urlMap.PW.RESET, route.resetPassword);
    app.post(exp.urlMap.PW.RESET, route.resetPassword);

    // Password Editing
    app.get(exp.urlMap.PW.EDIT, route.editPassword);
    app.post(exp.urlMap.PW.EDIT, route.editPassword);


    // Account Editing
    app.get(exp.urlMap.PROFILE.EDIT, route.editProfile);
    app.post(exp.urlMap.PROFILE.EDIT, route.editProfile);


    // Delete account
    app.get(exp.urlMap.ACCOUNTS.DELETE, route.deleteAccount);
    app.post(exp.urlMap.ACCOUNTS.DELETE, route.deleteAccount);

    // Print all accounts
    app.get(exp.urlMap.ACCOUNTS.LIST, route.accounts);
};
