console.log('[DevSoutinho] Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const som_hit = new Audio();
som_hit.src = './music/hit.mp3';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// Plano de fundo
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    X: 0,
    Y: canvas.height - 204,
    desenha: function () {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.X, planoDeFundo.Y,
            planoDeFundo.largura, planoDeFundo.altura
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.X + planoDeFundo.largura, planoDeFundo.Y,
            planoDeFundo.largura, planoDeFundo.altura
        );
    },
};

// Chão
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        X: 0,
        Y: canvas.height - 112,
        atualiza: function () {
            const movimentoDoChao = 1;
            chao.X = (chao.X - movimentoDoChao) % (chao.largura);
            if (chao.X < -chao.largura) {
                chao.X += chao.largura;
            }
        },
        desenha: function () {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.X, chao.Y,
                chao.largura, chao.altura
            );
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.X + chao.largura, chao.Y,
                chao.largura, chao.altura
            );
        },
    };
    return chao;
}

// Flappy Bird
function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        X: 10,
        Y: 50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        pula: function () {
            console.log('devo pular');
            flappyBird.velocidade = -flappyBird.pulo;
        },
        atualiza: function () {
            if (fazColisao(flappyBird, globais.chao)) {
                som_hit.play();
                mudaParaTela(telas.inicio);
                return;
            }

            flappyBird.velocidade += flappyBird.gravidade;
            flappyBird.Y += flappyBird.velocidade;
        },
        desenha: function () {
            contexto.drawImage(
                sprites,
                flappyBird.spriteX, flappyBird.spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.X, flappyBird.Y,
                flappyBird.largura, flappyBird.altura
            );
        },
    };
    return flappyBird;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.Y + flappyBird.altura;
    const chaoY = chao.Y;

    return flappyBirdY >= chaoY;
}

// Mensagem Get Ready
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha: function () {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    },
};

// Telas
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const telas = {
    inicio: {
        inicializa: function () {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
        },
        desenha: function () {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
        },
        click: function () {
            mudaParaTela(telas.jogo);
        },
        atualiza: function () {
            globais.chao.atualiza();
        },
    },
    jogo: {
        desenha: function () {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
        },
        click: function () {
            globais.flappyBird.pula();
        },
        atualiza: function () {
            globais.flappyBird.atualiza();
        },
    },
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(telas.inicio);
loop();
