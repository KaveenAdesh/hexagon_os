

document.getElementById("internet").src = connection === "online" ? "System-apps/wi-fi.png" : "System-apps/no-internet.png";
document.body.style.backgroundImage = `url(${wallpaper["url"]})`;

function dragWindow(windowObj) {
    const card = document.getElementById(windowObj["id"]);
    const header = document.getElementById(`${windowObj["id"]}-header`);
    const taskIcon = document.getElementById("task-" + windowObj["id"]);

    if (taskIcon && taskIcon.style.borderBottom !== "solid 2px rgb(0,150,250)") {
        taskIcon.style.borderBottom = "solid 2px rgb(0,150,250)";
    }

    const dragTarget = header || card;

    dragTarget.onmousedown = function(e) {
        e.preventDefault();

        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmousemove = function(e) {
            e.preventDefault();

            let pos1 = pos3 - e.clientX;
            let pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = card.offsetTop - pos2;
            let newLeft = card.offsetLeft - pos1;

            // FIXED: Soft bounds - prevent dragging completely off screen
            const margin = 40; // small visible part always stays
            newTop = Math.max(-card.offsetHeight + margin, Math.min(newTop, window.innerHeight - margin));
            newLeft = Math.max(-card.offsetWidth + margin, Math.min(newLeft, window.innerWidth - margin));

            card.style.top = newTop + "px";
            card.style.left = newLeft + "px";
        };

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;

            // FIXED: Save real position only when not fullscreen
            if (windows[windowObj["id"]]["state"] !== "fullscreen") {
                windows[windowObj["id"]]["top"] = card.style.top;
                windows[windowObj["id"]]["left"] = card.style.left;
            }
        };
    };
}

function openMinimize(windId) {
    let application = document.getElementById(windId);
    if (!application) return;

    if (application.style.display === "none") {
        application.style.display = "flex";
        windows[windId]["state"] = "open";
        document.getElementById('task-' + windId).style.borderBottom = "solid 2px rgb(0,150,250)";
    } else {
        application.style.animationName = "minimizing";
        setTimeout(() => {
            document.getElementById('task-' + windId).style.borderBottom = "solid 2px transparent";
            application.style.display = "none";
            windows[windId]["state"] = "minimized";
        }, 400);
    }
}

function maximize(id) {
    let application = document.getElementById(id);
    if (!application || !windows[id]) return;

    if (windows[id]["state"] !== "fullscreen") {
        // FIXED: Save current size before going fullscreen
        windows[id]["width"] = application.style.width;
        windows[id]["height"] = application.style.height;
        windows[id]["top"] = application.style.top;
        windows[id]["left"] = application.style.left;

        application.style.top = "0px";
        application.style.left = "0px";
        application.style.width = "100%";
        application.style.height = "100%";
        windows[id]["state"] = "fullscreen";
    } else {
        // Restore saved size and position
        application.style.top = windows[id]["top"];
        application.style.left = windows[id]["left"];
        application.style.width = windows[id]["width"];
        application.style.height = windows[id]["height"];
        windows[id]["state"] = "open";
    }
}


// Listen for apps pushing widgets
// Ensure widgets is initialized from localStorage at the start of your script

function addWidget(id, code, width, height, top, left) {
    const layer = document.getElementById('widget-layer');
    
    // 1. Update the Registry (The Map)
    let widgetMap = JSON.parse(localStorage.getItem("system-widgets")) || [];
    const widgetIndex = widgetMap.findIndex(w => w.id === id);
    
    const metadata = { id, width, height, top, left, version: "1.0v" };

    if (widgetIndex > -1) {
        widgetMap[widgetIndex] = metadata; // Update existing
    } else {
        widgetMap.push(metadata); // Add new
    }
    localStorage.setItem("system-widgets", JSON.stringify(widgetMap));

    // 2. Save the Code Separately (The Shard)
    localStorage.setItem(`widget-code-${id}`, code);

    // 3. Render to UI
    const existing = document.getElementById(`widget-${id}`);
    if (existing) existing.remove();

    const widget = document.createElement('div');
    widget.id = `widget-${id}`;
    widget.className = "widget";
    widget.style.width = width;
    widget.style.height = height;
    widget.style.marginTop = top;
    widget.style.marginLeft = left;
    
    widget.innerHTML = code;
    layer.appendChild(widget);

    // 4. Execute Scripts (Hydration)
    const scripts = widget.querySelectorAll("script");
    scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
        newScript.remove();
    });
}

