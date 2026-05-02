const desktop = document.getElementById('desktop');
const runningAppsContainer = document.getElementById('running-apps');

let apps = System_apps

function closeLoading(){
let loadingScreen = document.getElementById("star-loader");
loadingScreen.style.display = "none";


}


if (typeof installedApps !== 'undefined') {
    for (let i = 0; i < installedApps.length; i++) {
        apps.push(installedApps[i]);
    }
}

// FIXED: Better z-index counter
let nextZIndex = 10;  // start higher than taskbar etc

function openWindow(icon, title, url, width, height, resizable, top, left,file="none",folder="none") {
    const windowId = title.replace(/\s+/g, '-').toLowerCase();

    // FIXED: Singleton - if already open, just focus + bring to front
    if (document.getElementById(windowId)) {
        const existing = document.getElementById(windowId);
        existing.style.display = 'flex';
        existing.style.zIndex = nextZIndex++;
        focusWindow(windowId);
        return;
    }
    let finalUrl = url;
    if (file !== "none" && folder !== "none") {
        const separator = url.includes('?') ? '&' : '?';
        finalUrl = `${url}${separator}openedFile=${encodeURIComponent(file)}&openedFolder=${encodeURIComponent(folder)}`;
    }


    const win = document.createElement('div');
    win.id = windowId;
    win.className = 'window';
    win.style.width = width || '600px';
    win.style.height = height || '400px';
    win.style.left = left || '100px';
    win.style.top = top || '100px';
    win.style.zIndex = nextZIndex++;

    const resizeControls = resizable === "true" 
        ? `<button class="window-resize-btn" onclick="maximize('${windowId}')">❐</button>`
        : `<button class="window-resize-btn-not" style="opacity:0.5;">❐</button>`;

    win.innerHTML = `
<div class="window-header" id="${windowId}-header">
        <div class="window-title">
            <img src="${icon}" class="window-icon">
            <span>${title}</span>
        </div>
        <div class="window-controls">
            <button class="window-minimize-btn" style="font-weight:bold;" onclick="openMinimize('${windowId}')">—</button>
            ${resizeControls}
            <button class="window-close-btn" onclick="closeWindow('${windowId}')">⤬</button>
        </div>
    </div>
    <div class="window-content" style="position: relative; flex-grow: 1;">
        <!-- The loader div - starts visible -->
        <div id="loader-${windowId}" class="window-loader">
            <div class="star-dance">✦</div>
        </div>

        <!-- Overlay (you already have this, keeping it) -->
        <div class="iframe-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: none; z-index: 10;"></div>
        
        <!-- Iframe with onload -->
        <iframe 
            src="${finalUrl}" 
            style="width:100%; height:100%; border:none;"
            onload="document.getElementById('loader-${windowId}').style.display = 'none';">
        </iframe>
    </div>
    `;

    // Store window data
    windows[windowId] = {
        "id": windowId,
        "top": win.style.top,
        "left": win.style.left,
        "width": win.style.width,
        "height": win.style.height,
        "z-index": win.style.zIndex,
        "state": "open",
        "name": title,
        "url": url,
        "icon": icon
    };

    win.onclick = () => focusWindow(windowId);

    desktop.appendChild(win);
    dragWindow(windows[windowId]);

    // Taskbar item
    const taskItem = document.createElement('div');
    taskItem.id = `task-${windowId}`;
    taskItem.className = 'taskbar-item';
    taskItem.onclick = () => toggleWindow(windowId);
    taskItem.innerHTML = `<img src="${icon}" title="${title}">`;
    runningAppsContainer.appendChild(taskItem);

    focusWindow(windowId);
}


function focusWindow(id) {
    if (activeWindow.now === id) return;

    // Remove highlight from previous
    if (activeWindow.now && document.getElementById("task-" + activeWindow.now)) {
        document.getElementById("task-" + activeWindow.now).style.borderBottom = "solid 2px transparent";
    }

    activeWindow.before = activeWindow.now;
    activeWindow.now = id;

    // Bring to front
    if (windows[id]) {
        windows[id]["z-index"] = nextZIndex++;
        document.getElementById(id).style.zIndex = windows[id]["z-index"];
    }

    // Highlight taskbar
    if (document.getElementById("task-" + id)) {
        document.getElementById("task-" + id).style.borderBottom = "solid 2px rgb(0,150,250)";
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    const task = document.getElementById(`task-${id}`);

    if (!win) return;

    win.style.animationName = "windowClose";
    if (task) task.style.animationName = "goingOut";

    setTimeout(() => {
        delete windows[id];
        win.remove();
        if (task) task.remove();

        // FIXED: Smarter active fallback
        if (activeWindow.now === id) {
            activeWindow.now = "";
            activeWindow.before = "";

            // Look for the most recently active window that is still actually open/visible
            for (const winId in windows) {
                const w = document.getElementById(winId);
                if (w && w.style.display !== 'none') {
                    focusWindow(winId);
                    break;
                }
            }

            // If literally nothing is open anymore, clear taskbar highlights
            if (activeWindow.now === "") {
                document.querySelectorAll('.taskbar-item').forEach(item => {
                    item.style.borderBottom = "solid 2px transparent";
                });
            }
        }
    }, 400);

        // Make sure no stale highlights remain
    document.querySelectorAll('.taskbar-item').forEach(item => {
        if (item.id !== `task-${id}`) {
            item.style.borderBottom = "solid 2px transparent";
        }
    });
}

function toggleWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    if (win.style.display === 'none') {
        win.style.display = 'flex';
        win.style.animationName = 'opening';
        focusWindow(id);
    } else {
        if (activeWindow.now === id) {
            win.style.animationName = "minimizing";
            setTimeout(() => {
                win.style.display = 'none';
                if (document.getElementById("task-" + id)) {
                    document.getElementById("task-" + id).style.borderBottom = "solid 2px transparent";
                }
            }, 400);
        } else {
            focusWindow(id);
        }
    }
}

// Load desktop icons
for (let i = 0; i < apps.length; i++) {

if (apps[i]["desktop"] != "false") {

    
    
    let iconArea = document.getElementById("icon-area");
    let icon = document.createElement('div');
    icon.className = "desktop-icon";
    icon.onclick = () => {
        openWindow(
            apps[i]["icon"],
            apps[i]["name"],
            apps[i]["url"],
            apps[i]["width"],
            apps[i]["height"],
            apps[i]["resizable"],
            apps[i]["top"],
            apps[i]["left"]
        );
    };

    let img = document.createElement('img');
    let title = document.createElement('p');
    img.src = apps[i]["icon"];
    title.textContent = apps[i]["name"];
    img.style.width = "40px";

    icon.appendChild(img);
    icon.appendChild(title);
    iconArea.appendChild(icon);
}
}

// Clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('taskbar-time').textContent = `${hours}:${minutes}`;

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('taskbar-date').textContent = `${day}/${month}/${year}`;
}
updateClock();
setInterval(updateClock, 60000);

// Notifications
function toggleNotifs() {
    const panel = document.getElementById('notification-panel');
    panel.classList.toggle('hidden');
}

document.getElementById('notification-btn').onclick = toggleNotifs;

function addNotification(imgSrc, title, message) {

    let silentApps = JSON.parse(localStorage.getItem("system-settings"))["silent-apps"] || [];
    
    // If the app title is in the muted list, we stay quiet
    if (silentApps.includes(title)) {
        console.log(`${title} is muted. No notification shown.`);
        return;
    }



    const toastContainer = document.getElementById('toast-container');
    const centerContainer = document.getElementById('notif-container');

    const toast = document.createElement('div');
    toast.className = 'toast-card';
    toast.innerHTML = `
        <img src="${imgSrc}" style="width:40px; height:40px; border-radius:5px;">
        <div class="notif-content">
            <div class="notif-title" style="font-weight:bold; font-size:13px;">${title}</div>
            <div class="notif-message" style="font-size:12px; opacity:0.8;">${message}</div>
        </div>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 5000);

    const historyCard = document.createElement('div');
    historyCard.className = 'notif-card';
    historyCard.innerHTML = `
        <img src="${imgSrc}">
        <div class="notif-content">
            <div class="notif-title">${title}</div>
            <div class="notif-message">${message}</div>
        </div>
    `;
    centerContainer.prepend(historyCard);
}

function clearAllNotifications() {
    const container = document.getElementById('notif-container');
    container.innerHTML = `<p style="text-align:center; opacity:0.5; font-size:12px; margin-top:20px;">No notifications</p>`;
}




// Toggle Start Menu
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

const menuGrid = document.getElementById('start-menu-grid');
const emptyMenu = menuGrid
startBtn.onclick = (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('active');
    menuGrid.innerHTML = '';

apps.forEach(app => {
    const item = document.createElement('div');
    item.className = 'start-app-item';
    item.onclick = () => {
        openWindow(app.icon, app.name, app.url, app.width, app.height, app.resizable, app.top, app.left);
        startMenu.classList.remove('active');
    };
    item.innerHTML = `
        <img src="${app.icon}">
        <span>${app.name}</span>
        `;
        menuGrid.appendChild(item);
    });
};

// Close menu when clicking outside
document.addEventListener('click', () => {
    startMenu.classList.remove('active');
});

startMenu.onclick = (e) => e.stopPropagation();





// Listener for System Settings Updates
window.addEventListener('message', (event) => {
    const data = event.data;

if (data.type === 'OPEN_FILE') {
 const settings = JSON.parse(localStorage.getItem("system-settings")) || system_settings;
        const defaultApps = settings.default_apps || {};

        // 2. Identify the target app based on file extension/type
        // If the type isn't in settings, we default to the 'txt' handler (Notepad)
        const appData = defaultApps[data.fileType] || defaultApps["txt"];

        if (appData) {
            console.log(`Kernel: Launching ${appData.name} for ${data.fileName} in ${data.folderName}`);
            
            // 3. Call openWindow using the JSON data directly
            openWindow(
                appData.icon,
                appData.name,
                appData.url,
                appData.width,
                appData.height,
                appData.resizable,
                appData.top,
                appData.left,
                data.fileName,   // Passing the file name for the app to request
                data.folderName  // Passing the folder name for the app to request
            );
        } else {
            // Last resort fallback if even 'txt' handler is missing
            addNotification("System-apps/error.png", "System", `No compatible app found. type : ${data.fileType}`);
        }
    }

    // 2. The Data Pipe: DELIVER file content to sandboxed apps
    if (data.type === 'REQUEST_FILE_CONTENT') {
        const folderItems = JSON.parse(localStorage.getItem(data.folder) || "[]");
        const file = folderItems.find(f => f.name === data.file);

        if (file) {
            event.source.postMessage({
                type: 'DELIVER_FILE_CONTENT',
                content: file.content,
                fileName: file.name,
                fileType: file.type
            }, "*");
        }
    }

    // 3. System Commands
    if (data.type === 'RELOAD_SETTINGS') {
        applySystemSettings();
        addNotification("System-apps/settings.png", "System", "Appearance updated.");
    }


    if (data.type === 'UPDATE_SETTINGS') {

        if (data.key === 'wallpaper-url') {
            // Update the live wallpaper immediately
            document.body.style.backgroundImage = `url(${data.value})`;
            
            // Update localStorage so it persists
            let current = JSON.parse(localStorage.getItem("system-wallpaper"));
            current.url = data.value;
            localStorage.setItem("system-wallpaper", JSON.stringify(current));
        }

        if (data.key === 'toggle-service') {
            const serviceIndex = data.index;
            // Logic to clear or restart intervals could go here
            addNotification("System-apps/settings.png", "Services", `${data.name} status updated.`);
        }
    }


    if (event.data.type === 'PUSH_NOTIF') {
        const { icon, title, message } = event.data;
        addNotification(icon, title, message);
    }
    if (event.data.type === 'SPAWN_APP') {
        const c = event.data.config;
        openWindow(c.icon, c.name, c.url, c.width, c.height, c.resizable, c.top, c.left);
    }

    if (event.data.type === 'UNINSTALL_APP') {
        // This will refresh the desktop icons automatically 
        // because your services.js is watching localStorage.apps
        addNotification("System-apps/settings.png", "System", `${event.data.name} removed successfully.`);
    }

        if (event.data.type === 'PUSH_WIDGET') {
        const { id, html, w, h, x = "0px", y = "0px" } = event.data;

        // 1. Better Duplicate Check: Look for the specific ID
        const exists = widgets.find(w => w.id === id);
        if (exists) return;

        // 2. Create the new widget object
        const newWidget = {
            "id": id,
            "code": html,
            "width": w,
            "height": h,
            "top": x,
            "left": y
        };

        // 3. Update the list correctly
        // Use .push() to modify the actual array
        widgets.push(newWidget);
        
        // 4. Save to LocalStorage
        localStorage.setItem("system-widgets", JSON.stringify(widgets));

        // 5. Render it on the screen
        addWidget(id, html, w, h, x, y);
    }

        if (event.data.type === 'PUSH_SERVICE') {

        const { name, icon, code, interval } = event.data;

        // Check if service already exists to prevent memory leaks
        const exists = serviceList.find(s => s.name === name);
        if (exists) {
            console.log(`[Kernel] Service ${name} is already running.`);
            return;
        }

        console.log(`[Kernel] Installing background service: ${name}...`);

        // Create the service object
        const newService = {
            name: name,
            icon: icon,
            // We use new Function() to turn the string code into executable logic
            function: setInterval(new Function(code), interval || 60000)
        };

        // Push to our active service list
        serviceList.push(newService);

        // Optional: Notify the user that a service has started
        addNotification(icon, "System", `${name} service started in background.`);


        // Inside the PUSH_SERVICE listener
        let savedServices = JSON.parse(localStorage.getItem("system-external-services")) || [];
        savedServices.push({ name, icon, code, interval });
        localStorage.setItem("system-external-services", JSON.stringify(savedServices));
    }

if (event.data.type === 'OPEN_WINDOW') {
        const { icon, title, url, width, height, resizable, top, left } = event.data;
        
        // We call your existing openWindow function from manage-windows.js
        openWindow(
            icon || 'System-apps/default.png', // Fallback icon
            title || 'New Window',             // Fallback title
            url, 
            width || '600px', 
            height || '400px', 
            resizable || 'true', 
            top || '100px', 
            left || '100px'
        );

        // Optional: Send a notification that a new process started
        addNotification(icon, "System", `Starting ${title}...`);
    }
});

// Load all widgets from the registry on startup
const widgetMap = JSON.parse(localStorage.getItem("system-widgets")) || [];

widgetMap.forEach(w => {
    // Fetch the code shard using the ID
    const savedCode = localStorage.getItem(`widget-code-${w.id}`);
    if (savedCode) {
        // We call addWidget, but we need to make sure we don't 
        // infinitely loop the saving logic. 
        // (The addWidget version above works fine)
        renderWidgetOnly(w, savedCode); 
    }
});

// Helper to render without re-saving to localStorage
function renderWidgetOnly(w, code) {
    const layer = document.getElementById('widget-layer');
    const widget = document.createElement('div');
    widget.id = `widget-${w.id}`;
    widget.className = "widget";
    widget.style.width = w.width;
    widget.style.height = w.height;
    widget.style.marginTop = w.top;
    widget.style.marginLeft = w.left;
    widget.innerHTML = code;
    layer.appendChild(widget);
    
    const scripts = widget.querySelectorAll("script");
    scripts.forEach(s => {
        const ns = document.createElement("script");
        ns.textContent = s.textContent;
        document.body.appendChild(ns);
        ns.remove();
    });
}
function applySystemSettings() {
    const settings = JSON.parse(localStorage.getItem("system-settings")) || {
        accentColor: "rgba(0, 210, 255, 1)",
        windowBg: "rgba(20, 20, 30, 0.4)",
        blurAmount: "20px"
    };
    
    const root = document.documentElement;
    // This applies to your windows, taskbar, and start menu
    root.style.setProperty('--accent-color', settings.accentColor);
    root.style.setProperty('--window-bg', settings.windowBg);
    root.style.setProperty('--glass-blur', settings.blurAmount);
}

// Add this to your message listener
window.addEventListener('message', (event) => {
    if (event.data.type === 'REFRESH_SETTINGS') {
        applySystemSettings();
        addNotification("System-apps/settings.png", "System", "Appearance updated.");
    }
});



// Initialize on load
applySystemSettings();