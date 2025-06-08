export const theme = {
    colors: {
        primary: "#36373b", // appAccentColor
        primaryHover: "#747580", // appAccentHover
        surface: "#f7f7f2", // appWindowColor
        background: "#ffffff", //white
        error: "#ff4444", // red
        onPrimary: "#ffffff", // white text on primary
        onSurface: "#353535", // text color
        onBackground: "#353535", // text color on background
        onError: "#ffffff", // white text on error
    },
    breakpoints: {
        mobile: "450px",
        tablet: "900px",
    },
};

export type AppTheme = typeof theme;
