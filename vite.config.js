import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import path from "path";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        about: path.resolve(__dirname, "pages/about.html"),
        contact: "pages/contact.html",
        "course-details": "pages/course-details.html",
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
