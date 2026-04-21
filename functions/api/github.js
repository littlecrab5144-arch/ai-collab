export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.searchParams.get('path') || '';
  const token = context.env.GH_TOKEN;

  if (!path.startsWith('/repos/littlecrab5144-arch/ai-collab')) {
    return new Response('Forbidden', { status: 403 });
  }

  const ghUrl = `https://api.github.com${path}${url.search.replace(/^\?path=[^&]*&?/, '?').replace(/^\?$/, '')}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'ai-collab-proxy'
  };

  // 處理 GET / POST / PUT / DELETE
  const method = context.request.method;
  let body = undefined;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await context.request.text();
  }

  const resp = await fetch(ghUrl, { method, headers, body });
  const data = await resp.text();

  return new Response(data, {
    status: resp.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
