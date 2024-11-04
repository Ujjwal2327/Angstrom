"use client";

import Link from "next/link";
import { tasksData } from "@/data/tasks";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const paramsTask = pathname.split("/")[2];

  return (
    <aside className="w-52 fixed border-r-2 h-screen hidden sm:block overflow-y-auto pb-20">
      <Link href="/tasks" className="hover:underline text-xl font-bold">
        Tasks
      </Link>
      {Object.keys(tasksData).map((key) => {
        const task = tasksData[key];
        return (
          <Link
            key={key}
            href={`/tasks/${key}`}
            className={`hover:underline block truncate text-sm leading-loose ${
              key === paramsTask ? "opacity-100" : "opacity-50"
            }`}
            title={task.name}
          >
            {task.name}
          </Link>
        );
      })}
    </aside>
  );
}
