import { Response } from "@tauri-apps/api/http";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import * as ContextMenu from "@radix-ui/react-context-menu";

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

  const open = useCallback(async (url: string) => {
    const invoke = (await import("@tauri-apps/api")).invoke;
    invoke("open_url", { url });
  }, []);

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

  const MenuItem = (props) => (
    <ContextMenu.Item
      {...props}
      className="flex items-center gap-4 px-4 py-1 transition-colors duration-100 cursor-default hover:bg-neutral-700 ring-0 hover:ring-0 hover:outline-none"
    />
  );

  return (
    <ContextMenu.Root>
      <div className="group">
        <ContextMenu.Trigger className="flex flex-col gap-1 px-4 py-2 transition-colors rounded cursor-pointer group-hover:bg-neutral-800">
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
        </ContextMenu.Trigger>
        {dep && (
          <ContextMenu.Portal>
            <ContextMenu.Content
              className="w-48 overflow-hidden rounded shadow-xl bg-neutral-800 "
              alignOffset={5}
            >
              <MenuItem onClick={() => open(`https://${dep.url}`)}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>{" "}
                Visit
              </MenuItem>
              <MenuItem onClick={() => open(dep.inspectorUrl)}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5C9 6.5001 9 6.50021 9 6.50031V6.50035V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738"
                    fill="currentColor"
                  ></path>
                </svg>
                View Deployment
              </MenuItem>
              <MenuItem
                onClick={() =>
                  open(
                    `https://github.com/${dep.meta.githubOrg}/${dep.meta.githubRepo}/commit/${dep.meta.githubCommitSha}`
                  )
                }
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.94969 7.49989C9.94969 8.85288 8.85288 9.94969 7.49989 9.94969C6.14691 9.94969 5.0501 8.85288 5.0501 7.49989C5.0501 6.14691 6.14691 5.0501 7.49989 5.0501C8.85288 5.0501 9.94969 6.14691 9.94969 7.49989ZM10.8632 8C10.6213 9.64055 9.20764 10.8997 7.49989 10.8997C5.79214 10.8997 4.37847 9.64055 4.13662 8H0.5C0.223858 8 0 7.77614 0 7.5C0 7.22386 0.223858 7 0.5 7H4.13659C4.37835 5.35935 5.79206 4.1001 7.49989 4.1001C9.20772 4.1001 10.6214 5.35935 10.8632 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H10.8632Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                View Commit
              </MenuItem>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        )}
        {/* <pre>{data && JSON.stringify(data, null, 2)}</pre> */}
      </div>
    </ContextMenu.Root>
  );
}
