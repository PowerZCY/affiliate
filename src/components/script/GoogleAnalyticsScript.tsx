/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Script from "next/script";

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!;

export function GoogleAnalyticsScript() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `,
        }}
      />
    </>
  );
}

export function useGoogleAnalytics() {
  const trackEvent = (event: string, data?: Record<string, unknown>) => {
    if (typeof window === "undefined" || !window.gtag) {
      return;
    }

    window.gtag("event", event, data);
  };

  return {
    trackEvent,
  };
}

// 为 window 添加 gtag 类型定义
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
