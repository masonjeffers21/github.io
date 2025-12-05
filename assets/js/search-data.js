// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-projects",
          title: "Projects",
          description: "This is an updated list of my current and previous personal projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Resume and professional experience of Mason Jeffers - Control Systems Engineer",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-games",
          title: "Games",
          description: "A collection of browser-based games",
          section: "Navigation",
          handler: () => {
            window.location.href = "/games/";
          },
        },{id: "projects-unmanned-aerial-systems",
          title: 'Unmanned Aerial Systems',
          description: "Defense counter-UAS engineering and university rocketry drone payload development.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Drones/";
            },},{id: "projects-homelab-infrastructure",
          title: 'Homelab Infrastructure',
          description: "Building and maintaining a homelab environment using Proxmox VE with various services including Home Assistant, media servers, and development environments.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Homelab/";
            },},{id: "projects-robot-arm",
          title: 'Robot Arm',
          description: "Restoration and software integration of a 6-axis robot arm.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/RobotArm/";
            },},{id: "projects-personal-website",
          title: 'Personal Website',
          description: "Development of a personal website using Jekyll and GitHub Pages.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/WebsiteDevelopment/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6D%61%73%6F%6E%6A%65%66%66%65%72%73%30@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/masonjeffers21", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/mason-jeffers", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
