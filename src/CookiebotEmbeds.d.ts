// CookiebotEmbeds.d.ts
interface CookiebotEmbedsConfig {
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

// CookiebotEmbeds.d.ts
interface CookiebotEmbedsConfig {
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

export default class CookiebotEmbeds {
  constructor(customConfig?: CookiebotEmbedsConfig);

  // Include any public methods here as well. For instance:
  // init(): void;
  // checkConsentAndUpdateIframes(): void;
  // createIframeSourceDocument(source: string): string;
  // setupEventListeners(): void;
  // handleIframeMessages(e: MessageEvent): void;
}
