import jwt from 'jsonwebtoken';
import https from 'https';
import jwkToPem from 'jwk-to-pem';

// Utilizando variáveis de ambiente
const region = process.env.AWS_REGION; 
const userPoolId = process.env.USER_POOL_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

async function fetchJWKS(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('Erro ao fazer parse do JSON das JWKs'));
        }
      });
    }).on('error', (err) => {
      console.error('Erro ao buscar JWKS:', err);
      reject(err);
    });
  });
}

async function validateToken(token, jwks) {
  try {
    console.log('Token:', token);
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('Decoded Token:', decodedToken);

    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
      throw new Error('Token JWT inválido');
    }

    const signingKey = jwks.keys.find((key) => key.kid === decodedToken.header.kid);

    if (!signingKey) {
      throw new Error('Assinatura JWT inválida - Chave não encontrada');
    }

    const publicKey = jwkToPem(signingKey);
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  } catch (err) {
    console.error('Erro ao validar token:', err);
    throw err;
  }
}

export const handler = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  console.log('Evento Lambda@Edge:', JSON.stringify(event, null, 2));

  if (request.method === 'OPTIONS') {
    console.log('Requisição OPTIONS recebida.');
    const response = {
      status: '200',
      statusDescription: 'OK',
      headers: {
        'access-control-allow-origin': [{
          key: 'Access-Control-Allow-Origin',
          value: 'http://localhost:4200'
        }],
        'access-control-allow-methods': [{
          key: 'Access-Control-Allow-Methods',
          value: 'GET, HEAD, PUT'
        }],
        'access-control-allow-headers': [{
          key: 'Access-Control-Allow-Headers',
          value: 'Authorization, Content-Type, x-amz-*'
        }],
        'access-control-max-age': [{
          key: 'Access-Control-Max-Age',
          value: '86400'
        }]
      }
    };
    console.log('Resposta OPTIONS:', JSON.stringify(response, null, 2));
    return response;
  }

  try {
    if (!headers.authorization || headers.authorization.length === 0 || !headers.authorization[0].value) {
      throw new Error('Cabeçalho Authorization ausente ou inválido');
    }

    const authHeader = headers.authorization[0].value;
    console.log("AuthHeader: ", authHeader);
    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Cabeçalho Authorization inválido. Esperado: "Bearer <token>"');
    }

    const token = authHeader.split(' ')[1];

    const jwks = await fetchJWKS(jwksUrl);
    console.log('JWKS:', JSON.stringify(jwks, null, 2));

    await validateToken(token, jwks);

    console.log('Token válido, acesso permitido.');
    return request;

  } catch (err) {
    console.error('Erro de autorização:', err);
    return {
      status: '401',
      statusDescription: 'Unauthorized',
      headers: {
        'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Bearer' }],
      },
    };
  }
};
