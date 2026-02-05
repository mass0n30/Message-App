document.addEventListener("DOMContentLoaded", () => {
  function handleModal() {

    const toggleButton = document.getElementById("fileModal");

    toggleButton.addEventListener("click", function() {
      if (toggleButton.style.display === "none") {
        toggleButton.style.display = "block";
      } else {
        toggleButton.style.display = "none";
      }
    });
  }

  function styleMessages() {
    let toggleRowsColors = false;

    const fieldsDivs = document.querySelectorAll(".filefoldersContainer");

    fieldsDivs.forEach((message) => {
      if (toggleRowsColors) {
        message.classList.add("light");
        toggleRowsColors = false;
      } else {
        message.classList.add("dark");
        toggleRowsColors = true;
      }
    });
  };
  handleModal();
  styleMessages();
  
});