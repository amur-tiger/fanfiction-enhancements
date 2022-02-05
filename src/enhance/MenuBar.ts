import { environment } from "../util/environment";
import { DropBox } from "../api/DropBox";
import Enhancer from "./Enhancer";
import BellIcon from "../assets/bell.svg";
import DropboxIcon from "../assets/dropbox.svg";

import "./MenuBar.css";

export default class MenuBar implements Enhancer {
  constructor(private readonly dropBox: DropBox) {}

  public async enhance(): Promise<any> {
    if (!environment.currentUserName) {
      return;
    }

    const loginElement = document.querySelector("#name_login a");
    const parent = loginElement?.parentElement;
    const ref = loginElement?.nextElementSibling;
    if (!parent || !ref) {
      return;
    }

    const toAlerts = document.createElement("a");
    toAlerts.classList.add("ffe-mb-icon", "ffe-mb-alerts", "ffe-mb-bell");
    toAlerts.title = "Go to Story Alerts";
    toAlerts.href = "/alert/story.php";
    toAlerts.appendChild(BellIcon());

    const toFavorites = document.createElement("a");
    toFavorites.classList.add("ffe-mb-icon", "ffe-mb-favorites", "icon-heart");
    toFavorites.title = "Go to Story Favorites";
    toFavorites.href = "/favorites/story.php";

    const toDropBox = document.createElement("a");
    toDropBox.classList.add("ffe-mb-icon", "ffe-mb-dropbox");
    toDropBox.title = "Connect to DropBox";
    toDropBox.href = "#";
    toDropBox.appendChild(DropboxIcon());

    if (await this.dropBox.isAuthorized()) {
      toDropBox.classList.add("ffe-mb-checked");
    }

    toDropBox.addEventListener("click", async (event) => {
      event.preventDefault();
      await this.dropBox.authorize();
      toDropBox.classList.add("ffe-mb-checked");
    });

    const separator = document.createElement("span");
    separator.classList.add("ffe-mb-separator");

    parent.insertBefore(toAlerts, ref);
    parent.insertBefore(toFavorites, ref);
    parent.insertBefore(toDropBox, ref);
    parent.insertBefore(separator, ref);
  }
}
