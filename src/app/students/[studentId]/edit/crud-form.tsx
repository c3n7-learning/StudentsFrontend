"use client";
import { ChevronLeft, LoaderCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { store, useAppSelector } from "@/store/store";
import { fetchStudentDetails, saveStudent } from "@/store/studentSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchStreams } from "@/store/streamSlice";

export function CrudForm({ studentId }: { studentId: number }) {
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [admissionNumber, setAdmissionNumber] = useState<string>("");
  const [classStreamId, setClassStreamId] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isLoading = useAppSelector(
    (state) => state.students.studentDetailsStatus === "pending"
  );
  const studentDetails = useAppSelector(
    (state) => state.students.studentDetails
  );

  const streams = useAppSelector((state) => state.streams.streams);
  const isLoadingStreams = useAppSelector(
    (state) => state.streams.streamsStatus === "pending"
  );
  useEffect(() => {
    store.dispatch(fetchStreams());
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (studentId == -1) return;

    store.dispatch(fetchStudentDetails({ id: studentId }));
  }, [studentId]);

  useEffect(() => {
    if (studentId == -1 || !studentDetails) return;

    setFirstName(studentDetails.firstName);
    setSurname(studentDetails.surname);
    setAdmissionNumber(studentDetails.admissionNumber);
    setClassStreamId(studentDetails.classStreamId);
  }, [studentId, studentDetails]);

  async function submit() {
    try {
      setIsSubmitting(true);

      await store
        .dispatch(
          saveStudent({
            id: studentId == -1 ? undefined : studentId,
            firstName,
            surname,
            admissionNumber,
            classStreamId: classStreamId!,
          })
        )
        .unwrap();

      router.push("/students/");
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
        <Link href="/students/">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {studentId == -1 ? "New Student" : `Edit Student #${studentId}`}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {isLoading && <LoaderCircle className="animate-spin" />}
          <Link href="/students/">
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
              <CardTitle>Student Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter First Name"
                    className="w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="firstName">Surname</Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Enter Surname"
                    className="w-full"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="firstName">Admission Number</Label>
                  <Input
                    id="admissionNumber"
                    type="text"
                    placeholder="Enter Admission Number"
                    className="w-full"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="classStreamId">Class Stream</Label>
                  <div className="flex flex-row gap-2 items-center">
                    {isLoadingStreams && (
                      <LoaderCircle className="animate-spin" />
                    )}
                    <Select
                      value={`${classStreamId ?? ""}`}
                      onValueChange={(v) =>
                        setClassStreamId(v ? Number.parseInt(v) : undefined)
                      }
                    >
                      <SelectTrigger
                        id="classStreamId"
                        aria-label="Select stream"
                      >
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {streams?.map((stream) => (
                          <SelectItem key={stream.id} value={`${stream.id}`}>
                            {stream.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
