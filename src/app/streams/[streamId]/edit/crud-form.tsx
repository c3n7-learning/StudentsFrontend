"use client";
import { ChevronLeft, LoaderCircle, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { store } from "@/store/store";
import { saveStream } from "@/store/streamSlice";

export function CrudForm({ streamId }: { streamId: number }) {
  const [name, setName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  async function submit() {
    try {
      setIsSubmitting(true);

      await store.dispatch(saveStream({ name })).unwrap();

      router.push("/streams/");
    } catch (error) {
      console.log("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form
      className="mx-auto grid flex-1 gap-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="flex items-center gap-4">
        <Link href="/streams/">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {streamId == -1 ? "New Stream" : `Edit Stream #${streamId}`}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Link href="/streams/">
            <Button variant="outline" size="sm">
              Discard
            </Button>
          </Link>

          <Button
            size="sm"
            className="gap-1"
            disabled={isSubmitting}
            type="submit"
          >
            {!isSubmitting && <Save className="h-3.5 w-3.5" />}
            {isSubmitting && (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            )}
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Save
            </span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 w-full">
        <div className="grid auto-rows-max items-start gap-4  lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Stream Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter stream name"
                    className="w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm">Save</Button>
      </div>
    </form>
  );
}
