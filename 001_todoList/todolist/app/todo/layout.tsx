import { STYLE } from "@/public/styles/theme/theme";
import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

/******************** style ********************/
const style: STYLE = {
  layoutContainer: {
    display: "flex",
    padding: 5,
    gap: 5,
    height: "100%",
    "& > div": {
      flexGrow: 1,
      width: "30%",
      minWidth: 300,
    },
  },
};

// props
type TodoLayoutProps = {
  children: ReactNode;
  todo: ReactNode;
  inprogress: ReactNode;
  done: ReactNode;
};

export default function TodoLayout({
  children,
  todo,
  inprogress,
  done,
}: TodoLayoutProps) {
  return (
    <>
      {children}
      <Box sx={style.layoutContainer}>
        <Box>{todo}</Box>
        <Box>{inprogress}</Box>
        <Box>{done}</Box>
      </Box>
    </>
  );
}
