# Configuração do Google Analytics 4 + Google Ads

Este documento explica o que você (Guilherme) precisa fazer **uma única vez** para ativar
o rastreamento que já foi instalado no site. O código já está em `index.html` — você só
precisa colar 3 IDs no lugar dos placeholders `XXXXXXXXXX`.

> **Enquanto os IDs estiverem como `XXXXXXXXXX`, o script não carrega nada do Google.**
> Nenhum dado é enviado, nenhuma cookie é criada, nenhum pixel dispara. Só começa a
> funcionar quando você colocar IDs reais.

---

## Onde ficam os IDs no código

Abra `index.html` e procure por `ARCANUM_ANALYTICS` (fica logo no `<head>`, perto do
topo do arquivo). Você vai ver:

```js
window.ARCANUM_ANALYTICS = {
  GA4_MEASUREMENT_ID:     'G-XXXXXXXXXX',   // ex.: 'G-ABC1234567'
  GOOGLE_ADS_ID:          'AW-XXXXXXXXXX',  // ex.: 'AW-1234567890'
  CONVERSION_LABEL_LEAD:  'XXXXXXXXXXX'     // ex.: 'abcDEFghiJ1kLmNoPqr'
};
```

Depois de pegar cada ID (instruções abaixo), substitua essas três strings e faça commit.

---

## 1. Google Analytics 4 (GA4) — `GA4_MEASUREMENT_ID`

Serve para você **ver quantas pessoas visitam o site**, de onde vêm, o que clicam,
e medir se os visitantes do Google Ads estão convertendo.

### Passo a passo

1. Acesse <https://analytics.google.com/> com sua conta Google.
2. Se ainda não tem uma conta GA: clique em **Começar a medir** → crie a conta
   "Arcanum PI" → crie a propriedade "arcanumpi.com.br".
3. Em **Admin → Propriedade → Fluxos de dados → Adicionar fluxo → Web**:
   - URL do site: `https://arcanumpi.com.br`
   - Nome do fluxo: `Arcanum PI — Site`
4. Copie o **ID de medição** que aparece (formato `G-XXXXXXXXXX`).
5. Cole em `GA4_MEASUREMENT_ID` no `index.html`.

### Ative eventos aprimorados (já vêm por padrão, só confira)

Em **Admin → Propriedade → Fluxos de dados → seu fluxo → Medição aprimorada (engrenagem)**,
confirme que está **ligado**. Isso captura automaticamente page_view, scrolls, cliques
em links externos, buscas, engajamento, etc.

### (Opcional mas recomendado) Marque eventos como conversão no GA4

Os eventos que o site já dispara são:

| Evento             | Quando dispara                                          |
| ------------------ | ------------------------------------------------------- |
| `generate_lead`    | Ao enviar o formulário de contato (principal conversão) |
| `click_whatsapp`   | Clique em qualquer link WhatsApp (wa.me)                |
| `click_email`      | Clique em links `mailto:`                               |
| `click_instagram`  | Clique em links para instagram.com                      |
| `click_phone`      | Clique em links `tel:` (se houver)                      |

Em **Admin → Eventos**, aguarde um dia de dados entrarem e então clique no toggle
"Marcar como conversão" nos eventos `generate_lead` e `click_whatsapp` (estes são
os dois que mais indicam intenção real de contratação).

---

## 2. Google Ads — `GOOGLE_ADS_ID` e `CONVERSION_LABEL_LEAD`

### Passo a passo

1. Acesse <https://ads.google.com/> com a mesma conta Google do GA4 (fica mais fácil de vincular).
2. Se ainda não tem conta Ads: crie uma. **Não crie uma campanha ainda** — pule o
   onboarding "Smart Campaigns" clicando em **"Alternar para modo Especialista"** no
   rodapé (senão o Ads força você a criar uma campanha ruim antes de continuar).
3. Em **Admin (engrenagem, canto superior direito) → Cobrança → Resumo**, cadastre o
   cartão de crédito (R$ 1,00/dia × 30 dias ≈ R$ 30/mês máximo).

### Criando a ação de conversão

4. No topo, clique em **Metas → Conversões** (ou **Ferramentas → Medição → Conversões**
   dependendo da versão da interface).
5. Clique em **+ Nova ação de conversão** → **Site**.
6. Digite `arcanumpi.com.br` e clique em **Verificar**.
7. Escolha **"Adicionar ação de conversão manualmente"**.
8. Preencha:
   - **Categoria de meta**: `Envio de formulário de lead`
   - **Nome**: `Lead — Formulário de contato`
   - **Valor**: `Não use um valor para esta ação de conversão` (ou defina R$ 50 se
     quiser ver o "valor" estimado no relatório)
   - **Contagem**: `Uma` (uma conversão por clique — evita contar múltiplos envios
     do mesmo usuário)
   - **Janela de clique**: 30 dias (padrão está ok)
   - **Modelo de atribuição**: `Baseada em dados` (padrão está ok)
9. Clique em **Concluído** → **Salvar e continuar**.
10. Na tela seguinte, escolha **"Usar o Google Tag"** e copie:
    - O **ID de conversão** no formato `AW-XXXXXXXXXX` → cole em `GOOGLE_ADS_ID`.
    - O **Rótulo de conversão** (string curta tipo `abc1DEF2ghi3JKL`) → cole em
      `CONVERSION_LABEL_LEAD`.
11. **Não precisa** colar o código JavaScript que o Google mostra na tela — o site já
    tem o código pronto, ele só precisa dos IDs acima.

### (Opcional) Vincular GA4 ↔ Google Ads

Em **Admin → Contas vinculadas → Google Ads** (dentro do GA4), vincule as duas contas.
Isso te permite importar conversões do GA4 pro Ads e usar as audiências do GA4 em
remarketing.

---

## 3. Verificando que tudo funciona

### Método 1 — Google Tag Assistant (o mais fácil)

1. Instale a extensão **Tag Assistant Companion** do Chrome.
2. Abra <https://tagassistant.google.com/> e clique em **Add domain** → cole
   `https://arcanumpi.com.br`.
3. Uma nova aba abre com uma sessão de debug. Clique em um link do WhatsApp ou
   envie um formulário de teste.
4. Volte ao Tag Assistant — você deve ver `page_view`, `click_whatsapp`, `generate_lead`,
   etc. sendo disparados.

### Método 2 — Debug View do GA4 (tempo real)

1. No GA4: **Admin → Propriedade → DebugView**.
2. Em outra aba, abra seu site com `?_dbg=1` no final da URL
   (ex.: `https://arcanumpi.com.br/?_dbg=1`) — ou instale a extensão
   **Google Analytics Debugger** do Chrome.
3. Interaja com o site. Os eventos aparecem no DebugView em tempo real.

### Método 3 — Relatório "Tempo real" do GA4

Em **Relatórios → Tempo real**, você deve ver você mesmo como visitante ativo assim
que abrir o site. Se aparecer, o GA4 está funcionando.

---

## 4. Google Search Console (grátis, faça também)

Enquanto está logado no Google, aproveite:

1. Acesse <https://search.google.com/search-console>.
2. Adicione a propriedade `arcanumpi.com.br` (prefixo de URL ou domínio inteiro).
3. Verifique via DNS (se for a opção "Domínio") ou via GA4 (se já configurou acima —
   é 1 clique).
4. Em **Sitemaps**, adicione `https://arcanumpi.com.br/sitemap.xml`.

O Search Console te mostra **com quais buscas** as pessoas chegam no seu site
organicamente, taxa de cliques, posição média, e erros de indexação — dados que
complementam o Ads.

---

## Troubleshooting rápido

| Sintoma                                | Causa provável                                                 |
| -------------------------------------- | -------------------------------------------------------------- |
| Tag Assistant não vê nenhuma tag       | Você não trocou `G-XXXXXXXXXX` pelo ID real                    |
| `page_view` aparece mas conversões não | Você não trocou `AW-XXXXXXXXXX` e/ou `CONVERSION_LABEL_LEAD`   |
| Console mostra erro CSP                | Adicionou domínio Google novo? Atualize o `<meta http-equiv="Content-Security-Policy" ...>` no `index.html` |
| GA4 conta você mesmo como visitante    | Normal. Para filtrar, em GA4 crie um filtro de IP interno      |

---

## Onde pedir ajuda

Se algum passo der errado, abra uma issue no repositório ou me chame numa nova
sessão do Devin com o print do erro — eu corrijo direto no código.
