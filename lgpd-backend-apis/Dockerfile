# Dockerfile para o Back-end LGPD (Node.js)
# Usando Multi-Stage Build para otimizar o tamanho da imagem final

# --- STAGE 1: Build (Instalação de dependências) ---
FROM node:20-slim AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de definição de dependências
COPY package*.json ./

# Instala as dependências de produção e desenvolvimento
# As dependências de desenvolvimento são necessárias para rodar os testes no Cloud Build
RUN npm install

# --- STAGE 2: Produção (Imagem final) ---
FROM node:20-slim AS production

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas as dependências de produção do estágio de build
COPY --from=builder /app/node_modules ./node_modules

# Copia o código-fonte da aplicação
COPY . .

# Expõe a porta que o Cloud Run usará (o valor real é injetado pelo Cloud Run)
EXPOSE 8080

# O comando de inicialização (ENTRYPOINT) será sobrescrito pelo Cloud Build/Cloud Run
# para iniciar o microsserviço específico (ex: node api_governanca.js)
# Definimos um comando padrão apenas para fins de teste local
CMD ["npm", "start:governanca"]
