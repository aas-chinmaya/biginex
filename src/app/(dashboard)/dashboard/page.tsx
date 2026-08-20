import { Card } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Receipt,
  IndianRupee,
} from "lucide-react";


const stats = [
  {
    title: "Total Items",
    value: "1,245",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Today's Sales",
    value: "₹42,580",
    icon: ShoppingCart,
    color: "text-green-600",
  },
  {
    title: "Purchase",
    value: "₹18,900",
    icon: Receipt,
    color: "text-orange-600",
  },
  {
    title: "Revenue",
    value: "₹8,45,230",
    icon: IndianRupee,
    color: "text-violet-600",
  },
];


export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Welcome to Biznex ERP. Here's an overview of your business.
        </p>
      </div>


      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="flex items-center justify-between p-6"
            >

              <div>
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {item.value}
                </h2>
              </div>


              <div
                className={`rounded-xl bg-gray-100 p-4 ${item.color}`}
              >
                <Icon className="h-7 w-7" />
              </div>

            </Card>
          );
        })}

      </div>


      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">

        <Card className="p-6 lg:col-span-2">

          <h3 className="mb-4 text-lg font-semibold">
            Sales Overview
          </h3>


          <div className="flex h-80 items-center justify-center rounded-lg border border-dashed">
            Sales Chart
          </div>

        </Card>


        <Card className="p-6">

          <h3 className="mb-4 text-lg font-semibold">
            Low Stock
          </h3>


          <div className="space-y-4">

            {[
              ["Apple iPhone 15",3],
              ["Samsung A55",5],
              ["HP Laptop",2],
            ].map(([name,stock]) => (

              <div
                key={name}
                className="rounded-lg border p-3"
              >

                {name}

                <p className="text-sm text-red-500">
                  Stock: {stock}
                </p>

              </div>

            ))}

          </div>

        </Card>

      </div>


      {/* Recent Sales */}
      <Card className="p-6">

        <h3 className="mb-4 text-lg font-semibold">
          Recent Sales
        </h3>


        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed">
          DataTable Component
        </div>

      </Card>

    </div>
  );
}