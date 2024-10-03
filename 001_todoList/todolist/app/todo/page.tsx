"use client";

import { AddIcon, DownloadIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  AlertStatus,
  Box,
  IconButton,
  ToastId,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import TodoModal from "../components/todoModal";
import { ReactElement, useCallback, useContext, useMemo, useRef } from "react";
import { STYLE } from "@/public/styles/theme/theme";
import {
  initTodoListState,
  TODOLIST_CONTEXT,
  TodoListContext,
} from "../_store/todoListStore";
import { TODO_RESPONSE } from "../api/todoList/route";

/******************** type ********************/
/** 버튼 목록 */
type BTNLIST = {
  "aria-label": string; // 라벨
  icon: ReactElement; // 아이콘
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; // 클릭 이벤트
  toolTip: string; // 툴팁
};

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
  const { isOpen, onOpen, onClose } = useDisclosure(); // modal
  const toast = useToast(); // toast
  const toastRef = useRef<ToastId>(); //  toast ref

  /******************** store ********************/
  const todoListContext = useContext<TODOLIST_CONTEXT>(TodoListContext);

  /******************** func ********************/
  // todo 아이템 추가버튼 클릭시
  const onAddTodoItemBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      onOpen(); // modal open
    },
    [onOpen]
  );
  // todoList 저장 버튼 클릭시
  const onSaveTodoListBtnClick = useCallback(
    async (_event: React.MouseEvent<HTMLButtonElement>) => {
      if (!todoListContext.state) return;

      // toast 설정
      toast.closeAll(); // 초기화
      toastRef.current = toast({ description: "TodoList를 저장 중..." });

      // todoList 저장
      const response = await fetch("/api/todoList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoListContext.state.todoList),
      });

      if (response.ok) {
        const result: TODO_RESPONSE = await response.json();

        // toast 설정
        if (toastRef.current) {
          toast.update(toastRef.current, {
            description: result.message,
            status: result.type as AlertStatus,
          });
        }
      }
    },
    [toast, todoListContext.state]
  );

  // todoList 조회 버튼 클릭시
  const onFindTodoListBtnClick = useCallback(
    async (_event: React.MouseEvent<HTMLButtonElement>) => {
      if (!todoListContext.dispatch) return;

      // toast 설정
      toast.closeAll(); // 초기화
      toastRef.current = toast({ description: "TodoList를 저장 중..." });

      // todoList 조회
      const response = await fetch("/api/todoList", {
        method: "GET",
      });
      if (response.ok) {
        const result: TODO_RESPONSE = await response.json();

        // todoList 설정
        if (result.data) {
          todoListContext.dispatch({
            type: "findTodoList",
            data: initTodoListState.selectTodoItem,
            list: result.data,
          });
        }

        // toast 설정
        if (toastRef.current) {
          toast.update(toastRef.current, {
            description: result.message,
            status: result.type as AlertStatus,
          });
        }
      }
    },
    [toast, todoListContext]
  );

  /******************** info ********************/
  const btnList = useMemo<BTNLIST[]>(
    () => [
      // Todo 아이템 추가 버튼
      {
        "aria-label": "addTodoItemBtn",
        icon: <AddIcon />,
        onClick: onAddTodoItemBtnClick,
        toolTip: "할일 추가",
      },

      // todoList 저장 버튼
      {
        "aria-label": "saveTodoListBtn",
        icon: <DownloadIcon />,
        onClick: onSaveTodoListBtnClick,
        toolTip: "할일 저장",
      },

      // todoList 조회 버튼
      {
        "aria-label": "findTodoListBtn",
        icon: <RepeatIcon />,
        onClick: onFindTodoListBtnClick,
        toolTip: "할일 조회",
      },
    ],
    [onAddTodoItemBtnClick, onFindTodoListBtnClick, onSaveTodoListBtnClick]
  );

  return (
    <>
      {/* 버튼 목록 */}
      <Box sx={style.btnWrapper}>
        {btnList.map((el: BTNLIST, index: number) => (
          <Tooltip label={el.toolTip} key={`${el["aria-label"]}_${index}`}>
            <IconButton
              aria-label={el["aria-label"]}
              icon={el.icon}
              onClick={el.onClick}
            />
          </Tooltip>
        ))}
      </Box>

      {/* Todo 아이템 추가 모달 */}
      {isOpen && <TodoModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
