/**
 * CookiebotEmbeds Class
 * --------------------------------
 *
 * This class provides a solution for integrating Cookiebot consent management in a web environment,
 * specifically targeting the handling of marketing cookies for embedded content like YouTube videos.
 * It's designed to be a part of a larger system for managing user consents in compliance with GDPR and similar regulations.
 * @class
 */
class CookiebotEmbeds {
  /**
   * Creates an instance of CookiebotEmbeds.
   * @param {Object} [customConfig={}] - Custom configuration object for the CookiebotEmbeds.
   * @param {boolean} [customConfig.showSourceURL=true] - Determines if the source URL should be shown.
   * @param {Object} [customConfig.headingText] - Text for various headings based on content type.
   * @param {string} [customConfig.headingText.default="To access this content, please enable marketing cookies."] - Default heading text.
   * @param {string} [customConfig.headingText.youtube="To play this video, please enable marketing cookies required by YouTube."] - YouTube-specific heading text.
   * @param {string} [customConfig.acceptButtonText="Accept marketing cookies"] - Text for the accept cookies button.
   * @param {string} [customConfig.openCookiebotSettingsButtonText="Open Cookiebot Settings"] - Text for the button to open Cookiebot settings.
   * @param {string} [customConfig.background="rgba(0, 0, 0, 0.7)"] - Background color.
   * @param {string} [customConfig.textColor="white"] - Text color.
   * @param {string} [customConfig.buttonBackgroundColor="#88b364"] - Background color of the button.
   * @param {string} [customConfig.buttonBackgroundColorHover="#6e9e4f"] - Hover background color of the button.
   * @param {string} [customConfig.buttonTextColor="white"] - Text color of the button.
   * @param {string} [customConfig.gap="15px"] - Gap between elements.
   * @param {string} [customConfig.customCSS=""] - Additional custom CSS.
   */
  constructor(customConfig = {}) {
    // Default configuration
    this.config = {
      showSourceURL: true,
      headingText: {
        default: "To access this content, please enable marketing cookies.",
        youtube:
          "To play this video, please enable marketing cookies required by YouTube.",
      },
      acceptButtonText: "Accept marketing cookies",
      openCookiebotSettingsButtonText: "Open Cookiebot Settings",
      background: "rgba(0, 0, 0, 0.7)",
      textColor: "white",
      buttonBackgroundColor: "#88b364",
      buttonBackgroundColorHover: "#6e9e4f",
      buttonTextColor: "white",
      gap: "15px",
      customCSS: "",
      // Merge user-provided config
      ...customConfig,
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
    if (typeof Cookiebot !== "undefined" && !Cookiebot.consent.marketing) {
      let marketingIframes = document.querySelectorAll(
        "iframe.consent-frame, iframe.cookieconsent-optin-marketing, iframe[data-src*='youtube.com/embed'],[data-src*='youtube-nocookie.com/embed']"
      );
      marketingIframes.forEach((iframe) => {
        if (!iframe.hasAttribute("srcdoc")) {
          let src =
            iframe.getAttribute("src") ||
            iframe.getAttribute("data-cookieblock-src") ||
            iframe.getAttribute("data-src");

          iframe.srcdoc = this.createIframeSourceDocument(src);
          iframe.style.display = "block";
        }
      });

      // Listen for Cookiebot onAccept event
      window.addEventListener("CookiebotOnAccept", function (e) {
        // Check if marketing cookies are accepted
        if (Cookiebot.consent.marketing) {
          // Loop through all youtube embeds and remove the srcdoc attribute
          marketingIframes.forEach((marketingIframe) => {
            marketingIframe.removeAttribute("srcdoc");
          });
        }
      });
    }
  }

  /**
   * Creates a source document for an iframe based on the provided source URL.
   * @param {string} source - The source URL for the iframe.
   * @returns {string} HTML string representing the iframe source document.
   */
  createIframeSourceDocument(source) {
    const cookiebotConsentConfig = this.config;

    if (!source) return "";
    // get the host name of the source without subdomain
    let sourceHost = new URL(source).hostname;

    let sourceElement =
      cookiebotConsentConfig.showSourceURL && source
        ? `<a href="${source}" class="source" target="_blank" rel="nofollow noopener" aria-label="Open in new tab">${source}</a>`
        : "";
    let headline_text = cookiebotConsentConfig.headingText.default;

    // Check if the sourceHost contains any key from cookiebotConsentConfig
    Object.keys(cookiebotConsentConfig.headingText).some((key) => {
      if (sourceHost.includes(key)) {
        return (headline_text = cookiebotConsentConfig.headingText[key]);
      }
    });

    return `<div role="dialog" aria-labelledby="cookiebot_marketing_required" id="info">
              <h1 id="cookiebot_marketing_required" class="heading">${headline_text}</h1>
              <div style="display: flex; flex-flow: row wrap; gap: inherit; justify-content: start;">
                  <a href="#accept_marketing" class="btn">${cookiebotConsentConfig.acceptButtonText}</a>
                  <a href="#open_cookiebot" class="btn">${cookiebotConsentConfig.openCookiebotSettingsButtonText}</a>
              </div>
          </div>
          ${sourceElement}
          <style>
              html, body {
                  display: flex;
                  min-height: 100%;
              }
  
              body {
                  width: 100%;
                  margin: 32px 20px;
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
  
              .heading {
                font-family: sans-serif;
                margin: 0;
                font-size: 20px;
              }
  
              @media screen and (min-width: 768px) {
                body {
                  margin: 30px;
                }
  
                .btn {
                  padding: 12px 20px;
                }
  
                .heading {
                  font-size: 36px;
                }
              }

              a:focus-visible, button:focus-visible {
                outline: 2px solid #005fcc;
                background-color: #eef;
                color: #005fcc;
                transition: outline 0.3s ease, background-color 0.3s ease;
              }            
              
              ${cookiebotConsentConfig.customCSS}
          </style>
          <script>
          // Listen for all hash based anchor links
          var anchor = document.querySelectorAll('a:not(.source)[href^="#"]');
          if (anchor && anchor.length > 0) {
              anchor.forEach((a) => {
                  // Add click event listener to all hash based anchor links
                  a.addEventListener("click", function (e) {
                  // Check if the anchor link is a cookiebot link
                  if (a.getAttribute("href") === "#open_cookiebot") {
                      // Prevent default action
                      e.preventDefault();
                      // Inform parent window to open cookiebot popup
                      window.parent.postMessage("open_cookiebot", "*");
                  }
  
                  // Check if the anchor link is a marketing cookie link
                  if (a.getAttribute("href") === "#accept_marketing") {
                      // Inform parent window to accept marketing cookies
                      window.parent.postMessage("accept_marketing", "*");
                  }
                  });
              });
          }
          </script>`;
  }

  /**
   * Sets up various event listeners for handling Cookiebot events and iframe messages.
   */
  setupEventListeners() {
    const that = this;
    // Check for Cookiebot onAccept event and if marketing cookies are not accepted
    window.addEventListener("CookiebotOnAccept", function (e) {
      if (!Cookiebot.consent.marketing) {
        that.checkConsentAndUpdateIframes();
      }
    });

    // Check for Cookiebot onDecline event and if marketing cookies are not accepted
    window.addEventListener("CookiebotOnDecline", function (e) {
      if (!Cookiebot.consent.marketing) {
        that.checkConsentAndUpdateIframes();
      }
    });

    // When the user navigates back in history, check for consent and update marketing iframes
    window.addEventListener(
      "popstate",
      this.checkConsentAndUpdateIframes.bind(this)
    );

    // When the document is loaded, check for consent and update marketing iframes
    window.addEventListener("load", this.onDocumentLoad.bind(this));
  }

  /**
   * Handles actions to be performed when the document is loaded.
   * This includes checking if Cookiebot is loaded and updating iframes.
   */
  onDocumentLoad() {
    // Check if Cookiebot is loaded
    if (typeof Cookiebot === "undefined") {
      return console.warn(
        "Cookiebot is not loaded. Please add the Cookiebot script to the page."
      );
    }

    this.checkConsentAndUpdateIframes();
    window.addEventListener("message", this.handleIframeMessages.bind(this));
  }

  /**
   * Handles messages received from iframes, particularly those related to Cookiebot actions.
   * @param {Event} e - The event object containing the message data.
   */
  handleIframeMessages(e) {
    if (e.data === "open_cookiebot") {
      Cookiebot.show();
    }
    if (e.data === "accept_marketing") {
      Cookiebot.submitCustomConsent(
        Cookiebot.consent.preferences,
        Cookiebot.consent.statistics,
        true
      );
    }
  }
}

export default CookiebotEmbeds;
