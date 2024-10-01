import { Box } from "@chakra-ui/react";
import { TODOITEM } from "../_store/todoListStore";
import { STYLE } from "@/public/styles/theme/theme";

/******************** style ********************/
const style: STYLE = {
  itemWrapper: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "todoItem.bg",
    borderRadius: 10,
    padding: 3,
    cursor: "pointer",
    // ":hover": {
    //   backgroundColor: "todoItem.hoverBg",
    // },
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
  },
};

// props
type TodoItemProps = {
  todoItem: TODOITEM;
  onClick: (el: TODOITEM) => (event: React.MouseEvent<HTMLDivElement>) => void;
};
export default function TodoItem({ todoItem, onClick }: TodoItemProps) {
  return (
    <Box
      sx={{
        ...style.itemWrapper,
        ":hover": {
          backgroundColor: `${todoItem.status}.primary`,
        },
      }}
      onClick={onClick(todoItem)}
    >
      <Box sx={style.header}>
        <Box sx={style.title}>{todoItem.title}</Box>
        <Box>{todoItem.dueDate.toISOString().split("T")[0]}</Box>
      </Box>
      <Box sx={style.content}>{todoItem.content}</Box>
    </Box>
  );
}
