import slugify from "./slugify.js";

export default async (fn) => {
  const date = new Date();
  const versionString = `${date.getHours()}-${date.getMinutes()}`;
  let data = await fetch(`/data/achievements.json?v=${versionString}`);

  const achievementsAll = await data.json();
  data = await fetch(`/data/my-achievements.json?v=${versionString}`);
  const achievementsAchieved = await data.json();

  let achievementsSectionsHTML = /* html */ `
    <p class="fw-bold">Browse achievements %COUNT%</p>
    <ul>
  `;

  let achievementsHTML = /* html */ `
  <div class="container text-center">
  `;

  let badgesCountTotal = 0;
  let badgesCountAchieved = 0;

  for (let category in achievementsAchieved) {
    if (achievementsAchieved[category] && achievementsAchieved[category].show) {
      const categoryBadgesCountTotal = Object.keys(
        achievementsAll[category].badges
      ).length;

      const categoryBadgesCountAchieved = Object.keys(
        achievementsAchieved[category].badges
      ).length;

      badgesCountTotal += categoryBadgesCountTotal;
      badgesCountAchieved += categoryBadgesCountAchieved;

      achievementsSectionsHTML += /* html */ `
        <li>
          <a href="#${slugify(
            category
          )}">${category}</a> <small class="text-body-secondary">(${categoryBadgesCountAchieved.toLocaleString()}/${categoryBadgesCountTotal.toLocaleString()})</small>
        </li>
      `;

      const is100 =
        categoryBadgesCountAchieved === categoryBadgesCountTotal ? " 🎉" : "";

      achievementsHTML += /* html */ `
      <div class="row mt-4 mb-4 sticky-top ${
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "bg-dark"
          : "bg-white"
      }">
        <div class="col-12">
          <a class="text-decoration-none text-body-secondary" href="#${slugify(
            category
          )}">
            <h2 id="${slugify(
              category
            )}">${category} <small class="text-body-secondary">(${categoryBadgesCountAchieved}/${categoryBadgesCountTotal})${is100}</small>
            </h2>
          </a>  
        </div>
      </div>
      <div class="row mb-4">
      `;

      const badgeNames = Object.keys(achievementsAll[category].badges);

      if (category === "Route achievements") {
        badgeNames.sort();
      }

      for (let i = 0; i < badgeNames.length; ++i) {
        // const badge = achievementsAll[category].badges[badgeNames[i]];
        const badgeName = badgeNames[i];
        const isBadgeAchieved = achievementsAchieved[category].badges
          .map((routeName) => routeName.toLowerCase())
          .includes(badgeName.toLowerCase());

        const imageDescriptions = {
          DESCR_ROUTE_COMPLETE:
            "An S-shaped route graphic connecting a “start” arrow icon in a circle with green background and an orange “finnish” circle at the end of it. There is a mountain in the background with its top covered with a cloud. The route goes through a hilly lake area. Two cyclist silhouettes are visible next to the mountain in the back.",
        };

        const imageDescription =
          imageDescriptions[
            achievementsAll[category].badges[badgeName].image_description
          ] || achievementsAll[category].badges[badgeName].image_description;

        console.log(imageDescription);

        achievementsHTML += /* html */ `
        <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4 ${
          isBadgeAchieved ? "badge-achieved" : "badge-not-achieved"
        }">
          <p class="fw-bold">${badgeName}<span class="visually-hidden">, badge ${
          isBadgeAchieved ? "" : "not"
        } awarded</span></p>
          <img loading="lazy" class="achievement-badge" width="120" height="120" src="images/badges/${
            achievementsAll[category].badges[badgeName].image
          }"
          title="The &quot;${badgeName}&quot; badge (${
          isBadgeAchieved ? "" : "not "
        }awarded)"
          alt="${imageDescription}${
          !isBadgeAchieved
            ? " The colors of the image are grayed out as the badge has not been awarded yet."
            : ""
        }">
          <p class="text-center">
            <small class="text-body-secondary">${
              achievementsAll[category].badges[badgeName].description
            }</small>
          </p>
        </div>
        `;
      }
      achievementsHTML += "</div>";
    }
  }

  achievementsSectionsHTML += /* html */ `
  </ul>
  `;

  achievementsHTML += /* html */ `
  </div>
  `;

  const badgesCountInfo = `${badgesCountAchieved.toLocaleString()}/${badgesCountTotal.toLocaleString()}`;

  document.getElementById("badges").innerHTML =
    achievementsSectionsHTML.replace("%COUNT%", `(${badgesCountInfo})`) +
    achievementsHTML;
};
