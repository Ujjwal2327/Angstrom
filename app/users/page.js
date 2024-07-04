import DataTable from "./data-table";
import { getAllUsers } from "@/action/user";

export default async function UsersPage() {
  const data = await getAllUsers();

  return <DataTable data={data} />;
}
