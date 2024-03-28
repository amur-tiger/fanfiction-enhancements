import { environment, Page } from "../util/environment";
import { createSignal, type ReadonlySignal } from "../signal/signal";
import effect from "../signal/effect";

const BEARER_TOKEN_KEY = "ffe-drive-token";
const REDIRECT_URI = "https://www.fanfiction.net/ffe-oauth2-return";
const CLIENT_ID = "19948706217-jsn5u8hqi959m0q2b3s65qh2f3h6pcu4.apps.googleusercontent.com";

type UnsafeWindow = Window & { ffeOAuth2Callback(token: string | undefined): void };

declare const unsafeWindow: UnsafeWindow;

/**
 * Checks if the user is authenticated with Google Drive.
 */
export async function isSyncAuthorized(): Promise<boolean> {
  return !!(await GM.getValue(BEARER_TOKEN_KEY));
}

/**
 * Checks if the user is authenticated with Google Drive.
 */
export function getAuthorizedSignal(): ReadonlySignal<boolean> {
  const signal = createSignal(false);
  GM.getValue(BEARER_TOKEN_KEY).then((value) => signal.set(!!value, { isInternal: true }));

  effect(() => {
    const token = GM_addValueChangeListener(BEARER_TOKEN_KEY, (name, oldValue, newValue) => {
      signal.set(!!newValue, { isInternal: true });
    });
    return () => GM_removeValueChangeListener(token);
  });

  return signal;
}

/**
 * Retrieves the sync token. If not authorized, will throw an error instead.
 */
export async function getSyncToken(): Promise<string> {
  const token = await GM.getValue(BEARER_TOKEN_KEY);
  if (!token || typeof token !== "string") {
    throw new Error("Not logged in");
  }
  return token;
}

/**
 * Deletes the token. The user must re-authenticate.
 */
export async function removeSyncToken() {
  await GM.deleteValue(BEARER_TOKEN_KEY);
}

/**
 * Redirects to Google to authenticate the userscript and grant access to settings.
 */
export async function startSyncAuthorization(): Promise<void> {
  const token = await new Promise<string>((resolve, reject) => {
    unsafeWindow.ffeOAuth2Callback = (callbackToken) => {
      clearInterval(handle);
      if (!callbackToken) {
        reject(new Error("No token received."));
      } else {
        resolve(callbackToken);
      }
    };

    const scopes = "https://www.googleapis.com/auth/drive.appdata";
    const popup = xwindow(
      `https://accounts.google.com/o/oauth2/auth?scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&client_id=${encodeURIComponent(CLIENT_ID)}`,
      670,
      720,
    );

    // popup may be null if it was blocked by the browser?

    const handle = setInterval(() => {
      if (popup.closed) {
        clearInterval(handle);
        reject(new Error("Authorization aborted by user"));
      }
    }, 1000);
  });

  console.info("Authenticated successfully.");
  await GM.setValue(BEARER_TOKEN_KEY, token);
}

if (environment.currentPageType === Page.OAuth2) {
  // This section will be executed inside the child popup window receiving the OAuth token.
  const target = document.body.firstElementChild;
  if (target) {
    target.innerHTML = "<h2>Received oAuth2 token</h2>This page should close momentarily.";
  }

  const token = /[?&#]access_token=([^&#]*)/i.exec(window.location.hash)?.[1];
  (window.opener as UnsafeWindow).ffeOAuth2Callback(token);
  window.close();
}
