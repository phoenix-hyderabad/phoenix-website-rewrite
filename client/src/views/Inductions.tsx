import { useEffect, useMemo, useRef } from "react";
import TeamLinkCard from "@/components/inductions_page/TeamLinkCard";
import { useAuth } from "@/lib/Auth";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Induction {
  name: string;
  url: string;
  isOpen: boolean;
}

const fetchInductions = async (): Promise<Induction[]> => {
  const response = await axiosInstance.get("/inductions/get");
  return response.data;
};

const updateInduction = async (payload: Induction): Promise<Induction> => {
  const response = await axiosInstance.patch("/inductions/update", payload);
  return response.data;
};

function Inductions() {
  const queryClient = useQueryClient();

  const {
    data: inductions,
    isLoading,
    isError,
  } = useQuery<Induction[]>(["inductions"], fetchInductions, {
    staleTime: Infinity,
  });

  const mutation = useMutation(updateInduction, {
    onMutate: (payload) => {
      const previousInductions = queryClient.getQueryData<Induction[]>([
        "inductions",
      ]);
      if (previousInductions) {
        const optimisticInductions = previousInductions.map((induction) =>
          induction.name === payload.name ? payload : induction
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
  const { checkAccess } = useAuth();
  const canEdit = useMemo(() => checkAccess("inductions:edit"), [checkAccess]);

  useEffect(() => {
    const moveEvent = (ev: MouseEvent) => {
      if (!teamsContainer.current) return;
      for (let elem of teamsContainer.current.children) {
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
  }, [teamsContainer.current]);

  const toggleOpen = (elem: Induction) => {
    mutation.mutate({ ...elem, isOpen: !elem.isOpen });
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-8 p-8 text-center">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Teams</h3>
        <p className="text-sm text-muted-foreground">
          We have the following teams to ensure the smooth functioning of
          various activities within the association.
          <br />
          Click on the respective team to apply.
        </p>
      </div>
      {isLoading ? (
        <div>Fetching status...</div>
      ) : isError ? (
        <div>An error occurred.</div>
      ) : !inductions.length ? (
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
              to={el.url}
              canEdit={canEdit}
              toggleFn={() => toggleOpen(el)}
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
