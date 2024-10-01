"use client";

import { AddIcon, DownloadIcon, RepeatIcon } from "@chakra-ui/icons";
import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import TodoModal from "../components/todoModal";
import { useCallback, useContext } from "react";
import { STYLE } from "@/public/styles/theme/theme";

import {
  initTodoListState,
  TODOITEM,
  TODOLIST,
  TODOLIST_CONTEXT,
  TodoListContext,
} from "../_store/todoListStore";

/******************** style ********************/
const style: STYLE = {
  btnWrapper: {
    position: "fixed",
    bottom: 10,
    right: 10,
    display: "flex",
    gap: 2,
  },
};

export default function TodoMain() {
  /******************** info ********************/
  const { isOpen, onOpen, onClose } = useDisclosure();

  /******************** store ********************/
  const todoListContext = useContext<TODOLIST_CONTEXT>(TodoListContext);

  /******************** func ********************/
  // todo 아이템 추가버튼 클릭시
  const onAddTodoItemBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      // modal open
      onOpen();
    },
    [onOpen]
  );
  // todoList 저장 버튼 클릭시
  const onSaveTodoListBtnClick = useCallback(
    async (_event: React.MouseEvent<HTMLButtonElement>) => {
      if (!todoListContext.state) return;
      const response = await fetch("/api/todoList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoListContext.state.todoList),
      });

      if (response.ok) {
        const result = await response.json();
      }
    },
    [todoListContext.state]
  );

  // todoList 조회 버튼 클릭시
  const onFindTodoListBtnClick = useCallback(
    async (_event: React.MouseEvent<HTMLButtonElement>) => {
      if (!todoListContext.dispatch) return;
      const response = await fetch("/api/todoList", {
        method: "GET",
      });
      if (response.ok) {
        const result = await response.json();
        const data: TODOLIST = JSON.parse(result.data);

        console.log(`data:${JSON.stringify(data, null, 2)}`);

        todoListContext.dispatch({
          type: "findTodoList",
          data: initTodoListState.selectTodoItem,
          list: data,
        });
      }
    },
    [todoListContext]
  );

  return (
    <>
      {/* 버튼 목록 */}
      <Box sx={style.btnWrapper}>
        {/* Todo 아이템 추가 버튼 */}
        <IconButton
          aria-label="addTodoItemBtn"
          icon={<AddIcon />}
          onClick={onAddTodoItemBtnClick}
        />

        {/* todoList 저장 버튼 */}
        <IconButton
          aria-label="saveTodoListBtn"
          icon={<DownloadIcon />}
          onClick={onSaveTodoListBtnClick}
        />

        {/* todoList 조회 버튼 */}
        <IconButton
          aria-label="findTodoListBtn"
          icon={<RepeatIcon />}
          onClick={onFindTodoListBtnClick}
        />
      </Box>

      {/* Todo 아이템 추가 모달 */}
      {isOpen && <TodoModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
