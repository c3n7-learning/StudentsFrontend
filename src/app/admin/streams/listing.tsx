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

interface Product {
  id: string;
  name: string;
  description?: string;
  product_status?: string;
  price?: string;
}

interface PreFilter {
  field: string;
  operator: string;
  value: string;
}

interface QueryData {
  query: string;
  prefilters?: PreFilter[];
}

interface QueryResponse {
  ids: string[];
}

export function ProductsListing() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [filteredIds, setFilteredIds] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [productStatus, setProductStatus] = useState<string>("");

  useEffect(() => {
    async function fetcher() {
      setIsLoading(true);
      // Fetch the data
      setIsLoading(false);
    }

    fetcher();
  }, []);

  const searchVectorIndex = useMemo(
    () =>
      debounce(
        async (query: string, prefilters?: PreFilter[]): Promise<void> => {
          setIsLoading(true);

          // Send a filtering-query from here

          setIsLoading(false);
        },
        750
      ),
    []
  );

  useEffect(() => {
    if (!query) {
      setFilteredIds([]);
      return;
    }

    const prefilters: PreFilter[] = [];

    if (productStatus && productStatus !== "all")
      [
        prefilters.push({
          field: "product_status",
          operator: "==",
          value: productStatus,
        }),
      ];

    searchVectorIndex(query, prefilters);
  }, [query, productStatus, searchVectorIndex]);

  const filteredProducts = useMemo<Product[]>(() => {
    if (!query || filteredIds.length === 0) {
      return productList;
    }
    const products: Product[] = [];

    filteredIds.forEach((id) => {
      const product = productList.find((item) => item.id === id);
      if (product) products.push(product);
    });

    return products;
  }, [productList, filteredIds, query]);

  return (
    <AdminLayout
      breadcrumbs={[{ href: "/admin/streams", label: "Streams" }]}
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

          <Link href="/admin/streams/edit">
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
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell whitespace-nowrap">
                  Total Sales
                </TableHead>
                <TableHead className="hidden md:table-cell whitespace-nowrap">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-medium">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.product_status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell whitespace-nowrap">
                    Ksh. {product.price}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">25</TableCell>
                  <TableCell className="hidden md:table-cell">
                    2023-07-12 10:42 AM
                  </TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
}
