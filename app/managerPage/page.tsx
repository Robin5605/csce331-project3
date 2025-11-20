import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import EmployeesPage from "@/app/employees/page";
import IngredientManagementPage from "@/app/ingredientManagementPage/page";
import MenuManagementPage from "@/app/menuManagementPage/page";
import ReportsPage from "@/app/ReportsPage/page";
import XZReports from "@/app/x_and_z_reports/page";

export default function ManagerPage() {
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      <Tabs defaultValue="cashier" className="w-full">

        {/* ───── TAB HEADERS ───── */}
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="xz_reports">X and Z Reports</TabsTrigger>
        </TabsList>

        {/* ───── TAB CONTENTS ───── */}

        <TabsContent value="employees" className="pt-4">
          <EmployeesPage />
        </TabsContent>

        <TabsContent value="ingredients" className="pt-4">
          <IngredientManagementPage />
        </TabsContent>

        <TabsContent value="menu" className="pt-4">
          <MenuManagementPage />
        </TabsContent>

        <TabsContent value="reports" className="pt-4">
          <ReportsPage />
        </TabsContent>

		<TabsContent value="xz_reports" className="pt-4">
		  <XZReports />
		</TabsContent>
	</Tabs>

    </div>
  );
}
