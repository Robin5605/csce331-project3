interface Category {
    id: number;
    name: string;
    stock: number;
}

interface Order {
    id: number;
    placed_at: Date;
    cost: number;
    employee_id: number;
    payment_method: string;
}

interface Employee {
    id: number;
    name: string;
    hours_worked: number;
    is_manager: boolean;
    pin: number;
}

interface MenuItem {
    id: number;
    name: string;
    category_id: number;
    stock: number;
    cost: number;
}

interface DrinkIngredient {
    id: number;
    drink_id: number;
    ingredient_id: number;
    servings: number;
}

interface DrinkOrder {
    id: number;
    menu_id: number;
    order_id: number;
}

export type {
    Category,
    Order,
    Employee,
    MenuItem,
    DrinkIngredient,
    DrinkOrder,
};
