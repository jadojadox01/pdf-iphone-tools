"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { ANALYTICS_CHANGE_EVENT, ANALYTICS_STORAGE_KEY, GA_MEASUREMENT_ID } from "@/lib/analytics";

function consentAccepted() {
  try {
    return window.localStorage.getItem(ANALYTICS_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function sync() {
      setEnabled(consentAccepted());
    }
    sync();
    window.addEventListener(ANALYTICS_CHANGE_EVENT, sync);
    return () => window.removeEventListener(ANALYTICS_CHANGE_EVENT, sync);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
        }}
      />
    </>
  );
}
