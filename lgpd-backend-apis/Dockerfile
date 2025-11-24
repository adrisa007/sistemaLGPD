# Dockerfile para a aplicação Node.js (lgpd-backend-apis)

# --- Estágio 1: Builder ---
# Este estágio é usado pelo Cloud Build para instalar TODAS as dependências e rodar os testes.
FROM node:20-slim AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# --- Estágio 2: Produção ---
# Usa uma imagem Node.js mínima para a execução, resultando em uma imagem final menor e mais segura.
FROM node:20-slim AS production

WORKDIR /usr/src/app

COPY package*.json ./

# Instala APENAS as dependências de produção, criando uma imagem final mais enxuta.
RUN npm install --production

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que a aplicação usa (ajuste se for diferente)
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]
