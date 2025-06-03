const hobbyContainer = document.querySelector('.hobby-items');
const carousel       = document.querySelector('.carousel');
const btnLeft        = document.querySelector('.carousel-arrow.left');
const btnRight       = document.querySelector('.carousel-arrow.right');
const datumP         = document.querySelector('.heutiges-datum');
const hamburger      = document.querySelector('.hamburger');
const menu           = document.querySelector('.menu');

const visibleCount = 3;
let origItems = [];
let currentIndex;
let itemWidthWithGap;
let peekOffset;
let isAnimating = false;
let touchStartX = 0;

function setupCarousel() {
  origItems = Array.from(hobbyContainer.querySelectorAll('.hobby-item'));

  hobbyContainer.innerHTML = '';

  const lastSlice = origItems.slice(origItems.length - visibleCount);
  lastSlice.forEach(item => {
    const clone = item.cloneNode(true);
    hobbyContainer.appendChild(clone);
  });

  origItems.forEach(item => {
    const clone = item.cloneNode(true);
    hobbyContainer.appendChild(clone);
  });

  const firstSlice = origItems.slice(0, visibleCount);
  firstSlice.forEach(item => {
    const clone = item.cloneNode(true);
    hobbyContainer.appendChild(clone);
  });

  currentIndex = visibleCount;

  requestAnimationFrame(() => {
    const firstItem = hobbyContainer.querySelector('.hobby-item');
    const gap = 20; 
    const itemWidth = firstItem.offsetWidth;
    itemWidthWithGap = itemWidth + gap;

    const containerWidth = carousel.offsetWidth;
    const visibleWidth = visibleCount * itemWidth + (visibleCount - 1) * gap;
    peekOffset = (containerWidth - visibleWidth) / 2;

    hobbyContainer.style.transition = 'none';
    hobbyContainer.style.transform =
      `translateX(-${currentIndex * itemWidthWithGap - peekOffset}px)`;
  });
}

function slideRight() {
  if (isAnimating) return;
  isAnimating = true;
  currentIndex++;
  hobbyContainer.style.transition = 'transform 0.5s ease';
  hobbyContainer.style.transform =
    `translateX(-${currentIndex * itemWidthWithGap - peekOffset}px)`;
  hobbyContainer.addEventListener('transitionend', onRightEnd, { once: true });
}

function onRightEnd() {
  if (currentIndex === origItems.length + visibleCount) {
    hobbyContainer.style.transition = 'none';
    currentIndex = visibleCount;
    hobbyContainer.style.transform =
      `translateX(-${currentIndex * itemWidthWithGap - peekOffset}px)`;
  }
  isAnimating = false;
}

function slideLeft() {
  if (isAnimating) return;
  isAnimating = true;
  currentIndex--;
  hobbyContainer.style.transition = 'transform 0.5s ease';
  hobbyContainer.style.transform =
    `translateX(-${currentIndex * itemWidthWithGap - peekOffset}px)`;
  hobbyContainer.addEventListener('transitionend', onLeftEnd, { once: true });
}

function onLeftEnd() {
  if (currentIndex === visibleCount - 1) {
    hobbyContainer.style.transition = 'none';
    currentIndex = origItems.length + visibleCount - 1;
    hobbyContainer.style.transform =
      `translateX(-${currentIndex * itemWidthWithGap - peekOffset}px)`;
  }
  isAnimating = false;
}

hobbyContainer.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
});
hobbyContainer.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) {
    slideRight();
  } else if (touchEndX - touchStartX > 50) {
    slideLeft();
  }
});

(function setzeDatum() {
  const heute = new Date();
  const dd = String(heute.getDate()).padStart(2, '0');
  const mm = String(heute.getMonth() + 1).padStart(2, '0');
  const yyyy = heute.getFullYear();
  datumP.textContent = `${dd}.${mm}.${yyyy}`;
})();

hamburger.addEventListener('click', () => {
  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
});

setupCarousel();
btnRight.addEventListener('click', slideRight);
btnLeft.addEventListener('click', slideLeft);
