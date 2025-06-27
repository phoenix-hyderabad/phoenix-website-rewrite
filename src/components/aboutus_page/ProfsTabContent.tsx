"use client";

import ProfessorCard from "~/components/aboutus_page/ProfessorCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { getProfessors } from "~/server/actions/professors";
import { useAuth } from "~/hooks/auth";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { type z } from "zod";
import { Input } from "~/components/ui/input";
import { addProfessorSchema } from "~/lib/schemas";
import { useAddMutation } from "~/hooks/professors";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const fetchProfessors = async () => {
  const data = await getProfessors();
  return data;
};

const ProfsTabContent = () => {
  const {
    data: professors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["professors"],
    queryFn: fetchProfessors,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { canEdit } = useAuth("professors:edit");

  const addMutation = useAddMutation(() => setDialogOpen(false));

  const onSubmit = (data: z.infer<typeof addProfessorSchema>) => {
    addMutation.mutate(data);
  };

  const form = useForm<z.infer<typeof addProfessorSchema>>({
    resolver: zodResolver(addProfessorSchema),
    defaultValues: {
      name: "",
      designation: "",
      qualification: "",
      joinedBits: "",
      interests: "",
      coursesTaught: "",
      experience: "",
      researchLab: "",
    },
  });

  return (
    <>
      <h2 className="py-4 text-center text-3xl">Professors</h2>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {canEdit ? (
          <DialogTrigger asChild>
            <Button className="mb-4 self-center">Add professor</Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className="flex max-h-[90vh] flex-col">
          <DialogHeader className="p-2">
            <DialogTitle>Add professor</DialogTitle>
            <DialogDescription>Enter details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex max-h-full flex-col" type="always">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-2 pt-0"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="joinedBits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Joined Bits*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coursesTaught"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Courses Taught</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="researchLab"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Research Lab</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((e) => (
              <ProfessorCardSkeleton key={e} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-500">Error while fetching professors</div>
        ) : !professors?.length ? (
          <div>No professors to show</div>
        ) : (
          <Dialog>
            <DialogContent className="flex flex-col overflow-auto">
              <DialogHeader>
                <DialogTitle className="flex w-full justify-center">
                  {professors[selectedIndex]?.name}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex max-h-[70dvh] flex-col" type="always">
                <ul className="divide-accent-foreground/50 h-full divide-y-2 p-2">
                  {Object.entries(professors[selectedIndex] ?? {})
                    .slice(2)
                    .map(([subject, value], index) => {
                      const content = value as string;
                      if (!content) return null;
                      return (
                        <li
                          key={index}
                          className="flex flex-col gap-4 py-2 sm:flex-col"
                        >
                          <h2>
                            {capitalizeFirstLetter(
                              subject.replace(/([a-z])([A-Z])/g, "$1 $2"),
                            )}
                            :
                          </h2>
                          <div className="text-muted-foreground">{content}</div>
                        </li>
                      );
                    })}
                </ul>
              </ScrollArea>
            </DialogContent>

            {professors.map((e, index) => (
              <ProfessorCard
                key={index}
                id={e.id}
                name={e.name}
                designation={e.designation}
                img={`/professorImages/${e.name}.png`}
                onClick={() => {
                  setSelectedIndex(index);
                }}
              />
            ))}
          </Dialog>
        )}
      </div>
    </>
  );
};

export const ProfessorCardSkeleton = () => {
  return (
    <div className="bg-card flex flex-col justify-center space-y-3 rounded-lg p-6">
      <Skeleton className="ml-auto mr-auto h-[70px] w-[70px] rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[240px]" />
        <Skeleton className="h-4 w-[240px]" />
      </div>
    </div>
  );
};

export default ProfsTabContent;
