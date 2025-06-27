"use client";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import TeamCarouselItem from "~/components/aboutus_page/TeamCarouselItem";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getTeam } from "~/server/actions/team";
import { addMemberSchema } from "~/lib/schemas";
import { LoadingSpinner } from "~/components/ui/spinner";
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
import { Checkbox } from "~/components/ui/checkbox";
import type { z } from "zod";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAddMutation } from "~/hooks/team";

const fetchTeam = async () => {
  const data = await getTeam();
  return data;
};

const TeamTabContent = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { canEdit } = useAuth("members:edit");

  const addMutation = useAddMutation(() => setDialogOpen(false));

  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      uid: "",
      name: "",
      year: new Date().getFullYear(),
      contact: "",
      designation: "",
      ispoc: false,
      ispor: false,
      link: "",
      project: "",
      team: null,
    },
  });

  const onSubmit = (data: z.infer<typeof addMemberSchema>) => {
    addMutation.mutate(data);
  };

  const {
    data: team,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["team"],
    queryFn: fetchTeam,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const currentTeam = useMemo(
    () => (team ? team[current] : undefined),
    [team, current],
  );

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <h2 className="py-4 text-center text-3xl">Team</h2>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {canEdit ? (
          <DialogTrigger asChild>
            <Button className="mb-4 self-center">Add member</Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className="flex max-h-[90vh] flex-col">
          <DialogHeader className="p-2">
            <DialogTitle>Add member</DialogTitle>
            <DialogDescription>Enter details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex max-h-full flex-col" type="always">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-2 pt-0"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="uid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UID*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="fyyyyxxxx"
                            maxLength={13}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            min={2020}
                            max={new Date().getFullYear()}
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="tech">Tech</SelectItem>
                            <SelectItem value="editorial">Editorial</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            form.setValue("team", null);
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/username"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ispor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>is POR?</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.getValues("ispor") ? (
                  <>
                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : null}
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {isLoading ? (
        <LoadingSpinner className="h-6 w-6 self-center" />
      ) : isError ? (
        <div className="text-red-500">Error while fetching team members</div>
      ) : !team?.length || !currentTeam ? (
        <div>No team members to show</div>
      ) : (
        <Carousel
          setApi={setApi}
          className="flex flex-col"
          opts={{ loop: true }}
        >
          <div className="text-muted-foreground flex items-center gap-4 self-center">
            <CarouselPrevious className="static translate-y-0" />
            {currentTeam.term} {currentTeam.current ? "(current)" : ""}
            <CarouselNext className="static translate-y-0" />
          </div>
          <CarouselContent className="-ml-4">
            {team.map((el, index) => (
              <TeamCarouselItem {...el} key={index} />
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </>
  );
};

export default TeamTabContent;
