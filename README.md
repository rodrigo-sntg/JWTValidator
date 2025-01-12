
# Projeto Lambda JWT Authentication

Este projeto é uma implementação de uma função Lambda que valida tokens JWT usando o Amazon Cognito. O código busca as chaves públicas do Cognito (JWKS), valida o token JWT recebido na requisição e garante o acesso autorizado. O código pode ser usado como parte de um sistema de autenticação em uma API ou website.

## Funcionalidade

- A função Lambda valida um token JWT presente no cabeçalho de requisições HTTP.
- As chaves públicas para validação do JWT são obtidas dinamicamente a partir do Amazon Cognito.
- Suporta requisições CORS para facilitar o desenvolvimento frontend com APIs RESTful.

## Requisitos

Antes de começar, você precisa ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (recomendado v14.x ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes Node)
- Conta na AWS com acesso ao AWS Lambda e Amazon Cognito.

## Configuração

### 1. Clone o repositório

Clone este repositório para o seu ambiente local:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instale as dependências

Execute o comando abaixo para instalar as dependências do projeto:

```bash
npm install
```

### 3. Configurar variáveis de ambiente

No console da AWS Lambda, configure as variáveis de ambiente necessárias:

- **AWS_REGION**: A região onde seu pool de usuários Cognito está localizado, ex: `us-east-1`.
- **USER_POOL_ID**: O ID do seu pool de usuários Cognito.

Alternativamente, você pode configurar essas variáveis em um arquivo `.env` para uso local (não adicione o `.env` ao repositório, já que ele contém dados sensíveis).

### 4. Deploy para AWS Lambda

Caso queira rodar a função na AWS Lambda, faça o deploy através da AWS Console ou use o AWS CLI ou Serverless Framework para automatizar o processo.

### 5. Teste local

Você pode simular a execução da função Lambda localmente, se necessário, usando o [AWS SAM](https://aws.amazon.com/serverless/sam/), [Serverless Framework](https://www.serverless.com/), ou [AWS Lambda emular localmente](https://docs.aws.amazon.com/lambda/latest/dg/test-samples.html).

Para rodar os testes localmente com a AWS SDK, adicione as variáveis de ambiente ou use um arquivo `.env` (lembre-se de adicionar o `.env` no `.gitignore`).

### 6. Realizando uma chamada à API

Depois de configurar e realizar o deploy, você pode fazer requisições HTTP para a função Lambda usando um cliente HTTP (ex: Postman, cURL) ou configurando a Lambda em uma API Gateway. A função espera que o token JWT seja passado no cabeçalho da requisição:

```http
Authorization: Bearer <seu_token_jwt>
```

## Estrutura de Arquivos

- `index.js`: Arquivo principal com a lógica da função Lambda para validação do JWT.
- `.gitignore`: Arquivos e pastas que não devem ser versionados (ex: `node_modules`, logs, etc).
- `package.json`: Dependências e scripts do projeto.

## Dependências

- `jsonwebtoken`: Para trabalhar com tokens JWT.
- `jwk-to-pem`: Para converter JWK (JSON Web Keys) em formato PEM, necessário para verificar a assinatura do JWT.
- `https`: Para fazer requisições HTTPS ao endpoint do Cognito para obter as JWKs.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
