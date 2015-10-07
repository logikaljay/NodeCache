# NodeCache
NodeCache will listen for HTTP GETs in an aim to increase the TTFB for .NET sites in a reusable component (per website)

When it receives a GET, it will check its cache.
- If the result is present, it will reply with the response.
- If the result is not present, it will preform the same GET in the background, cache it and return the result.
