"use client";

import "@/public/styles/global.css";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/public/styles/theme/theme";
import { useReducer } from "react";
import {
  initTodoListState,
  TodoListContext,
  todoListReducer,
} from "./_store/todoListStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /******************** store ********************/
  const [todoListState, todoListDispatch] = useReducer(
    todoListReducer,
    initTodoListState
  );
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <TodoListContext.Provider
            value={{ state: todoListState, dispatch: todoListDispatch }}
          >
            {children}
          </TodoListContext.Provider>
        </ChakraProvider>
      </body>
    </html>
  );
}
