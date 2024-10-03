import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  initTodoListState,
  TODOITEM,
  TODOLIST_CONTEXT,
  TodoListContext,
} from "../_store/todoListStore";
import { STYLE } from "@/public/styles/theme/theme";

/******************** style ********************/
const style: STYLE = {
  formLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    gap: 3,
  },
};

// props
type TodoModalProps = {
  defaultTodoItem?: TODOITEM;
  isOpen: boolean;
  onClose: () => void;
};

export default function TodoModal({
  defaultTodoItem,
  isOpen,
  onClose,
}: TodoModalProps) {
  /******************** info ********************/
  const todoListContext = useContext<TODOLIST_CONTEXT>(TodoListContext);
  // todoItem 정보
  const [todoItem, setTodoItem] = useState<TODOITEM>(
    defaultTodoItem ?? initTodoListState.selectTodoItem
  );

  /******************** func ********************/
  // 입력값 변경시
  const onChangeValue = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const key: string = event.target.name;
      const value: string = event.target.value;

      // todoItem 정보 변경
      setTodoItem((prev: TODOITEM) => ({
        ...prev,
        [key]: key === "dueDate" ? new Date(value) : value,
      }));
    },
    []
  );

  // 저장 버튼 클릭시
  const onSaveBtnClick = useCallback(() => {
    if (todoListContext.dispatch == null) return;

    // 저장
    todoListContext.dispatch({
      type: defaultTodoItem ? "updateTodoList" : "saveTodoList",
      data: todoItem,
    });

    onClose(); // modal
  }, [defaultTodoItem, onClose, todoItem, todoListContext]);

  /******************** render ********************/
  // modal 종료시 selectTodoItem 초기화
  useEffect(() => {
    return () => {
      if (todoListContext.dispatch == null) return;

      todoListContext.dispatch({
        type: "initSelectItem",
        data: initTodoListState.selectTodoItem,
      });
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* modal 배경 */}
      <ModalOverlay />

      {/* modal 내용 */}
      <ModalContent>
        {/* modal 상단 */}
        <ModalHeader>할일 등록</ModalHeader>
        <ModalCloseButton />

        {/* modal 내용 */}
        <ModalBody pb={6}>
          {/* 제목 */}
          <FormControl>
            <FormLabel sx={style.formLabel}>제목</FormLabel>
            <Input
              name="title"
              placeholder="제목을 입력!"
              onChange={onChangeValue}
              value={todoItem.title}
            />
          </FormControl>

          {/* 내용 */}
          <FormControl mt={4}>
            <FormLabel sx={style.formLabel}>내용</FormLabel>
            <Textarea
              name="content"
              placeholder="내용을 입력!"
              onChange={onChangeValue}
              value={todoItem.content}
            />
          </FormControl>

          {/* 진행단계 */}
          <FormControl mt={4}>
            <FormLabel sx={style.formLabel}>단계</FormLabel>
            <Select
              name="status"
              size={"sm"}
              onChange={onChangeValue}
              value={todoItem.status}
            >
              {["todo", "inProgress", "done"].map(
                (value: string, index: number) => (
                  <option value={value} key={`${value}_${index}`}>
                    {value.toUpperCase()}
                  </option>
                )
              )}
            </Select>
          </FormControl>

          {/* 마감일 */}
          <FormControl mt={4}>
            <FormLabel sx={style.formLabel}>마감일</FormLabel>
            <Input
              type="date"
              name="dueDate"
              onChange={onChangeValue}
              value={todoItem.dueDate.toISOString().split("T")[0]}
            />
          </FormControl>
        </ModalBody>

        {/* modal footer */}
        <ModalFooter sx={style.footer}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSaveBtnClick} colorScheme="blue" mr={3}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
