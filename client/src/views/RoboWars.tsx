import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/Auth";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import dataDoublePlayoffs from "@/lib/bracket_data";
import data8kg from "@/lib/fixtures/8kg";
import data3lb from "@/lib/fixtures/3lbs";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import StyledTabTrigger from "@/components/aboutus_page/StyledTabTrigger";
import FixtureContent from "@/components/robowars_page/fixtures";

const urlSchema = z.object({
  newUrl: z
    .string()
    .regex(
      /https:\/\/www.youtube.com\/embed\/.+/,
      "Invalid URL, should be a YouTube embed URL"
    ),
});

const fetchEmbedUrl = async (): Promise<string> => {
  const response = await axiosInstance.get<string>("/robowars/embed");
  return response.data;
};

const Robowars = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkInputVal, setLinkInputVal] = useState("");

  const queryClient = useQueryClient();
  const { checkAccess } = useAuth();
  const canEdit = useMemo(() => checkAccess("robowars:embed"), [checkAccess]);

  const { data: link, isLoading } = useQuery(
    ["robowars_embed"],
    fetchEmbedUrl,
    {
      staleTime: Infinity,
      retry: 1,
    }
  );

  const editUrlMutation = useMutation((newUrl: string) => {
    return axiosInstance.post<string>("/robowars/embed", { newUrl });
  });

  const editFn = useCallback(() => {
    const parsed = urlSchema.safeParse({ newUrl: linkInputVal.trim() });
    if (!parsed.success) {
      return toast.error("Invalid URL, should be a YouTube embed URL");
    }
    editUrlMutation.mutate(parsed.data.newUrl, {
      onError: () => {
        toast.error("Failed to edit link");
      },
      onSuccess: (res) => {
        queryClient.setQueryData(["robowars_embed"], res.data);
        setDialogOpen(false);
        toast.success("Link edited successfully");
      },
    });
  }, [linkInputVal, editUrlMutation, queryClient]);

  return (
    <div className="flex flex-1 flex-col bg-[#EC2023] px-2 pb-2 text-center">
      <div className="flex w-full flex-col self-center overflow-x-hidden">
        <div className="relative flex flex-col text-center">
          <h1 className="relative font-atom text-[10rem] text-black">ROBO</h1>
          <div className="absolute left-0 top-0 flex h-full w-full -rotate-12 items-center justify-center font-miyoshi text-8xl text-[#EC2023] [text-shadow:_-1px_1px_0_#000,1px_1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
            WARS
          </div>
        </div>
        {isLoading ? (
          <LoadingSpinner className="h-8 w-8 self-center text-black" />
        ) : (
          <>
            <iframe
              width="560"
              height="315"
              src={link ?? "https://www.youtube.com/embed/dQw4w9WgXcQ"}
              title="YouTube video player"
              className="self-center border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>

            {canEdit ? (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Button
                  className="mt-4 self-center"
                  variant="secondary"
                  onClick={(e) => {
                    setDialogOpen(true);
                    setLinkInputVal(link ?? "");
                    e.preventDefault();
                  }}
                >
                  Edit link
                </Button>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit link</DialogTitle>
                    <DialogDescription>
                      Input new link for youtube embed
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    id="link"
                    value={linkInputVal}
                    onChange={(e) => setLinkInputVal(e.target.value)}
                    className="w-full"
                  />
                  <DialogFooter>
                    <Button type="submit" onClick={() => editFn()}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
          </>
        )}
        <div className="py-6" />
        <Tabs defaultValue="about">
          <TabsList className="gap-2 bg-background">
            <StyledTabTrigger value="15">15 Kg</StyledTabTrigger>
            <StyledTabTrigger value="3">3 Lbs</StyledTabTrigger>
            <StyledTabTrigger value="8">8 Kg</StyledTabTrigger>
          </TabsList>
          <div className="py-3" />
          <TabsContent value="15" className="m-0 flex flex-col">
            <FixtureContent playoffData={dataDoublePlayoffs} />
          </TabsContent>
          <TabsContent value="3" className="m-0 flex flex-col">
            <FixtureContent playoffData={data3lb} />
          </TabsContent>
          <TabsContent value="8" className="m-0 flex flex-col">
            <FixtureContent playoffData={data8kg} />
          </TabsContent>
        </Tabs>

        <div className="py-4" />
      </div>
    </div>
  );
};

export default Robowars;
