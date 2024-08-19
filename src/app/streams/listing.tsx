"use client";
import Link from "next/link";
import {
  ListFilter,
  LoaderCircle,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminLayout from "@/components/shared/admin-layout";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { store, useAppSelector } from "@/store/store";
import { fetchStreams } from "@/store/streamSlice";

export function StreamsListing() {
  const isLoading = useAppSelector(
    (state) => state.streams.streamsStatus === "pending"
  );
  const streams = useAppSelector((state) => state.streams.streams);

  useEffect(() => {
    store.dispatch(fetchStreams());
  }, []);

  return (
    <AdminLayout
      breadcrumbs={[{ href: "/streams", label: "Streams" }]}
      className="gap-2 md:gap-3"
    >
      <div className="flex justify-between items-center">
        <div className="px-1">
          <CardTitle>Streams</CardTitle>
          <CardDescription className="hidden md:block">
            Manage your class streams
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isLoading && <LoaderCircle className="animate-spin" />}

          <Link href="/streams/-1/edit">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Streams
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="overflow-hidden">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streams.map((stream) => (
                <TableRow key={stream.id}>
                  <TableCell className="font-medium">{stream.id}</TableCell>
                  <TableCell className="font-medium">{stream.name}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/streams/${stream.id}/edit`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{streams.length}</strong> streams
          </div>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
}
