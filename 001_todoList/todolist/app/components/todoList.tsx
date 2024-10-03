import {
  useDisclosure,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { useContext, useCallback, useState, useMemo } from "react";
import {
  TODOLIST_CONTEXT,
  TodoListContext,
  TODOITEM,
  TODOSTATUS,
} from "../_store/todoListStore";
import TodoItem from "./todoItem";
import TodoModal from "./todoModal";
import { STYLE } from "@/public/styles/theme/theme";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

/******************** style ********************/
const style: STYLE = {
  header: {
    height: "5%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    position: "relative",
  },
  itemWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: 3,
    height: "95%",
    overflowY: "auto",
  },
  itemCnt: {
    minWidth: 6,
    textAlign: "center",
    position: "absolute",
    left: 3,
    fontSize: 11,
    padding: 1,
    backgroundColor: "todoItem.bg.secondary",
    color: "white",
    borderRadius: "50%",
  },
  menuBtn: {
    backgroundColor: "todo.secondary",
    position: "absolute",
    right: 3,
    ":hover": {
      backgroundColor: "todo.primary",
      color: "todo.secondary",
    },
    "&[aria-expanded=true]": {
      backgroundColor: "todo.secondary",
      color: "todo.primary",
    },
  },
  menuList: {
    minWidth: 100,
  },
};

// props
type TodoListProps = {
  status: TODOSTATUS;
};
export default function TodoList({ status }: TodoListProps) {
  /******************** info ********************/
  const { isOpen, onOpen, onClose } = useDisclosure(); // modal
  const [sortType, setSortType] = useState<string>("regDate"); // 정렬방식

  /******************** store ********************/
  const todoListContext = useContext<TODOLIST_CONTEXT>(TodoListContext);

  /******************** info ********************/
  // todoList 재구성 (정렬방식 적용)
  const arrangeTodoList = useMemo<TODOITEM[]>(() => {
    switch (sortType) {
      case "regDate": {
        return (
          todoListContext.state?.todoList[status].toSorted(
            (prev: TODOITEM, current: TODOITEM) =>
              prev.id > current.id ? 1 : -1
          ) ?? []
        );
      }

      case "dueDate": {
        return (
          todoListContext.state?.todoList[status].toSorted(
            (prev: TODOITEM, current: TODOITEM) =>
              prev.dueDate > current.dueDate ? 1 : -1
          ) ?? []
        );
      }

      default: {
        return todoListContext.state?.todoList[status] ?? [];
      }
    }
  }, [sortType, status, todoListContext.state?.todoList]);

  /******************** func ********************/
  // todo 아이템 클릭시
  const onTodoItemClick = useCallback(
    (el: TODOITEM) => (_event: React.MouseEvent<HTMLDivElement>) => {
      if (!todoListContext.dispatch) return;

      // 아이템 선택
      todoListContext.dispatch({ type: "selectItem", data: el });

      onOpen(); // modal
    },
    [onOpen, todoListContext]
  );

  // 메뉴 아이템 클릭시
  const onMenuItemClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // 선택한 정렬 방식
      const selectSortType: string = event.currentTarget.value;

      // 정렬방식 설정
      setSortType(selectSortType);
    },
    []
  );

  // todo 아이템 삭제버튼 클릭시
  const onDeleteTodoListBtnClick = useCallback(
    (todoItem: TODOITEM) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation(); // 부모 이벤트 실행 방지

      if (!todoListContext.dispatch) return;

      // todoList 설정
      todoListContext.dispatch({ type: "deleteTodoList", data: todoItem });
    },
    [todoListContext]
  );

  return (
    <>
      {/* 상단 */}
      <Box sx={{ ...style.header, backgroundColor: `${status}.primary` }}>
        {arrangeTodoList.length > 0 && (
          <Box sx={style.itemCnt}>
            {arrangeTodoList.length > 99 ? "99+" : arrangeTodoList.length}
          </Box>
        )}

        {/* 타이틀 */}
        <Box sx={{ position: "relative" }}>{status.toUpperCase()}</Box>

        {/* 메뉴 */}
        <Menu placement="bottom-end">
          {({ isOpen }) => (
            <>
              <MenuButton
                aria-label="sortBtn"
                size={"xs"}
                isActive={isOpen}
                as={IconButton}
                icon={!isOpen ? <HamburgerIcon /> : <CloseIcon />}
                sx={{
                  ...style.menuBtn,
                  backgroundColor: `${status}.secondary`,
                  ":hover": {
                    backgroundColor: `${status}.primary`,
                    color: `${status}.secondary`,
                  },
                  "&[aria-expanded=true]": {
                    backgroundColor: `${status}.secondary`,
                    color: `${status}.primary`,
                  },
                }}
              />
              <MenuList sx={style.menuList}>
                <MenuOptionGroup type="radio" defaultValue={sortType}>
                  <MenuItemOption value="regDate" onClick={onMenuItemClick}>
                    등록 순
                  </MenuItemOption>
                  <MenuItemOption value="dueDate" onClick={onMenuItemClick}>
                    마감 순
                  </MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </>
          )}
        </Menu>
      </Box>

      {/* Todo 목록 */}
      <Box sx={style.itemWrapper}>
        {arrangeTodoList.map((el: TODOITEM, index: number) => {
          return (
            <TodoItem
              key={`${el.status}_${el.id}_${index}`}
              todoItem={el}
              onItemClick={onTodoItemClick}
              onItemDeleteBtnClick={onDeleteTodoListBtnClick}
            />
          );
        })}
      </Box>

      {/* Todo 아이템 모달 */}
      {isOpen && (
        <TodoModal
          isOpen={isOpen}
          onClose={onClose}
          defaultTodoItem={todoListContext.state?.selectTodoItem}
        />
      )}
    </>
  );
}
