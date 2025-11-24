# Dockerfile para a aplicação Node.js (lgpd-backend-apis)

# --- Estágio 1: Builder ---
# Usa uma imagem Node.js completa para instalar dependências e rodar testes.
FROM node:20-slim AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o package.json e o package-lock.json (se existir)
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies para os testes)
RUN npm install

# --- Estágio 2: Produção ---
# Usa uma imagem Node.js mínima para a execução, resultando em uma imagem final menor e mais segura.
FROM node:20-slim AS production

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia as dependências já instaladas do estágio 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que a aplicação usa (ajuste se for diferente)
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]
