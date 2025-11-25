# Use uma imagem oficial do Node.js como imagem base
FROM node:18-slim

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale apenas as dependências de produção
# O 'npm ci' é mais rápido e seguro para builds em CI/CD
RUN npm ci --only=production

# Copie o código-fonte da aplicação
# Certifique-se de ter um arquivo .dockerignore para evitar copiar node_modules e outros arquivos desnecessários
COPY . .

# ...
# Substitui 'COPY . .' e 'RUN chown...' por um único comando
COPY --chown=node:node . .
USER node
# ...

# Torne a porta 8080 acessível para o mundo fora deste contêiner
EXPOSE 8080

# Mude para o usuário não-root
USER node

# Defina o comando para executar sua aplicação
CMD [ "node", "index.js" ]