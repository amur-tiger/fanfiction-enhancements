import { environment } from "../util/environment";
import type Enhancer from "./Enhancer";
import scoped from "../signal/scope";
import { getAuthorizedSignal, startSyncAuthorization } from "../sync/auth";
import BellIcon from "../assets/bell.svg";
import "./MenuBar.css";

export default class MenuBar implements Enhancer {
  public async enhance(): Promise<void> {
    if (!environment.currentUserName) {
      return;
    }

    const loginElement = document.querySelector("#name_login a");
    const parent = loginElement?.parentElement;
    const ref = loginElement?.nextElementSibling;
    if (!parent || !ref) {
      return;
    }

    document.documentElement.dataset.theme = XCOOKIE.read_theme;
    document.querySelector(".lc > span:last-of-type")?.addEventListener("click", () => {
      document.documentElement.dataset.theme = XCOOKIE.read_theme;
    });

    const toggleTheme = document.createElement("a");
    toggleTheme.classList.add("ffe-mb-icon", "ffe-mb-theme", "icon-tl-contrast");
    toggleTheme.title = "Toggle Light/Dark Theme";
    toggleTheme.href = "#";
    toggleTheme.addEventListener("click", (event) => {
      event.preventDefault();
      if (XCOOKIE.read_theme === "light") {
        _fontastic_change_theme("dark");
      } else {
        _fontastic_change_theme("light");
      }
      document.documentElement.dataset.theme = XCOOKIE.read_theme;
    });

    const toAlerts = document.createElement("a");
    toAlerts.classList.add("ffe-mb-icon", "ffe-mb-alerts", "ffe-mb-bell");
    toAlerts.title = "Go to Story Alerts";
    toAlerts.href = "/alert/story.php";
    toAlerts.appendChild(BellIcon());

    const toFavorites = document.createElement("a");
    toFavorites.classList.add("ffe-mb-icon", "ffe-mb-favorites", "icon-heart");
    toFavorites.title = "Go to Story Favorites";
    toFavorites.href = "/favorites/story.php";

    const toSync = document.createElement("a");
    toSync.classList.add("ffe-mb-icon", "icon-mpl2-sync");
    toSync.title = "Connect to Google Drive";
    toSync.href = "#";

    const isAuthorized = getAuthorizedSignal();
    scoped(() => {
      toSync.classList.toggle("ffe-mb-checked", isAuthorized());
    });

    toSync.addEventListener("click", async (event) => {
      event.preventDefault();
      await startSyncAuthorization();
    });

    const separator1 = document.createElement("span");
    separator1.classList.add("ffe-mb-separator");

    const separator2 = document.createElement("span");
    separator2.classList.add("ffe-mb-separator");

    parent.insertBefore(toggleTheme, ref);
    parent.insertBefore(separator2, ref);
    parent.insertBefore(toAlerts, ref);
    parent.insertBefore(toFavorites, ref);
    parent.insertBefore(toSync, ref);
    parent.insertBefore(separator1, ref);
  }
}
