export const GA_TRACKING_ID = process.env.GA_TRACKING_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
// This triggers when the route changes
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: number;
}) => {
  if (!GA_TRACKING_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
