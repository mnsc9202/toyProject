import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TODOLIST } from "@/app/_store/todoListStore";

/******************** type ********************/
/** todo api response */
export type TODO_RESPONSE = {
  type: string;
  message: string;
  data?: TODOLIST;
};

/******************** const ********************/
/** 현재 작업 경로 */
const currentWorkingDirectory: string = process.cwd();

/** todoList 파일명 */
const todoListFileName: string = "todoList.txt";

export async function GET(request: Request) {
  // 파일 읽기 경로 설정
  const filePath = path.join(
    currentWorkingDirectory,
    "public",
    "files",
    todoListFileName
  );

  try {
    // 파일의 내용 읽기
    const fileData: string = await fs.promises.readFile(filePath, "utf-8");

    // 변환
    const data: TODOLIST = JSON.parse(fileData);

    // response
    return NextResponse.json(
      { type: "success", message: "파일 조회 성공!", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { type: "error", message: "파일 조회 오류!" },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  const reqBody = await request.json();

  // 파일 저장 경로 설정
  const filePath = path.join(
    currentWorkingDirectory,
    "public",
    "files",
    todoListFileName
  );

  try {
    // 디렉토리 생성 (존재하지 않을 경우)
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // 파일에 내용 쓰기
    const result = await new Promise((resolve, reject) => {
      fs.writeFile(
        filePath,
        JSON.stringify(reqBody),
        (err: NodeJS.ErrnoException | null) => {
          if (err) {
            reject(err);
          } else {
            resolve(err);
          }
        }
      );
    });
    if (result === null) {
      return NextResponse.json(
        { type: "success", message: "파일 저장 성공!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { type: "error", message: "파일 저장 오류!" },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { type: "error", message: "파일 저장 오류!" },
      { status: 200 }
    );
  }
}
