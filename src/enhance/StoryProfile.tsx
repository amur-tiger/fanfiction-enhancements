import { environment } from "../util/environment";
import type Enhancer from "./Enhancer";
import StoryCard from "./components/StoryCard/StoryCard";
import type ValueContainer from "../api/ValueContainer";

import "./StoryProfile.css";

export default class StoryProfile implements Enhancer {
  constructor(private readonly valueContainer: ValueContainer) {}

  public async enhance(): Promise<void> {
    const profile = document.getElementById("profile_top");
    if (!profile || !environment.currentStoryId) {
      return;
    }

    const story = await this.valueContainer.getStory(environment.currentStoryId);
    if (!story) {
      return;
    }

    const card = <StoryCard story={story} />;

    // profile.parentElement.replaceChild(card, profile);
    profile.parentElement?.insertBefore(card, profile);
    profile.style.display = "none";
  }
}
