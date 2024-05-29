class d {
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
  constructor(o = {}) {
    const i = {
      showSourceURL: !0,
      headingText: {
        default: "Enable [REQUIRED_COOKIES] cookies on Cookiebot settings to view this content.",
        youtube: "To play this video, please enable marketing cookies required by YouTube."
      },
      cookieCategoriesTitle: {
        preferences: "Preferences",
        statistics: "Statistics",
        marketing: "Marketing"
      },
      acceptButtonText: "Accept required cookies",
      openCookiebotSettingsButtonText: "Open Cookiebot Settings",
      background: "rgba(0, 0, 0, 0.7)",
      textColor: "white",
      buttonBackgroundColor: "#88b364",
      buttonBackgroundColorHover: "#6e9e4f",
      buttonTextColor: "white",
      gap: "15px",
      customCSS: ""
    };
    this.config = {
      ...i,
      ...o,
      headingText: {
        ...i.headingText,
        ...o.headingText
      },
      cookieCategoriesTitle: {
        ...i.cookieCategoriesTitle,
        ...o.cookieCategoriesTitle
      }
    }, this.init();
  }
  /**
   * Initializes the library by checking cookie consent and setting up event listeners.
   */
  init() {
    this.checkConsentAndUpdateIframes(), this.setupEventListeners();
  }
  /**
   * Checks the Cookiebot consent and updates iframes accordingly.
   */
  checkConsentAndUpdateIframes() {
    const o = this;
    if (typeof Cookiebot < "u" && Cookiebot && "consent" in Cookiebot && Cookiebot.consent && "preferences" in Cookiebot.consent && "statistics" in Cookiebot.consent && "marketing" in Cookiebot.consent) {
      const i = document.querySelectorAll("iframe[data-cookieconsent]"), e = (t) => t.filter((a) => !Cookiebot.consent[a]);
      i.forEach((t) => {
        if (t.hasAttribute("data-cookieconsent")) {
          if (t.getAttribute("data-cookieconsent") == "ignore")
            return;
          const a = e(
            t.getAttribute("data-cookieconsent").split(",")
          ), r = t.getAttribute("src") || t.getAttribute("data-cookieblock-src") || t.getAttribute("data-src");
          a.every((n) => Cookiebot.consent[n]) || (t.setAttribute("srcdoc", o.createIframeSourceDocument(r, a)), setTimeout(() => {
            t.style.display = "block";
          }, 150));
        }
      }), window.addEventListener("CookiebotOnAccept", function() {
        let t = 0;
        i.forEach((a) => {
          e(
            a.getAttribute("data-cookieconsent").split(",")
          ).every((n) => Cookiebot.consent[n]) ? a.removeAttribute("srcdoc") : t++;
        }), t > 0 && o.checkConsentAndUpdateIframes();
      });
    }
  }
  /**
   * Creates a source document for an iframe based on the provided source URL.
   * @param {string} source - The source URL for the iframe.
   * @param {string[]} requiredConsents - An array of required consents for the iframe.
   * @returns {string} HTML string representing the iframe source document.
   */
  createIframeSourceDocument(o, i = []) {
    const e = this.config;
    if (!o)
      return "";
    let t = o;
    try {
      let n = new URL(o).hostname;
    } catch {
    }
    let a = e.showSourceURL && o ? `<a href="${o}" class="source" target="_blank" rel="nofollow noopener" aria-label="Open in new tab">${o}</a>` : "", r = e.headingText.default;
    if (Object.keys(e.headingText).some((n) => {
      if (t.includes(n))
        return r = e.headingText[n];
    }), r && r.includes("[REQUIRED_COOKIES]") && i) {
      let n = i.map(
        (s) => e.cookieCategoriesTitle[s]
      );
      r = r.replace(
        "[REQUIRED_COOKIES]",
        // add a comma after each required consent except the last one
        i && i.length > 1 ? n.join(", ").replace(/,(?=[^,]*$)/, " &") : n[0]
      );
    }
    return `<div role="dialog" aria-labelledby="cookiebot_marketing_required" id="info">
                <h1 id="cookiebot_marketing_required" class="heading">${r}</h1>
                <div style="display: flex; flex-flow: row wrap; gap: calc(${e.gap} - (${e.gap} / 2)); justify-content: start;">
                    <a href="#accept_required_cookies" class="btn btn--accept-required-cookies">
                      ${e.acceptButtonText}
                    </a>
                    <a href="#open_cookiebot" class="btn btn--open-settings">${e.openCookiebotSettingsButtonText}</a>
                </div>
            </div>
            <div class="loading__overlay" aria-hidden="true">
              <svg class="loading__overlay--icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.72 19.9a8 8 0 0 1-6.5-9.79 7.77 7.77 0 0 1 6.18-5.95 8 8 0 0 1 9.49 6.52A1.54 1.54 0 0 0 21.38 12h.13a1.37 1.37 0 0 0 1.38-1.54 11 11 0 1 0-12.7 12.39A1.54 1.54 0 0 0 12 21.34a1.47 1.47 0 0 0-1.28-1.44Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
            </div>
            ${a}
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
                  background-color: ${e.background};
                  color: ${e.textColor};
                  position: relative;
                  font-family: sans-serif;
                  font-weight: 400;
                  line-height: 1.34;
                }
    
                #info {
                  display: flex;
                  flex-direction: column;
                  gap: ${e.gap};
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
                  background: ${e.buttonBackgroundColor};
                  color: ${e.buttonTextColor};
                  transition: all 0.2s ease;
                  border: none;
                }
    
                .btn:hover {
                  background: ${e.buttonBackgroundColorHover};
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
                  background-color: ${e.background};
                  color: ${e.textColor};
                }

                .loading__overlay--icon {
                  width: 10vw;
                  height: 10vw;
                }

                .loading__overlay.loading {
                  opacity: 0.92;
                  visibility: visible;
                }
                
                ${e.customCSS}
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
                      var requiredConsents = "${i}";
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
            <\/script>
            `;
  }
  /**
   * Sets up various event listeners for handling Cookiebot events and iframe messages.
   */
  setupEventListeners() {
    window.addEventListener("CookiebotOnAccept", this.checkConsentAndUpdateIframes.bind(this)), window.addEventListener("CookiebotOnDecline", this.checkConsentAndUpdateIframes.bind(this)), window.addEventListener("popstate", this.checkConsentAndUpdateIframes.bind(this)), window.addEventListener("load", this.onDocumentLoad.bind(this));
  }
  /**
   * Handles actions to be performed when the document is loaded.
   * This includes checking if Cookiebot is loaded and updating iframes.
   */
  onDocumentLoad() {
    if (typeof Cookiebot > "u")
      return console.warn("Cookiebot is not loaded. Please add the Cookiebot script to the page.");
    this.checkConsentAndUpdateIframes();
  }
}
export {
  d as default
};
