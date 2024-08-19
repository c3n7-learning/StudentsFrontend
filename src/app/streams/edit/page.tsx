import Image from "next/image";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import AdminLayout from "@/components/shared/admin-layout";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/constants";
import { CrudForm } from "./crud-form";

export default function Page() {
  const session: string | null =
    cookies().get(SESSION_COOKIE_NAME)?.value || null;

  return (
    <AdminLayout
      breadcrumbs={[
        { href: "/admin/products", label: "Products" },
        { href: "/admin/products/edit", label: "Edit Product" },
      ]}
      session={session}
    >
      <CrudForm />
    </AdminLayout>
  );
}
