serviceList.push({

"name" : "Wallpaper Changer",
"icon" : "",
"function" : setInterval(() =>{

let theme = JSON.parse(localStorage.getItem("system-wallpaper"))
let wallpapers = theme["wallpaper-list"]
let index = Number(theme["index"])

if (index == wallpapers.length-1){    
    theme["index"] = 0
    index = 0
}else{
    index++
    theme["index"] = index
} 

document.body.style.backgroundImage = `url(${wallpapers[index]})`

theme["url"] = wallpapers[index]

localStorage.setItem("system-wallpaper",JSON.stringify(theme))


},wallpaper["duration"]*60000)




})

// Make sure to define 'connection' outside if it's not already

serviceList.push({
    "name" : "Network Status",
    "icon" : "System-apps/wi-fi.png",
    "function" : setInterval(() => {
        let internetIcon = document.getElementById("internet");
        
        // Use lowercase 'navigator'
        if (navigator.onLine) { 
            if (connection === "offline") {
                connection = "online";
                internetIcon.src = "System-apps/wi-fi.png";
                // A small gift for the user
                addNotification("System-apps/wi-fi.png", "Network", "Connection is back!.");
            }
        } else {
            if (connection === "online") {
                connection = "offline";
                internetIcon.src = "System-apps/no-internet.png";
                addNotification("System-apps/no-internet.png", "Network", "Ops..! You lost connection.");
            }
        }
    }, 100) 
});


// services.js

serviceList.push({
    "name": "App Manager",
    "icon": "https://cdn-icons-png.flaticon.com/128/13171/13171523.png",
    "function": setInterval(() => {
        // 1. Fetch the latest list from storage
        const storedApps = JSON.parse(localStorage.getItem('apps')) || [];
        
        // 2. ONLY run if the storage actually changed (using stringify for a deep check)
        if (JSON.stringify(installedApps) !== JSON.stringify(storedApps)) {
            console.log("Resyncing Desktop...");
            
            // Update the global reference so this loop doesn't trigger again immediately
            installedApps = storedApps;

            // 3. Rebuild the master 'apps' list from scratch
            // This is the most important part: reset to defaults, then add extras.
            apps = [...System_apps]; 
            
            installedApps.forEach(newApp => {
                // Double-check to prevent duplicates based on name
                if (!apps.find(a => a.name === newApp.name)) {
                    apps.push(newApp);
                }
            });

            // 4. Wipe and Redraw
            const iconArea = document.getElementById("icon-area");
            if (iconArea) {
                iconArea.innerHTML = ""; // Clear the shore

                apps.forEach((app) => {
                    let icon = document.createElement('div');
                    icon.className = "desktop-icon";
                    icon.onclick = () => {
                        openWindow(app.icon, app.name, app.url, app.width, app.height, app.resizable, app.top, app.left);
                    };

                    let img = document.createElement('img');
                    img.src = app.icon;
                    img.style.width = "40px";

                    let title = document.createElement('p');
                    title.textContent = app.name;

                       if(app.desktop != "false") {

                           
                           icon.appendChild(img);
                           icon.appendChild(title);
                           iconArea.appendChild(icon);
                        }
                });
            }
        }
    }, 1000) 
});



setInterval(() =>{

localStorage.setItem("background-services-rn",JSON.stringify(serviceList))



},100)