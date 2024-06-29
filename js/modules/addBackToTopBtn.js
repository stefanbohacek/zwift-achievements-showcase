export default () => {
  const backToTopBtn = document.getElementById("back-to-top");

  backToTopBtn.addEventListener("click", (ev) => {
    ev.preventDefault();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  window.addEventListener("scroll", () => {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      backToTopBtn.classList.remove("d-none");
    } else {
      backToTopBtn.classList.add("d-none");
    }
  });
};
