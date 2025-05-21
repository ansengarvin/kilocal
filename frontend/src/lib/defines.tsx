// Development Mode
const is_dev = process.env.NODE_ENV === "development";
console.log(process.env.NODE_ENV);
export const apiURL = is_dev ? "http://localhost:8000" : "https://api.kcal.ansengarvin.com";

// Screen Widths
export const mobileView = "450px";
export const mobileViewPx = 450;

export const tabletView = "800px";
export const tabletViewPx = 800;

// Global site colors
export const appAccentColor = "#36373b";
export const appAccentHover = "#747580";
export const appWindowColor = "#f7f7f2";
