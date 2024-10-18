import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        about: "pages/about.html",
        contact: "pages/contact.html",
        "course-automotive": "pages/course-automotive.html",
        "course-virtual-surgery": "pages/course-virtual-surgery.html",
        "course-vr-chemistry": "pages/course-vr-chemistry.html",
        courses: "pages/courses.html",
        events: "pages/events.html",
        media: "pages/media.html",
        "our-services": "pages/services/Our services.html",
        "vr-games": "pages/services/vr-games.html",
        "vr-movies": "pages/services/vr-movies.html",
        "vr-simulation": "pages/services/vr-simulation.html",
      },
    },
  },
});
