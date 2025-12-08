// app/managerPage/page.tsx
import { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TopNav from "@/components/TopNav";
import LogoutButton from "@/components/LogoutButton";

// These are SERVER components (pages) – normal imports are fine
import EmployeesPage from "@/app/employees/page";
import IngredientManagementPage from "@/app/ingredientManagementPage/page";
import MenuManagementPage from "@/app/menuManagementPage/page";
import ReportsPage from "@/app/ReportsPage/page";
import XZReports from "@/app/x_and_z_reports/page";
import KitchenPage from "@/app/KitchenPage/page";

export default function ManagerPage() {
    return (
        <div className="p-6">
            <TopNav subtitle="Manager Dashboard" />

            <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

            <Tabs defaultValue="employees" className="w-full">
                <TabsList className="grid grid-cols-6 w-full">
                    <TabsTrigger value="employees">Employees</TabsTrigger>
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="menu">Menu</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="xz_reports">
                        X and Z Reports
                    </TabsTrigger>
                    <TabsTrigger value="kitchenpage">Kitchen Page</TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="pt-5">
                    <Suspense fallback={<p>Loading employees…</p>}>
                        {/* async server component, so TS complains */}
                        <EmployeesPage />
                    </Suspense>
                </TabsContent>

                <TabsContent value="ingredients" className="pt-4">
                    <Suspense fallback={<p>Loading ingredients…</p>}>
                        <IngredientManagementPage />
                    </Suspense>
                </TabsContent>

                <TabsContent value="menu" className="pt-4">
                    <Suspense fallback={<p>Loading menu…</p>}>
                        <MenuManagementPage />
                    </Suspense>
                </TabsContent>

                <TabsContent value="reports" className="pt-4">
                    <Suspense fallback={<p>Loading reports…</p>}>
                        <ReportsPage />
                    </Suspense>
                </TabsContent>

                <TabsContent value="xz_reports" className="pt-4">
                    <Suspense fallback={<p>Loading X/Z reports…</p>}>
                        <XZReports />
                    </Suspense>
                </TabsContent>

                <TabsContent value="kitchenpage" className="pt-4">
                    <Suspense fallback={<p>Loading kitchen…</p>}>
                        <KitchenPage />
                    </Suspense>
                </TabsContent>
            </Tabs>

            <LogoutButton />
        </div>
    );
}
