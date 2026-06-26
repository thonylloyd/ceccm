import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function HlsPlayer({ src, poster, title }: { src: string; poster?: string; title?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    const isM3u8 = /\.m3u8(\?|$)/i.test(src);

    if (isM3u8 && video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari/iOS)
      video.src = src;
    } else if (isM3u8 && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    video.play().catch(() => {});

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full bg-black"
      controls
      autoPlay
      playsInline
      muted
      poster={poster}
      title={title}
    />
  );
}
