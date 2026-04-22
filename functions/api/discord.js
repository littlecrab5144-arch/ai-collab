export async function onRequest(context) {
  const url = new URL(context.request.url);
  const channelId = url.searchParams.get('channel');
  const limit = url.searchParams.get('limit') || '50';

  if (!channelId || !/^\d+$/.test(channelId)) {
    return new Response('Invalid channel', { status: 400 });
  }

  const DISCORD_TOKEN = context.env.DISCORD_BOT_TOKEN;
  const ghUrl = `https://discord.com/api/v10/channels/${channelId}/messages?limit=${limit}`;

  const resp = await fetch(ghUrl, {
    headers: {
      'Authorization': `Bot ${DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await resp.text();
  return new Response(data, {
    status: resp.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
