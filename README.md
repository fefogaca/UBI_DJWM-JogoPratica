![UBI](images/ubi-banner.png)

# Desert Run

Jogo de plataformas 2D no browser. O Three.js desenha a cena, o Rapier trata da física e o Vite serve as páginas: menu, nível, créditos e fim de jogo.

## Contexto

Trabalho da disciplina de **Desenvolvimento de Jogos Web e Móveis** — Informática Web, Móvel e na Nuvem, UBI 2025/2026, professor Nuno Carapito.

## Início rápido

```bash
git clone https://github.com/fefogaca/UBI_DJWM-JogoPratica.git
cd UBI_DJWM-JogoPratica
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173). **Jogar** entra no nível, **Créditos** mostra a ficha e **Sair** tenta fechar o separador.

Para gerar a versão estática: `npm run build` e `npm run preview`.

## Jogar

Move com **A** / **D** ou com as setas e salta com **Espaço** (dá para fazer salto duplo). **Esc** pausa o jogo e abre o menu de pausa; a música também para.

Cada moeda vale 10 pontos e a pontuação fica no `localStorage` (volta a 0 quando se começa um jogo novo pelo menu). Há 3 vidas: cair do mapa tira uma e o jogador volta à última plataforma que pisou, ou à placa de checkpoint se já lhe tiver tocado. Sem vidas, vai para o ecrã de fim de jogo.

## Estrutura

| Ficheiro | Responsabilidade |
|---|---|
| `index.html`, `nivel1.html`, `creditos.html`, `gameover.html` | Uma cena por página |
| `src/Scripts/SceneManager.js` | Troca de cena |
| `src/Scripts/Player.js`, `Input.js` | Movimento, vidas, respawn e checkpoint |
| `src/Scripts/GameManager.js`, `Time.js` | Pausa, menu de pausa e música |
| `src/Scripts/Level1Manager.js`, `Clouds.js` | Cria as nuvens a partir dos prefabs e mexe-as |
| `src/Scripts/Fisica.js` | Corpos, colisões e sensores (Rapier) |
| `src/Scripts/ScoreManager.js`, `CoinPickup.js` | Pontuação e moedas |
| `src/Prefabs/` | Fundo, plataformas, moeda, nuvens, limite e checkpoint |
| `public/assets/` | Sprites e sons |

## Autor

[Felipe Dourado](https://github.com/fefogaca) · nº 53394  
UBI — Universidade da Beira Interior, Desenvolvimento de Jogos Web e Móveis 2025/2026
