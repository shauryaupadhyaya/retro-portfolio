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

let isWindowOpen = false;

const tabData = {
  aboutme: { title: "About Me", icon: "👤" },
  favs: { title: "Favourites", icon: "⭐" },
  contact: { title: "Contact", icon: "📞" }
};

// start menu
startBtn.addEventListener("click", () => {
  if (startMenu.classList.contains("active")) {
    startMenu.classList.remove("active");
  } else {
    startMenu.classList.add("active");
  }
});

closeMenuBtn.addEventListener("click", () => {
  startMenu.classList.remove("active");
});

// welcome menu options
document.querySelectorAll(".menu-option").forEach(option => {
  option.addEventListener("click", () => {
    const id = option.getAttribute("data-open");
    startMenu.classList.remove("active");
    openOrSwitchToTab(id);
  });
});

// open on double click
icons.forEach(icon => {
  icon.addEventListener("dblclick", () => {
    const id = icon.getAttribute("data-window");
    openOrSwitchToTab(id);
  });
});

closeBtn.addEventListener("click", () => {
  mainWindow.classList.remove("active");
  isWindowOpen = false;
  updateTaskbar();
});

// open or switch to tab
function openOrSwitchToTab(tabId) {
  if (!isWindowOpen) {
    mainWindow.classList.add("active");
    isWindowOpen = true;
  }

  if (!openTabs.find(tab => tab.id === tabId)) {
    createTab(tabId);
  } else {
    switchToTab(tabId);
  }
  updateTaskbar();
}

// new tab
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

// switching tabs
function switchToTab(tabId) {
  activeTabId = tabId;

  document.querySelectorAll(".tab").forEach(tabEl => {
    if (tabEl.getAttribute("data-tab-id") === tabId) {
      tabEl.classList.add("active");
    } else {
      tabEl.classList.remove("active");
    }
  });

  document.querySelectorAll(".content-section").forEach(section => {
    if (section.getAttribute("data-window") === tabId) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });

  updateTaskbar();
}

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

// taskbar tabs
function updateTaskbar() {
  taskbarTasks.innerHTML = "";

  // each open tab in taskbar
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

// draggable windows
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
  if (e.target.tagName === 'BUTTON') return;
  
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

// clock
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
setInterval(updateClock, 1000);
updateClock();

// loader
window.addEventListener("load", function() {
  setTimeout(function() {
    const loader = document.querySelector(".loader-wrapper");
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.5s ease-out";
    setTimeout(function() {
      loader.style.display = "none";
    }, 500);
  }, 2000);
});