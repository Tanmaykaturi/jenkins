(function () {
  function updateBuildCaptionIcon() {
    const buildCaption = document.querySelector(".jenkins-build-caption");
    const url = buildCaption.dataset.statusUrl;
    fetch(url).then((rsp) => {
      if (rsp.ok) {
        let isBuilding = rsp.headers.get("X-Building");
        if (isBuilding === "true") {
          setTimeout(updateBuildCaptionIcon, 5000);
          let progress = rsp.headers.get("X-Progress");
          let runtime = rsp.headers.get("X-Executor-Runtime");
          let remaining = rsp.headers.get("X-Executor-Remaining");
          let stuck = rsp.headers.get("X-Executor-Stuck");
          let progressBar = document.querySelector(".app-progress-bar");
          let progressBarDone = document.querySelector(
            ".app-progress-bar span",
          );
          if (progressBar) {
            let tooltip = progressBar.dataset.tooltipTemplate;
            tooltip = tooltip.replace("%0", runtime).replace("%1", remaining);
            progressBar.setAttribute("tooltip", tooltip);
            progressBar.setAttribute("title", tooltip);
            Behaviour.applySubtree(progressBar, true);
            if (stuck === "true") {
              progressBar.classList.add("app-progress-bar--error");
            } else {
              progressBar.classList.remove("app-progress-bar--error");
            }
          }
          if (progressBarDone) {
            progressBarDone.style.width = `${progress}%`;
          }
        } else {
          let progressBar = document.querySelector(
            ".build-caption-progress-container",
          );
          if (progressBar) {
            progressBar.style.display = "none";
          }
        }
        rsp.text().then((responseText) => {
          const svgElement = document.querySelector(".jenkins-build-caption svg");
          if (svgElement && svgElement.parentNode) {
            // Create a temporary container to safely parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = responseText;
            const newSvg = tempDiv.querySelector('svg');
            if (newSvg) {
              // Replace the existing SVG with the new one
              svgElement.parentNode.replaceChild(newSvg, svgElement);
            }
          }
          Behaviour.applySubtree(buildCaption, false);
        });
      }
    });
  }

  setTimeout(updateBuildCaptionIcon, 5000);
})();
