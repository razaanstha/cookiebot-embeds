(function(o,i){typeof exports=="object"&&typeof module<"u"?module.exports=i():typeof define=="function"&&define.amd?define(i):(o=typeof globalThis<"u"?globalThis:o||self,o.CookiebotEmbeds=i())})(this,function(){"use strict";class o{constructor(t={}){this.config={showSourceURL:!0,headingText:{default:"To access this content, please enable marketing cookies.",youtube:"To play this video, please enable marketing cookies required by YouTube."},acceptButtonText:"Accept marketing cookies",openCookiebotSettingsButtonText:"Open Cookiebot Settings",background:"rgba(0, 0, 0, 0.7)",textColor:"white",buttonBackgroundColor:"#88b364",buttonBackgroundColorHover:"#6e9e4f",buttonTextColor:"white",gap:"15px",customCSS:"",...t},this.init()}init(){this.checkConsentAndUpdateIframes(),this.setupEventListeners()}checkConsentAndUpdateIframes(){if(typeof Cookiebot<"u"&&Cookiebot&&"consent"in Cookiebot&&Cookiebot.consent&&"marketing"in Cookiebot.consent&&!Cookiebot.consent.marketing){let t=document.querySelectorAll("iframe.consent-frame, iframe.cookieconsent-optin-marketing, iframe[data-src*='youtube.com/embed'],[data-src*='youtube-nocookie.com/embed']");t.forEach(e=>{if(!e.hasAttribute("srcdoc")){let n=e.getAttribute("src")||e.getAttribute("data-cookieblock-src")||e.getAttribute("data-src");e.srcdoc=this.createIframeSourceDocument(n),e.style.display="block"}}),window.addEventListener("CookiebotOnAccept",function(e){Cookiebot.consent.marketing&&t.forEach(n=>{n.removeAttribute("srcdoc")})})}}createIframeSourceDocument(t){const e=this.config;if(!t)return"";let n=new URL(t).hostname,r=e.showSourceURL&&t?`<a href="${t}" class="source" target="_blank" rel="nofollow noopener" aria-label="Open in new tab">${t}</a>`:"",a=e.headingText.default;return Object.keys(e.headingText).some(s=>{if(n.includes(s))return a=e.headingText[s]}),`<div role="dialog" aria-labelledby="cookiebot_marketing_required" id="info">
              <h1 id="cookiebot_marketing_required" class="heading">${a}</h1>
              <div style="display: flex; flex-flow: row wrap; gap: inherit; justify-content: start;">
                  <a href="#accept_marketing" class="btn btn--accept-marketing">${e.acceptButtonText}</a>
                  <a href="#open_cookiebot" class="btn btn--open-settings">${e.openCookiebotSettingsButtonText}</a>
              </div>
          </div>
          ${r}
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
              
              ${e.customCSS}
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
                      // Prevent default action
                      e.preventDefault();
                      // Inform parent window to accept marketing cookies
                      window.parent.postMessage("accept_marketing", "*");
                  }
                  });
              });
          }
          <\/script>`}setupEventListeners(){const t=this;window.addEventListener("CookiebotOnAccept",function(e){Cookiebot.consent.marketing||t.checkConsentAndUpdateIframes()}),window.addEventListener("CookiebotOnDecline",function(e){Cookiebot.consent.marketing||t.checkConsentAndUpdateIframes()}),window.addEventListener("popstate",this.checkConsentAndUpdateIframes.bind(this)),window.addEventListener("load",this.onDocumentLoad.bind(this))}onDocumentLoad(){if(typeof Cookiebot>"u")return console.warn("Cookiebot is not loaded. Please add the Cookiebot script to the page.");this.checkConsentAndUpdateIframes(),window.addEventListener("message",this.handleIframeMessages.bind(this))}handleIframeMessages(t){t.data==="open_cookiebot"&&Cookiebot.show(),t.data==="accept_marketing"&&Cookiebot.submitCustomConsent(Cookiebot.consent.preferences,Cookiebot.consent.statistics,!0)}}return o});
