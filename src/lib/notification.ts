import {
  isPermissionGranted,
  requestPermission,
  sendNotification as _sendNotification,
} from "@tauri-apps/api/notification";

type NotificationProps = {
  title: string;
  body: string;
};

export async function sendNotification(props: NotificationProps) {
  let allowed = await isPermissionGranted();

  if (!allowed) {
    const permission = await requestPermission();
    allowed = permission === "granted";
  }

  if (allowed) {
    _sendNotification(props);
  }

  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // setGreetMsg(await invoke("greet", { name }));
}
