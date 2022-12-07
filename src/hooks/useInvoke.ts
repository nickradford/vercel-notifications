export function useInvoke<T>() {
  return async <T>(cmd: string, args?: any) => {
    const { invoke } = await import("@tauri-apps/api");
    return await invoke<T>(cmd, args);
  };
}
