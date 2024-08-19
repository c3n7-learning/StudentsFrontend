import AdminLayout from "@/components/shared/admin-layout";
import { CrudForm } from "./crud-form";

export default function Page({ params }: { params: { studentId: number } }) {
  return (
    <AdminLayout
      breadcrumbs={[
        { href: "/students", label: "Students" },
        { href: "/students/edit", label: "Edit Student" },
      ]}
    >
      <CrudForm studentId={params.studentId} />
    </AdminLayout>
  );
}
