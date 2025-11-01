const icons = document.querySelectorAll(".icon");
const mainWindow = document.getElementById("mainWindow");
const tabContainer = document.getElementById("tabContainer");
const taskbarTasks = document.getElementById("taskbarTasks");
const closeBtn = document.querySelector(".close");
const closeMenuBtn = document.querySelector(".close-menu");
const startBtn = document.querySelector(".start-btn");
const startMenu = document.getElementById("startMenu");
const clock = document.querySelector(".clock");

let openTabs = [];
let activeTabId = null;

// Window state management
let isWindowOpen = false;

// Tab data mapping
const tabData = {
  aboutme: { title: "About Me", icon: "👤" },
  favs: { title: "Favourites", icon: "⭐" },
  contact: { title: "Contact", icon: "📞" }
};

// Open Start Menu
startBtn.addEventListener("click", () => {
  if (startMenu.classList.contains("active")) {
    startMenu.classList.remove("active");
  } else {
    startMenu.classList.add("active");
  }
});

// Close Start Menu
closeMenuBtn.addEventListener("click", () => {
  startMenu.classList.remove("active");
});

// Handle welcome menu options
document.querySelectorAll(".menu-option").forEach(option => {
  option.addEventListener("click", () => {
    const id = option.getAttribute("data-open");
    startMenu.classList.remove("active");
    openOrSwitchToTab(id);
  });
});

// Open window/tab on double click
icons.forEach(icon => {
  icon.addEventListener("dblclick", () => {
    const id = icon.getAttribute("data-window");
    openOrSwitchToTab(id);
  });
});

// Close main window
closeBtn.addEventListener("click", () => {
  mainWindow.classList.remove("active");
  isWindowOpen = false;
  updateTaskbar();
});

// Open or switch to a tab
function openOrSwitchToTab(tabId) {
  // Show main window if hidden
  if (!isWindowOpen) {
    mainWindow.classList.add("active");
    isWindowOpen = true;
  }

  // Create tab if it doesn't exist
  if (!openTabs.find(tab => tab.id === tabId)) {
    createTab(tabId);
  } else {
    switchToTab(tabId);
  }
  updateTaskbar();
}

// Create a new tab
function createTab(tabId) {
  const tab = {
    id: tabId,
    title: tabData[tabId].title,
    icon: tabData[tabId].icon
  };

  openTabs.push(tab);
  renderTabs();
  switchToTab(tabId);
}

// Switch to a specific tab
function switchToTab(tabId) {
  activeTabId = tabId;

  // Update tab visuals
  document.querySelectorAll(".tab").forEach(tabEl => {
    if (tabEl.getAttribute("data-tab-id") === tabId) {
      tabEl.classList.add("active");
    } else {
      tabEl.classList.remove("active");
    }
  });

  // Update content sections
  document.querySelectorAll(".content-section").forEach(section => {
    if (section.getAttribute("data-window") === tabId) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });

  // Update taskbar
  updateTaskbar();
}

// Render all tabs
function renderTabs() {
  tabContainer.innerHTML = "";
  openTabs.forEach(tab => {
    const tabEl = document.createElement("div");
    tabEl.className = "tab";
    tabEl.setAttribute("data-tab-id", tab.id);
    tabEl.textContent = `${tab.icon} ${tab.title}`;
    if (tab.id === activeTabId) {
      tabEl.classList.add("active");
    }
    tabEl.addEventListener("click", () => switchToTab(tab.id));
    tabContainer.appendChild(tabEl);
  });
}

// Update taskbar with current tasks (show individual tabs)
function updateTaskbar() {
  taskbarTasks.innerHTML = "";

  // Show each open tab as a separate taskbar button
  openTabs.forEach(tab => {
    const taskBtn = document.createElement("div");
    taskBtn.className = "task-button";
    if (tab.id === activeTabId) {
      taskBtn.classList.add("active");
    }
    taskBtn.innerHTML = `<span>${tab.icon}</span><span>${tab.title}</span>`;
    taskBtn.addEventListener("click", () => {
      switchToTab(tab.id);
    });
    taskbarTasks.appendChild(taskBtn);
  });
}

// Make windows draggable
let isDragging = false;
let currentX, currentY, initialX, initialY;
let activeWindow = null;

document.querySelectorAll(".window").forEach(win => {
  const titleBar = win.querySelector(".title-bar");
  titleBar.addEventListener("mousedown", (e) => dragStart(e, win));
});

document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", dragEnd);

function dragStart(e, win) {
  if (e.target.tagName === 'BUTTON') return; // Don't drag when clicking buttons
  
  initialX = e.clientX;
  initialY = e.clientY;
  activeWindow = win;
  isDragging = true;
  
  const rect = activeWindow.getBoundingClientRect();
  currentX = rect.left + rect.width / 2;
  currentY = rect.top + rect.height / 2;
}

function drag(e) {
  if (isDragging && activeWindow) {
    e.preventDefault();
    const deltaX = e.clientX - initialX;
    const deltaY = e.clientY - initialY;
    
    activeWindow.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
  }
}

function dragEnd(e) {
  if (isDragging && activeWindow) {
    const deltaX = e.clientX - initialX;
    const deltaY = e.clientY - initialY;
    activeWindow.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
  }
  isDragging = false;
  activeWindow = null;
}

// Live clock - reverted to original simple format
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
setInterval(updateClock, 1000);
updateClock();