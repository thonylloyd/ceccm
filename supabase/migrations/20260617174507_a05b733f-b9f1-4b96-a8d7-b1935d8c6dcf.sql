
ALTER TABLE public.video_unlocks DROP CONSTRAINT IF EXISTS video_unlocks_pkey;
ALTER TABLE public.video_unlocks ADD PRIMARY KEY (user_id, video_id, method);

ALTER TABLE public.broadcast_unlocks DROP CONSTRAINT IF EXISTS broadcast_unlocks_pkey;
ALTER TABLE public.broadcast_unlocks ADD PRIMARY KEY (user_id, broadcast_id, method);
