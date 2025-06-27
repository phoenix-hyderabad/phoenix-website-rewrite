"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  TeamLinkCard,
  TeamLinkCardSkeleton,
} from "~/components/inductions_page/TeamLinkCard";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getInductions,
  type Induction,
  updateInduction as updateInductionAction,
} from "~/server/actions/inductions";
import { checkAccessSafe } from "~/lib/auth";

const fetchInductions = async () => {
  const data = await getInductions();
  return data;
};

const updateInduction = async ({ ...props }: Induction) => {
  const data = await updateInductionAction(props.name, props.url, props.isOpen);
  return data;
};

function Inductions() {
  const queryClient = useQueryClient();

  const {
    data: inductions,
    isLoading,
    isError,
  } = useQuery<Induction[]>({
    queryKey: ["inductions"],
    queryFn: fetchInductions,
    staleTime: Infinity,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: updateInduction,
    onMutate: (payload) => {
      const previousInductions = queryClient.getQueryData<Induction[]>([
        "inductions",
      ]);
      if (previousInductions) {
        const optimisticInductions = previousInductions.map((induction) =>
          induction.name === payload.name ? payload : induction,
        );
        queryClient.setQueryData(["inductions"], optimisticInductions);
      }
      return previousInductions;
    },
    onError: (err, _vars, previousInductions) => {
      if (previousInductions) {
        queryClient.setQueryData(["inductions"], previousInductions);
      }
      if (err) toast.error("Error updating induction");
    },
  });

  const teamsContainer = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const canEdit = useMemo(
    () => checkAccessSafe(session, "inductions:edit"),
    [session],
  );

  useEffect(() => {
    const moveEvent = (ev: MouseEvent) => {
      if (!teamsContainer.current) return;
      for (const elem of teamsContainer.current.children) {
        if (
          !(elem instanceof HTMLAnchorElement || elem instanceof HTMLDivElement)
        )
          return;
        const rect = elem.getBoundingClientRect(),
          x = ev.clientX - rect.left,
          y = ev.clientY - rect.top;
        elem.style.setProperty("--mouse-x", `${x}px`);
        elem.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    if (matchMedia("(pointer:fine)").matches) {
      window.addEventListener("mousemove", moveEvent);
    }

    return () => {
      window.removeEventListener("mousemove", moveEvent);
    };
  }, []);

  const toggleOpen = (elem: Induction) => {
    mutation.mutate({ ...elem, isOpen: !elem.isOpen });
  };

  const createEditFn = (elem: Induction) => {
    return async (newLink: string) => {
      return await mutation
        .mutateAsync({ ...elem, url: newLink })
        .then(() => true)
        .catch(() => false);
    };
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-8 p-8 text-center">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Teams</h3>
        <p className="text-muted-foreground text-sm">
          We have the following teams to ensure the smooth functioning of
          various activities within the association.
          <br />
          Click on the respective team to apply.
        </p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4">
          {[1, 2, 3, 4].map((e) => (
            <TeamLinkCardSkeleton key={e} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500">Error while fetching inductions</div>
      ) : !inductions?.length ? (
        <div>No inductions to show</div>
      ) : (
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4"
          ref={teamsContainer}
        >
          {inductions.map((el, index) => (
            <TeamLinkCard
              key={index}
              open={el.isOpen}
              href={el.url}
              canEdit={canEdit}
              toggleFn={() => toggleOpen(el)}
              editFn={createEditFn(el)}
            >
              {el.name}
            </TeamLinkCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inductions;
