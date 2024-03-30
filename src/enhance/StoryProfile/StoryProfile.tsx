import { environment, Page } from "../../util/environment";
import type Enhancer from "../Enhancer";
import StoryCard from "../../components/StoryCard/StoryCard";
import "./StoryProfile.css";

export default class StoryProfile implements Enhancer {
  public canEnhance(type: Page): boolean {
    return type === Page.Story || type === Page.Chapter;
  }

  public async enhance(): Promise<void> {
    const profile = document.getElementById("profile_top");
    if (!profile || !environment.currentStoryId) {
      return;
    }

    const card = <StoryCard storyId={environment.currentStoryId} />;

    // profile.parentElement.replaceChild(card, profile);
    profile.parentElement?.insertBefore(card, profile);
    profile.style.display = "none";
  }
}
