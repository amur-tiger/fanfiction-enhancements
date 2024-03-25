import { createSignal, type Signal, type SignalEx } from "../signal/signal";
import effect from "../signal/effect";
import { tryParse, type WithTimestamp } from "../utils";
import Api from "./Api";
import view from "../signal/view";

const api = new Api();

type FollowsCache = WithTimestamp<Record<number, WithTimestamp<{ id: number; follow: boolean }> | undefined>>;

function getStoryFollowCache(type: "alerts" | "favorites"): Signal<FollowsCache> {
  const key = `ffe-${type}`;

  const signal = createSignal(
    tryParse<FollowsCache>(localStorage.getItem(key), {
      timestamp: 0,
    }),
    {
      async onChange(next) {
        localStorage.setItem(key, JSON.stringify(next));

        dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: JSON.stringify(next),
          }),
        );
      },
    },
  );

  effect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }

      const next = tryParse<FollowsCache>(event.newValue);
      if (next) {
        (signal as SignalEx<FollowsCache>).set(next, { silent: true });
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  });

  return signal;
}

export function getStoryFavorite(storyId: number): Signal<boolean> {
  return view(
    getStoryFollowCache("favorites"),
    (cache) => cache[storyId]?.follow ?? false,
    (cache, follow) => {
      if (follow) {
        void api.addStoryFavorite(storyId);
      } else {
        void api.removeStoryFavorite(storyId);
      }

      return {
        ...cache,
        [storyId]: {
          ...cache[storyId],
          id: storyId,
          follow,
          timestamp: Date.now(),
        },
      };
    },
  );
}

export function getStoryAlert(storyId: number): Signal<boolean> {
  return view(
    getStoryFollowCache("alerts"),
    (cache) => cache[storyId]?.follow ?? false,
    (cache, follow) => {
      if (follow) {
        void api.addStoryAlert(storyId);
      } else {
        void api.removeStoryAlert(storyId);
      }

      return {
        ...cache,
        [storyId]: {
          ...cache[storyId],
          id: storyId,
          follow,
          timestamp: Date.now(),
        },
      };
    },
  );
}

function updateFollows() {
  // fetch follows every 5 minutes
  const maxAge = 5 * 60 * 1000;
  const favorites = getStoryFollowCache("favorites");
  if (favorites.peek().timestamp < Date.now() - maxAge) {
    api.getStoryFavorites().then((follows) => {
      favorites.set({
        timestamp: Date.now(),
        ...Object.fromEntries(
          follows.map((follow) => [
            follow.id,
            {
              id: follow.id,
              follow: true,
              timestamp: Date.now(),
            },
          ]),
        ),
      });
    });
  }
  const alerts = getStoryFollowCache("alerts");
  if (alerts.peek().timestamp < Date.now() - maxAge) {
    api.getStoryAlerts().then((follows) => {
      alerts.set({
        timestamp: Date.now(),
        ...Object.fromEntries(
          follows.map((follow) => [
            follow.id,
            {
              id: follow.id,
              follow: true,
              timestamp: Date.now(),
            },
          ]),
        ),
      });
    });
  }
}

function migrateFollows() {
  // Cache migration from < 0.8
  const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i) as string);
  for (const key of keys) {
    if (key && /^ffe-story-\d+-(favorite|alert)$/.test(key)) {
      localStorage.removeItem(key);
      localStorage.removeItem(key + "+timestamp");
    }
  }
}

if (process.env.MODE !== "test") {
  migrateFollows();
  updateFollows();
}
