// CookiebotMarketingEmbeds.d.ts
interface CookiebotMarketingEmbedsConfig {
  showSourceURL?: boolean;
  headingText?: {
    default?: string;
    youtube?: string;
  };
  acceptButtonText?: string;
  openCookiebotSettingsButtonText?: string;
  background?: string;
  textColor?: string;
  buttonBackgroundColor?: string;
  buttonBackgroundColorHover?: string;
  buttonTextColor?: string;
  gap?: string;
}

// CookiebotMarketingEmbeds.d.ts
interface CookiebotMarketingEmbedsConfig {
  showSourceURL?: boolean;
  headingText?: {
    default?: string;
    youtube?: string;
  };
  buttonText?: string;
  openCookiebotButtonText?: string;
  background?: string;
  textColor?: string;
  buttonBackgroundColor?: string;
  buttonBackgroundColorHover?: string;
  buttonTextColor?: string;
  gap?: string;
  customCSS?: string;
}

export default class CookiebotMarketingEmbeds {
  constructor(customConfig?: CookiebotMarketingEmbedsConfig);

  // Include any public methods here as well. For instance:
  // init(): void;
  // checkConsentAndUpdateIframes(): void;
  // createIframeSourceDocument(source: string): string;
  // setupEventListeners(): void;
  // handleIframeMessages(e: MessageEvent): void;
}
