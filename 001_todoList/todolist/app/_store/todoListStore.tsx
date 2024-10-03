import { createContext, Dispatch } from "react";

/******************** type ********************/
export type TODOSTATUS = "todo" | "inProgress" | "done";
export type TODOLIST = {
  [key in TODOSTATUS]: TODOITEM[];
};
export type TODOITEM = {
  id: number; // sequence
  title: string; // 제목
  content: string; // 내용
  status: TODOSTATUS; // 상태
  dueDate: Date; // 마감일
};

/** context */
export type TODOLIST_CONTEXT = {
  state: TODOLIST_STATE | null;
  dispatch: Dispatch<TODOLIST_ACTION> | null;
};

/** store */
type TODOLIST_STATE = {
  selectTodoItem: TODOITEM;
  todoList: TODOLIST;
};

/** action */
type TODOLIST_ACTION = {
  type: string; // 액션
  data: TODOITEM; // 데이터
  list?: TODOLIST;
};

/******************** store ********************/
export const initTodoListState: TODOLIST_STATE = {
  selectTodoItem: {
    id: 1,
    title: "",
    content: "",
    status: "todo",
    dueDate: new Date(),
  },
  todoList: { todo: [], inProgress: [], done: [] },
};

/******************** context ********************/
const initTodoListContext: TODOLIST_CONTEXT = { state: null, dispatch: null };
export const TodoListContext =
  createContext<TODOLIST_CONTEXT>(initTodoListContext);

/******************** reducer ********************/
export function todoListReducer(
  state: TODOLIST_STATE,
  action: TODOLIST_ACTION
) {
  const key: TODOSTATUS = action.data.status;
  const todoListOfKey: TODOITEM[] = state.todoList[key];
  const todoItem: TODOITEM = action.data;
  const seq: number = Object.keys(state.todoList).reduce(
    (prev: number, current: string) => {
      return prev + state.todoList[current as TODOSTATUS].length;
    },
    0
  );

  switch (action.type) {
    // 아이템 선택
    case "selectItem": {
      return {
        ...state,
        selectTodoItem: todoItem,
      };
    }
    // 아이템 초기화
    case "initSelectItem": {
      return {
        ...state,
        selectTodoItem: initTodoListState.selectTodoItem,
      };
    }

    // todoList 조회
    case "findTodoList": {
      // 파일로 조회된 todoList
      const findTodoList: TODOLIST = action.list!;

      // todoList 재구성
      /**
       * todoList의 key에 맞게 분류 파일로 조회된 todoList를 분류
       */
      const arrangeTodoList: TODOLIST = Object.keys(findTodoList).reduce(
        (prev: TODOLIST, current: string) => {
          const key: TODOSTATUS = current as TODOSTATUS;
          const todoListOfKey: TODOITEM[] = findTodoList[key];

          // dueDate의 타입 설정
          const arrangeTodoListOfKey: TODOITEM[] = todoListOfKey.reduce(
            (todoPrev: TODOITEM[], todoCurrent: TODOITEM) => {
              return todoPrev.concat({
                ...todoCurrent,
                dueDate: new Date(todoCurrent.dueDate),
              });
            },
            [] as TODOITEM[]
          );

          return { ...prev, [key]: arrangeTodoListOfKey };
        },
        {} as TODOLIST
      );

      return {
        ...state,
        todoList: arrangeTodoList,
      };
    }

    // todoList 저장
    case "saveTodoList": {
      // id 설정
      todoItem.id = seq + 1;

      return {
        ...state,
        todoList: {
          ...state.todoList,
          [key]: state.todoList[key].concat(todoItem),
        },
      };
    }

    // todoList 수정
    case "updateTodoList": {
      // 1. 원본 todoItem 조회
      let originTodoItem: TODOITEM | null = null;
      Object.keys(state.todoList).forEach((todoListKey: string) => {
        state.todoList[todoListKey as TODOSTATUS].forEach((el: TODOITEM) => {
          if (el.id === todoItem.id) originTodoItem = el;
        });
      });

      // 2. status 변경 확인
      if (!originTodoItem) return state;
      const originKey: TODOSTATUS = (originTodoItem as TODOITEM).status; // 원본 todoItem의 status
      if ((originTodoItem as TODOITEM).status === todoItem.status) {
        // 2.1 status가 같은 경우
        /**
         * todoList의 동일한 key에서 해당 todoItem을 교체
         */
        const arrangeTodoListOfKey: TODOITEM[] = todoListOfKey.reduce(
          (prev: TODOITEM[], current: TODOITEM) => {
            if (current.id === todoItem.id) return prev.concat(todoItem);
            else return prev.concat(current);
          },
          [] as TODOITEM[]
        );

        return {
          ...state,
          todoList: {
            ...state.todoList,
            [key]: arrangeTodoListOfKey,
          },
        };
      } else {
        // 2.2 status가 다른 경우
        /**
         * 1. todoList의 원본 key에서 해당 todoItem을 삭제
         * 2. todoList의 수정 key에서 해당 todoItem을 추가
         */

        // 2.2.1 원본 제거
        const arrangeTodoListOfOriginKey: TODOITEM[] = state.todoList[
          originKey
        ].reduce((prev: TODOITEM[], current: TODOITEM) => {
          if (current.id === originTodoItem?.id) return prev;
          return prev.concat(current);
        }, [] as TODOITEM[]);

        // 2.2.2 수정된 todoItem 추가
        const arrangeTodoListOfkey = state.todoList[key].concat(todoItem);

        return {
          ...state,
          todoList: {
            ...state.todoList,
            [originKey]: arrangeTodoListOfOriginKey,
            [key]: arrangeTodoListOfkey,
          },
        };
      }
    }

    // todoList 삭제
    case "deleteTodoList": {
      const arrangeTodoListOfKey: TODOITEM[] = todoListOfKey.filter(
        (el: TODOITEM) => el.id !== todoItem.id
      );

      return {
        ...state,
        todoList: {
          ...state.todoList,
          [key]: arrangeTodoListOfKey,
        },
      };
    }

    // todoList 삭제 취소
    case "undoDeleteTodoList": {
      const arrangeTodoListOfKey: TODOITEM[] = todoListOfKey.concat(todoItem);
      return {
        ...state,
        todoList: {
          ...state.todoList,
          [key]: arrangeTodoListOfKey,
        },
      };
    }

    default: {
      throw new Error("Unhandeld action");
    }
  }
}
