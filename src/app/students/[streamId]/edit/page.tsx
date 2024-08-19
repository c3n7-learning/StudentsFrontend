import AdminLayout from "@/components/shared/admin-layout";
import { CrudForm } from "./crud-form";

export default function Page({ params }: { params: { streamId: number } }) {
  return (
    <AdminLayout
      breadcrumbs={[
        { href: "/streams", label: "Streams" },
        { href: "/streams/edit", label: "Edit Stream" },
      ]}
    >
      <CrudForm streamId={params.streamId} />
    </AdminLayout>
  );
}
