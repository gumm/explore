goog.provide('exp.userUrls');

goog.require('exp.routes.user');
goog.require('exp.urlMap');

exp.userUrls = function(app) {

    var route = exp.routes.user;

    // Auto Login
    app.get(    exp.urlMap.AUTO_LOGIN,          route.autoLogin);

    // Intro pages
    app.get(    exp.urlMap.INTRO,               route.intro);

    // Persistent elements
    app.get(    exp.urlMap.HEADER,              route.header);
    app.post(   exp.urlMap.LOGOUT,              route.header);

    // Login
    app.get(    exp.urlMap.LOGIN,               route.login);
    app.post(   exp.urlMap.LOGIN,               route.login);

    //------------------------------------------------------------[ Password ]--

    // Password Management
    app.get(    exp.urlMap.PW.LOST,             route.lostPassword);
    app.post(   exp.urlMap.PW.LOST,             route.lostPassword);

    // Reset Password
    app.get(    exp.urlMap.PW.RESET,            route.resetPassword);
    app.post(   exp.urlMap.PW.RESET,            route.resetPassword);

    // Password Editing
    app.get(    exp.urlMap.PW.EDIT,             route.editPassword);
    app.post(   exp.urlMap.PW.EDIT,             route.editPassword);

    //-------------------------------------------------------------[ Account ]--

    /** Create */
    app.get(    exp.urlMap.ACCOUNTS.CREATE,     route.signUp);
    app.post(   exp.urlMap.ACCOUNTS.CREATE,     route.signUp);

    /** Read */
    app.get(    exp.urlMap.ACCOUNTS.READ,       route.readProfile);

    /** Update */
    app.get(    exp.urlMap.ACCOUNTS.UPDATE,     route.editProfile);
    app.post(   exp.urlMap.ACCOUNTS.UPDATE,     route.editProfile);

    /** Delete */
    app.get(    exp.urlMap.ACCOUNTS.DELETE,     route.deleteAccount);
    app.post(   exp.urlMap.ACCOUNTS.DELETE,     route.deleteAccount);
};
