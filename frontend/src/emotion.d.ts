import "@emotion/react";
import { AppTheme } from "./styles/theme";

// https://emotion.sh/docs/typescript#define-a-theme
declare module "@emotion/react" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface Theme extends AppTheme {}
}
