// 1. LOADER CONTROLLER
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
  }, 400);
});

// 2. DARK / LIGHT THEME TOGGLE
const themeBtn = document.getElementById('theme');
themeBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    showToast('Switched to Light Theme!', 'fa-sun');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    showToast('Switched to Dark Theme!', 'fa-moon');
  }
});

// 3. SEARCH AND FILTER ENGINE
const searchInput = document.getElementById('search');
const catButtons = document.querySelectorAll('.category button');
const cards = document.querySelectorAll('.card');

let activeCategory = 'all';
let searchQuery = '';

function filterProducts() {
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    const cardTitle = card.querySelector('.info h3').textContent.toLowerCase();
    
    const matchesCategory = (activeCategory === 'all' || cardCat === activeCategory);
    const matchesSearch = cardTitle.includes(searchQuery);

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  filterProducts();
});

catButtons.forEach(button => {
  button.addEventListener('click', () => {
    catButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.getAttribute('data-cat');
    filterProducts();
  });
});

// 4. WISHLIST MANAGEMENT SYSTEM
const wishlistToggleBtn = document.getElementById('wishlistToggleBtn');
const wishlistCloseBtn = document.getElementById('wishlistCloseBtn');
const wishlistDrawer = document.getElementById('wishlistDrawer');
const wishlistOverlay = document.getElementById('wishlistOverlay');
const wishlistCount = document.getElementById('wishlistCount');
const wishlistItemsContainer = document.getElementById('wishlistItemsContainer');

let wishlist = [];

// Open/Close Drawer Toggle
const toggleDrawer = () => {
  wishlistDrawer.classList.toggle('open');
  wishlistOverlay.classList.toggle('open');
};
wishlistToggleBtn.addEventListener('click', toggleDrawer);
wishlistCloseBtn.addEventListener('click', toggleDrawer);
wishlistOverlay.addEventListener('click', toggleDrawer);

// Global Fav Button click assignment
document.querySelectorAll('.card .fav').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    const id = card.getAttribute('data-id');
    const title = card.querySelector('.info h3').textContent;
    const price = card.querySelector('.price h2').textContent;
    const img = card.querySelector('img').src;

    btn.classList.toggle('active');
    const heartIcon = btn.querySelector('i');
    
    if (btn.classList.contains('active')) {
      heartIcon.classList.replace('fa-regular', 'fa-solid');
      addToWishlist({ id, title, price, img });
    } else {
      heartIcon.classList.replace('fa-solid', 'fa-regular');
      removeFromWishlist(id);
    }
  });
});

function addToWishlist(item) {
  wishlist.push(item);
  updateWishlistUI();
  showToast(`${item.title} added to Wishlist!`, 'fa-heart');
}

function removeFromWishlist(id) {
  wishlist = wishlist.filter(item => item.id !== id);
  
  // Untoggle main grid button representation if alive
  const matchedCard = document.querySelector(`.card[data-id="${id}"]`);
  if (matchedCard) {
    const favBtn = matchedCard.querySelector('.fav');
    favBtn.classList.remove('active');
    favBtn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
  }
  
  updateWishlistUI();
  showToast('Removed from Wishlist.', 'fa-trash');
}

function updateWishlistUI() {
  wishlistCount.textContent = wishlist.length;
  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML = `
      <div class="wishlist-empty">
        <i class="fa-regular fa-heart"></i>
        <p>Your wishlist is empty!</p>
      </div>`;
    return;
  }

  wishlistItemsContainer.innerHTML = wishlist.map(item => `
    <div class="wish-item">
      <img src="${item.img}" alt="${item.title}">
      <div class="wish-item-info">
        <h4>${item.title}</h4>
        <p>${item.price}</p>
      </div>
      <button class="wish-item-remove" onclick="removeFromWishlist('${item.id}')">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

// 5. NATIVE LINK SHARING ENGINE
document.querySelectorAll('.share').forEach(btn => {
  btn.addEventListener('click', () => {
    const link = btn.getAttribute('data-link');
    navigator.clipboard.writeText(link).then(() => {
      showToast('Affiliate Link copied to clipboard!', 'fa-share-nodes');
    }).catch(() => {
      showToast('Failed to copy link.', 'fa-xmark');
    });
  });
});

// 6. TOAST CREATOR
function showToast(message, iconClass = 'fa-info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => { toast.remove(); }, 3000);
}

// 7. COUNTDOWN TIMER PROMO
function startCountdown() {
  let time = 4 * 60 * 60; // 4 Hours transformed into total seconds
  const display = document.getElementById('countdown');
  
  const timer = setInterval(() => {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    display.textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (--time < 0) clearInterval(timer);
  }, 1000);
}
startCountdown();

// 8. BACK TO TOP SCROLL UTILITY
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
  topBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
});
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
