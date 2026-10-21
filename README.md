![UBI](images/ubi-banner.png)

# Desert Run

Jogo de plataformas 2D no browser. O Three.js desenha a cena, o Rapier trata da física e o Vite serve as páginas: menu, nível e créditos.

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

Move com **A** / **D** ou com as setas. Cada moeda vale 10 pontos. A pontuação fica no `localStorage` e volta a 0 quando se começa um jogo novo pelo menu. As moedas por cima das plataformas laterais ainda não se apanham: o salto fica para a ficha seguinte.

## Estrutura

| Ficheiro | Responsabilidade |
|---|---|
| `index.html`, `nivel1.html`, `creditos.html` | Uma cena por página |
| `src/Scripts/SceneManager.js` | Troca de cena |
| `src/Scripts/Player.js`, `Input.js` | Movimento do jogador |
| `src/Scripts/Fisica.js` | Corpos, colisões e sensores (Rapier) |
| `src/Scripts/ScoreManager.js`, `CoinPickup.js` | Pontuação e moedas |
| `src/Prefabs/` | Fundo, plataformas e moeda |
| `public/assets/` | Sprites e sons |

## Autor

[Felipe Dourado](https://github.com/fefogaca) · nº 53394  
UBI — Universidade da Beira Interior, Desenvolvimento de Jogos Web e Móveis 2025/2026
