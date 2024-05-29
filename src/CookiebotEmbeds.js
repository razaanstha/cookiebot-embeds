/**
 * CookiebotEmbeds Class
 * --------------------------------
 *
 * This class provides a solution for integrating Cookiebot consent management in a web environment,
 * specifically targeting the handling of preferences, statistics and marketing cookies for embedded content like YouTube emebds and different other sources.
 * It's designed to be a part of a larger system for managing user consents in compliance with GDPR and similar regulations.
 * @class CookiebotEmbeds
 */
class CookiebotEmbeds {
  /**
   * Creates an instance of CookiebotEmbeds.
   * @param {Object} [customConfig={}] - Custom configuration object for the CookiebotEmbeds.
   * @param {boolean} [customConfig.showSourceURL=true] - Determines if the source URL should be shown.
   * @param {Object} [customConfig.headingText] - Text for various headings based on content type.
   * @param {string} [customConfig.headingText.default="Enable [REQUIRED_COOKIES] cookies on Cookiebot settings to view this content."] - Default heading text.
   * @param {string} [customConfig.headingText.youtube="To play this video, please enable marketing cookies required by YouTube."] - YouTube-specific heading text.
   * @param {Object} [customConfig.cookieCategoriesTitle] - Text for various cookie categories.
   * @param {string} [customConfig.cookieCategoriesTitle.preferences="Preferences"] - Text for the preferences cookie category.
   * @param {string} [customConfig.cookieCategoriesTitle.statistics="Statistics"] - Text for the statistics cookie category.
   * @param {string} [customConfig.cookieCategoriesTitle.marketing="Marketing"] - Text for the marketing cookie category.
   * @param {string} [customConfig.acceptButtonText="Accept required cookies"] - Text for the accept required cookies button.
   * @param {string} [customConfig.openCookiebotSettingsButtonText="Open Cookiebot Settings"] - Text for the button to open Cookiebot settings.
   * @param {string} [customConfig.background="rgba(0, 0, 0, 0.7)"] - Background color.
   * @param {string} [customConfig.textColor="white"] - Text color.
   * @param {string} [customConfig.buttonBackgroundColor="#88b364"] - Background color of the button.
   * @param {string} [customConfig.buttonBackgroundColorHover="#6e9e4f"] - Hover background color of the button.
   * @param {string} [customConfig.gap="15px"] - Gap between elements.
   * @param {string} [customConfig.customCSS=""] - Additional custom CSS.
   */
  constructor(customConfig = {}) {
    // Default configuration
    const defaultConfig = {
      showSourceURL: true,
      headingText: {
        default: 'Enable [REQUIRED_COOKIES] cookies on Cookiebot settings to view this content.',
        youtube: 'To play this video, please enable marketing cookies required by YouTube.',
      },
      cookieCategoriesTitle: {
        preferences: 'Preferences',
        statistics: 'Statistics',
        marketing: 'Marketing',
      },
      acceptButtonText: 'Accept required cookies',
      openCookiebotSettingsButtonText: 'Open Cookiebot Settings',
      background: 'rgba(0, 0, 0, 0.7)',
      textColor: 'white',
      buttonBackgroundColor: '#88b364',
      buttonBackgroundColorHover: '#6e9e4f',
      buttonTextColor: 'white',
      gap: '15px',
      customCSS: '',
    };

    // Merge default and custom configuration provided by the user
    this.config = {
      ...defaultConfig,
      ...customConfig,
      headingText: {
        ...defaultConfig.headingText,
        ...customConfig.headingText,
      },
      cookieCategoriesTitle: {
        ...defaultConfig.cookieCategoriesTitle,
        ...customConfig.cookieCategoriesTitle,
      },
    };

    this.init();
  }

  /**
   * Initializes the library by checking cookie consent and setting up event listeners.
   */
  init() {
    this.checkConsentAndUpdateIframes();
    this.setupEventListeners();
  }

  /**
   * Checks the Cookiebot consent and updates iframes accordingly.
   */
  checkConsentAndUpdateIframes() {
    const that = this;

    // Check if Cookiebot is loaded properly and if marketing cookies are accepted more precisely
    if (
      typeof Cookiebot !== 'undefined' &&
      Cookiebot &&
      'consent' in Cookiebot &&
      Cookiebot.consent &&
      'preferences' in Cookiebot.consent &&
      'statistics' in Cookiebot.consent &&
      'marketing' in Cookiebot.consent
    ) {
      const marketingIframes = document.querySelectorAll('iframe[data-cookieconsent]');

      // Get all the required consents for the iframe
      const getNonConsentedCookieCategories = (requiredConsents) => {
        return requiredConsents.filter((consent) => !Cookiebot.consent[consent]);
      };

      marketingIframes.forEach((iframe) => {
        if (iframe.hasAttribute('data-cookieconsent')) {
          // Check if the iframe should be ignored and if so, skip it
          if (iframe.getAttribute('data-cookieconsent') == 'ignore') {
            return;
          }

          // Show an info on iframe to enable all the cookies to display the iframe
          const requiredConsents = getNonConsentedCookieCategories(
            iframe.getAttribute('data-cookieconsent').split(',')
          );

          const src =
            iframe.getAttribute('src') ||
            iframe.getAttribute('data-cookieblock-src') ||
            iframe.getAttribute('data-src');

          // Check if cookiebot has all the required consents enabled and if not, set the srcdoc attribute
          if (!requiredConsents.every((consent) => Cookiebot.consent[consent])) {
            iframe.setAttribute('srcdoc', that.createIframeSourceDocument(src, requiredConsents));

            setTimeout(() => {
              iframe.style.display = 'block';
            }, 150);
          }
        }
      });

      // Listen for Cookiebot onAccept event
      window.addEventListener('CookiebotOnAccept', function () {
        let unsettledIframes = 0;
        // Show an info on iframe to enable all the cookies to display the iframe
        marketingIframes.forEach((marketingIframe) => {
          const requiredConsents = getNonConsentedCookieCategories(
            marketingIframe.getAttribute('data-cookieconsent').split(',')
          );

          // Check if cookiebot has all the required consents enabled and if not, set the srcdoc attribute
          if (requiredConsents.every((consent) => Cookiebot.consent[consent])) {
            marketingIframe.removeAttribute('srcdoc');
          } else {
            unsettledIframes++;
          }
        });

        // If there are still iframes with unset srcdoc, listen for Cookiebot onAccept event again and check if all the iframes have srcdoc set
        if (unsettledIframes > 0) {
          that.checkConsentAndUpdateIframes();
        }
      });
    }
  }

  /**
   * Creates a source document for an iframe based on the provided source URL.
   * @param {string} source - The source URL for the iframe.
   * @param {string[]} requiredConsents - An array of required consents for the iframe.
   * @returns {string} HTML string representing the iframe source document.
   */
  createIframeSourceDocument(source, requiredConsents = []) {
    const cookiebotConsentConfig = this.config;
    if (!source) return '';

    // get the host name of the source without subdomain and use the
    let sourceHost = source;

    // Check if the source URL is valid else use the source URL as it is
    try {
      let sourceHost = new URL(source).hostname;
    } catch (error) {
      // console.error('Error parsing the source URL', error);
    }

    let sourceElement =
      cookiebotConsentConfig.showSourceURL && source
        ? `<a href="${source}" class="source" target="_blank" rel="nofollow noopener" aria-label="Open in new tab">${source}</a>`
        : '';

    let headline_text = cookiebotConsentConfig.headingText.default;

    // Check if the sourceHost contains any key from cookiebotConsentConfig
    Object.keys(cookiebotConsentConfig.headingText).some((key) => {
      if (sourceHost.includes(key)) {
        return (headline_text = cookiebotConsentConfig.headingText[key]);
      }
    });

    // Find and replace [REQUIRED_COOKIES] dynamic tags with requiredConsents
    if (headline_text && headline_text.includes('[REQUIRED_COOKIES]') && requiredConsents) {
      // Convert the requiredConsents array to a user provided string from the config
      let requiredConsentsFromConfig = requiredConsents.map(
        (consent) => cookiebotConsentConfig.cookieCategoriesTitle[consent]
      );

      headline_text = headline_text.replace(
        '[REQUIRED_COOKIES]',

        // add a comma after each required consent except the last one
        requiredConsents && requiredConsents.length > 1
          ? requiredConsentsFromConfig.join(', ').replace(/,(?=[^,]*$)/, ' &')
          : requiredConsentsFromConfig[0]
      );
    }

    return `<div role="dialog" aria-labelledby="cookiebot_marketing_required" id="info">
                <h1 id="cookiebot_marketing_required" class="heading">${headline_text}</h1>
                <div style="display: flex; flex-flow: row wrap; gap: calc(${cookiebotConsentConfig.gap} - (${cookiebotConsentConfig.gap} / 2)); justify-content: start;">
                    <a href="#accept_required_cookies" class="btn btn--accept-required-cookies">
                      ${cookiebotConsentConfig.acceptButtonText}
                    </a>
                    <a href="#open_cookiebot" class="btn btn--open-settings">${cookiebotConsentConfig.openCookiebotSettingsButtonText}</a>
                </div>
            </div>
            <div class="loading__overlay" aria-hidden="true">
              <svg class="loading__overlay--icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.72 19.9a8 8 0 0 1-6.5-9.79 7.77 7.77 0 0 1 6.18-5.95 8 8 0 0 1 9.49 6.52A1.54 1.54 0 0 0 21.38 12h.13a1.37 1.37 0 0 0 1.38-1.54 11 11 0 1 0-12.7 12.39A1.54 1.54 0 0 0 12 21.34a1.47 1.47 0 0 0-1.28-1.44Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
            </div>
            ${sourceElement}
            <style>
                * {
                  box-sizing: border-box;
                }

                html {
                    height: 100%;
                }
                
                body {
                  margin: 0;
                  width: 100%;
                  display: flex;
                  padding: 32px 12px;
                  justify-content: center;
                  align-items: center;
                  background-color: ${cookiebotConsentConfig.background};
                  color: ${cookiebotConsentConfig.textColor};
                  position: relative;
                  font-family: sans-serif;
                  font-weight: 400;
                  line-height: 1.34;
                }
    
                #info {
                  display: flex;
                  flex-direction: column;
                  gap: ${cookiebotConsentConfig.gap};
                  text-align: left;
                  max-width: 750px;
                  overflow: hidden;
                }
    
                a.source {
                  display: inline;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: 250px;
                  background: black;
                  font-size: 14px;
                  position: fixed;
                  top: 0;
                  left: 0;
                  padding: 5px 10px;
                  color: currentColor;
                  text-decoration: none;
                  opacity: .8;
                }
    
                a.source:hover,
                a.source:focus {
                  text-decoration: underline;
                }
    
                .btn {
                  text-decoration: none; 
                  display: inline-flex;
                  font-family: sans-serif;
                  padding: 8px 14px;
                  background: ${cookiebotConsentConfig.buttonBackgroundColor};
                  color: ${cookiebotConsentConfig.buttonTextColor};
                  transition: all 0.2s ease;
                  border: none;
                }
    
                .btn:hover {
                  background: ${cookiebotConsentConfig.buttonBackgroundColorHover};
                }

                .btn.btn--accept-required-cookies.loading {
                  cursor: wait;
                }
    
                .heading {
                  font-family: sans-serif;
                  margin: 0;
                  font-size: 18px;
                }
    
                @media screen and (min-width: 400px) {
                  body {
                    padding: 40px 30px 30px;
                    min-height: 100%;
                  }
                }

                @media screen and (min-width: 768px) {    
                  .btn {
                    padding: 12px 20px;
                  }
    
                  .heading {
                    font-size: 36px;
                  }
                }
  
                a.btn:focus-visible {
                  outline: 2px solid #005fcc;
                  background-color: #eef;
                  color: #005fcc;
                  transition: outline 0.3s ease, background-color 0.3s ease;
                }            

                .loading__overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  z-index: 999;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  opacity: 0;
                  visibility: hidden;
                  justify-content: center;
                  align-items: center;
                  transition: opacity 0.3s ease, visibility 0.3s ease;
                  background-color: ${cookiebotConsentConfig.background};
                  color: ${cookiebotConsentConfig.textColor};
                }

                .loading__overlay--icon {
                  width: 10vw;
                  height: 10vw;
                }

                .loading__overlay.loading {
                  opacity: 0.92;
                  visibility: visible;
                }
                
                ${cookiebotConsentConfig.customCSS}
            </style>
            <script>
              // Listen for all hash based anchor links
              var dialogOverlay = document.querySelector(".loading__overlay");
              var anchor = document.querySelectorAll('a:not(.source)[href^="#"]');

              if (anchor && anchor.length) {
                anchor.forEach((a) => {
                  // Add click event listener to all hash based anchor links
                  a.addEventListener("click", function (e) {
                    if (dialogOverlay.classList.contains("loading")) {
                      e.preventDefault();
                      return;
                    }

                    // Check if the anchor link is a cookiebot link
                    if (a.getAttribute("href") === "#open_cookiebot") {
                      e.preventDefault();
                      window.parent.Cookiebot.show();
                    }

                    // Check if the anchor link is about accepting required cookies
                    if (a.getAttribute("href") === "#accept_required_cookies") {
                      dialogOverlay.classList.add("loading");
                      e.preventDefault();

                      // Get the required consents from the iframe
                      var requiredConsents = "${requiredConsents}";
                      var optinPreferences = requiredConsents.includes("preferences") ? true : ${Cookiebot.consent.preferences};
                      var optinStatistics = requiredConsents.includes("statistics") ? true : ${Cookiebot.consent.statistics};
                      var optinMarketing =  requiredConsents.includes("marketing") ? true : ${Cookiebot.consent.marketing};

                      window.parent.Cookiebot.submitCustomConsent(
                          optinPreferences,
                          optinStatistics,
                          optinMarketing
                      );
                    }
                  });
                });
              }
            </script>
            `;
  }

  /**
   * Sets up various event listeners for handling Cookiebot events and iframe messages.
   */
  setupEventListeners() {
    window.addEventListener('CookiebotOnAccept', this.checkConsentAndUpdateIframes.bind(this));
    window.addEventListener('CookiebotOnDecline', this.checkConsentAndUpdateIframes.bind(this));

    window.addEventListener('popstate', this.checkConsentAndUpdateIframes.bind(this));
    window.addEventListener('load', this.onDocumentLoad.bind(this));
  }

  /**
   * Handles actions to be performed when the document is loaded.
   * This includes checking if Cookiebot is loaded and updating iframes.
   */
  onDocumentLoad() {
    // Check if Cookiebot is loaded
    if (typeof Cookiebot === 'undefined') {
      return console.warn('Cookiebot is not loaded. Please add the Cookiebot script to the page.');
    }

    this.checkConsentAndUpdateIframes();
  }
}

export default CookiebotEmbeds;
