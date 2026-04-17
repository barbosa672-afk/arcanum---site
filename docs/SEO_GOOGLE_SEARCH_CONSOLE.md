# SEO & Google Search Console — Arcanum

Este documento explica **exatamente o que fazer** para o site começar a aparecer
nas buscas do Google (e também do Bing). A parte técnica no site já foi feita
por este PR — o que falta é você fazer **3 coisas rápidas**:

1. **Verificar a propriedade no Google Search Console** (15 min)
2. **Enviar o sitemap.xml** (2 min)
3. **Pedir indexação das URLs principais** (2 min)

O resto é só esperar o Google rastrear e aparecer organicamente.

---

## Expectativa honesta

Termos super genéricos como **"notícias gerais"** ou **"news"** são **impossíveis**
de ranquear para um site novo — o topo é dominado por G1, UOL, Folha, BBC,
que têm 20+ anos de domínio e bilhões de backlinks.

O que é **realista** conquistar com esse site:

| Tipo de busca                              | Viabilidade | Prazo típico       |
| ------------------------------------------ | ----------- | ------------------ |
| Buscas pelo nome ("Arcanum Tax News", "Arcanum PI") | ✅ Muito alta | 1–2 semanas       |
| Long-tail tributário ("notícias reforma tributária 2026", "jurisprudência tributária recente") | ✅ Alta | 1–3 meses |
| Long-tail PI ("registrar marca Ribeirão Preto", "consultoria INPI patente") | ✅ Alta | 2–6 meses |
| Termos médios ("notícias tributárias") | 🟡 Média | 6–12 meses com conteúdo próprio |
| Termos genéricos ("notícias", "news")      | ❌ Praticamente impossível | N/A              |

**Para subir no ranking de "notícias tributárias" (e afins), a médio prazo o
site precisa de conteúdo próprio** (artigos escritos por você, não só
agregação de RSS de terceiros). O Google já sabe diferenciar agregador de fonte
primária — vê mais valor em fonte. Recomendação: publicar 1 artigo curto/semana
sobre um tema que você domina (reforma tributária, caso de cliente anonimizado,
explicação de lei, etc).

---

## O que já foi feito no código (você não precisa fazer nada)

| Arquivo                         | O que mudou                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `index.html` — `<head>`         | Title, description e keywords expandidos para cobrir PI **e** notícias tributárias/fiscais.    |
| `index.html` — `<head>`         | Meta tags `geo.*`, `theme-color`, `hreflang`, `robots` com `max-image-preview:large`.          |
| `index.html` — `<head>`         | Open Graph + Twitter Card (aparece bonito quando o link é compartilhado).                      |
| `index.html` — `<head>`         | JSON-LD com `Organization` + `WebSite` + `LegalService` (nome, NAP, serviços, SearchAction).   |
| `index.html` — `<head>`         | Placeholder `google-site-verification` para você colar o token do Search Console.              |
| `sitemap.xml`                   | Expandido com todas as seções + referência de imagem (logo).                                   |
| `robots.txt` (novo)             | Permite indexação, aponta pro sitemap, autoriza `Googlebot-Image`.                             |

---

## 1. Google Search Console — Verificação da propriedade

### Passo a passo

1. Acesse <https://search.google.com/search-console>.
2. Clique em **"Adicionar propriedade"**.
3. Escolha **"Prefixo do URL"** (é o mais fácil) e digite:
   ```
   https://arcanumpi.com.br
   ```
   (se preferir, use "Domínio" — cobre www/sem-www e http/https, mas exige acesso
   ao DNS da Registro.br, mais chato).
4. O Google vai te oferecer várias formas de verificar. Escolha uma:

#### Opção A — Tag HTML (a mais simples, **recomendada**)

1. O Google mostra uma tag parecida com:
   ```html
   <meta name="google-site-verification" content="aBc123xYz_longStringUniqueToYou" />
   ```
2. Copie **apenas o valor do `content`** (a string entre aspas).
3. Abra `index.html` e procure por `google-site-verification` (fica logo no topo
   do `<head>`). Substitua `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` pela
   string copiada.
4. Faça commit e push (ou use a interface do GitHub: editar arquivo → commit).
5. Espere 2–3 minutos o GitHub Pages publicar.
6. Volte no Search Console e clique em **"Verificar"**.

#### Opção B — DNS TXT (mais permanente)

Útil se você quiser verificar o **domínio inteiro** (cobrindo `www` + raiz). Exige
acesso ao painel da Registro.br ou de onde você hospeda o DNS.

1. No Search Console, escolha "Domínio" em vez de "Prefixo do URL".
2. O Google dá um registro TXT tipo `google-site-verification=abc123...`.
3. No painel DNS: adicione um registro **TXT** com esse valor na raiz (`@`).
4. Espere 1–24h a propagação e clique em "Verificar".

#### Opção C — Via Google Analytics

Se um dia configurar GA4 no site, pode verificar em 1 clique direto do GSC.
Não vamos usar agora porque você não quer analytics — mas fica a opção.

---

## 2. Enviar o sitemap.xml

Depois de verificado:

1. No Search Console, menu lateral → **"Sitemaps"**.
2. Em "Adicionar um novo sitemap", digite:
   ```
   sitemap.xml
   ```
   (o campo completa automaticamente com `https://arcanumpi.com.br/`)
3. Clique em **"Enviar"**.
4. Em poucos minutos (às vezes horas) o status vai mudar para **"Êxito"** e o
   Google começa a rastrear. Volte em 3–7 dias pra ver quantas URLs indexaram.

> ⚠️ **Nota sobre URLs com `#`:** o Google em geral **não indexa fragmentos
> `#noticias`, `#marcas` etc. como páginas separadas** — ele trata como
> a mesma página (`/`). Elas estão no sitemap mais como documentação de
> estrutura; só contam como páginas separadas se no futuro forem rotas
> reais (ex.: `/noticias/`, `/marcas/`).

---

## 3. Pedir indexação manual (acelera as primeiras visitas do Googlebot)

Também dentro do Search Console:

1. Na barra de busca do topo do painel, cole **`https://arcanumpi.com.br`** e pressione Enter.
2. Se aparecer "URL não está no Google", clique em **"Solicitar indexação"**.
3. Pode haver fila (até 1–2 dias pra processar), mas costuma aparecer em
   24–48h.
4. Repita para o subdomínio se tiver (`https://www.arcanumpi.com.br`).

---

## 4. Bing Webmaster Tools (5 minutos, mesmo processo)

Bing + DuckDuckGo (que usa Bing) representam ~8% das buscas no Brasil. Vale o
esforço de 5 min:

1. Acesse <https://www.bing.com/webmasters/>.
2. Entre com sua conta Google/Microsoft.
3. Clique em **"Importar do Google Search Console"** — importa tudo de uma vez
   (propriedade + sitemap) se você já fez o passo 1.
4. Pronto.

---

## 5. Perfil da Empresa no Google (Google Meu Negócio) — grátis, gera tráfego local

Não é Search Console, mas é a maior alavanca orgânica para um escritório em
Ribeirão Preto. **Faça isso.**

1. Acesse <https://www.google.com/business/>.
2. Clique em "Gerenciar agora" → crie o perfil:
   - Nome: **Arcanum Propriedade Intelectual**
   - Categoria: **Advogado** (e adicione também **Consultor jurídico** como secundária)
   - Endereço: Ribeirão Preto — SP (pode marcar "atendemos clientes no endereço deles" para não aparecer o endereço de casa, se for o caso)
   - Telefone: +55 16 99255-3003
   - Site: https://arcanumpi.com.br
3. Google envia um cartão postal com código de verificação (leva ~5–14 dias).
4. Depois de verificado, adicione: foto do logo, foto externa (se tiver sala),
   horário de atendimento, descrição de 750 caracteres (use palavras-chave:
   "registro de marca", "patente", "INPI", "Ribeirão Preto").
5. **Peça avaliações** pros seus primeiros clientes — cada avaliação 5 estrelas
   sobe o ranking local.

Depois que estiver ativo, buscas por "advogado marcas Ribeirão Preto",
"registro INPI Ribeirão Preto" etc. tendem a te mostrar no **Maps** + no pack
local do Google Search — conversão muito alta.

---

## 6. O que monitorar no Search Console (semanalmente)

| Seção                             | O que olhar                                                      |
| --------------------------------- | ---------------------------------------------------------------- |
| **Visão geral**                   | Cliques, impressões, CTR, posição média.                         |
| **Desempenho → Consultas**        | Quais buscas trouxeram gente pro site. **Ouro** pra saber em quais termos investir conteúdo. |
| **Páginas indexadas**             | Se o Google tá tendo problema pra indexar alguma URL.            |
| **Sitemap**                       | Se continua com status "Êxito".                                  |
| **Core Web Vitals**               | Velocidade/layout — GitHub Pages é rápido, provável estar verde. |
| **Melhorias → Dados estruturados**| Avisa se o JSON-LD tem erro (vale conferir na 1ª semana).        |

---

## 7. Validação rápida que as mudanças deste PR estão OK

Depois de fazer o merge e o site atualizar (1–2 min no GitHub Pages):

| O que testar                                       | Onde                                                                 |
| -------------------------------------------------- | -------------------------------------------------------------------- |
| robots.txt aparece                                 | https://arcanumpi.com.br/robots.txt                                  |
| sitemap.xml aparece e é XML válido                 | https://arcanumpi.com.br/sitemap.xml                                 |
| JSON-LD está correto e sem erro                    | https://search.google.com/test/rich-results?url=https://arcanumpi.com.br |
| Preview do WhatsApp/LinkedIn (og:image etc)        | https://www.opengraph.xyz/url/https%3A%2F%2Farcanumpi.com.br         |
| Título e descrição que o Google mostra             | https://search.google.com/test/rich-results?url=https://arcanumpi.com.br |

---

## 8. Ganhos futuros (quando quiser investir em crescer orgânico)

Em ordem decrescente de retorno:

1. **Publicar conteúdo próprio** — 1 artigo/semana sobre temas que você conhece
   (reforma tributária, explicação de lei, caso de cliente, etc.). Isso é o que
   mais move o ponteiro. Pode ser numa pasta `/blog/` ou em páginas separadas
   `/artigos/reforma-tributaria-2026.html`.
2. **Transformar `#marcas`, `#patentes`, `#software` em páginas reais** — cada
   uma vira um HTML separado (`/registro-de-marcas.html`), com seu próprio
   `<title>`, `<meta description>`, conteúdo único e JSON-LD `Service`. Hoje o
   Google trata tudo como a mesma página.
3. **Backlinks** — pedir parceiros, associações de advogados (OAB/SP),
   câmaras de comércio de Ribeirão Preto para linkar o site.
4. **Schema de FAQ** — como o site já tem uma seção FAQ, vale adicionar JSON-LD
   `FAQPage` pra tentar aparecer como "Pergunta expandida" no Google.
5. **Blog integrado ao Tax News** — alguns dos RSS agregados viram gatilho pra
   você escrever um parágrafo de comentário ("a Arcanum analisa…") em cima da
   notícia, transformando agregação em curadoria editorial (isso agrega valor
   real pro Google).

Se quiser que eu implemente qualquer um desses, é só abrir uma nova tarefa.

---

## Checklist final (o que **você** precisa fazer depois do merge)

- [ ] Verificar a propriedade no Search Console (colar o token no `index.html` → commit)
- [ ] Enviar `sitemap.xml` no Search Console
- [ ] Solicitar indexação de `https://arcanumpi.com.br` manualmente
- [ ] (5 min) Importar tudo pro Bing Webmaster Tools
- [ ] (Opcional, mas recomendado) Criar Perfil da Empresa no Google
- [ ] Validar `robots.txt`, `sitemap.xml` e JSON-LD nas URLs de teste acima
