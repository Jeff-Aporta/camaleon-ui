// Polyfills and environment adjustments
import { href as routerHref } from "@framework";
import { hrefManagement } from "./hrefManagement";

localStorage.setItem(
  "theme-name",
  localStorage.getItem("theme-name") ?? "skyGreenPanda"
);

Object.assign(window, { hrefManagement });

export function init() {
  window.assignNullish(window, {
    configApp: { context: "dev" },
    currentUser: JSON.parse(localStorage.getItem("user") || "null"),
    loadUser: async (username, password) => {
      try {
        let user = [
          {
            name: "Jeffrey",
            lastName: "Agudelo",
            email: "jeffrey.agudelo@email.com",
          },
        ];
        if (Array.isArray(user)) {
          user = user[0];
        }
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      } catch (err) {
        console.error("Credenciales inválidas", err);
        return null;
      }
    },
    logoutUser: () => {
      localStorage.removeItem("user");
      delete window.currentUser;
      window.location.href = routerHref({ view: "/" });
    },
  });

  const { configApp } = window;
  const { context } = configApp;

  if (["prod", "production"].includes(context)) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
}
