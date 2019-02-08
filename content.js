// store visit
if (window.location.pathname.indexOf('series') >= 0) {
  // series page:
  // https://aniwatcher.com/series/shokugeki-no-souma?page=2
  const hrefSplitted = window.location.pathname.split('/');
  const seriesId = hrefSplitted[hrefSplitted.length - 1];
  const seriesTitle = document.title.replace(' Episodes', '');
  chrome.runtime.sendMessage({
    action: 'VIEW',
    data: {
      id: seriesId,
      seriesTitle,
      seriesUrl: window.location.origin + window.location.pathname,
    },
  });
} else {
  // episode page:
  // https://aniwatcher.com/shokugeki-no-souma-episode-18
  // https://aniwatcher.com/shokugeki-no-souma-ova-2
  let disableTracking = false;
  const seriesLink = document.querySelector('#nextprevlist li.center a');
  if (seriesLink) {
    const seriesUrl = seriesLink.getAttribute('href');
    const seriesTitle = seriesLink.getAttribute('title');
    const seriesId = seriesUrl.replace('/series/', '');
    const episodeTitle = document.title.replace(' - AniLinkz', '');
    document.getElementById('player').onclick = () => {
      if (disableTracking) {
        return;
      }
      chrome.runtime.sendMessage({
        action: 'VIEW',
        data: {
          id: seriesId,
          seriesTitle,
          seriesUrl: window.location.origin + seriesUrl,
          episodeTitle,
          episodeUrl: window.location.href,
        },
      });
      disableTracking = true;
    };
  }
}
