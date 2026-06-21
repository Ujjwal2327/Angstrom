// lib/projectPreview.js

/**
 * Decide what preview image a project card should show, and return everything
 * needed to render it.
 *
 * - If `live_url` exists and differs from `code_url`, treat the project as having
 *   a real live deployment: use Microlink's free screenshot embed (no API key,
 *   works as a plain <img src>) to show an actual current screenshot, and flag
 *   `isLive` so the card can show a "live" badge.
 * - Otherwise, fall back to GitHub's own native repo OpenGraph card image
 *   (the same image GitHub generates when a repo link is shared on social media).
 *   This only works if `code_url` is a github.com/{owner}/{repo} URL; if it isn't,
 *   `previewUrl` comes back null and the card should show a quiet placeholder.
 *
 * Note: Microlink's free tier is rate-limited (50 requests/day at time of writing).
 * Fine for personal-scale traffic; if Angstrom sees real volume, consider caching
 * the resolved screenshot URL server-side instead of hitting Microlink on every load.
 */
export function getProjectPreview(project) {
  const hasLiveUrl = project.live_url && project.live_url !== project.code_url;

  if (hasLiveUrl) {
    return {
      previewUrl: `https://api.microlink.io/?url=${encodeURIComponent(
        project.live_url,
      )}&screenshot=true&meta=false&embed=screenshot.url`,
      isLive: true,
    };
  }

  const githubMatch = project.code_url?.match(
    /github\.com\/([^/]+)\/([^/?#]+)/i,
  );

  if (githubMatch) {
    const [, owner, repo] = githubMatch;
    return {
      previewUrl: `https://opengraph.githubassets.com/1/${owner}/${repo.replace(
        /\.git$/,
        "",
      )}`,
      isLive: false,
    };
  }

  return { previewUrl: null, isLive: false };
}
