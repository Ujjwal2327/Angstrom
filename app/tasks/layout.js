import Sidebar from "@/components/tasks/Sidebar";

export default function TasksLayout({ children }) {
  return (
    <div className=" w-full">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
