export default async function ({addon, console, msg}) {
    // --- Create canvas for Bug Godzilla ---
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 500;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Bug Godzilla state
    let bug = {
        x: -300,
        y: canvas.height * 0.6,
        width: 250,
        height: 200,
        legOffset: 0,
        walking: true
    };

    // Animation state
    let direction = 1; // 1 = right, -1 = left

    function drawBugGodzilla(ctx, bug) {
        const scale = bug.width / 250;
        const centerX = bug.x;
        const centerY = bug.y;

        ctx.save();
        if (direction === -1) {
            ctx.translate(centerX, centerY);
            ctx.scale(-1, 1);
            ctx.translate(-centerX, -centerY);
        }

        // Body (red oval)
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 80 * scale, 70 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body outline
        ctx.strokeStyle = '#1d3557';
        ctx.lineWidth = 4 * scale;
        ctx.stroke();

        // Spots on body
        ctx.fillStyle = '#1d3557';
        const spots = [
            {x: -30 * scale, y: -20 * scale, r: 15 * scale},
            {x: 25 * scale, y: -30 * scale, r: 12 * scale},
            {x: 40 * scale, y: 10 * scale, r: 14 * scale},
            {x: -10 * scale, y: 35 * scale, r: 10 * scale},
            {x: 15 * scale, y: 25 * scale, r: 8 * scale}
        ];
        for (const spot of spots) {
            ctx.beginPath();
            ctx.arc(centerX + spot.x, centerY + spot.y, spot.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Head (black circle)
        ctx.fillStyle = '#1d3557';
        ctx.beginPath();
        ctx.arc(centerX + 70 * scale, centerY - 20 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#f1faee';
        ctx.beginPath();
        ctx.arc(centerX + 80 * scale, centerY - 30 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 60 * scale, centerY - 30 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Pupils (angry look)
        ctx.fillStyle = '#1d3557';
        ctx.beginPath();
        ctx.arc(centerX + 82 * scale, centerY - 30 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 62 * scale, centerY - 30 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Antennae
        ctx.strokeStyle = '#1d3557';
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX + 85 * scale, centerY - 50 * scale);
        ctx.lineTo(centerX + 95 * scale, centerY - 70 * scale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 55 * scale, centerY - 50 * scale);
        ctx.lineTo(centerX + 45 * scale, centerY - 70 * scale);
        ctx.stroke();

        // Antenna balls
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.arc(centerX + 95 * scale, centerY - 70 * scale, 6 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 45 * scale, centerY - 70 * scale, 6 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Legs (animated)
        const legPhase = bug.legOffset;
        ctx.strokeStyle = '#e63946';
        ctx.lineWidth = 8 * scale;
        
        // Front legs
        ctx.beginPath();
        ctx.moveTo(centerX + 60 * scale, centerY + 50 * scale);
        ctx.lineTo(centerX + 80 * scale + Math.sin(legPhase) * 20 * scale, centerY + 90 * scale);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 30 * scale, centerY + 55 * scale);
        ctx.lineTo(centerX + 50 * scale + Math.sin(legPhase + Math.PI) * 20 * scale, centerY + 95 * scale);
        ctx.stroke();

        // Back legs
        ctx.beginPath();
        ctx.moveTo(centerX - 50 * scale, centerY + 50 * scale);
        ctx.lineTo(centerX - 70 * scale + Math.sin(legPhase + Math.PI) * 20 * scale, centerY + 90 * scale);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX - 80 * scale, centerY + 55 * scale);
        ctx.lineTo(centerX - 100 * scale + Math.sin(legPhase) * 20 * scale, centerY + 95 * scale);
        ctx.stroke();

        // Center legs
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 60 * scale);
        ctx.lineTo(centerX + Math.sin(legPhase + Math.PI/2) * 25 * scale, centerY + 100 * scale);
        ctx.stroke();

        ctx.restore();

        // Godzilla shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(bug.x, bug.y + 110 * scale, 100 * scale, 20 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update bug position
        if (bug.walking) {
            bug.x += 2 * direction;
            bug.legOffset += 0.2;

            // Bounce effect
            bug.y = canvas.height * 0.6 + Math.sin(bug.legOffset * 2) * 5;

            // Reset when off screen
            if (bug.x > canvas.width + 300) {
                bug.x = -300;
            }
            if (bug.x < -300) {
                bug.x = canvas.width + 300;
            }
        }

        drawBugGodzilla(ctx, bug);
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Scale bug position proportionally
        bug.x = (bug.x / oldWidth) * canvas.width;
        bug.y = (bug.y / oldHeight) * canvas.height;
        
        // Keep bug at reasonable vertical position
        bug.y = canvas.height * 0.6;
    });

    // --- Utility: parse stylesheets for class names with a prefix ---
    function getClassesByPrefix(prefix) {
        const classes = new Set();
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText) {
                        const parts = rule.selectorText.split(/[\s,>+~]+/);
                        for (const part of parts) {
                            if (part.startsWith('.') && part.slice(1).startsWith(prefix)) {
                                classes.add(part.slice(1));
                            }
                        }
                    }
                }
            } catch (e) {
                // Ignore cross-origin stylesheets
            }
        }
        return [...classes];
    }

    // --- Inject "Remove Bug" menu item continuously ---
    function injectMenuItem() {
        const menuItemClasses = getClassesByPrefix('menu_menu-item_');
        const hoverableClasses = getClassesByPrefix('menu_hoverable_');
        const settingsLabelClasses = getClassesByPrefix('settings-menu_dropdown-label_');

        const menus = Array.from(document.querySelectorAll('ul')).filter(ul =>
            Array.from(ul.children).some(child =>
                settingsLabelClasses.some(cls => child.classList.contains(cls))
            )
        );

        for (const menu of menus) {
            if (menu.querySelector('.remove-bug-item')) continue;

            const li = document.createElement('li');
            li.classList.add('remove-bug-item');

            if (menuItemClasses.length) li.classList.add(menuItemClasses[0]);
            if (hoverableClasses.length) li.classList.add(hoverableClasses[0]);

            li.textContent = 'Remove Bug Godzilla';
            li.addEventListener('click', () => {
                canvas.remove();
                console.log('Bug Godzilla removed!');
            });

            menu.appendChild(li);
        }
    }

    injectMenuItem();

    console.log(msg || 'Bug Godzilla canvas overlay activated with React menu support! 🐞');
}