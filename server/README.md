# Sugestão de categoria com Gemini

O app continua no Expo Go. O servidor chama a Gemini API; Firebase AI Logic e App Check não são utilizados nesta integração. O Firebase Auth existente valida a sessão, e o Firestore continua salvando as ocorrências.

## Configuração

Requer Node 22 ou superior. Não há dependências novas.

**Inicialização em um terminal:** após preencher `.env.gemini.local`, execute `npm start` na raiz. O comando inicia Expo e servidor de IA/fotos juntos, mantém o QR Code e os atalhos do Expo e identifica mensagens do servidor com `[Servidor]`. `Ctrl+C` encerra os dois. Se um processo falhar, o outro também é encerrado. Opções como `npm start -- --clear` são encaminhadas ao Expo. As credenciais são carregadas somente pelo processo do servidor.

Para executar separadamente, use `npm run ia:dev` e, em outro terminal, `npm run start:expo`.

1. Crie uma chave Gemini no AI Studio, no projeto gratuito.
2. Na raiz do projeto, copie `.env.gemini.example` para `.env.gemini.local`.
3. Preencha `GEMINI_API_KEY` apenas nesse arquivo. Em `FIREBASE_WEB_API_KEY`, use o campo público `apiKey` de `src/services/firebase.ts`.
4. Execute `npm run ia:dev`. O terminal lista os endereços de rede do computador.
5. Acrescente `EXPO_PUBLIC_IA_API_URL=http://IP_DO_COMPUTADOR:8787` ao `.env.local` existente, sem apagar outras linhas. Nunca coloque a chave Gemini nessa variável.
6. Computador e celular devem estar no mesmo Wi-Fi. Se o Windows perguntar, permita Node apenas na rede privada. Mantenha o servidor aberto.
7. Em outro terminal, execute `npm run start:expo` e abra no Expo Go. Alternativamente, pare o servidor iniciado no passo 4 e use apenas `npm start` para iniciar os dois juntos. Recarregue o app após configurar a URL. `localhost` no celular aponta para o celular, não para o computador. O túnel do Expo não expõe este servidor.
8. Em Nova ocorrência, digite ao menos 10 caracteres, solicite a sugestão e toque em “Usar categoria sugerida” se concordar. Editar a descrição descarta sugestões anteriores. A seleção manual e o cadastro funcionam mesmo sem a IA.

`GET http://IP_DO_COMPUTADOR:8787/health` no navegador do celular permite conferir a conexão sem enviar dados ao Gemini.

## Limites e privacidade

Modelo inicial: `gemini-3.5-flash-lite`. Confira disponibilidade/cota em https://aistudio.google.com/usage. Erros de chave, modelo ou quota não impedem o cadastro manual. Não há troca automática de modelo ou ativação de faturamento. A cota gratuita depende do projeto; o código não garante gratuidade se alguém vincular faturamento no Google.

Apenas a descrição é enviada ao Gemini por solicitação explícita, sem nome, localização ou identificador do usuário. No Free Tier, conteúdo pode ser usado pelo Google para melhorar seus produtos: https://ai.google.dev/gemini-api/terms. Teste com descrições fictícias sem dados pessoais.

O servidor valida tokens no Google, restringe categorias, limita o tamanho do corpo, aplica timeouts e limita o uso a 30 solicitações/minuto por processo, até 6 análises/minuto por usuário e 100/dia no processo. Reiniciar o servidor reinicia os contadores. Sessões anônimas não impedem abuso por criação de contas.

Esta configuração é para testes e demonstrações, inclusive na hospedagem gratuita. Antes de uso amplo em produção: adicionar limites persistentes/compartilhados contra abuso e revisar autenticação anônima e a verificação de tokens para essa escala. O Render oferece HTTPS para as chamadas públicas. Em teste local o tráfego é HTTP: use apenas uma rede privada confiável. Este servidor atende ao app nativo; a integração Web requer configuração de CORS específica.

Verificações: `npm run ia:test`, `npm run lint`, `npm run typecheck`.

## Hospedagem de testes no Render

O Render executa somente `server/iniciar.mjs`, sem iniciar Expo ou instalar as dependências móveis. Os demais arquivos do repositório são recebidos como fonte, mas não publicados como arquivos estáticos. A raiz do serviço precisa ser a raiz do repositório, pois as categorias compartilhadas ficam em `src/constants/categorias-labels.json`.

1. Revise `git status` e envie os arquivos da integração ao GitHub na sua branch. Não inclua `.env.local` nem `.env.gemini.local`; ambos são ignorados. O arquivo `render.yaml` não contém chaves.
2. No Render, crie **New → Web Service**, conecte `LehiRolim/Help-Campus` e selecione a branch que contém estes arquivos.
3. Preencha:

| Campo | Valor |
| --- | --- |
| Name | `help-campus-ia` (ou outro nome disponível) |
| Language | `Node` |
| Branch | A branch para a qual você enviou a integração |
| Root Directory | Deixar vazio |
| Build Command | `node --check server/iniciar.mjs && node --check server/ia.mjs` |
| Start Command | `node server/iniciar.mjs` |
| Instance Type | `Free` |
| Health Check Path | `/health` |
| Auto-Deploy | `Off`, para controlar as publicações |

4. Em **Environment Variables**, cadastre `GEMINI_API_KEY`, `GEMINI_MODEL`, `FIREBASE_WEB_API_KEY` e `FIREBASE_PROJECT_ID` usando os mesmos valores de `.env.gemini.local`. Adicione `NODE_VERSION=22.21.0`. Não adicione `EXPO_PUBLIC_IA_API_URL` no servidor; ela pertence ao aplicativo.
5. Clique em **Deploy Web Service**. Se o formulário pedir pagamento, confira se a instância escolhida é Free antes de continuar.
6. Quando estiver **Live**, abra `https://SEU-SERVICO.onrender.com/health`. O esperado é `{"ok":true}`. Isso verifica a disponibilidade do servidor, mas não faz uma consulta à IA nem valida a chave Gemini.
7. No `.env.local` do aplicativo, substitua o endereço local por `EXPO_PUBLIC_IA_API_URL=https://SEU-SERVICO.onrender.com`, sem `/health` nem `/sugerir-categoria`. Reinicie o Expo e recarregue o app.
8. Desligue apenas o servidor local da IA e teste a sugestão no celular. O servidor hospedado deve atender a solicitação. O Expo Go ainda depende do Metro no computador para abrir/carregar o código do app; para distribuir um aplicativo independente, será necessário um build próprio posteriormente.

O arquivo `render.yaml` é uma alternativa para criar um Blueprint com as mesmas definições. Se usar essa opção, selecione a branch correta e preencha os segredos no painel.

No plano Free, o Render suspende o serviço após 15 minutos sem tráfego e leva cerca de um minuto para reativá-lo. O aplicativo verifica `/health` antes da análise e permite até dois minutos para concluir a solicitação; a seleção manual continua disponível. Não use serviços artificiais de ping para evitar a suspensão.

Os limites de uso ficam em memória e recomeçam quando o Render suspende, reinicia ou publica o serviço. Eles não são um teto de cobrança permanente. Mantenha o projeto Gemini no Free Tier se quiser somente a cota gratuita. Consulte: https://render.com/docs/free e https://render.com/docs/configure-environment-variables.

## Fotos das ocorrências — Cloudinary

O formulário aceita uma foto opcional escolhida da galeria. A imagem é redimensionada no aparelho para até 1600 pixels no maior lado e convertida em JPEG, com limite de 2 MB. Selecionar, trocar ou remover a foto na prévia não faz upload. Fotos não são enviadas ao Gemini.

### Configurar a conta

1. Crie uma conta Free de **Image and Video APIs** em https://cloudinary.com/ (não confundir com o trial de Assets/DAM).
2. No painel, abra **Settings → API Keys** (ou **Go to API Keys**) e encontre **Cloud name**, **API Key** e **API Secret**.
3. Acrescente ao `.env.gemini.local` do servidor as variáveis `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`. O arquivo `.env.cloudinary.example` contém apenas os nomes, sem valores.
4. Preencha os valores apenas localmente ou em **Environment** do Render. Não coloque API Secret em `EXPO_PUBLIC_`, no código do app ou no GitHub. Não é necessário criar preset unsigned ou habilitar uploads públicos.
5. Reinicie o servidor local com `npm run ia:dev`, ou publique o código atualizado no Render e faça novo deploy após cadastrar as três variáveis.
6. Reinicie o Expo e recarregue o aplicativo para carregar `expo-image-picker` e `expo-image-manipulator`. Os módulos estão incluídos no Expo Go. Em builds próprios, será necessário gerar um novo binário para incluir os módulos e os textos de permissão.

### Salvamento e acesso

- Sem foto: o cadastro continua sendo salvo pelo SDK Firestore no aplicativo.
- Com foto: o app envia os campos e o JPEG para `POST /ocorrencias/com-foto`, no mesmo servidor da IA. O servidor valida a sessão Firebase, campos, tamanho e cabeçalho JPEG. O Cloudinary decodifica a imagem e limita suas dimensões.
- A imagem é armazenada com tipo **authenticated**, protegendo o original e suas versões. No Firestore ficam somente identificador, formato e dimensões, nunca base64 ou uma URL permanente. A foto aparece nos detalhes da ocorrência.
- `POST /fotos/visualizar` consulta o documento no Firestore usando o token do usuário e verifica a propriedade antes de gerar uma URL temporária (5 minutos). O link funciona como credencial temporária: quem receber esse link consegue acessar enquanto for válido. Não o compartilhe. A expiração não remove arquivos já baixados do aparelho.
- O servidor usa a API REST do Firestore com o token do usuário, sujeita às mesmas Security Rules. Não exige credenciais de administrador nem Firebase Storage/Blaze. O arquivo `firestore.rules` na raiz contém as regras com o campo opcional `foto` e validação de seus metadados. Copie o conteúdo completo para **Firestore Database → Regras** no projeto e clique em **Publicar**. Criar ou editar esse arquivo local não publica regras automaticamente.
- As credenciais do Cloudinary ficam somente no servidor. O cadastro já possui um ID antes do envio, e tentativas repetidas com esse ID não criam outra ocorrência. A criação no servidor usa a precondição `exists: false` para impedir sobrescrita.
- Se a gravação falhar e for possível confirmar que a ocorrência não existe, o servidor tenta remover a imagem enviada. Quando a confirmação é inconclusiva (conexão perdida ou permissão negada), preserva a foto privada para evitar apagar uma imagem de uma ocorrência que pode ter sido salva. Nesses casos, uma imagem órfã pode exigir revisão na Media Library. A integração não oferece atomicidade entre os dois serviços.
- Limite adicional: 100 tentativas de upload por dia por processo (reinícios zeram esse contador). URLs de download privado podem consumir mais banda que entrega pública via CDN; acompanhe créditos e cotas no Cloudinary. Plano Free tem limites: https://cloudinary.com/pricing.

### Teste manual

1. Escolher foto da galeria, conferir a prévia, trocar e remover antes de salvar.
2. Cancelar a galeria: o formulário e a foto anterior devem permanecer.
3. Conferir que existe apenas seleção da galeria, sem captura ou solicitação de acesso à câmera.
4. Cadastrar com foto e abrir detalhes: imagem carregada via URL temporária.
5. Cadastrar sem foto: fluxo anterior continua funcionando; ocorrências antigas também.
6. Derrubar a conexão durante envio: formulário permanece preenchido e permite nova tentativa. Confirme que não surgiu ocorrência duplicada.
7. Conferir no Cloudinary o tipo **authenticated** e no Firestore somente os metadados `foto`.

Testes automatizados de fotos usam respostas simuladas: cobrem autenticação de acesso no fluxo, arquivos inválidos, confirmação incerta, limpeza após falha e repetição sem duplicação. O upload real precisa ser validado com sua conta após preencher as credenciais.
