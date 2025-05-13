declare module 'react-google-recaptcha-enterprise' {
  import * as React from 'react';

  // Define action options for reCAPTCHA
  export interface ReCaptchaExecuteOptions {
    action: string;
  }

  // Define parameter types for reCAPTCHA rendering
  export interface ReCaptchaRenderParameters {
    sitekey: string;
    theme?: 'light' | 'dark';
    size?: 'invisible' | 'normal' | 'compact';
    badge?: 'bottomright' | 'bottomleft' | 'inline';
    tabindex?: number;
    callback?: (token: string) => void;
    'expired-callback'?: () => void;
    'error-callback'?: () => void;
    isolated?: boolean;
    hl?: string;
  }

  // Define the grecaptcha object structure
  export interface ReCaptchaGrecaptcha {
    ready: (callback: () => void) => void;
    execute: (sitekey: string, options: ReCaptchaExecuteOptions) => Promise<string>;
    render: (container: string | HTMLElement, parameters: ReCaptchaRenderParameters) => number;
    reset: (widgetId?: number) => void;
    getResponse: (widgetId?: number) => string;
  }

  // Define props for the ReCAPTCHA component
  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    grecaptcha?: ReCaptchaGrecaptcha;
    theme?: 'light' | 'dark';
    size?: 'invisible' | 'normal' | 'compact';
    tabindex?: number;
    onExpired?: () => void;
    onErrored?: () => void;
    onLoad?: () => void;
    hl?: string;
    badge?: 'bottomright' | 'bottomleft' | 'inline';
    type?: 'image' | 'audio';
    isolated?: boolean;
    action?: string;
  }

  // Define the ReCAPTCHA component
  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    reset(): void;
    execute(): Promise<string>;
    executeAsync(): Promise<string>;
    getResponse(): string | null;
  }
}
