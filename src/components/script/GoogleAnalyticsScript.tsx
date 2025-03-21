/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Script from "next/script";

const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID!;

export function GoogleAnalyticsScript() {
  return (
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      onLoad={() => {
        if (typeof window === "undefined") {
          return;
        }

        (window as any).dataLayer = (window as any).dataLayer || [];

        function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        }
        gtag("js", new Date());
        gtag("config", googleAnalyticsId);
      }}
    />
  );
}

export function useGoogleAnalytics() {
  const trackEvent = (event: string, data?: Record<string, unknown>) => {
    if (typeof window === "undefined" || !(window as any).gta) {
      return;
    }

    (window as any).gta("event", event, data);
  };

  return {
    trackEvent,
  };
}
