/* 1. Canvas Water Bubbles Animation */
const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');
let bubbles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Bubble {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.radius = Math.random() * 18 + 8;
        this.speed = Math.random() * 0.7 + 0.3;
        this.swing = Math.random() * Math.PI;
    }
    update() {
        this.y -= this.speed;
        this.swing += 0.02;
        this.x += Math.sin(this.swing) * 0.4;
        if (this.y < -this.radius * 2) this.reset();
    }
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        const grad = ctx.createRadialGradient(
            this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1,
            this.x, this.y, this.radius
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
        grad.addColorStop(0.4, 'rgba(180, 230, 255, 0.25)');
        grad.addColorStop(1, 'rgba(0, 150, 255, 0.4)');
        
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, Math.PI * 1.2, Math.PI * 1.8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }
}

for (let i = 0; i < 28; i++) {
    bubbles.push(new Bubble());
}

function animateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach(b => {
        b.update();
        b.draw();
    });
    requestAnimationFrame(animateBubbles);
}
animateBubbles();

/* 2. Avatar Profile Picture Management (FileReader API) */
const userSphere = document.getElementById('userSphere');
const avatarInput = document.getElementById('avatarInput');
const avatarImg = document.getElementById('avatarImg');
const defaultAvatarIcon = document.getElementById('defaultAvatarIcon');
const btnChangePhoto = document.getElementById('btnChangePhoto');
const btnRemovePhoto = document.getElementById('btnRemovePhoto');

// Trigger file input dialog
userSphere.addEventListener('click', (e) => {
    avatarInput.click();
});

btnChangePhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarInput.click();
});

// Handle image selection via FileReader
avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            showToast('Arquivo inválido', 'Por favor, selecione um arquivo de imagem.', 'erro');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            avatarImg.src = event.target.result;
            avatarImg.classList.remove('hidden');
            defaultAvatarIcon.classList.add('hidden');
            btnRemovePhoto.classList.remove('hidden');
            showToast('Foto atualizada!', 'Sua foto de perfil foi adicionada à esfera.', 'sucesso');
        };
        reader.readAsDataURL(file);
    }
});

// Handle photo removal
btnRemovePhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarImg.src = '';
    avatarImg.classList.add('hidden');
    defaultAvatarIcon.classList.remove('hidden');
    btnRemovePhoto.classList.add('hidden');
    avatarInput.value = '';
    showToast('Foto removida', 'O avatar padrão do sistema foi restaurado.', 'info');
});

/* 3. Password Visibility Toggle */
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fa-solid fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fa-solid fa-eye';
    }
}

/* 4. Password Recovery Simulation */
function forgotPassword() {
    showToast('Recuperação de Senha', 'Instruções para redefinir a senha foram enviadas ao seu e-mail.', 'info');
}

/* 5. Glass Toast Manager */
let toastTimeout;
function showToast(title, message, type = 'sucesso') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIconBg = document.getElementById('toastIconBg');
    const toastIcon = document.getElementById('toastIcon');

    toastTitle.innerText = title;
    toastMessage.innerText = message;

    if (type === 'sucesso') {
        toastIconBg.className = 'w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center text-white shrink-0 shadow';
        toastIcon.className = 'fa-solid fa-check text-xs';
    } else if (type === 'erro') {
        toastIconBg.className = 'w-7 h-7 rounded-full bg-gradient-to-tr from-rose-400 to-red-600 flex items-center justify-center text-white shrink-0 shadow';
        toastIcon.className = 'fa-solid fa-xmark text-xs';
    } else {
        toastIconBg.className = 'w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white shrink-0 shadow';
        toastIcon.className = 'fa-solid fa-info text-xs';
    }

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

/* 6. Form Login Submission & Audio Synthesizer */
function playChime() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
}

function handleLogin(e) {
    e.preventDefault();
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const btnSpinner = document.getElementById('btnSpinner');

    btnText.innerText = 'Verificando...';
    btnIcon.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    setTimeout(() => {
        btnSpinner.classList.add('hidden');
        btnIcon.classList.remove('hidden');
        btnIcon.className = 'fa-solid fa-check text-[10px]';
        btnText.innerText = 'Conectado!';

        playChime();
        showToast('Acesso Concedido!', 'Carregando a área de trabalho do Aero OS...', 'sucesso');

        setTimeout(() => {
            btnText.innerText = 'Entrar no Sistema';
            btnIcon.className = 'fa-solid fa-arrow-right text-[10px]';
        }, 3500);
    }, 1000);
}