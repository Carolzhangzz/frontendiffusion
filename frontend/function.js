function updateElementState(element, isActive, type) {
  const img = element.querySelector("img");
  const activeIcon =
    element.dataset[type === "button" ? "selectedIcon" : "activeIcon"];
  const originalIcon = element.dataset.originalIcon || img.src;

  if (isActive) {
    element.classList.add(
      isActive === "hover"
        ? "hovered"
        : type === "button"
        ? "selected"
        : "active"
    );
    if (activeIcon) {
      img.src = activeIcon;
    }
  } else {
    element.classList.remove("hovered", "selected", "active");
    img.src = originalIcon;
  }
}

function selectButton(button) {
  document.querySelectorAll("#controls button").forEach((btn) => {
    updateElementState(btn, false, "button");
  });
  updateElementState(button, "click", "button");
}

function switchTab(clickedTab) {
  document.querySelectorAll(".tab").forEach((tab) => {
    updateElementState(tab, tab === clickedTab, "tab");
  });
}

// Add event listeners to each button
document.querySelectorAll("#controls button").forEach((button) => {
  button.dataset.originalIcon = button.querySelector("img").src;

  button.addEventListener("click", () => selectButton(button));

  button.addEventListener("mouseenter", () => {
    if (!button.classList.contains("selected")) {
      updateElementState(button, "hover", "button");
    }
  });

  button.addEventListener("mouseleave", () => {
    if (!button.classList.contains("selected")) {
      updateElementState(button, false, "button");
    }
  });
});

// Add event listeners to each tab
document.querySelectorAll(".tab").forEach((tab) => {
  tab.dataset.originalIcon = tab.querySelector("img").src;

  tab.addEventListener("click", () => switchTab(tab));

  tab.addEventListener("mouseenter", () => {
    if (!tab.classList.contains("active")) {
      updateElementState(tab, "hover", "tab");
    }
  });

  tab.addEventListener("mouseleave", () => {
    if (!tab.classList.contains("active")) {
      updateElementState(tab, false, "tab");
    }
  });
});

// Initialize the active tab
switchTab(document.querySelector(".tab.active"));
