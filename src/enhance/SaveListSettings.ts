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

  private setRating(value: string): Promise<void> {
    return GM.setValue("list-rating", value);
  }

  public async enhance(): Promise<void> {
    const form = document.querySelector("#filters #myform") as HTMLFormElement | null;
    if (form) {
      const sortSelect = form.elements.namedItem("sortid") as HTMLSelectElement | null;
      if (sortSelect) {
        sortSelect.value = await this.getSort();
      }

      const ratingSelect = form.elements.namedItem("censorid") as HTMLSelectElement | null;
      if (ratingSelect) {
        ratingSelect.value = await this.getRating();
      }

      const submitButton = form.querySelector(".btn-primary");
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
    }

    const sort = await this.getSort();
    const rating = await this.getRating();

    const showAllCrossoversButton = document.querySelector("#content_wrapper_inner a.btn") as HTMLAnchorElement | null;
    if (showAllCrossoversButton) {
      showAllCrossoversButton.href += `?&srt=${sort}&r=${rating}`;
    }

    const universeLinks = document.querySelectorAll("#list_output a");
    for (let i = 0; i < universeLinks.length; i++) {
      const universeLink = universeLinks.item(i) as HTMLAnchorElement;
      if (universeLink.href.includes("crossovers")) {
        continue;
      }

      universeLink.href += `?&srt=${sort}&r=${rating}`;
    }
  }
}
