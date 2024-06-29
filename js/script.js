import ready from "./modules/ready.js";
import addBackToTopBtn from "./modules/addBackToTopBtn.js";
import showAchievements from "./modules/showAchievements.js";

ready(async () => {
  addBackToTopBtn();
  showAchievements();
});
