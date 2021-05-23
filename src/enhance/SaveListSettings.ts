import Enhancer from "./Enhancer";

export default class SaveListSettings implements Enhancer {
  private getSort(): Promise<string> {
    return GM.getValue("list-sort", "1") as Promise<string>;
  }

  private setSort(value: string): Promise<void> {
    return GM.setValue("list-sort", value);
  }

  private getRating(): Promise<string> {
    return GM.getValue("list-rating", "103") as Promise<string>;
  }

  private async getRatingBar(): Promise<string> {
    const rating = await this.getRating();
    switch (rating) {
      case "10": // all
        return "99";
      case "103": // K -> T
      default:
        return "3";
      case "102": // K -> K+
        return "2";
      case "1": // K
        return "1";
      case "2": // K+
        return "12";
      case "3": // T
        return "13";
      case "4": // M
        return "14";
    }
  }

  private setRating(value: string): Promise<void> {
    return GM.setValue("list-rating", value);
  }

  private async setRatingBar(value: string): Promise<void> {
    switch (value) {
      case "99": // all
        await this.setRating("10");
        break;
      case "3": // K -> T
      default:
        await this.setRating("103");
        break;
      case "2": // K -> K+
        await this.setRating("102");
        break;
      case "1": // K
        await this.setRating("1");
        break;
      case "12": // K+
        await this.setRating("2");
        break;
      case "13": // T
        await this.setRating("3");
        break;
      case "14": // M
        await this.setRating("4");
        break;
    }
  }

  public async enhance(): Promise<void> {
    await this.updateFilterForm();

    const sort = await this.getSort();
    const rating = await this.getRating();
    const ratingBar = await this.getRatingBar();

    const showAllCrossoversButton = document.querySelector("#content_wrapper_inner a.btn") as HTMLAnchorElement | null;
    if (showAllCrossoversButton) {
      showAllCrossoversButton.href += `?&srt=${sort}&r=${rating}`;
    }

    const universeLinks = document.querySelectorAll("#list_output a");
    for (let i = 0; i < universeLinks.length; i++) {
      const link = universeLinks.item(i) as HTMLAnchorElement;
      if (!link.href.includes("crossovers")) {
        link.href += `?&srt=${sort}&r=${rating}`;
      }
    }

    const communityLinks = document.querySelectorAll(".z-list a");
    for (let i = 0; i < communityLinks.length; i++) {
      const link = communityLinks.item(i) as HTMLAnchorElement;
      link.href += `${ratingBar}/${sort}/1/0/0/0/0/`;
    }
  }

  private async updateFilterForm() {
    const dialog = document.querySelector("#filters #myform") as HTMLFormElement | null;
    if (dialog) {
      const sortSelect = dialog.elements.namedItem("sortid") as HTMLSelectElement | null;
      if (sortSelect) {
        sortSelect.value = await this.getSort();
      }

      const ratingSelect = dialog.elements.namedItem("censorid") as HTMLSelectElement | null;
      if (ratingSelect) {
        ratingSelect.value = await this.getRating();
      }

      const submitButton = dialog.querySelector(".btn-primary");
      if (submitButton) {
        submitButton.addEventListener("click", async () => {
          if (sortSelect) {
            await this.setSort(sortSelect.value);
          }
          if (ratingSelect) {
            await this.setRating(ratingSelect.value);
          }
        });
      }
    } else {
      const bar = document.querySelector("#content_wrapper_inner form") as HTMLFormElement | null;
      if (bar && bar.name === "myform") {
        const sortSelect = bar.elements.namedItem("s") as HTMLSelectElement | null;
        if (sortSelect) {
          sortSelect.value = await this.getSort();
        }

        const ratingSelect = bar.elements.namedItem("censorid") as HTMLSelectElement | null;
        if (ratingSelect) {
          ratingSelect.value = await this.getRatingBar();
        }

        const submitButton = bar.querySelector("input[type=submit]") as HTMLInputElement | null;
        if (submitButton) {
          submitButton.addEventListener("click", async () => {
            if (sortSelect) {
              await this.setSort(sortSelect.value);
            }

            if (ratingSelect) {
              await this.setRatingBar(ratingSelect.value);
            }
          });
        }
      }
    }
  }
}
