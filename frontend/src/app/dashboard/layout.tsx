import DashboardNav from "@/components/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}