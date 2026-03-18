/**
 * App configuration for the Notify Me subscription form.
 *
 * Web3Forms: Get your access key at https://web3forms.com — enter your email
 * and they send the key to your inbox (no account signup). Submissions are
 * delivered to that email. Put the key in web3formsAccessKey below.
 */
(function (global) {
  'use strict';

  var CONFIG = {
    /** Email address that receives Notify Me form submissions (for reference; delivery is tied to your Web3Forms key). */
    signupEmail: 'signups@jasonmelendez.com',

    /**
     * Web3Forms access key. Get one at https://web3forms.com (enter email, they send the key).
     * Leave empty to disable form submission until you add it.
     */
    web3formsAccessKey: '97857a74-44e4-497f-b7ed-b8656663927f'
  };

  global.APP_CONFIG = CONFIG;
})(typeof window !== 'undefined' ? window : this);
