document.getElementById("playVideoButton").addEventListener("click", () => {
  document
    .getElementById("videoSection")
    .scrollIntoView({ behavior: "smooth" });
});

// Load and populate the comparison table
async function loadComparison() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    const regulierFeatures = document.querySelector(".regulier .plan-features");
    const agoraFeatures = document.querySelector(".agora .plan-features");

    // Clear existing content
    regulierFeatures.innerHTML = "";
    agoraFeatures.innerHTML = "";

    // Add new features
    for (const [subject, details] of Object.entries(data)) {
      // Regulier feature
      const regulierFeature = document.createElement("div");
      regulierFeature.className = "feature-item";
      regulierFeature.innerHTML = `
        <h4>${subject}</h4>
        <p>${details.Regulier}</p>
      `;
      regulierFeatures.appendChild(regulierFeature);

      // Agora feature
      const agoraFeature = document.createElement("div");
      agoraFeature.className = "feature-item";
      agoraFeature.innerHTML = `
        <h4>${subject}</h4>
        <p>${details.Agora}</p>
      `;
      agoraFeatures.appendChild(agoraFeature);
    }
  } catch (error) {
    console.error("Error loading comparison data:", error);
  }
}

// Initialize the comparison table when the page loads
document.addEventListener("DOMContentLoaded", loadComparison);

// Show comparison section after video ends
document.getElementById("videoPlayer").addEventListener("ended", () => {
  document
    .getElementById("comparisonSection")
    .scrollIntoView({ behavior: "smooth" });
});

// Add swipe functionality
function initializeSwipe() {
  const container = document.querySelector(".cards-wrapper");
  const indicators = document.querySelectorAll(".indicator");
  let startX;
  let currentX;
  let isPressed = false;
  let currentCard = 0;

  function updateIndicators(index) {
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === index);
    });
  }

  function showCard(index) {
    currentCard = index;
    const offset = index * -100;
    container.style.transform = `translateX(${offset}%)`;
    updateIndicators(index);
  }

  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isPressed = true;
  });

  container.addEventListener("touchmove", (e) => {
    if (!isPressed) return;
    e.preventDefault();
    currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    const percentMove = (diff / window.innerWidth) * 100;

    if ((currentCard === 0 && diff < 0) || (currentCard === 1 && diff > 0)) {
      return;
    }

    const offset = -(currentCard * 100 + percentMove);
    container.style.transform = `translateX(${offset}%)`;
  });

  container.addEventListener("touchend", (e) => {
    if (!isPressed) return;
    isPressed = false;
    const diff = startX - currentX;
    const threshold = window.innerWidth * 0.2;

    if (Math.abs(diff) > threshold) {
      showCard(
        diff > 0 ? Math.min(currentCard + 1, 1) : Math.max(currentCard - 1, 0)
      );
    } else {
      showCard(currentCard);
    }
  });

  // Add click handlers for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => showCard(index));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadComparison();
  initializeSwipe();
});
