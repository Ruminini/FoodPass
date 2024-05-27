import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { sendRestockEmail } from "./Api";

const EMAIL_RESTOCK_ORDER = "send-restock-email";

TaskManager.defineTask(EMAIL_RESTOCK_ORDER, async () => {
  try {
    const response = await sendRestockEmail();
    if (!response) return BackgroundFetch.BackgroundFetchResult.NoData;
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerRestockerTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(EMAIL_RESTOCK_ORDER, {
      minimumInterval: 60 * 15,
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log("Restocker registration successful");
  } catch (error) {
    console.error("Restocker registration failed:", error);
  }
};
