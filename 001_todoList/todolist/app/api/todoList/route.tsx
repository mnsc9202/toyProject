import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const todoListPath: string = process.env.NEXT_PUBLIC_USER_HOST ?? "";
const currentWorkingDirectory: string = process.cwd();
const todoListFileName: string = "todoList.txt";

export async function GET(request: Request) {
  // 파일 읽기 경로 설정
  const filePath = path.join(
    currentWorkingDirectory,
    "public",
    "files",
    todoListFileName
  );

  // 파일의 내용 읽기
  const fileData: string = await fs.promises.readFile(filePath, "utf-8");
  return NextResponse.json({ data: fileData }, { status: 200 });
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

  // 디렉토리 생성 (존재하지 않을 경우)
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // 파일에 내용 쓰기
  fs.writeFile(filePath, JSON.stringify(reqBody), (err) => {
    if (err) {
      return NextResponse.json(
        { message: `파일 저장 오류! / ${err}` },
        { status: 500 }
      );
    }
  });
  return NextResponse.json({ message: "파일 저장 성공!" }, { status: 200 });
}
