import { environment } from "../../util/environment";
import clsx from "clsx";
import type Enhancer from "../Enhancer";
import { getAuthorizedSignal, removeSyncToken, startSyncAuthorization } from "../../sync/auth";
import BellIcon from "../../assets/bell.svg";
import classes from "./MenuBar.css";

export default class MenuBar implements Enhancer {
  public canEnhance(): boolean {
    return true;
  }

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

    parent.insertBefore(
      <a
        class={clsx(classes.icon, "icon-tl-contrast")}
        title="Toggle Light/Dark Theme"
        href="#"
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          if (XCOOKIE.read_theme === "light") {
            _fontastic_change_theme("dark");
          } else {
            _fontastic_change_theme("light");
          }
          document.documentElement.dataset.theme = XCOOKIE.read_theme;
        }}
      />,
      ref,
    );

    parent.insertBefore(<span class={classes.separator} />, ref);

    parent.insertBefore(
      <a class={clsx(classes.icon, classes.bell)} title="Go to Story Alerts" href="/alert/story.php">
        <BellIcon />
      </a>,
      ref,
    );

    parent.insertBefore(
      <a class={clsx(classes.icon, "icon-heart")} title="Go to Story Favorites" href="/favorites/story.php" />,
      ref,
    );

    const isAuthorized = getAuthorizedSignal();
    parent.insertBefore(
      <a
        class={clsx(classes.icon, "icon-mpl2-sync", {
          [classes.checked]: isAuthorized(),
        })}
        title={isAuthorized() ? "Disconnect from Google Drive" : "Connect to Google Drive"}
        href="#"
        onClick={async (event: MouseEvent) => {
          event.preventDefault();
          if (isAuthorized()) {
            if (confirm("Stop sync with Google Drive?")) {
              await removeSyncToken();
            }
          } else {
            await startSyncAuthorization();
          }
        }}
      />,
      ref,
    );

    parent.insertBefore(<span class={classes.separator} />, ref);
  }
}
