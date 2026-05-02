/**
 * HexagonOS Welcome Service - "Shooting Star" Edition
 * Optimized for high-end UI and modular updates
 */

const welcomeService = {
    config: {
        version: "2.1.0",
        osName: "HEXAGON OS",
        heroText: "SHOOTING STAR",
        subtitle: "A faster, more fluid modular experience.", 
        icon: "System-apps/ico.png",
        features: [
            { title: "Core", desc: "Hexagon Kernel v1.4 Stabilization" },
            { title: "Flow", desc: "Asymmetric window animations" },
            { title: "Files", desc: "Advance yet easy to use virtual file system" }
        ],
        buttonText: "LET'S START THE JOURNEY!"
    },

    init() {
        const lastSeen = localStorage.getItem('hx_version_seen');
        if (lastSeen !== this.config.version) {
            this.injectStyles();
            this.render();
        }
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .welcome-portal {
                position: fixed; inset: 0; z-index: 99999;
                display: flex; align-items: center; justify-content: center;
                background: radial-gradient(circle at center, rgba(0, 100, 255, 0.15) 0%, #020205 100%);
                backdrop-filter: blur(40px) saturate(180%);
                opacity: 0; transition: opacity 0.8s ease;
            }
            .welcome-portal.active { opacity: 1; }
            
            .glass-card {
                width: 520px; padding: 45px;
                background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 100%);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 40px;
                box-shadow: 0 40px 100px rgba(0,0,0,0.7);
                text-align: center;
                transform: scale(0.9) translateY(30px);
                transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .active .glass-card { transform: scale(1) translateY(0); }

            .signature-row {
                display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 10px;
            }
            .os-name {
                font-family: 'Orbitron'; font-size: 14px; letter-spacing: 5px; color: var(--accent-color);
                text-shadow: 0 0 10px var(--accent-color);
            }

            .hero-title {
                font-family: 'Orbitron'; font-size: 3.2rem; font-weight: 900;
                color: #fff; margin: 0; line-height: 1;
                /* Fixed visibility with triple-layered shadow */
                text-shadow: 0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.2);
            }

            .sub-title {
                color: rgba(255,255,255,0.6); font-size: 1.1rem; margin: 15px 0 30px 0; font-weight: 300;
            }

            .feature-list {
                text-align: left; background: rgba(0,0,0,0.2);
                border-radius: 24px; padding: 20px; border: 1px solid rgba(255,255,255,0.03);
            }
            .feature-item {
                display: flex; align-items: center; gap: 15px; margin-bottom: 12px;
            }
            .feature-item:last-child { margin-bottom: 0; }
            .feature-tag {
                font-size: 10px; padding: 4px 8px; background: var(--accent-color);
                color: #000; border-radius: 6px; font-family: 'Orbitron';
            }
            .feature-desc { color: #eee; font-size: 0.9rem; }

            .launch-btn {
                margin-top: 35px; width: 100%; padding: 20px;
                background: #fff; color: #000; border: none; border-radius: 20px;
                font-family: 'Orbitron'; font-weight: 800; cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 0 rgba(255,255,255,0);
            }
            .launch-btn:hover {
                background: var(--accent-color); color: #fff;
                transform: translateY(-3px);
                box-shadow: 0 15px 30px rgba(0, 210, 255, 0.4);
            }
        `;
        document.head.appendChild(style);
    },

    render() {
        const portal = document.createElement('div');
        portal.id = 'welcome-portal';
        portal.className = 'welcome-portal';
        
        const featureHtml = this.config.features.map(f => `
            <div class="feature-item">
                <span class="feature-tag">${f.title}</span>
                <span class="feature-desc">${f.desc}</span>
            </div>
        `).join('');

        portal.innerHTML = `
            <div class="glass-card">
                <div class="signature-row">
                    <img src="${this.config.icon}" style="width:24px; height:24px;">
                    <span class="os-name">${this.config.osName}</span>
                </div>
                <h1 class="hero-title">${this.config.heroText}</h1>
                <p class="sub-title">${this.config.subtitle}</p>
                
                <div class="feature-list">
                    ${featureHtml}
                </div>

                <button class="launch-btn" onclick="welcomeService.dismiss()">
                    ${this.config.buttonText}
                </button>
            </div>
        `;

        document.body.appendChild(portal);
        setTimeout(() => portal.classList.add('active'), 100);
    },

    dismiss() {
        const portal = document.getElementById('welcome-portal');
        portal.classList.remove('active');
        setTimeout(() => {
            portal.remove();
            localStorage.setItem('hx_version_seen', this.config.version);
        }, 800);
    }
};

window.addEventListener('DOMContentLoaded', () => welcomeService.init());