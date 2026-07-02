import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export function HlsPlayer({ src, poster, title }: { src: string; poster?: string; title?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    let retryTimer: ReturnType<typeof window.setTimeout> | null = null;
    const isM3u8 = /\.m3u8(\?|$)/i.test(src);
    setHasError(false);

    video.pause();
    video.removeAttribute("src");
    video.load();

    const attemptAutoplay = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    if (isM3u8 && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        manifestLoadingTimeOut: 15_000,
        manifestLoadingMaxRetry: 6,
        manifestLoadingRetryDelay: 1_000,
        levelLoadingMaxRetry: 6,
        fragLoadingMaxRetry: 6,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        },
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, attemptAutoplay);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!hls || !data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          retryTimer = window.setTimeout(() => hls?.startLoad(), 1_500);
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        setHasError(true);
        hls.destroy();
        hls = null;
      });
    } else if (isM3u8 && video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS fallback (Safari/iOS)
      video.src = src;
      video.addEventListener("loadedmetadata", attemptAutoplay, { once: true });
    } else {
      video.src = src;
      video.addEventListener("loadedmetadata", attemptAutoplay, { once: true });
    }

    const onVideoError = () => setHasError(true);
    video.addEventListener("error", onVideoError);

    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
      video.removeEventListener("error", onVideoError);
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        className="h-full w-full bg-black"
        controls
        autoPlay
        playsInline
        muted
        poster={poster}
        title={title}
      />
      {hasError && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/75 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Stream is connecting. If it does not start, confirm the broadcast stream URL is currently active.
        </div>
      )}
    </div>
  );
}
