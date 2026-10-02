// URLs for a YouTube video ID, shared by the VideoObject JSON-LD (app) and the sitemap source (server).

/** The 16:9 thumbnail (exists for every video that was uploaded in HD) */
export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`

/** The page people watch it on */
export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

/** The privacy-enhanced embed player */
export const youtubeEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`
