let windows = {};
let activeWindow = {
    "now": "",
    "before": ""
};

let serviceList = []

if (localStorage.getItem("system-wallpaper") == undefined){

    let System_wallpaper = {
    "theme": "system",
    "index": 0,
    "duration": 1,
    "url": "https://wallpapercave.com/wp/wp15083050.webp",
    "wallpaper-list": [
        "https://wallpapercave.com/wp/wp15083050.webp",
        "https://wallpapercave.com/wp/wp11109428.jpg",
        "https://wallpapercave.com/wp/wp15170830.webp",
        "https://wallpapercave.com/wp/wp5918136.jpg",
        "https://wallpapercave.com/wp/wp4127620.jpg",
        "https://wallpapercave.com/wp/wp15083058.webp",
        "https://wallpapercave.com/wp/wp2471726.jpg",
        "https://wallpapercave.com/wp/wp7888212.jpg",
        "https://wallpapercave.com/wp/wp15170857.webp",
        "https://wallpapercave.com/wp/wp15170860.webp",
        "https://wallpapercave.com/wp/wp14836461.webp",
        "https://wallpapercave.com/wp/wp15170868.webp",
        "https://wallpapercave.com/wp/wp5085163.jpg",
        "https://wallpapercave.com/wp/wp12411190.jpg"
    ]
}

    localStorage.setItem("system-wallpaper",JSON.stringify(System_wallpaper))
}
let wallpaper = JSON.parse(localStorage.getItem("system-wallpaper"))
wallpaper["index"] = Number(wallpaper["index"])
wallpaper["duration"] = Number(wallpaper["duration"])
let connection = navigator.onLine ? "online" : "offline";
let installedApps = JSON.parse(localStorage.getItem('apps')) || [];


let System_apps = [
    {
        "name": "Settings",
        "icon": "System-apps/settings.png",
        "url": "System-apps/settings/settings.html",
        "width": "900px",
        "height": "500px",
        "resizable": "false",
        "publish": "com.web-os",
        "version": "1.4.3v",
        "top": "50px",
        "left": "170px",
    },
    {
    "name" : "Web Store",
    "icon" : "https://cdn-icons-png.flaticon.com/128/13171/13171523.png",
    "url" : "App-store/index.html",
    "width" : "900px",
    "height" : "500px",
    "resizable" : "true",
    "publish" : "com.web-os.store",
    "version": "1.0.0v",
    "top" : "40px",
    "left" : "100px"
},
{
        "name" : "Command Prompt",
    "icon" : "https://cdn-icons-png.flaticon.com/128/15414/15414130.png",
    "url" : "System-apps/command_prompt.html",
    "width" : "900px",
    "height" : "500px",
    "resizable" : "true",
    "publish" : "com.web-os.store",
    "version": "1.0.0v",
    "top" : "40px",
    "left" : "100px",
    "desktop" : "false"
},
{
        "name" : "Files",
    "icon" : "https://cdn-icons-png.flaticon.com/128/3767/3767094.png",
    "url" : "System-apps/file-manager.html",
    "width" : "900px",
    "height" : "500px",
    "resizable" : "true",
    "publish" : "com.web-os.store",
    "version": "1.0.0v",
    "top" : "40px",
    "left" : "100px"
},
{
    "name": "Gallery",
    "icon": "https://cdn-icons-png.flaticon.com/128/1040/1040241.png",
    "url": "System-apps/gallery.html",
    "width": "800px",
    "height": "550px",
    "resizable": "true",
    "top": "15%",
    "left": "25%",
    "desktop" : "false"
},
{
    "name": "Notepad",
    "icon": "https://cdn-icons-png.flaticon.com/128/9683/9683569.png",
    "url": "System-apps/notepad.html",
    "width": "800px",
    "height": "450px",
    "resizable": "true",
    "top": "10%",
    "left": "20%",
    "desktop": "false"
},
{
    "name": "Hexagon Pulse",
    "icon": "https://img.icons8.com/nolan/64/heart-monitor.png",
    "url": "System-apps/pulse.html",
    "width": "650px",
    "height": "480px",
    "resizable": "false",
    "publish": "com.hexagon.core",
    "version": "1.0.5v",
    "top": "20%",
    "left": "30%",
    "desktop": "false",
    "description": "Real-time kernel resource and storage monitor for HexagonOS."
}



];

if (localStorage.getItem("system-widgets") == undefined){
    let widgets = [];
    localStorage.setItem("system-widgets",JSON.stringify(widgets))
}
if (localStorage.getItem("system-storage") == undefined){
    localStorage.setItem("system-storage",JSON.stringify([]))
}
let widgets = JSON.parse(localStorage.getItem("system-widgets"))

function loadExternalServices() {
    const saved = JSON.parse(localStorage.getItem("system-external-services")) || [];
    saved.forEach(s => {
        serviceList.push({
            name: s.name,
            icon: s.icon,
            function: setInterval(new Function(s.code), s.interval)
        });
    });
}
if (localStorage.getItem("system-settings") == undefined){
let system_settings = {
    "windowBg": "rgba(30, 20, 10, 0.3)",
    "blurAmount": "25px",
    "silent-apps": [],
    "os-version": "2.4.0v",
    "os-name": "Hexagon OS v2",
    "user-name": "User",
    "default_apps": {
        "txt": {
            "name": "Notepad",
            "icon": "https://cdn-icons-png.flaticon.com/128/9683/9683569.png",
            "url": "System-apps/notepad.html",
            "width": "600px",
            "height": "450px",
            "resizable": "true",
            "top": "10%",
            "left": "20%"
        },
        "html": {
            "name": "Web viewer",
            "icon": "https://cdn-icons-png.flaticon.com/128/2010/2010990.png",
            "url": "System-apps/editor.html",
            "width": "900px",
            "height": "600px",
            "resizable": "true",
            "top": "5%",
            "left": "10%"
        },
        "js": {
            "name": "Code Editor",
            "icon": "https://cdn-icons-png.flaticon.com/128/2919/2919590.png",
            "url": "System-apps/editor.html",
            "width": "900px",
            "height": "600px",
            "resizable": "true",
            "top": "5%",
            "left": "10%"
        },
        "img": {
            "name": "Gallery",
            "icon": "https://cdn-icons-png.flaticon.com/128/1040/1040241.png",
            "url": "System-apps/gallery.html",
            "width": "800px",
            "height": "550px",
            "resizable": "true",
            "top": "15%",
            "left": "25%"
        },
        "video": {
            "name": "Gallery",
            "icon": "https://cdn-icons-png.flaticon.com/128/1040/1040241.png",
            "url": "System-apps/gallery.html",
            "width": "800px",
            "height": "550px",
            "resizable": "true",
            "top": "15%",
            "left": "25%"
        }
    }
};

    localStorage.setItem("system-settings",JSON.stringify(system_settings))
}

if (localStorage.getItem("system-apps") == undefined){
    localStorage.setItem("system-apps",JSON.stringify(System_apps))
}


loadExternalServices();