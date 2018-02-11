import StoryProfile from "./enhance/StoryProfile";
import StoryText from "./enhance/StoryText";

const profile = document.getElementById("profile_top");
const storyProfile = new StoryProfile(profile);
storyProfile.enhance();

const text = document.getElementById("storytextp");
const storyText = new StoryText(text);
storyText.enhance();
