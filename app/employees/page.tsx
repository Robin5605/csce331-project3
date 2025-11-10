import { EmployeesDataTable } from "./data-table";
import { columns } from "./columns";
import { fetch_employee_data } from "@/lib/db";

export default async function EmployeePage() {
    const data = await fetch_employee_data();

    return (
        <div className="container mx-auto py-10 space-y-4">
            <h1 className="text-2xl">Employees</h1>
            <EmployeesDataTable columns={columns} data={data} />
        </div>
    );
}
