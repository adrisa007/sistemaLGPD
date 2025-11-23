# ----------------------------------------------------------------------------------
# 1. IMAGEM BASE: O ponto de partida (Sistema Operacional + Node.js)
# ----------------------------------------------------------------------------------
FROM node:18-slim

# ----------------------------------------------------------------------------------
# 2. DIRETÓRIO DE TRABALHO: Define onde o código estará dentro do Container
# ----------------------------------------------------------------------------------
WORKDIR /usr/src/app

# ----------------------------------------------------------------------------------
# 3. INSTALAÇÃO DE DEPENDÊNCIAS: Otimização de Cache
# ----------------------------------------------------------------------------------
# Copia o manifesto do projeto (package.json e package-lock.json)
COPY package*.json ./

# Instala todas as dependências (Express, pg, bcrypt, etc.)
# Esta é a camada que o Cloud Build cacheia. Se o package.json não mudar,
# esta etapa não será executada novamente, acelerando as construções futuras.
RUN npm install --omit=dev

# ----------------------------------------------------------------------------------
# 4. CÓDIGO-FONTE E AMBIENTE
# ----------------------------------------------------------------------------------
# Copia o restante do seu código (server.js, routes/, controllers/) para o container
COPY . .

# Expõe a porta que sua aplicação Node.js está ouvindo (definida no server.js)
# Embora o Cloud Run detecte automaticamente, é boa prática documentar.
EXPOSE 3000

# ----------------------------------------------------------------------------------
# 5. COMANDO DE INICIALIZAÇÃO: O que o Container deve rodar
# ----------------------------------------------------------------------------------
# Define o comando que será executado quando o Container for iniciado.
# Isto inicia o seu servidor Node.js.
CMD [ "node", "server.js" ]