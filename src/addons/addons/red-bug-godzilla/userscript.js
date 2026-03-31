const STOMP_INTERVAL_MS = 2 * 60 * 1000;

export default async function ({ addon }) {
  const godzilla = document.createElement("div");
  godzilla.className = "sa-red-bug-godzilla";
  godzilla.style.setProperty("--sa-red-bug-godzilla-image", `url("${addon.self.getResource("/red-bug-godzilla.svg")}")`);
  godzilla.dataset.variant = pickVariant();
  addon.tab.displayNoneWhileDisabled(godzilla);

  let stop = setupStomping(godzilla);

  addon.self.addEventListener("disabled", () => {
    stop();
    godzilla.remove();
  });

  addon.self.addEventListener("reenabled", () => {
    if (!document.body.contains(godzilla)) {
      document.body.appendChild(godzilla);
      stop = setupStomping(godzilla);
    }
  });
}

const setupStomping = godzilla => {
  let stompInterval = null;
  let stompTimeout = null;

  const stomp = () => {
    if (stompTimeout) {
      clearTimeout(stompTimeout);
    }
    godzilla.dataset.visible = "true";
    godzilla.classList.remove("sa-red-bug-godzilla--stomping");
    // Force animation restart.
    void godzilla.offsetWidth;
    godzilla.classList.add("sa-red-bug-godzilla--stomping");
    stompTimeout = setTimeout(() => {
      godzilla.classList.remove("sa-red-bug-godzilla--stomping");
      godzilla.dataset.visible = "false";
    }, 7100);
  };

  if (!document.body.contains(godzilla)) {
    document.body.appendChild(godzilla);
  }

  stomp();
  stompInterval = setInterval(stomp, STOMP_INTERVAL_MS);

  return () => {
    if (stompInterval) {
      clearInterval(stompInterval);
    }
    if (stompTimeout) {
      clearTimeout(stompTimeout);
    }
  };
};

const pickVariant = () => {
  const randomValue = Math.random();
  if (randomValue < 0.05) {
    return Math.random() < 0.5 ? "blue" : "green";
  }
  return "red";
};
