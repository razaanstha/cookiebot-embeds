interface HeadingTextConfig {
  default?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

interface CookieCategoriesTitleConfig {
  preferences?: string;
  statistics?: string;
  marketing?: string;
}

interface CustomConfig {
  showSourceURL?: boolean;
  headingText?: HeadingTextConfig;
  cookieCategoriesTitle?: CookieCategoriesTitleConfig;
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

  createIframeSourceDocument(source: string, requiredConsents: string[]): string;

  setupEventListeners(): void;

  onDocumentLoad(): void;
}

export default CookiebotEmbeds;
