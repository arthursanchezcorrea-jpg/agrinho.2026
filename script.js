// ===== VARIÁVEIS GLOBAIS =====
let dicaSelecionada = null;          // Armazena a dica que o usuário clicou
let problemasCombatidos = 0;         // Conta quantos problemas foram resolvidos
const totalProblemas = 4;            // Total de problemas no jogo

// ===== INICIALIZAÇÃO AO CARREGAR A PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarJogo();
    inicializarAcessibilidade();
});

// ===== FUNÇÃO: INICIALIZAR JOGO =====
function inicializarJogo() {
    // Seleciona todas as dicas
    const dicas = document.querySelectorAll('.dica');
    const problemas = document.querySelectorAll('.problema');
    
    // Remove event listeners antigos para evitar duplicação
    dicas.forEach(dica => {
        const novaDica = dica.cloneNode(true);
        dica.parentNode.replaceChild(novaDica, dica);
    });
    
    const novasDicas = document.querySelectorAll('.dica');
    
    // Adiciona evento de clique nas dicas
    novasDicas.forEach(dica => {
        dica.addEventListener('click', function() {
            // Remove seleção de todas as outras dicas
            document.querySelectorAll('.dica').forEach(d => d.classList.remove('selecionada'));
            // Adiciona seleção na dica atual
            this.classList.add('selecionada');
            // Armazena o tipo da dica selecionada
            dicaSelecionada = this.getAttribute('data-tipo');
        });
    });
    
    // Adiciona evento de clique nos problemas
    problemas.forEach(problema => {
        // Remove event listener antigo
        const novoProblema = problema.cloneNode(true);
        problema.parentNode.replaceChild(novoProblema, problema);
    });
    
    const novosProblemas = document.querySelectorAll('.problema');
    
    novosProblemas.forEach(problema => {
        problema.addEventListener('click', function() {
            // Se já foi combatido, não faz nada
            if (this.getAttribute('data-combatido') === 'true') {
                alert('✅ Este problema já foi combatido!');
                return;
            }
            
            // Se nenhuma dica foi selecionada
            if (dicaSelecionada === null) {
                alert('⚠️ Primeiro clique em uma dica agrária do lado esquerdo!');
                return;
            }
            
            // Pega o tipo do problema
            const tipoProblema = this.getAttribute('data-tipo');
            
            // Verifica se a dica combina com o problema
            if (dicaSelecionada === tipoProblema) {
                // Combate o problema
                this.setAttribute('data-combatido', 'true');
                this.classList.add('combatido');
                const statusSpan = this.querySelector('.status');
                statusSpan.textContent = '✅ Combatido!';
                
                // Aumenta o contador
                problemasCombatidos++;
                
                // Atualiza a barra de progresso
                atualizarProgresso();
                
                // Mostra mensagem de sucesso
                mostrarMensagem('🎉 Correto! Você ajudou a combater o problema!', 'sucesso');
                
                // Remove a seleção da dica
                dicaSelecionada = null;
                document.querySelectorAll('.dica').forEach(d => d.classList.remove('selecionada'));
                
                // Verifica se todos os problemas foram combatidos
                if (problemasCombatidos === totalProblemas) {
                    setTimeout(() => {
                        alert('🏆 PARABÉNS! Você salvou o planeta! 🏆\n\nVocê combateu todas as queimadas e agrotóxicos. O mundo agradece!');
                    }, 100);
                }
            } else {
                // Dica errada
                mostrarMensagem('❌ Dica errada! Essa dica não combate este problema. Tente outra!', 'erro');
            }
        });
    });
    
    // Botão reset - corrigido!
    const resetBtn = document.getElementById('resetJogo');
    if (resetBtn) {
        // Remove event listener antigo se existir
        const novoResetBtn = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(novoResetBtn, resetBtn);
        
        novoResetBtn.addEventListener('click', function() {
            resetarJogo();
        });
    }
}

// ===== FUNÇÃO: ATUALIZAR BARRA DE PROGRESSO =====
function atualizarProgresso() {
    const porcentagem = (problemasCombatidos / totalProblemas) * 100;
    const barra = document.getElementById('barraProgresso');
    const texto = document.getElementById('textoProgresso');
    
    if (barra) {
        barra.style.width = porcentagem + '%';
        barra.textContent = Math.round(porcentagem) + '%';
    }
    
    if (texto) {
        if (problemasCombatidos === 0) {
            texto.textContent = '🌱 Combine dicas com problemas para começar a salvar o planeta!';
        } else if (problemasCombatidos < totalProblemas) {
            texto.textContent = `🌍 Você já ajudou o mundo em ${problemasCombatidos} de ${totalProblemas} problemas. Continue assim!`;
        } else {
            texto.textContent = '🏆 PERFEITO! Você salvou o planeta! Parabéns por ser uma pessoa consciente! 🏆';
        }
    }
}

// ===== FUNÇÃO: MOSTRAR MENSAGEM TEMPORÁRIA =====
function mostrarMensagem(msg, tipo) {
    // Cria elemento de mensagem
    const mensagem = document.createElement('div');
    mensagem.textContent = msg;
    mensagem.style.position = 'fixed';
    mensagem.style.bottom = '100px';
    mensagem.style.right = '20px';
    mensagem.style.padding = '15px 20px';
    mensagem.style.borderRadius = '10px';
    mensagem.style.zIndex = '1001';
    mensagem.style.fontWeight = 'bold';
    mensagem.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    if (tipo === 'sucesso') {
        mensagem.style.backgroundColor = '#4CAF50';
        mensagem.style.color = 'white';
    } else {
        mensagem.style.backgroundColor = '#f44336';
        mensagem.style.color = 'white';
    }
    
    document.body.appendChild(mensagem);
    
    // Remove após 2 segundos
    setTimeout(() => {
        if (mensagem && mensagem.remove) {
            mensagem.remove();
        }
    }, 2000);
}

// ===== FUNÇÃO: RESETAR JOGO (CORRIGIDA) =====
function resetarJogo() {
    console.log('Resetando jogo...'); // Para debug
    
    // Reseta variáveis
    problemasCombatidos = 0;
    dicaSelecionada = null;
    
    // Reseta todos os problemas
    const problemas = document.querySelectorAll('.problema');
    problemas.forEach(problema => {
        problema.setAttribute('data-combatido', 'false');
        problema.classList.remove('combatido');
        const statusSpan = problema.querySelector('.status');
        if (statusSpan) {
            statusSpan.textContent = '⚪ Ativo';
        }
    });
    
    // Remove seleção das dicas
    const dicas = document.querySelectorAll('.dica');
    dicas.forEach(dica => {
        dica.classList.remove('selecionada');
    });
    
    // Atualiza barra de progresso
    atualizarProgresso();
    
    // Mostra mensagem de confirmação
    mostrarMensagem('🔄 Jogo reiniciado! Vamos salvar o planeta novamente!', 'sucesso');
    
    console.log('Reset concluído. Problemas combatidos:', problemasCombatidos);
}

// ===== FUNÇÃO: INICIALIZAR MENU DE ACESSIBILIDADE =====
function inicializarAcessibilidade() {
    const btn = document.getElementById('btnAcessibilidade');
    const menu = document.getElementById('menuAcessibilidade');
    let menuAberto = false;
    
    // Abrir/fechar menu
    if (btn) {
        // Remove event listener antigo
        const novoBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(novoBtn, btn);
        
        novoBtn.addEventListener('click', function() {
            if (menuAberto) {
                menu.style.display = 'none';
                menuAberto = false;
            } else {
                menu.style.display = 'flex';
                menuAberto = true;
            }
        });
    }
    
    // Botão fechar menu
    const fecharBtn = document.getElementById('fecharMenu');
    if (fecharBtn) {
        const novoFechar = fecharBtn.cloneNode(true);
        fecharBtn.parentNode.replaceChild(novoFechar, fecharBtn);
        
        novoFechar.addEventListener('click', function() {
            menu.style.display = 'none';
            menuAberto = false;
        });
    }
    
    // Aumentar fonte
    const aumentar = document.getElementById('aumentarFonte');
    if (aumentar) {
        const novoAumentar = aumentar.cloneNode(true);
        aumentar.parentNode.replaceChild(novoAumentar, aumentar);
        
        novoAumentar.addEventListener('click', function() {
            document.body.classList.remove('fonte-pequena');
            document.body.classList.add('fonte-grande');
            menu.style.display = 'none';
            menuAberto = false;
        });
    }
    
    // Diminuir fonte
    const diminuir = document.getElementById('diminuirFonte');
    if (diminuir) {
        const novoDiminuir = diminuir.cloneNode(true);
        diminuir.parentNode.replaceChild(novoDiminuir, diminuir);
        
        novoDiminuir.addEventListener('click', function() {
            document.body.classList.remove('fonte-grande');
            document.body.classList.add('fonte-pequena');
            menu.style.display = 'none';
            menuAberto = false;
        });
    }
    
    // Alto contraste
    const contraste = document.getElementById('altoContraste');
    if (contraste) {
        const novoContraste = contraste.cloneNode(true);
        contraste.parentNode.replaceChild(novoContraste, contraste);
        
        novoContraste.addEventListener('click', function() {
            document.body.classList.toggle('alto-contraste');
            menu.style.display = 'none';
            menuAberto = false;
        });
    }
    
    // Modo daltônico (filtro de cores)
    const daltonico = document.getElementById('modoDaltonico');
    if (daltonico) {
        const novoDaltonico = daltonico.cloneNode(true);
        daltonico.parentNode.replaceChild(novoDaltonico, daltonico);
        
        novoDaltonico.addEventListener('click', function() {
            document.body.classList.toggle('daltonico');
            // Adiciona SVG filter se não existir
            if (!document.querySelector('#daltonicoFilter')) {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('style', 'position: absolute; width: 0; height: 0;');
                svg.setAttribute('id', 'daltonicoFilter');
                svg.innerHTML = `
                    <filter id="deuteranopia">
                        <feColorMatrix type="matrix" values="
                            0.367, 0.861, -0.228, 0, 0
                            0.280, 0.672, 0.048, 0, 0
                            -0.012, 0.108, 0.904, 0, 0
                            0, 0, 0, 1, 0"/>
                    </filter>
                `;
                document.body.appendChild(svg);
            }
            menu.style.display = 'none';
            menuAberto = false;
        });
    }
    
    // Modo simplificado
    const simples = document.getElementById('modoSIMPLES');
    if (simples) {
        const novoSimples = simples.cloneNode(true);
        simples.parentNode.replaceChild(novoSimples, simples);
        
        novoSimples.addEventListener('click', function() {
            document.body.classList.toggle('modo-simples');
            menu.style.display = 'none';
            menuAberto = false;
        });
    }
}
