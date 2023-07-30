import { environment } from "../util";
import Enhancer from "./Enhancer";
import { StoryCard } from "./components";
import { RequestManager, ValueContainer } from "../api";

import "./StoryProfile.css";

export default class StoryProfile implements Enhancer {
  constructor(
    private readonly requestManager: RequestManager,
    private readonly valueContainer: ValueContainer,
  ) {}

  public async enhance(): Promise<void> {
    const profile = document.getElementById("profile_top");
    if (!profile || !environment.currentStoryId) {
      return;
    }

    const story = await this.valueContainer.getStory(environment.currentStoryId);
    if (!story) {
      return;
    }

    const card = StoryCard({ requestManager: this.requestManager, story });

    // profile.parentElement.replaceChild(card, profile);
    profile.parentElement?.insertBefore(card, profile);
    profile.style.display = "none";
  }
}
