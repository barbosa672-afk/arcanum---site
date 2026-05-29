const DEFAULT_ENDPOINTS = [
  'https://api.infosimples.com/api/v2/consultas/inpi-marcas',
  'https://api.infosimples.com/api/v2/consultas/inpi/marcas',
  'https://api.infosimples.com/api/v2/inpi/marcas'
];

function unique(values) {
  return values.filter(Boolean).filter((value, index, arr) => arr.indexOf(value) === index);
}

function boolParam(value, fallback) {
  if (value == null || value === '') return fallback;
  return !['0', 'false', 'nao', 'não', 'no'].includes(String(value).trim().toLowerCase());
}

function sanitizeMarca(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 80);
}

async function callInfosimples(endpoint, body) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();
  let json;

  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  return { response, json };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const token = process.env.INFOSIMPLES_TOKEN;

  if (!token) {
    res.status(500).json({
      error: 'missing_infosimples_token',
      message: 'Configure a variável INFOSIMPLES_TOKEN na Vercel.'
    });
    return;
  }

  const marca = sanitizeMarca(req.query.marca);
  const pagina = Math.max(1, Math.min(Number(req.query.pagina || 1) || 1, 10));

  if (marca.length < 2) {
    res.status(400).json({
      error: 'invalid_brand',
      message: 'Informe uma marca com pelo menos 2 caracteres.'
    });
    return;
  }

  const payload = {
    token,
    marca,
    pagina,
    pedidos_vivos: boolParam(req.query.pedidos_vivos, true),
    pesquisa_textual: boolParam(req.query.pesquisa_textual, true)
  };

  const endpoints = unique([
    process.env.INFOSIMPLES_ENDPOINT,
    ...DEFAULT_ENDPOINTS
  ]);

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const { response, json } = await callInfosimples(endpoint, payload);

      if (response.status === 404) {
        lastError = { endpoint, status: response.status, json };
        continue;
      }

      if (!response.ok) {
        res.status(response.status).json({
          error: 'infosimples_error',
          endpoint,
          details: json
        });
        return;
      }

      res.status(200).json({
        fonte: 'Infosimples / INPI - Marcas',
        endpoint,
        consulta: {
          marca,
          pagina,
          pedidos_vivos: payload.pedidos_vivos,
          pesquisa_textual: payload.pesquisa_textual
        },
        ...json
      });
      return;
    } catch (error) {
      lastError = { endpoint, message: error.message };
    }
  }

  res.status(502).json({
    error: 'infosimples_unavailable',
    message: 'Não foi possível consultar a Infosimples agora.',
    details: lastError
  });
};
