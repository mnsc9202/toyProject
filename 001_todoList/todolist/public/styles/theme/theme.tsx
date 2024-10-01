import { extendTheme } from "@chakra-ui/react";
import { CSSProperties } from "react";

/******************** style ********************/
export type STYLE = {
  [key in string]: CSSProperties | { [key in string]: CSSProperties | STYLE };
};

/******************** theme ********************/
export const theme = extendTheme({
  colors: {
    todo: {
      primary: "#15B392",
      secondary: "#73EC8B",
    },
    inProgress: {
      primary: "#FFEEAD",
      secondary: "#FFF7D1",
    },
    done: {
      primary: "#D91656",
      secondary: "#FFB0B0",
    },
    todoItem: {
      bg: "#fff",
      hoverBg: "#B7B7B7",
    },
  },
});
