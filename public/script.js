// 这个占位符将在 Cloudflare Pages 构建时被替换为真实的密码哈希
const HASHED_PASSWORD = '__PASSWORD_HASH__';

document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const navContainer = document.getElementById('nav-container');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');

    // 检查 sessionStorage 中是否已有登录凭证
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        showNav();
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const enteredPassword = passwordInput.value;
        const enteredPasswordHash = await sha256(enteredPassword);

        if (enteredPasswordHash === HASHED_PASSWORD) {
            sessionStorage.setItem('isLoggedIn', 'true');
            showNav();
        } else {
            errorMessage.textContent = '密码错误！';
            passwordInput.value = '';
        }
    });

    function showNav() {
        loginContainer.classList.add('hidden');
        navContainer.classList.remove('hidden');
        loadLinks();
    }

    async function loadLinks() {
        try {
            const response = await fetch('links.json');
            const data = await response.json();
            const linksGrid = document.getElementById('links-grid');
            linksGrid.innerHTML = ''; // 清空

            data.forEach(category => {
                category.links.forEach(link => {
                    const linkCard = document.createElement('a');
                    linkCard.href = link.url;
                    linkCard.className = 'link-card';
                    linkCard.target = '_blank'; // 新标签页打开
                    linkCard.rel = 'noopener noreferrer';
                    
                    const linkTitle = document.createElement('h3');
                    linkTitle.textContent = link.name;
                    linkCard.appendChild(linkTitle);
                    
                    linksGrid.appendChild(linkCard);
                });
            });
        } catch (error) {
            console.error('加载链接失败:', error);
            linksGrid.innerHTML = '<p>无法加载链接列表。</p>';
        }
    }

    // SHA-256 哈希函数
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
});