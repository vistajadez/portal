/**
 * Notify Me subscription form: submits via Web3Forms API to send signups to your email.
 * Depends: APP_CONFIG (config.js), jQuery, Bootstrap modal.
 */
(function (global) {
  'use strict';

  var $ = global.jQuery;
  var config = global.APP_CONFIG;

  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  if (!config) {
    console.warn('notify-form: APP_CONFIG not found. Subscription form will not submit.');
    return;
  }

  var SELECTORS = {
    modal: '#subscribeModal',
    form: '#subscribeModal form',
    emailInput: '#subscribeModal input[name="email"]',
    submitBtn: '#subscribeModal button[type="submit"]'
  };

  /** Regex for basic email validation (local@domain.tld). */
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Returns true if the string looks like a valid email address.
   * @param {string} value
   * @returns {boolean}
   */
  function isValidEmail(value) {
    if (typeof value !== 'string') return false;
    var trimmed = value.trim();
    return trimmed.length > 0 && EMAIL_REGEX.test(trimmed);
  }

  /**
   * Submits the subscription email to Web3Forms; they send the notification to your email.
   * @param {string} subscriberEmail - The email address that subscribed
   * @returns {Promise<{ ok: boolean, message: string }>}
   */
  function submitSignup(subscriberEmail) {
    var accessKey = config.web3formsAccessKey;
    if (!accessKey || typeof accessKey !== 'string' || !accessKey.trim()) {
      return Promise.resolve({
        ok: false,
        message: 'Form is not configured. Add your Web3Forms access key in scripts/config.js.'
      });
    }

    var body = {
      access_key: accessKey.trim(),
      email: subscriberEmail,
      subject: 'Author Portal – Notify Me signup'
    };

    return fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (res.ok && data.success) {
            return { ok: true, message: data.body && data.body.message ? data.body.message : 'Thanks for subscribing, and welcome to the reader community!' };
          }
          return { ok: false, message: (data && (data.message || data.error)) || 'Subscription request failed.' };
        }).catch(function () {
          return { ok: false, message: res.ok ? 'Thanks! You\'re on the list.' : 'Subscription request failed.' };
        });
      })
      .catch(function () {
        return { ok: false, message: 'Network error. Please try again.' };
      });
  }

  /**
   * Shows a message in the modal (success or error). On success, hides the form and shows a clear success view.
   * @param {string} message
   * @param {boolean} isSuccess
   */
  function showModalMessage(message, isSuccess) {
    var $modal = $(SELECTORS.modal);
    var $content = $modal.find('.modal-content');
    var $form = $modal.find('form');
    var $body = $modal.find('.modal-body');
    $modal.find('.notify-form-message').remove();

    if (isSuccess) {
      $form.hide();
      var successTitle = $modal.find('.modal-title');
      var originalTitle = successTitle.data('original-title');
      if (originalTitle === undefined) {
        successTitle.data('original-title', successTitle.text());
      }
      successTitle.text("You're on the list!");
      var $msg = $('<div class="notify-form-message notify-form-success"></div>')
        .addClass('text-success')
        .css({ padding: '1rem', fontSize: '1.1rem' });
      $msg.append($('<p class="mb-0"></p>').text(message));
      $content.append($msg);
    } else {
      $form.show();
      var $msg = $('<div class="notify-form-message text-danger"></div>')
        .css({ padding: '0 0 0.5rem', fontSize: '0.95rem' })
        .text(message);
      $body.prepend($msg);
    }
  }

  /**
   * Resets modal to show the form and clear message (e.g. when modal is opened again).
   */
  function resetModalForm() {
    var $modal = $(SELECTORS.modal);
    $modal.find('form').show().get(0).reset();
    $modal.find('.notify-form-message').remove();
    $modal.find(SELECTORS.submitBtn).prop('disabled', false).text('Subscribe');
    var $title = $modal.find('.modal-title');
    if ($title.data('original-title')) {
      $title.text($title.data('original-title'));
    }
  }

  /**
   * Binds submit handler to the subscription form.
   */
  function init() {
    var $form = $(SELECTORS.form);
    if (!$form.length) return;

    $form.on('submit', function (e) {
      e.preventDefault();
      var raw = $(SELECTORS.emailInput).val();
      var email = typeof raw === 'string' ? raw.trim() : '';
      if (!email) {
        showModalMessage('Please enter your email address.', false);
        return;
      }
      if (!isValidEmail(email)) {
        showModalMessage('Please enter a valid email address.', false);
        return;
      }

      var $btn = $(SELECTORS.submitBtn);
      $btn.prop('disabled', true).text('Sending…');

      submitSignup(email).then(function (result) {
        $btn.prop('disabled', false).text('Subscribe');
        showModalMessage(result.message, result.ok);
      });
    });

    $(SELECTORS.modal).on('hidden.bs.modal', resetModalForm);
  }

  global.NotifyForm = { init: init };
})(typeof window !== 'undefined' ? window : this);
