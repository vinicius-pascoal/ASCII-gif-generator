# ASCII Art Converter

Conversor de GIFs e imagens para arte ASCII, construído com Next.js e TypeScript.

## 🎬 Funcionalidades

### Modo GIF
- **Upload de GIF**: Arraste e solte ou selecione arquivos GIF
- **Conversão para ASCII Animado**: Converte cada frame do GIF em arte ASCII
- **Prévia em Tempo Real**: Visualize a animação ASCII antes de baixar
- **Download de GIF ASCII**: Baixe o GIF ASCII gerado
- **Copiar Primeiro Frame**: Copie o primeiro frame ASCII para a área de transferência (Ctrl+C)

### Modo Imagem 🖼️
- **Upload de Imagem**: Suporte para PNG, JPG, WEBP e outros formatos
- **Conversão para ASCII Estático**: Converte a imagem em arte ASCII
- **Prévia em Tempo Real**: Visualize o resultado ASCII
- **Exportar como PNG**: Baixe a arte ASCII como imagem PNG
- **Copiar ASCII**: Copie o texto ASCII para a área de transferência (Ctrl+C)

### Personalização Completa
- Ajuste a largura (resolução ASCII)
- Configure o tamanho da fonte
- Escolha cores de texto e fundo
- Inverta o brilho para efeitos diferentes
- Controle de velocidade (para GIFs)
- **Compatibilidade com Plataformas**: 
  - Verificação automática de limites do WhatsApp (65.536 caracteres)
  - Verificação automática de limites do Discord (2.000 caracteres)
  - Verificação automática de limites do Discord Nitro (4.000 caracteres)
  - Botões de ajuste automático para cada plataforma
  - Presets rápidos otimizados

## 🚀 Como Usar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Abra no navegador**: http://localhost:3000

4. **Converta seu arquivo**:
   - Escolha entre modo GIF ou Imagem
   - Faça upload do arquivo
   - Ajuste as configurações de conversão
   - Clique em "Converter para ASCII"
   - Veja a prévia
   - Use **Ctrl+C** ou clique em "Copiar ASCII" para copiar o texto
   - Clique em "Baixar" para salvar (GIF ou PNG)

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **gifuct-js** - Parser de GIF
- **gif-encoder-2** - Geração de GIF

## 📦 Estrutura do Projeto

```
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página principal
│   └── globals.css     # Estilos globais
├── components/
│   ├── GifUploader.tsx        # Upload de GIFs
│   ├── ImageUploader.tsx      # Upload de imagens
│   ├── AsciiPreview.tsx       # Prévia de animação
│   ├── StaticAsciiPreview.tsx # Prévia de imagem estática
│   └── ControlPanel.tsx       # Painel de controles
├── lib/
│   ├── ascii-converter.ts   # Lógica de conversão ASCII
│   ├── gif-processor.ts     # Processamento de GIF
│   └── image-processor.ts   # Processamento de imagens
└── public/
```

## 🎨 Personalização

O conversor oferece várias opções de personalização:

- **Largura**: 20-200 caracteres (afeta a resolução)
- **Tamanho da Fonte**: 4-12px (para o arquivo final)
- **Cor do Texto**: Qualquer cor hexadecimal
- **Cor de Fundo**: Qualquer cor hexadecimal
- **Inverter Brilho**: Inverte o mapeamento de caracteres
- **Velocidade**: Controle de velocidade da animação (apenas GIF)

### 📱 Compatibilidade com Plataformas

O conversor agora verifica automaticamente se o ASCII cabe nas limitações das principais plataformas de mensagens:

- **WhatsApp**: Limite de 65.536 caracteres
  - ⚠️ **Limitação de largura**: O WhatsApp quebra linhas por largura de tela
  - **Recomendado Mobile**: 60 caracteres de largura
  - **Recomendado Desktop**: 80 caracteres de largura
  - Botão de ajuste automático se ultrapassar o limite
  
- **Discord**: Limite de 2.000 caracteres
  - **Recomendado**: 35 caracteres de largura
  - Verificação em tempo real
  - Sugestão automática de largura ideal
  
- **Discord Nitro**: Limite de 4.000 caracteres
  - **Recomendado**: 50 caracteres de largura
  - Suporte para usuários com Nitro
  - Ajuste inteligente de dimensões

**Presets Rápidos**: 
- Discord (35 caracteres)
- Discord Nitro (50 caracteres)
- WhatsApp Mobile (60 caracteres)
- WhatsApp Desktop (80 caracteres)

## 📝 Notas

- Arquivos GIF grandes podem levar mais tempo para processar
- A qualidade do ASCII depende da largura escolhida
- Imagens são exportadas como PNG com o texto ASCII renderizado
- Suporte para múltiplos formatos de imagem (PNG, JPG, WEBP, etc.)
- Suporta dark mode automaticamente

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

MIT
