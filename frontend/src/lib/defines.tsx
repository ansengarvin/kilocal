// Development Mode
const is_dev = process.env.NODE_ENV === 'development'
export const apiURL = is_dev ? 'http://localhost:8000' : 'https://api.kcal.ansengarvin.com'

// Screen Widths
export const mobileView = '768px';
export const mobileViewPx = 768;

export const tabletView = '1024px';
export const tabletViewPx = 1024;
