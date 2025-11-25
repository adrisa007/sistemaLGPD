# Estágio 1: Builder - Instala dependências e compila o que for necessário
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de manifesto de dependências
COPY package*.json ./

# Instala SOMENTE as dependências de produção.
# Isso evita incluir pacotes de desenvolvimento (como jest, supertest) na imagem final.
RUN npm install --only=production

# Copia o restante do código-fonte da aplicação
COPY . .

# --------------------------------------------------------------------

# Estágio 2: Production - Cria a imagem final e enxuta
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia as dependências já instaladas e o código-fonte do estágio 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

# Expõe a porta que a sua aplicação Express vai usar (o padrão para Cloud Run é 8080)
EXPOSE 8080

# Comando para iniciar a aplicação quando o contêiner for executado
CMD [ "node", "index.js" ]