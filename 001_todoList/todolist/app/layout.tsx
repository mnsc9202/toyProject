"use client";

import type { Metadata } from "next";
import "@/public/styles/global.css";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/public/styles/theme/theme";
import { useReducer } from "react";
import {
  initTodoListState,
  TodoListContext,
  todoListReducer,
} from "./_store/todoListStore";

// export const metadata: Metadata = {
//   title: "TODO List",
//   description: "Todo 리스트 만들기",
// };
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
