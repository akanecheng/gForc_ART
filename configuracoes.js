const menuToggle =
    document.getElementById("menuToggle");

const navDrawer =
    document.getElementById("navDrawer");


if (menuToggle && navDrawer) {

    menuToggle.addEventListener("click", () => {

        navDrawer.classList.toggle("open");

    });


    document.addEventListener("click", event => {

        if (
            !navDrawer.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            navDrawer.classList.remove("open");

        }

    });

}