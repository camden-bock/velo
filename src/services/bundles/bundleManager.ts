import {
  getBundleRules,
  releaseHeldThreads,
  updateLastDelivered,
  type DeliverySchedule,
} from "../db/bundleRules";
import { getAllAccounts } from "../db/accounts";

let bundleInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Check if the current time matches a delivery schedule.
 * We check within a 2-minute window to account for the 60s interval.
 */
function isDeliveryTime(schedule: DeliverySchedule): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (!schedule.days.includes(currentDay)) return false;
  if (currentHour !== schedule.hour) return false;
  // Allow within 2-minute window
  return currentMinute >= schedule.minute && currentMinute < schedule.minute + 2;
}

/**
 * Check all delivery schedules and release held threads when delivery time arrives.
 */
async function checkBundleDelivery(): Promise<void> {
  try {
    const accounts = await getAllAccounts();

    for (const account of accounts) {
      if (!account.is_active) continue;

      const rules = await getBundleRules(account.id);

      for (const rule of rules) {
        if (!rule.delivery_enabled || !rule.delivery_schedule) continue;

        let schedule: DeliverySchedule;
        try {
          schedule = JSON.parse(rule.delivery_schedule) as DeliverySchedule;
        } catch {
          continue;
        }

        if (isDeliveryTime(schedule)) {
          // Avoid double-delivery: check last_delivered_at
          const now = Math.floor(Date.now() / 1000);
          if (rule.last_delivered_at && now - rule.last_delivered_at < 120) continue;

          const released = await releaseHeldThreads(account.id, rule.category);
          if (released > 0) {
            await updateLastDelivered(account.id, rule.category);
            // Refresh UI
            window.dispatchEvent(new Event("velo-sync-done"));
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to check bundle delivery:", err);
  }
}

export function startBundleChecker(): void {
  if (bundleInterval) return;
  checkBundleDelivery();
  bundleInterval = setInterval(checkBundleDelivery, 60_000);
}

export function stopBundleChecker(): void {
  if (bundleInterval) {
    clearInterval(bundleInterval);
    bundleInterval = null;
  }
}
