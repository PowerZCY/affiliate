import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { appConfig } from "@/lib/appConfig";

// Can be imported from a shared config
const locales = appConfig.i18n.locales;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});