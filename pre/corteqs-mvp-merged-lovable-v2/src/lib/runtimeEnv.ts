const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getPublicSiteUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  const base = configured?.trim() || window.location.origin;
  return trimTrailingSlash(base);
};

export const getOAuthRedirectUrl = () => `${getPublicSiteUrl()}/`;

export const getResetPasswordRedirectUrl = () => `${getPublicSiteUrl()}/reset-password`;

export const isPreEnvironment = () => {
  const host = window.location.hostname.toLowerCase();
  return host === "pre.corteqs.net";
};

export const canAutoRecover = () => !isPreEnvironment();
