# Dockerfile para o Back-end LGPD (Node.js)
# Usando Multi-Stage Build para otimizar o tamanho da imagem final
# Dockerfile para a aplicação Node.js (lgpd-backend-apis)

# --- STAGE 1: Build (Instalação de dependências) ---
# --- Estágio 1: Builder ---
# Usa uma imagem Node.js completa para instalar dependências e rodar testes.
FROM node:20-slim AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app
WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências
# Copia o package.json e o package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências de produção e desenvolvimento
# As dependências de desenvolvimento são necessárias para rodar os testes no Cloud Build
# Instala TODAS as dependências (incluindo devDependencies para os testes)
RUN npm install

# --- STAGE 2: Produção (Imagem final) ---
# --- Estágio 2: Produção ---
# Usa uma imagem Node.js mínima para a execução, resultando em uma imagem final menor e mais segura.
FROM node:20-slim AS production

# Define o diretório de trabalho
WORKDIR /app
WORKDIR /usr/src/app

# Copia apenas as dependências de produção do estágio de build
COPY --from=builder /app/node_modules ./node_modules
# Copia as dependências já instaladas do estágio 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia o código-fonte da aplicação
# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que o Cloud Run usará (o valor real é injetado pelo Cloud Run)
# Expõe a porta que a aplicação usa (ajuste se for diferente)
EXPOSE 8080

# O comando de inicialização (ENTRYPOINT) será sobrescrito pelo Cloud Build/Cloud Run
# para iniciar o microsserviço específico (ex: node api_governanca.js)
# Definimos um comando padrão apenas para fins de teste local
CMD ["npm", "start:governanca"]
# Comando para iniciar a aplicação
CMD ["npm", "start"]
