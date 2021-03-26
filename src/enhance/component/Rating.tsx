import React from "../../util/react";
import Component from "./Component";

import "./Rating.css";

export default class Rating implements Component {
  constructor(private props: { rating: string }) {}

  public render(): HTMLAnchorElement {
    const element = (
      <a
        href="https://www.fictionratings.com/"
        class="ffe-rating"
        rel="noreferrer"
        target="rating"
      >
        {this.props.rating}
      </a>
    );

    switch (this.props.rating) {
      case "K":
        element.title = "General Audience (5+)";
        element.classList.add("ffe-rating-k");
        break;
      case "K+":
        element.title = "Young Children (9+)";
        element.classList.add("ffe-rating-kp");
        break;
      case "T":
        element.title = "Teens (13+)";
        element.classList.add("ffe-rating-t");
        break;
      case "M":
        element.title = "Teens (16+)";
        element.classList.add("ffe-rating-m");
        break;
      case "MA":
        element.title = "Mature (18+)";
        element.classList.add("ffe-rating-ma");
        break;
      default:
        element.textContent = "?";
        element.title = "No Rating Available";
        break;
    }

    return element;
  }
}
