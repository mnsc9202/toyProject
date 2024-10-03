import { Box, Button, IconButton, ToastId, useToast } from "@chakra-ui/react";
import {
  TODOITEM,
  TODOLIST_CONTEXT,
  TodoListContext,
} from "../_store/todoListStore";
import { STYLE } from "@/public/styles/theme/theme";
import { useContext, useRef, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

/******************** style ********************/
const style: STYLE = {
  itemWrapper: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "todoItem.bg.primary",
    borderRadius: 10,
    padding: 3,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    minHeight: 65,
    maxHeight: 65,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    whiteSpace: "nowrap" /* 한 줄로 표시 */,
    overflow: "hidden" /* 넘치는 텍스트 숨기기 */,
    textOverflow: "ellipsis" /* 말줄임표 표시 */,
  },
  content: {
    fontSize: 10,
    whiteSpace: "nowrap" /* 한 줄로 표시 */,
    overflow: "hidden" /* 넘치는 텍스트 숨기기 */,
    textOverflow: "ellipsis" /* 말줄임표 표시 */,
  },
  dueData: {
    minWidth: "60px",
    maxWidth: "60px",
    fontSize: 10,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
  },
  hoverWrapper: {
    width: "80px",
    height: "100%",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 3,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "todoItem.bg.secondary",
    display: "flex",
    justifyContent: "end",
    animation: "moveLeft 0.5s forwards",
    "@keyframes moveLeft": {
      "0%": {
        transform: "translateX(100%)",
      },
      "100%": {
        transform: "translateX(0%)",
      },
    },
  },
  toastTitleWrapper: {
    display: "flex",
    alignItems: "center",
  },
  toastDescriptionContainer: {
    position: "relative",
    height: 10,
  },
  toastDescriptionBtnWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    fontSize: 12,
    right: -5,
    bottom: 0,
    position: "absolute",
  },
};

// props
type TodoItemProps = {
  todoItem: TODOITEM;
  onItemClick: (
    el: TODOITEM
  ) => (event: React.MouseEvent<HTMLDivElement>) => void;
  onItemDeleteBtnClick: (
    todoItem: TODOITEM
  ) => (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function TodoItem({
  todoItem,
  onItemClick,
  onItemDeleteBtnClick,
}: TodoItemProps) {
  /******************** info ********************/
  const [isHover, setIsHover] = useState<boolean>(false); // hover 여부
  const toast = useToast(); // toast
  const toastRef = useRef<ToastId>(); //  toast ref
  const tempTodoItemRef = useRef<TODOITEM | null>(todoItem); // todoItem ref

  /******************** store ********************/
  const todoListContext = useContext<TODOLIST_CONTEXT>(TodoListContext);

  return (
    <Box
      sx={{
        ...style.itemWrapper,
        ":hover": {
          backgroundColor: `${todoItem.status}.primary`,
        },
      }}
      onClick={onItemClick(todoItem)}
      onMouseOver={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      {/* 상단 */}
      <Box sx={style.header}>
        {/* 타이틀 */}
        <Box sx={style.title}>{todoItem.title}</Box>
        {/* 마감일 */}
        <Box sx={style.dueData}>
          {todoItem.dueDate.toISOString().split("T")[0]}
        </Box>
      </Box>

      {/* 내용 */}
      <Box sx={style.content}>{todoItem.content}</Box>

      {/* hover */}
      {isHover && (
        <Box sx={style.hoverWrapper}>
          <IconButton
            aria-label="deleteTodoListBtn"
            icon={<DeleteIcon />}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              // temp 저장
              tempTodoItemRef.current = todoItem;

              // 아이템 삭제
              onItemDeleteBtnClick(todoItem)(event);

              // toast 설정
              toastRef.current = toast({
                duration: 3000,
                status: "warning",
                isClosable: false,
                title: (
                  <Box sx={style.toastTitleWrapper}>
                    {'"'}
                    <Box
                      sx={{
                        ...style.title,
                        maxWidth: 200,
                        display: "inline-block",
                      }}
                    >
                      {tempTodoItemRef.current.title}
                    </Box>
                    {'"'}할 일을 삭제!
                  </Box>
                ),
                description: (
                  <Box sx={style.toastDescriptionContainer}>
                    <Box sx={style.toastDescriptionBtnWrapper}>
                      {/* 삭제 취소 버튼 */}
                      <Button
                        size="xs"
                        sx={{
                          backgroundColor: "#fff",
                          color: "todoItem.bg.secondary",
                        }}
                        onClick={(
                          _event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          if (
                            !todoListContext.dispatch ||
                            !tempTodoItemRef.current ||
                            !toastRef.current
                          )
                            return;

                          // 삭제 취소
                          todoListContext.dispatch({
                            type: "undoDeleteTodoList",
                            data: tempTodoItemRef.current,
                          });

                          // toast 닫기
                          toast.close(toastRef.current);
                        }}
                      >
                        삭제 취소
                      </Button>
                    </Box>
                  </Box>
                ),

                onCloseComplete: () => {
                  tempTodoItemRef.current = null;
                },
              });
            }}
            sx={{
              backgroundColor: `${todoItem.status}.secondary`,
              ":hover": { backgroundColor: `${todoItem.status}.secondary` },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
