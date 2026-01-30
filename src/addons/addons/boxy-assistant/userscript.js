/* Boxy AI Assistant - Main Userscript */

export default async function ({ addon, console }) {
  console.log("Boxy AI Assistant initializing...");

  // Create the Boxy container that overlays the entire editor
  const boxyContainer = document.createElement("div");
  boxyContainer.className = "boxy-assistant-container";
  addon.tab.displayNoneWhileDisabled(boxyContainer, { display: "block" });

  // Create the Boxy character element
  const boxyCharacter = document.createElement("div");
  boxyCharacter.className = "boxy-character";
  boxyCharacter.innerHTML = `
    <div class="boxy-svg-wrapper">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="270.5" height="280.97568" viewBox="0,0,270.5,280.97568">
        <defs>
          <linearGradient x1="142.89951" y1="29.74746" x2="142.89951" y2="114.55138" gradientUnits="userSpaceOnUse" id="color-1">
            <stop offset="0" stop-color="#0067bb"/>
            <stop offset="1" stop-color="#00ba87"/>
          </linearGradient>
          <linearGradient x1="332.60049" y1="29.74746" x2="332.60049" y2="114.55138" gradientUnits="userSpaceOnUse" id="color-2">
            <stop offset="0" stop-color="#0067bb"/>
            <stop offset="1" stop-color="#00ba87"/>
          </linearGradient>
          <linearGradient x1="241.5" y1="110.23784" x2="241.5" y2="255.73784" gradientUnits="userSpaceOnUse" id="color-3">
            <stop offset="0" stop-color="#0067bb"/>
            <stop offset="1" stop-color="#00ba87"/>
          </linearGradient>
          <linearGradient x1="240.5" y1="252.48784" x2="240.5" y2="314.98784" gradientUnits="userSpaceOnUse" id="color-4">
            <stop offset="0" stop-color="#0067bb"/>
            <stop offset="1" stop-color="#00ba87"/>
          </linearGradient>
        </defs>
        <g transform="translate(-104.75,-39.51216)">
          <g data-paper-data='{"isPaintingLayer":true}' fill-rule="nonzero" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">
            <path d="M196.75,114.55138l-86.5,-69.53922" fill="none" stroke="url(#color-1)" stroke-width="11" stroke-linecap="round"/>
            <path d="M365.25,45.01217l-86.5,69.53922" data-paper-data='{"index":null}' fill="none" stroke="url(#color-2)" stroke-width="11" stroke-linecap="round"/>
            <path d="M132,255.73784v-145.5h219v145.5z" fill="#032500" stroke="url(#color-3)" stroke-width="10.5" stroke-linecap="butt"/>
            <!-- Eyes - can be animated later -->
            <path class="boxy-eye boxy-left-eye" d="M153.75,165.05138v-18h22.90527v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path class="boxy-eye boxy-right-eye" d="M253.25,165.55138v-18h22.90526v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <!-- Mouth -->
            <path d="M226.15527,202.55138v18h-22.90527v-18z" data-paper-data='{"index":null}' fill="#00ff2a" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M174.97106,150.55138v-18h22.90526v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M274.47105,151.05138v-18h22.90526v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M247.37632,217.05138v18h-22.90526v-18z" data-paper-data='{"index":null}' fill="#00ff2a" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M194.84474,165.05138v-18h22.90527v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M294.34474,165.55138v-18h22.90526v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M267.25,202.55138v18h-22.90527v-18z" data-paper-data='{"index":null}' fill="#00ff2a" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <!-- Body base -->
            <path d="M111.25,314.98784v-62.5h258.5v62.5z" fill="#000000" stroke="url(#color-4)" stroke-width="11" stroke-linecap="butt"/>
            <path d="M133.25,272.91641v-6.42857h20v6.42857z" fill="#ffcf00" stroke="none" stroke-width="11" stroke-linecap="butt"/>
            <path d="M306.53571,263.20213h6.42857v20h-6.42857z" fill="#00fff0" stroke="none" stroke-width="11" stroke-linecap="butt"/>
            <path d="M318.03571,263.20213h6.42857v34.5h-6.42857z" fill="#00fff0" stroke="none" stroke-width="11" stroke-linecap="butt"/>
            <path d="M330.03571,263.20213h6.42857v13h-6.42857z" fill="#00fff0" stroke="none" stroke-width="11" stroke-linecap="butt"/>
            <path d="M133.25,284.41641v-6.42857h20v6.42857z" fill="#ffcf00" stroke="none" stroke-width="11" stroke-linecap="butt"/>
            <path d="M133.25,295.91641v-6.42857h20v6.42857z" fill="#ffcf00" stroke="none" stroke-width="11" stroke-linecap="butt"/>
            <path d="M178.75,281.23784c0,4.55635 -3.35786,8.25 -7.5,8.25c-4.14214,0 -7.5,-3.69365 -7.5,-8.25c0,-4.55635 3.35786,-8.25 7.5,-8.25c4.14214,0 7.5,3.69365 7.5,8.25z" fill="#00ff05" stroke="none" stroke-width="0" stroke-linecap="butt"/>
          </g>
        </g>
      </svg>
    </div>
  `;

  // Create text bubble for Boxy's messages
  const textBubble = document.createElement("div");
  textBubble.className = "boxy-text-bubble";
  textBubble.style.display = "none"; // Hidden by default
  textBubble.innerHTML = `
    <div class="boxy-bubble-content">
      <p class="boxy-message">Hi! I'm Boxy, your AI assistant!</p>
    </div>
  `;

  // Assemble the components
  boxyContainer.appendChild(boxyCharacter);
  boxyContainer.appendChild(textBubble);

  // Wait for the editor to be ready
  while (true) {
    const stageWrapper = await addon.tab.waitForElement('[class*="stage-wrapper"]', {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED"],
    });

    if (addon.tab.editorMode === "editor") {
      // Add Boxy to the editor
      document.body.appendChild(boxyContainer);
      console.log("Boxy added to editor!");
      
      // Initialize Boxy's position (bottom right corner)
      initializeBoxyPosition();
      
      // Make Boxy draggable
      makeBoxyDraggable();
      
      // Show welcome message after a short delay
      setTimeout(() => {
        showBoxyMessage("Hi! I'm Boxy, your AI assistant! Click and drag me to move me around!");
      }, 1000);
      
      break;
    }
  }

  // Initialize Boxy's starting position
  function initializeBoxyPosition() {
    boxyCharacter.style.left = "calc(100vw - 200px)";
    boxyCharacter.style.top = "calc(100vh - 300px)";
  }

  // Make Boxy draggable
  function makeBoxyDraggable() {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    boxyCharacter.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    function dragStart(e) {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === boxyCharacter || boxyCharacter.contains(e.target)) {
        isDragging = true;
        boxyCharacter.classList.add("dragging");
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setBoxyTranslate(currentX, currentY);
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;

      isDragging = false;
      boxyCharacter.classList.remove("dragging");
    }

    function setBoxyTranslate(xPos, yPos) {
      boxyCharacter.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
  }

  // Show a message in Boxy's text bubble
  function showBoxyMessage(message, duration = 5000) {
    const messageElement = textBubble.querySelector(".boxy-message");
    messageElement.textContent = message;
    textBubble.style.display = "block";

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        textBubble.style.display = "none";
      }, duration);
    }
  }

  // Animation system (placeholder for future animations)
  const animationState = {
    current: "idle",
    isAnimating: false
  };

  // Future: Wave animation
  function playWaveAnimation() {
    console.log("Wave animation would play here");
    // TODO: Implement wave animation
  }

  // Future: Point animation (for pointing at blocks/buttons)
  function playPointAnimation(targetElement) {
    console.log("Point animation would play here", targetElement);
    // TODO: Implement pointing animation
  }

  // Expose API for future AI integration
  window.boxyAPI = {
    showMessage: showBoxyMessage,
    moveTo: (x, y) => {
      boxyCharacter.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    playAnimation: (animationName) => {
      console.log(`Playing animation: ${animationName}`);
      // TODO: Implement animation system
    }
  };

  console.log("Boxy AI Assistant fully initialized!");
}
