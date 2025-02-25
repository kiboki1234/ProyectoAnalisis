// menuRenderer.js
class MenuRenderer {
    constructor(menuItems, containerSelector) {
        this.menuItems = menuItems;
        this.container = document.querySelector(containerSelector);
    }

    render() {
        const ul = document.createElement("ul");
        this.menuItems.forEach(item => {
            const li = document.createElement("li");
            if (item.id) li.id = item.id;
            if (item.class) li.className = item.class;

            const a = document.createElement("a");
            a.href = item.href;

            const icon = document.createElement("i");
            icon.className = "material-icons";
            icon.textContent = item.icon;

            a.appendChild(icon);
            a.appendChild(document.createTextNode(` ${item.label}`));
            li.appendChild(a);
            ul.appendChild(li);
        });

        this.container.appendChild(ul);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.createElement("div");
    menuToggle.classList.add("menu-toggle");
    menuToggle.innerHTML = "☰";
    document.body.appendChild(menuToggle);

    const menuContainer = document.querySelector("#menu-container");

    menuToggle.addEventListener("click", () => {
        menuContainer.classList.toggle("show-menu");
    });
});
