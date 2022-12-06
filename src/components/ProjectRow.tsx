import { Response } from "@tauri-apps/api/http";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { get } from "../lib/http";
import { DeploymentResponse, State, StateEnum } from "../types/deployments";
import { BranchIcon } from "./BranchIcon";
import { Duration } from "./Duration";
import { StatusIndicator } from "./StatusIndicator";

type ProjectRowProps = {
  projectName: string;
  interval: number;
};

function fetcher<T>(projectName: string) {
  return get<T>(
    `https://api.vercel.com/v6/deployments?app=${projectName}&limit=1`
  );
}

function isBuilding(state: State): boolean {
  return (
    state === StateEnum.BUILDING ||
    state === StateEnum.QUEUED ||
    state === StateEnum.INITIALIZING
  );
}

export function ProjectRow({ projectName, interval }: ProjectRowProps) {
  const [ping, setPing] = useState<number>();
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const [refreshInterval, setRefreshInterval] = useState(interval);

  console.log({ ping, timer });

  const { data: resp } = useSWR<Response<DeploymentResponse>>(
    projectName,
    fetcher,
    {
      refreshInterval: refreshInterval * 1000,
      onSuccess(data, key, config) {
        console.log("fetched, refreshInterval:", config.refreshInterval);
      },
    }
  );
  let { data } = resp ?? {};

  const dep = data?.deployments?.[0];

  useEffect(() => {
    if (!dep) {
      console.log("No deployment yet, return.");
      return;
    }

    const building = isBuilding(dep.state);

    if (!building && timer) {
      console.log("Not building, and there is a timer. Clear all that.");
      clearInterval(timer);
      setTimer(null);
      setRefreshInterval(interval);
    }
    if (building && !timer) {
      console.log("Building and there isn't a timer, lets make one.");
      const t = setInterval(() => {
        console.log("PING");
        setPing(Date.now());
      }, 1000);

      setTimer(t);
      setRefreshInterval(10);
    }
    return () => {
      console.log("Unmounting, clean up.");
      if (timer) {
        console.log("There's a timer, clean in.");
        setRefreshInterval(interval);
        clearInterval(timer);
      }
    };
  }, [dep?.state, ping]);

  return (
    <>
      <div className="flex flex-col gap-1 px-4 py-2 transition-colors rounded cursor-pointer hover:bg-neutral-800 ">
        <h2>{projectName}</h2>
        {dep ? (
          <div className="flex justify-between text-neutral-500">
            <div className="flex gap-6">
              <StatusIndicator state={dep.state as State} />
              <Duration
                start={dep.createdAt}
                end={
                  isBuilding(dep.state) ? Date.now() : dep.ready ?? Date.now()
                }
              />
            </div>
            <span className="flex justify-end w-1/2 gap-1">
              <BranchIcon className="relative top-1 min-w-[18px]" />
              <span className="truncate">{dep.meta.githubCommitRef}</span>
            </span>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-neutral-500 animate-pulse">
              <div className="flex gap-6">
                <span className="w-16 h-6 bg-neutral-800 " />
                <span className="w-12 h-6 bg-neutral-800 " />
              </div>
              <span className="flex justify-end w-1/2 gap-1">
                <BranchIcon className="relative top-1 min-w-[18px]" />
                <span className="w-12 h-6 bg-neutral-800" />
              </span>
            </div>
          </>
        )}
      </div>
      {/* <pre>{data && JSON.stringify(data, null, 2)}</pre> */}
    </>
  );
}
