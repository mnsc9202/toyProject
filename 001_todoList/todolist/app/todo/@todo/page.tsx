"use client";

import TodoList from "@/app/components/todoList";
import { STYLE } from "@/public/styles/theme/theme";
import { Box } from "@chakra-ui/react";

/******************** style ********************/
const style: STYLE = {
  rootContainer: {
    backgroundColor: "todo.secondary",
    height: "90%",
  },
};

export default function Todo() {
  return (
    <Box sx={style.rootContainer}>
      {/* Todo 목록 */}
      <TodoList status="todo" />
    </Box>
  );
}
