// app/managerPage/page.tsx
import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TopNav from "@/components/TopNav";
import LogoutButton from "@/components/LogoutButton";

const EmployeesPage = dynamic(() => import("@/app/employees/page"), {
    loading: () => <p>Loading employees…</p>,
});

const IngredientManagementPage = dynamic(
    () => import("@/app/ingredientManagementPage/page"),
    {
        loading: () => <p>Loading ingredients…</p>,
    },
);

const MenuManagementPage = dynamic(
    () => import("@/app/menuManagementPage/page"),
    {
        loading: () => <p>Loading menu…</p>,
    },
);

const ReportsPage = dynamic(() => import("@/app/ReportsPage/page"), {
    loading: () => <p>Loading reports…</p>,
});

const XZReports = dynamic(() => import("@/app/x_and_z_reports/page"), {
    loading: () => <p>Loading X/Z reports…</p>,
});

const KitchenPage = dynamic(() => import("@/app/KitchenPage/page"), {
    loading: () => <p>Loading kitchen…</p>,
});

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
                    <TabsTrigger value="xz_reports">X and Z Reports</TabsTrigger>
                    <TabsTrigger value="kitchenpage">Kitchen Page</TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="pt-5">
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

                <TabsContent value="kitchenpage" className="pt-4">
                    <KitchenPage />
                </TabsContent>
            </Tabs>

            <LogoutButton />
        </div>
    );
}
