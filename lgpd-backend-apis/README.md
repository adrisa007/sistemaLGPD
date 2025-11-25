# LGPD Backend APIs

# 🛡️ Sistema de Conformidade LGPD (Backend Node.js & GCP Cloud Run)

Este repositório contém o código-fonte do *backend* (API RESTful) do Sistema de Conformidade à Lei Geral de Proteção de Dados (LGPD). O sistema implementa o ciclo de vida completo do dado, desde o consentimento até o descarte, e fornece as ferramentas de auditoria necessárias para o Encarregado de Dados (DPO).

 O back-end completo para o Sistema de Conformidade à Lei Geral de Proteção de Dados (LGPD), desenvolvido em Node.js e implantado como microsserviços no Google Cloud Run.

## Arquitetura do Projeto

O back-end é composto por cinco microsserviços distintos, cada um responsável por uma fase do ciclo de vida da LGPD...

| Microsserviço | Função Principal | Fases LGPD |
| :--- | :--- | :--- |
| `api-governanca` | Configuração de Entidades e Cargos. | FASE 1 |
| `api-uso-dados` | Ciclo de Vida do Dado, Filtros de Acesso e Cálculo de Prazo. | FASE 2 |
| `api-auditoria` | Registro assíncrono de Log de Acesso. | FASE 2 |
| `api-solicitacoes` | Registro e Gestão dos Direitos do Titular. | FASE 3 |
| `api-relatorios` | Consulta de Logs, Auditoria e Prova Final de Descarte. | FASE 4 |

##  Deploy e CI/CD (Google Cloud)

O deploy é totalmente automatizado via **Google Cloud Build** e **Cloud Run**, utilizando o arquivo `cloudbuild.yaml`.

### Variáveis de Substituição (Cloud Build)

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `_DB_USER` | Usuário do Cloud SQL | `root` |
| `_API_AUDITORIA_URL` | URL da API de Auditoria (para `api-uso-dados`) | `https://api-auditoria-xxxx.run.app` |
...

## 💡 Arquitetura e Tecnologias

O projeto é baseado em uma arquitetura *serverless* e gerenciada na nuvem.

* **Backend:** Node.js (Express)
* **Banco de Dados:** Google Cloud SQL (MySQL)
* **OR-Mapper:** `mysql2` (MySQL client)
* **Deployment:** Google Cloud Run (Containers Serverless)
* **Segurança:** JSON Web Tokens (JWT) para autenticação e `bcrypt` para *hashing* de senhas.

## ⚙️ Estrutura do Projeto

O código está organizado em módulos lógicos, focando na separação de responsabilidades.

* `server.js`: Ponto de entrada da aplicação e configuração do servidor Express.
* `config/`: Arquivos de configuração de ambiente e conexão com o banco de dados.
    * `db.js`: Lógica de conexão com o Cloud SQL.
* `controllers/`: Lógica de negócios e conformidade (ex: `TitularController.js`, `DPOController.js`).
* `routes/`: Definição de todos os endpoints da API (ex: `/api/v1/titular`, `/api/v1/dpo/auditoria`).
* `middlewares/`: Funções para autenticação (JWT) e autorização de cargos.
* `Dockerfile`: Receita de como construir o container da aplicação para o Cloud Run.

## 🚀 Como Executar o Projeto

Estes passos detalham a execução em ambiente de **desenvolvimento local** (para testar) ou o *deployment* no **Google Cloud Platform (GCP)**.

### 1. Pré-requisitos

* Node.js (v18+) e npm instalados.
* Conta no Google Cloud Platform (GCP) com os serviços **Cloud SQL**, **Artifact Registry** e **Cloud Run** ativados.
* Credenciais de Banco de Dados (Usuário Root e Senha) geradas.

### 2. Instalação e Configuração Local

1.  **Clone o Repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd sistema-lgpd
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Arquivo de Ambiente (`.env`):**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de conexão e segurança:
    ```env
    # Credenciais do Cloud SQL
    DB_USER=root
    DB_PASSWORD=[SUA_SENHA_ROOT_DO_CLOUD_SQL] 
    DB_NAME=lgpd_db
    DB_HOST=localhost # Use IP público ou proxy para desenvolvimento
    
    # Chave Secreta para JWT (Mantenha isso em segredo!)
    JWT_SECRET=super-chave-secreta-para-lgpd
    ```

4.  **Executar em Desenvolvimento:**
    ```bash
    npm run dev 
    # O servidor estará ativo em http://localhost:3000 (ou a porta definida)
    ```

### 3. Deployment no Google Cloud (GCP)

Para implantar no Cloud Run, siga os passos de CI/CD:

1.  **Construir a Imagem Docker (Cloud Build):**
    ```bash
    gcloud builds submit . --tag [REGION]-docker.pkg.dev/[PROJECT-ID]/lgpd-repo/lgpd-backend:v1
    ```

2.  **Deploy no Cloud Run:**
    * No Console GCP, crie um novo serviço no Cloud Run.
    * Selecione a imagem `lgpd-backend:v1` do Artifact Registry.
    * Na aba **Conexões**, adicione sua **Instância do Cloud SQL**.
    * Configure as variáveis de ambiente (DB_USER, DB_NAME, JWT_SECRET) injetadas de forma segura via **Secret Manager**.

## 🔑 Endpoints da API (Exemplos)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Autentica DPO/Operador e retorna JWT. |
| `GET` | `/api/v1/titular/dados/:cpf` | [Auth] Busca dados do titular. Aplica filtro de consentimento (Tabela USOS_POR_TITULAR). |
| `POST` | `/api/v1/lgpd/solicitar` | Registra uma solicitação de direito do titular (Tabela SOLICITACOES_LGPD). |
| `GET` | `/api/v1/dpo/auditoria/acessos` | [Auth: DPO] Retorna todos os logs de acesso (Tabela LOG_ACESSO_DADOS). |

## 🤝 Contribuições

Sinta-se à vontade para abrir *issues* (problemas) ou enviar *pull requests* (solicitações de alteração).

1.  Faça o *fork* do projeto.
2.  Crie uma *branch* de *feature* (`git checkout -b feature/nova-funcionalidade`).
3.  Faça o *commit* das suas alterações (`git commit -m 'feat: Adiciona nova funcionalidade de [X]'`).
4.  Envie para o *branch* (`git push origin feature/nova-funcionalidade`).
5.  Abra um *Pull Request* detalhado.

---

**Autor:** Adriano Isral
**Licença:** ISC