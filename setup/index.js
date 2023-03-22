class DataLoader {
    constructor(url) {
        this.url = url;
    }
    async load() {
        const response = await fetch(this.url);
        const data = await response.json();
        return data;
    }
}

const loader = new DataLoader('../data.json');
const layout = document.querySelector('.layout-placeholder');
const button = document.querySelector('.btn');
let counter = 0;
let selectedPlatform = 'all';

const socialMediaFilter = document.querySelectorAll('input[name="filterBySource"]');
socialMediaFilter.forEach((radio) => {
    radio.addEventListener('change', () => {
        selectedPlatform = radio.value;
        counter = 0;
        layout.innerHTML = '';
        displayNextSetOfImages();
    });
});

async function displayNextSetOfImages() {
    const data = await loader.load();
    let filteredData = data;
    if (selectedPlatform !== 'all') {
        filteredData = data.filter((item) => item.source_type === selectedPlatform);
    }
    const images = filteredData.slice(counter, counter + 4);
    images.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
      <div class="content" style="background-color: ${colorInput.value}">
        <div class="profileImg"><img src="${item.profile_image}"></div>
        <div class="name">${item.name}</div>
        <div class="date">${new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        <div class="image"><img src="${item.image}"></div>
        <div class="likes">${item.likes}</div>
        <img class="heart" src="../icons/heart.svg">
        <div class="caption">${item.caption}</div>
      </div>
    `;
        layout.append(div);

    })
    counter += images.length;
    if (counter >= filteredData.length) {
        button.style.display = 'none';
    } else {
        button.style.display = 'block';
    }
    const contentDiv = document.querySelectorAll('.content')
    if (layout.classList.contains('dark-theme')) {
        contentDiv.forEach(div => {
            div.style.backgroundColor = 'black'
            div.style.color = 'white';
        })
    }
    const heart = document.querySelectorAll('.heart');
    const likes = document.querySelectorAll('.likes');
    let isLiked = [];
    heart.forEach((hearts, index) => {
        let likesCount = parseInt(likes[index].textContent);
        isLiked[index] = false;
        hearts.addEventListener('click', () => {
            if (isLiked[index]) {
                hearts.src = '../icons/heart.svg';
                likesCount--;
                isLiked[index] = false;
            } else {
                hearts.src = '../icons/heart-red.svg';
                likesCount++;
                isLiked[index] = true;
            }
            likes[index].textContent = likesCount;
        });
    });
}

displayNextSetOfImages();
button.addEventListener('click', displayNextSetOfImages);

const colorInput = document.querySelector('#cardBackgroundColor');
colorInput.addEventListener('input', function () {
    const newBgColor = colorInput.value;
    const containerDivs = document.querySelectorAll('.content')
    containerDivs.forEach(div => {
        div.style.backgroundColor = newBgColor;
    });
});

const gapInput = document.querySelector('#cardSpaceBetween');
gapInput.addEventListener('input', function () {
    const newGap = gapInput.value;
    layout.style.gap = newGap;
});

const lightTheme = document.querySelector('#lightTheme');
const darkTheme = document.querySelector('#darkTheme');
function toggleTheme(isDarkTheme) {
    layout.classList.toggle('dark-theme', isDarkTheme);
    const containerDivs = document.querySelectorAll('.content');
    const bgColor = isDarkTheme ? 'black' : colorInput.value;
    const textColor = isDarkTheme ? 'white' : '';
    containerDivs.forEach(div => {
        div.style.backgroundColor = bgColor;
        div.style.color = textColor;
    });
}

lightTheme.addEventListener('change', function () {
    toggleTheme(false);
});

darkTheme.addEventListener('change', function () {
    toggleTheme(true);
});