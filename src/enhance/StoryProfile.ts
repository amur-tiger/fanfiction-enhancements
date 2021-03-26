import { environment } from "../util/environment";
import Enhancer from "./Enhancer";
import { StoryCard } from "./component";
import { ValueContainer } from "../api";

import "./StoryProfile.css";

export default class StoryProfile implements Enhancer {
  constructor(private readonly valueContainer: ValueContainer) {}

  public async enhance(): Promise<any> {
    const profile = document.getElementById("profile_top");
    if (!profile || !environment.currentStoryId) {
      return;
    }

    const story = await this.valueContainer.getStory(environment.currentStoryId);
    const card = new StoryCard({ story });
    const replacement = card.render();

    // profile.parentElement.replaceChild(replacement, profile);
    profile.parentElement?.insertBefore(replacement, profile);
    profile.style.display = "none";
  }
}
