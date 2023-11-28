interface CustomConfig {
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
  customCSS?: string;
}

class CookiebotEmbeds {
  private config: CustomConfig;
  constructor(customConfig?: CustomConfig);
  init(): void;
  checkConsentAndUpdateIframes(): void;
  createIframeSourceDocument(source: string): string;
  setupEventListeners(): void;
  onDocumentLoad(): void;
  handleIframeMessages(e: Event): void;
}

export default CookiebotEmbeds;
