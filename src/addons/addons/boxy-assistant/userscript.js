/* Boxy AI Assistant - Main Userscript */

export default async function ({ addon, console }) {
  console.log("Boxy AI Assistant initializing...");

  // Create the Boxy container that overlays the entire editor
  const boxyContainer = document.createElement("div");
  boxyContainer.className = "boxy-assistant-container";
  boxyContainer.setAttribute("role", "complementary");
  boxyContainer.setAttribute("aria-label", "Boxy AI Assistant - Your coding helper");
  addon.tab.displayNoneWhileDisabled(boxyContainer, { display: "block" });

  // Create the Boxy character element
  const boxyCharacter = document.createElement("div");
  boxyCharacter.className = "boxy-character";
  boxyCharacter.setAttribute("role", "button");
  boxyCharacter.setAttribute("aria-label", "Boxy - Click to chat, or drag to move");
  boxyCharacter.setAttribute("tabindex", "0");
  boxyCharacter.innerHTML = `
    <div class="boxy-svg-wrapper">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="270.5" height="280.97568" viewBox="0,0,270.5,280.97568">
        <defs>
          <linearGradient x1="142.89951" y1="29.74746" x2="142.89951" y2="114.55138" gradientUnits="userSpaceOnUse" id="boxy-color-1">
            <stop offset="0" stop-color="#0067bb"/>
            <stop offset="1" stop-color="#00ba87"/>
          </linearGradient>
          <linearGradient x1="332.60049" y1="29.74746" x2="332.60049" y2="114.55138" gradientUnits="userSpaceOnUse" id="boxy-color-2">
            <stop offset="0" stop-color="#0067bb"/>
            <stop offset="1" stop-color="#00ba87"/>
          </linearGradient>
          <linearGradient x1="241.5" y1="110.23784" x2="241.5" y2="255.73784" gradientUnits="userSpaceOnUse" id="boxy-color-3">
            <stop offset="0" stop-color="#0067bb"/>
            <stop offset="1" stop-color="#00ba87"/>
          </linearGradient>
          <linearGradient x1="240.5" y1="252.48784" x2="240.5" y2="314.98784" gradientUnits="userSpaceOnUse" id="boxy-color-4">
            <stop offset="0" stop-color="#0067bb"/>
            <stop offset="1" stop-color="#00ba87"/>
          </linearGradient>
        </defs>
        <g transform="translate(-104.75,-39.51216)">
          <g data-paper-data='{"isPaintingLayer":true}' fill-rule="nonzero" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">
            <path d="M196.75,114.55138l-86.5,-69.53922" fill="none" stroke="url(#boxy-color-1)" stroke-width="11" stroke-linecap="round"/>
            <path d="M365.25,45.01217l-86.5,69.53922" data-paper-data='{"index":null}' fill="none" stroke="url(#boxy-color-2)" stroke-width="11" stroke-linecap="round"/>
            <path d="M132,255.73784v-145.5h219v145.5z" fill="#032500" stroke="url(#boxy-color-3)" stroke-width="10.5" stroke-linecap="butt"/>
            <path class="boxy-eye boxy-left-eye" d="M153.75,165.05138v-18h22.90527v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path class="boxy-eye boxy-right-eye" d="M253.25,165.55138v-18h22.90526v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M226.15527,202.55138v18h-22.90527v-18z" data-paper-data='{"index":null}' fill="#00ff2a" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M174.97106,150.55138v-18h22.90526v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M274.47105,151.05138v-18h22.90526v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M247.37632,217.05138v18h-22.90526v-18z" data-paper-data='{"index":null}' fill="#00ff2a" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M194.84474,165.05138v-18h22.90527v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M294.34474,165.55138v-18h22.90526v18z" fill="#ffcd00" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M267.25,202.55138v18h-22.90527v-18z" data-paper-data='{"index":null}' fill="#00ff2a" stroke="none" stroke-width="10.5" stroke-linecap="butt"/>
            <path d="M111.25,314.98784v-62.5h258.5v62.5z" fill="#000000" stroke="url(#boxy-color-4)" stroke-width="11" stroke-linecap="butt"/>
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
  textBubble.style.display = "none";
  textBubble.setAttribute("role", "status");
  textBubble.setAttribute("aria-live", "polite");
  textBubble.innerHTML = `
    <div class="boxy-bubble-content">
      <p class="boxy-message">Hi! I'm Boxy, your AI assistant!</p>
    </div>
  `;

  // Create chat interface
  const chatInterface = document.createElement("div");
  chatInterface.className = "boxy-chat-interface";
  chatInterface.style.display = "none";
  chatInterface.setAttribute("role", "dialog");
  chatInterface.setAttribute("aria-label", "Chat with Boxy");
  chatInterface.innerHTML = `
    <div class="boxy-chat-header">
      <h3>Chat with Boxy</h3>
      <button class="boxy-chat-close" aria-label="Close chat">×</button>
    </div>
    <div class="boxy-chat-messages" role="log" aria-live="polite" aria-atomic="false">
      <div class="boxy-chat-message boxy-message-bot">
        <div class="boxy-chat-avatar">🤖</div>
        <div class="boxy-chat-text">Hi! I'm Boxy, your AI assistant! I can help you learn to code. To get started, you'll need to provide an API key from Pollinations AI.</div>
      </div>
    </div>
    <div class="boxy-chat-input-area">
      <input type="text" class="boxy-chat-input" placeholder="Type your message..." aria-label="Chat message input" />
      <button class="boxy-chat-send" aria-label="Send message">Send</button>
    </div>
    <div class="boxy-api-key-setup" style="display: block;">
      <p><strong>⚠️ API Key Required</strong></p>
      <p>Boxy uses Pollinations AI (BYOK - Bring Your Own Key). Get your free key at <a href="https://enter.pollinations.ai" target="_blank">enter.pollinations.ai</a></p>
      <input type="password" class="boxy-api-key-input" placeholder="Enter your API key..." aria-label="API key input" />
      <button class="boxy-api-key-save">Save Key</button>
    </div>
  `;

  // Assemble the components
  boxyContainer.appendChild(boxyCharacter);
  boxyContainer.appendChild(textBubble);
  boxyContainer.appendChild(chatInterface);

  // State variables
  let xOffset = 0;
  let yOffset = 0;
  let boxyHideTimeoutId = null;
  let apiKey = localStorage.getItem('boxy-api-key') || '';
  let chatHistory = [];

  // Wait for the editor to be ready
  while (true) {
    await addon.tab.waitForElement('[class*="stage-wrapper"]', {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED"],
    });

    if (addon.tab.editorMode === "editor") {
      document.body.appendChild(boxyContainer);
      console.log("Boxy added to editor!");
      
      initializeBoxyPosition();
      makeBoxyDraggable();
      setupChatInterface();
      
      setTimeout(() => {
        showBoxyMessage("Hi! I'm Boxy! Click me to chat, or drag me to move!");
      }, 1000);
      
      break;
    }
  }

  // Initialize Boxy's starting position
  function initializeBoxyPosition() {
    boxyCharacter.style.left = "calc(100vw - 200px)";
    boxyCharacter.style.top = "calc(100vh - 300px)";
  }

  // Update text bubble position relative to Boxy
  function updateBubblePosition() {
    const boxyRect = boxyCharacter.getBoundingClientRect();
    textBubble.style.left = `${boxyRect.left}px`;
    textBubble.style.top = `${boxyRect.top - textBubble.offsetHeight - 20}px`;
  }

  // Make Boxy draggable
  function makeBoxyDraggable() {
    let isDragging = false;
    let dragMoved = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    function dragStart(e) {
      if (e.type === "mousedown") {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      } else if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      }

      if (e.target === boxyCharacter || boxyCharacter.contains(e.target)) {
        isDragging = true;
        dragMoved = false;
        boxyCharacter.classList.add("dragging");
        
        // Attach drag listeners only when dragging starts
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchmove", drag);
        document.addEventListener("touchend", dragEnd);
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        dragMoved = true;
        
        if (e.type === "mousemove") {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        } else if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setBoxyTranslate(currentX, currentY);
        updateBubblePosition();
      }
    }

    function dragEnd(e) {
      if (isDragging) {
        // Only update if we actually computed positions
        if (typeof currentX === "number" && typeof currentY === "number") {
          initialX = currentX;
          initialY = currentY;
        }

        isDragging = false;
        boxyCharacter.classList.remove("dragging");
        
        // Remove drag listeners
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", dragEnd);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("touchend", dragEnd);

        // If we didn't move much, treat it as a click
        if (!dragMoved) {
          toggleChat();
        }
      }
    }

    function setBoxyTranslate(xPos, yPos) {
      boxyCharacter.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Keyboard support for accessibility
    function handleKeyDown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleChat();
      } else if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 5;
        switch (e.key) {
          case "ArrowLeft":
            xOffset -= step;
            break;
          case "ArrowRight":
            xOffset += step;
            break;
          case "ArrowUp":
            yOffset -= step;
            break;
          case "ArrowDown":
            yOffset += step;
            break;
        }
        currentX = xOffset;
        currentY = yOffset;
        setBoxyTranslate(xOffset, yOffset);
        updateBubblePosition();
      }
    }

    boxyCharacter.addEventListener("mousedown", dragStart);
    boxyCharacter.addEventListener("touchstart", dragStart);
    boxyCharacter.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    const cleanup = () => {
      boxyCharacter.removeEventListener("mousedown", dragStart);
      boxyCharacter.removeEventListener("touchstart", dragStart);
      boxyCharacter.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", dragEnd);
      document.removeEventListener("touchmove", drag);
      document.removeEventListener("touchend", dragEnd);
    };

    return cleanup;
  }

  // Show a message in Boxy's text bubble
  function showBoxyMessage(message, duration = 5000) {
    const messageElement = textBubble.querySelector(".boxy-message");
    messageElement.textContent = message;
    textBubble.style.display = "block";
    updateBubblePosition();

    // Clear any existing timeout
    if (boxyHideTimeoutId !== null) {
      clearTimeout(boxyHideTimeoutId);
      boxyHideTimeoutId = null;
    }

    // Auto-hide after duration
    if (duration > 0) {
      boxyHideTimeoutId = setTimeout(() => {
        textBubble.style.display = "none";
        boxyHideTimeoutId = null;
      }, duration);
    }
  }

  // Toggle chat interface
  function toggleChat() {
    const isVisible = chatInterface.style.display !== "none";
    chatInterface.style.display = isVisible ? "none" : "block";
    
    if (!isVisible) {
      // Position chat near Boxy
      const boxyRect = boxyCharacter.getBoundingClientRect();
      chatInterface.style.left = `${Math.max(20, boxyRect.left - 320)}px`;
      chatInterface.style.top = `${Math.max(20, boxyRect.top)}px`;
      
      // Focus input
      const input = chatInterface.querySelector(".boxy-chat-input");
      if (apiKey) {
        input.focus();
      }
    }
  }

  // Setup chat interface handlers
  function setupChatInterface() {
    const closeBtn = chatInterface.querySelector(".boxy-chat-close");
    const sendBtn = chatInterface.querySelector(".boxy-chat-send");
    const input = chatInterface.querySelector(".boxy-chat-input");
    const apiKeyInput = chatInterface.querySelector(".boxy-api-key-input");
    const apiKeySaveBtn = chatInterface.querySelector(".boxy-api-key-save");
    const messagesContainer = chatInterface.querySelector(".boxy-chat-messages");
    const apiKeySetup = chatInterface.querySelector(".boxy-api-key-setup");

    // Load saved API key
    if (apiKey) {
      apiKeySetup.style.display = "none";
      apiKeyInput.value = apiKey;
    }

    closeBtn.addEventListener("click", () => {
      chatInterface.style.display = "none";
    });

    apiKeySaveBtn.addEventListener("click", () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        apiKey = key;
        localStorage.setItem('boxy-api-key', key);
        apiKeySetup.style.display = "none";
        addChatMessage("API key saved! You can now chat with me.", "bot");
        input.focus();
      } else {
        alert("Please enter a valid API key");
      }
    });

    async function sendMessage() {
      const message = input.value.trim();
      if (!message) return;

      if (!apiKey) {
        addChatMessage("Please set up your API key first!", "bot");
        return;
      }

      // Add user message
      addChatMessage(message, "user");
      input.value = "";

      // Check for vibe coding request
      if (message.toLowerCase().includes("write") && (message.toLowerCase().includes("code") || message.toLowerCase().includes("program"))) {
        addChatMessage("Sorry, buddy. I can suggest things to you, help you learn a concept, or brainstorm fun things, but if you're here to vibe code, this ain't the place for you, pal. 😊", "bot");
        return;
      }

      // Show thinking state
      addChatMessage("...", "bot", true);

      try {
        // Call Pollinations AI API
        const response = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(message)}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        // Remove thinking message
        const thinkingMsg = messagesContainer.querySelector(".boxy-thinking");
        if (thinkingMsg) thinkingMsg.remove();

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const aiResponse = await response.text();
        addChatMessage(aiResponse, "bot");
        
        // Add to history
        chatHistory.push({ role: "user", content: message });
        chatHistory.push({ role: "assistant", content: aiResponse });

      } catch (error) {
        console.error("Chat error:", error);
        const thinkingMsg = messagesContainer.querySelector(".boxy-thinking");
        if (thinkingMsg) thinkingMsg.remove();
        addChatMessage(`Oops! Something went wrong: ${error.message}. Please check your API key.`, "bot");
      }
    }

    function addChatMessage(text, sender, isThinking = false) {
      const msgDiv = document.createElement("div");
      msgDiv.className = `boxy-chat-message boxy-message-${sender}`;
      if (isThinking) msgDiv.classList.add("boxy-thinking");
      
      msgDiv.innerHTML = `
        <div class="boxy-chat-avatar">${sender === "bot" ? "🤖" : "👤"}</div>
        <div class="boxy-chat-text">${text}</div>
      `;
      
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // Expose API for future integrations
  window.boxyAPI = {
    showMessage: showBoxyMessage,
    moveTo: (x, y) => {
      // Reset offsets when programmatically moving
      xOffset = x;
      yOffset = y;
      boxyCharacter.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      updateBubblePosition();
    },
    openChat: () => {
      if (chatInterface.style.display === "none") {
        toggleChat();
      }
    },
    closeChat: () => {
      chatInterface.style.display = "none";
    }
  };

  // Cleanup on addon disable
  addon.self.addEventListener("disabled", () => {
    if (boxyHideTimeoutId !== null) {
      clearTimeout(boxyHideTimeoutId);
    }
    if (window.boxyAPI) {
      delete window.boxyAPI;
    }
  });

  console.log("Boxy AI Assistant fully initialized!");
}
