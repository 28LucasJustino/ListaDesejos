
let wishes = [];
let editingWishId = null;
let currentFilter = 'todos';
let currentSearch = '';


$(document).ready(function () {

    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (!session || !session.isAuthenticated) {
        window.location.href = 'index.html';
        return;
    }

    $('#username').text(session.username);

    createStars();
    loadWishes();
    setupEventListeners();
});


function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}


function setupEventListeners() {
    $('#searchInput').on('input', function () {
        currentSearch = $(this).val().toLowerCase();
        filterAndDisplayWishes();
    });

    $('#statusFilter').on('change', function () {
        currentFilter = $(this).val();
        filterAndDisplayWishes();
    });

    $('#wishForm').on('submit', function (e) {
        e.preventDefault();
        saveWish();
    });
}


function generateId() {
    return 'wish_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}


function loadWishes() {
    const storedWishes = localStorage.getItem('wishes');
    if (storedWishes) {
        wishes = JSON.parse(storedWishes);
    } else {
        wishes = [
            {
                id: generateId(),
                title: 'Viagem para o Japão',
                description: 'Conhecer a cultura japonesa, visitar Tóquio e Kyoto, experimentar a culinária local e ver as cerejeiras em flor.',
                priority: 'alta',
                status: 'pendente',
                createdAt: new Date(2024, 5, 1),
                updatedAt: new Date(2024, 5, 1)
            },
            {
                id: generateId(),
                title: 'Aprender Piano',
                description: 'Sempre quis tocar piano. Gostaria de conseguir tocar algumas músicas clássicas e modernas.',
                priority: 'media',
                status: 'em-andamento',
                createdAt: new Date(2024, 5, 5),
                updatedAt: new Date(2024, 5, 15)
            },
            {
                id: generateId(),
                title: 'Ler 50 livros em um ano',
                description: 'Meta de leitura para expandir conhecimento e cultura. Foco em ficção, desenvolvimento pessoal e história.',
                priority: 'media',
                status: 'em-andamento',
                createdAt: new Date(2024, 4, 10),
                updatedAt: new Date(2024, 5, 20)
            }
        ];
    }
    filterAndDisplayWishes();
}


function saveWishes() {
    localStorage.setItem('wishes', JSON.stringify(wishes));
}


function filterAndDisplayWishes() {
    let filteredWishes = wishes;


    if (currentFilter !== 'todos') {
        filteredWishes = filteredWishes.filter(wish => wish.status === currentFilter);
    }


    if (currentSearch) {
        filteredWishes = filteredWishes.filter(wish =>
            wish.title.toLowerCase().includes(currentSearch) ||
            wish.description.toLowerCase().includes(currentSearch)
        );
    }

    displayWishes(filteredWishes);
    saveWishes();
}


function displayWishes(wishesToDisplay) {
    const container = $('#wishesContainer');
    const emptyState = $('#emptyState');

    if (wishesToDisplay.length === 0) {
        container.empty();
        emptyState.removeClass('hidden');
        return;
    }

    emptyState.addClass('hidden');

    const wishesHtml = wishesToDisplay.map(wish => `
                <div class="glass-card rounded-2xl p-6 mb-4 slide-in priority-${wish.priority} transition-all duration-300">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold text-white mb-2">${wish.title}</h3>
                            <p class="text-white text-opacity-80 text-sm mb-3">${wish.description || 'Sem descrição'}</p>
                            
                            <div class="flex items-center space-x-3 mb-3">
                                <span class="status-badge status-${wish.status}">
                                    <i class="fas fa-circle mr-1" style="font-size: 0.5rem;"></i>
                                    ${getStatusText(wish.status)}
                                </span>
                                <span class="text-white text-opacity-60 text-xs">
                                    <i class="fas fa-flag mr-1"></i>
                                    ${getPriorityText(wish.priority)}
                                </span>
                            </div>

                            <div class="text-white text-opacity-50 text-xs">
                                Criado em ${formatDate(wish.createdAt)}
                                ${wish.updatedAt > wish.createdAt ? ` • Atualizado em ${formatDate(wish.updatedAt)}` : ''}
                            </div>
                        </div>

                        <div class="flex flex-col space-y-2 ml-4">
                            <button onclick="shareWish('${wish.id}')" class="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-white text-opacity-70 hover:text-opacity-100 transition-all" title="Compartilhar">
                                <i class="fas fa-share-alt text-sm"></i>
                            </button>
                            <button onclick="editWish('${wish.id}')" class="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-white text-opacity-70 hover:text-opacity-100 transition-all" title="Editar">
                                <i class="fas fa-edit text-sm"></i>
                            </button>
                            <button onclick="deleteWish('${wish.id}')" class="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg text-red-400 hover:text-red-300 transition-all" title="Excluir">
                                <i class="fas fa-trash text-sm"></i>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <button onclick="updateStatus('${wish.id}', 'pendente')" class="px-3 py-1 text-xs rounded-full ${wish.status === 'pendente' ? 'bg-yellow-500 bg-opacity-30 text-yellow-300' : 'bg-white bg-opacity-10 text-white text-opacity-60'} hover:bg-opacity-20 transition-all">
                            Pendente
                        </button>
                        <button onclick="updateStatus('${wish.id}', 'em-andamento')" class="px-3 py-1 text-xs rounded-full ${wish.status === 'em-andamento' ? 'bg-blue-500 bg-opacity-30 text-blue-300' : 'bg-white bg-opacity-10 text-white text-opacity-60'} hover:bg-opacity-20 transition-all">
                            Em Andamento
                        </button>
                        <button onclick="updateStatus('${wish.id}', 'realizado')" class="px-3 py-1 text-xs rounded-full ${wish.status === 'realizado' ? 'bg-green-500 bg-opacity-30 text-green-300' : 'bg-white bg-opacity-10 text-white text-opacity-60'} hover:bg-opacity-20 transition-all">
                            Realizado
                        </button>
                        <button onclick="updateStatus('${wish.id}', 'cancelado')" class="px-3 py-1 text-xs rounded-full ${wish.status === 'cancelado' ? 'bg-red-500 bg-opacity-30 text-red-300' : 'bg-white bg-opacity-10 text-white text-opacity-60'} hover:bg-opacity-20 transition-all">
                            Cancelado
                        </button>
                    </div>
                </div>
            `).join('');

    container.html(wishesHtml);
}


function getStatusText(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'em-andamento': 'Em Andamento',
        'realizado': 'Realizado',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
}

function getPriorityText(priority) {
    const priorityMap = {
        'baixa': 'Baixa',
        'media': 'Média',
        'alta': 'Alta'
    };
    return priorityMap[priority] || priority;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}


function openAddModal() {
    editingWishId = null;
    $('#modalTitle').text('Adicionar Desejo');
    $('#submitBtnText').text('Adicionar');
    $('#statusField').addClass('hidden');
    $('#wishForm')[0].reset();
    $('#wishModal').removeClass('hidden').addClass('flex');
    $('#wishTitle').focus();
}

function editWish(id) {
    const wish = wishes.find(w => w.id === id);
    if (!wish) return;

    editingWishId = id;
    $('#modalTitle').text('Editar Desejo');
    $('#submitBtnText').text('Salvar');
    $('#statusField').removeClass('hidden');

    $('#wishTitle').val(wish.title);
    $('#wishDescription').val(wish.description);
    $('#wishPriority').val(wish.priority);
    $('#wishStatus').val(wish.status);

    $('#wishModal').removeClass('hidden').addClass('flex');
    $('#wishTitle').focus();
}

function closeModal() {
    $('#wishModal').addClass('hidden').removeClass('flex');
    editingWishId = null;
}

function saveWish() {
    const title = $('#wishTitle').val().trim();
    const description = $('#wishDescription').val().trim();
    const priority = $('#wishPriority').val();
    const status = $('#wishStatus').val() || 'pendente';

    if (!title) {
        alert('Por favor, digite um título para o desejo.');
        return;
    }

    if (editingWishId) {

        const wishIndex = wishes.findIndex(w => w.id === editingWishId);
        if (wishIndex !== -1) {
            wishes[wishIndex] = {
                ...wishes[wishIndex],
                title,
                description,
                priority,
                status,
                updatedAt: new Date()
            };
        }
    } else {

        const newWish = {
            id: generateId(),
            title,
            description,
            priority,
            status: 'pendente',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        wishes.unshift(newWish);
    }

    filterAndDisplayWishes();
    closeModal();
}


function updateStatus(id, newStatus) {
    const wishIndex = wishes.findIndex(w => w.id === id);
    if (wishIndex !== -1) {
        wishes[wishIndex].status = newStatus;
        wishes[wishIndex].updatedAt = new Date();
        filterAndDisplayWishes();
    }
}


function deleteWish(id) {
    if (confirm('Tem certeza que deseja excluir este desejo?')) {
        wishes = wishes.filter(w => w.id !== id);
        filterAndDisplayWishes();
    }
}


function shareWish(id) {
    const wish = wishes.find(w => w.id === id);
    if (!wish) return;

    const shareUrl = `${window.location.origin}/wish/${id}`;
    $('#shareLink').val(shareUrl);
    $('#shareModal').removeClass('hidden').addClass('flex');
}

function shareList() {
    const shareUrl = `${window.location.origin}/list/shared`;
    $('#shareLink').val(shareUrl);
    $('#shareModal').removeClass('hidden').addClass('flex');
}

function closeShareModal() {
    $('#shareModal').addClass('hidden').removeClass('flex');
}

function copyShareLink() {
    const shareLink = $('#shareLink')[0];
    shareLink.select();
    shareLink.setSelectionRange(0, 99999);

    try {
        document.execCommand('copy');


        const button = event.target.closest('button');
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.remove('btn-gradient');
        button.classList.add('bg-green-500');

        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.add('btn-gradient');
            button.classList.remove('bg-green-500');
        }, 2000);

    } catch (err) {
        console.error('Erro ao copiar link:', err);
        alert('Erro ao copiar link. Tente selecionar e copiar manualmente.');
    }
}


function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('currentSession');
        window.location.href = 'index.html';
    }
}


function handleRouting() {
    const path = window.location.pathname;
    const wishMatch = path.match(/\/wish\/(.+)/);

    if (wishMatch) {
        const wishId = wishMatch[1];
        showSharedWish(wishId);
    }
}

function showSharedWish(wishId) {
    const wish = wishes.find(w => w.id === wishId);
    if (!wish) {
        alert('Desejo não encontrado.');
        return;
    }


    const modalHtml = `
                <div id="sharedWishModal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
                    <div class="glass-card rounded-2xl p-6 w-full max-w-md">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-xl font-bold text-white">Desejo Compartilhado</h2>
                            <button onclick="closeSharedWish()" class="text-white text-opacity-70 hover:text-opacity-100 transition-all">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-2">${wish.title}</h3>
                                <p class="text-white text-opacity-80 text-sm mb-4">${wish.description || 'Sem descrição'}</p>
                            </div>

                            <div class="flex items-center space-x-3 mb-4">
                                <span class="status-badge status-${wish.status}">
                                    <i class="fas fa-circle mr-1" style="font-size: 0.5rem;"></i>
                                    ${getStatusText(wish.status)}
                                </span>
                                <span class="text-white text-opacity-60 text-xs">
                                    <i class="fas fa-flag mr-1"></i>
                                    ${getPriorityText(wish.priority)}
                                </span>
                            </div>

                            <div class="text-white text-opacity-50 text-xs">
                                Criado em ${formatDate(wish.createdAt)}
                                ${wish.updatedAt > wish.createdAt ? ` • Atualizado em ${formatDate(wish.updatedAt)}` : ''}
                            </div>

                            <div class="pt-4 border-t border-white border-opacity-20">
                                <p class="text-white text-opacity-60 text-xs text-center">
                                    Este é um link de visualização. Você está vendo os detalhes deste desejo em modo somente leitura.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    $('body').append(modalHtml);
}

function closeSharedWish() {
    $('#sharedWishModal').remove();

    history.pushState({}, '', '/');
}


$(document).ready(function () {
    handleRouting();
});


window.addEventListener('popstate', handleRouting);


window.getWishes = () => wishes;
window.addSampleWishes = () => {
    const sampleWishes = [
        {
            id: generateId(),
            title: 'Comprar uma casa própria',
            description: 'Sonho de ter minha própria casa, com jardim e espaço para a família.',
            priority: 'alta',
            status: 'em-andamento',
            createdAt: new Date(2024, 3, 15),
            updatedAt: new Date(2024, 5, 10)
        },
        {
            id: generateId(),
            title: 'Fazer um curso de culinária',
            description: 'Aprender técnicas culinárias profissionais e cozinhar pratos elaborados.',
            priority: 'baixa',
            status: 'pendente',
            createdAt: new Date(2024, 5, 18),
            updatedAt: new Date(2024, 5, 18)
        },
        {
            id: generateId(),
            title: 'Correr uma maratona',
            description: 'Meta de fitness: completar uma maratona de 42km em menos de 4 horas.',
            priority: 'media',
            status: 'realizado',
            createdAt: new Date(2024, 2, 5),
            updatedAt: new Date(2024, 4, 20)
        }
    ];

    wishes.push(...sampleWishes);
    filterAndDisplayWishes();
    console.log('Desejos de exemplo adicionados!');
};


$(document).keydown(function (e) {

    if (e.key === 'Escape') {
        if (!$('#wishModal').hasClass('hidden')) {
            closeModal();
        }
        if (!$('#shareModal').hasClass('hidden')) {
            closeShareModal();
        }
        if ($('#sharedWishModal').length) {
            closeSharedWish();
        }
    }


    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openAddModal();
    }


    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        $('#searchInput').focus();
    }
});


$(document).on('click', '.glass-card', function (e) {

    const ripple = $('<div class="absolute rounded-full bg-white opacity-25 animate-ping"></div>');
    const rect = this.getBoundingClientRect();
    const size = 50;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.css({
        width: size + 'px',
        height: size + 'px',
        left: x + 'px',
        top: y + 'px',
        position: 'absolute',
        pointerEvents: 'none'
    });

    $(this).css('position', 'relative').append(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
});


let autoSaveTimeout;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveWishes();
        console.log('Auto-salvando desejos...', wishes.length, 'itens');
    }, 2000);
}


const originalFilterAndDisplayWishes = filterAndDisplayWishes;
filterAndDisplayWishes = function () {
    originalFilterAndDisplayWishes();
    scheduleAutoSave();
};