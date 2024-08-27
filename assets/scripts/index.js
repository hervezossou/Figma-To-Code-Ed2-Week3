const toggleSidebar = document.getElementById('toggle-sidebar')
const sidebar = document.getElementById('sidebar')

function showSidebar() {
    sidebar.classList.toggle('active')
}

// Use toggleSidebar to show our sidebar dynamically
toggleSidebar.addEventListener('click', showSidebar)

// Hidding the sidebar nav when user click outside the menu

document.onclick = function(e) {
    if(sidebar.classList.contains('active') && 
    !toggleSidebar.contains(e.target) &&
    !sidebar.contains(e.target)) {
      sidebar.classList.remove('active')
    }
  }

// Fetching data for trending cards and crypto table

baseUrl = 'https://api.coingecko.com/api/v3/'

const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-Ujp4EVpLRtc6VmW9cKTEswHo'}
}

async function fetchTrendingCoinsData(apiUrl) {
  return fetch(apiUrl + 'search/trending', options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not okay');
      }
      return response.json();
    })
    .then(data => {
      const trendingCoinsData = data.coins;
      return trendingCoinsData;
    })
    .catch(error => {
      console.error('Error fetching trending coins data:', error);
      throw error; // Re-throw the error for further handling
    });
}

 // Building trending card 

 async function buildTrendingCard (classname) {

  // Our target container
  let trendingCardContainer = document.querySelector(classname)

  // Fetching trending data
  const trendingCoinsData = await fetchTrendingCoinsData(baseUrl)

  // Limit the data to the first 4 elements
  const limitedData = trendingCoinsData.slice(0, 4);

  // Creating each card elements
  limitedData.forEach(element => {
    const trendingCard = document.createElement('div')
    trendingCard.classList.add('trending-card')

    // Container for trending top and bottom
    const trendingCardTop = document.createElement('div')
    trendingCardTop.classList.add('trending-card-top')
    const trendingCardBottom = document.createElement('div')
    trendingCardBottom.classList.add('trending-card-bottom')

    // Trending Card Bottom Content
    const trendingCardPrice = document.createElement('h2')
    trendingCardPrice.textContent = `${(element.item.data.price).toFixed(4) + ' ' + 'USD'}`
    trendingCardPrice.classList.add('trending-card-price')
    const trendingCardVolume = document.createElement('h3')
    trendingCardVolume.textContent = `${(element.item.data.total_volume)}`
    trendingCardVolume.classList.add('trending-card-volume')


    // Trending Card Top Content
    const trendingCardCoin = document.createElement('div')
    trendingCardCoin.classList.add('trending-card-coin')

    // Card logo
    const coinImage = document.createElement('div')
    coinImage.style.backgroundImage = `url(${element.item.thumb})`
    coinImage.style.backgroundSize = 'cover'
    coinImage.style.backgroundPosition = 'center';
    coinImage.classList.add('coin-image')

    // Card name and symbol
    const coinNameContainer = document.createElement('div')
    coinNameContainer.classList.add('coin-name-container')
    const coinName = document.createElement('h2')
    coinName.classList.add('coin-name')

    coinName.textContent = element.item.name
    const coinSymbol = document.createElement('h3')
    coinSymbol.textContent = element.item.symbol
    coinSymbol.classList.add('coin-symbol')

    // Card badge 
    const cardBadge = document.createElement('div')
    cardBadge.classList.add('trending-card-badge')
    cardBadge.textContent = element.item.data.price_change_percentage_24h.usd.toFixed(2) + '%'

    // Adjusting card badge background color dynamically
    const percentage = element.item.data.price_change_percentage_24h.usd
    
    if (percentage > 0) {
      cardBadge.classList.add('positive', 'text-positive')
      cardBadge.classList.remove('negative', 'text-negative')
    } else if (percentage < 0) {
      cardBadge.classList.add('negative', 'text-negative')
      cardBadge.classList.remove('positive', 'text-positive')
    } else {
      cardBadge.classList.add('neutral', 'text-neutral')
    }

    // Appending all child to their parents
    trendingCardCoin.appendChild(coinImage)
    coinNameContainer.appendChild(coinName)
    coinNameContainer.appendChild(coinSymbol)
    trendingCardCoin.appendChild(coinNameContainer)
    
    trendingCardTop.appendChild(trendingCardCoin)
    trendingCardCoin.classList.add('trending-card-coin')
    trendingCardTop.appendChild(cardBadge)
    cardBadge.classList.add('card-badge')


    trendingCardBottom.appendChild(trendingCardPrice)
    trendingCardBottom.appendChild(trendingCardVolume)
    
    trendingCard.appendChild(trendingCardTop)
    trendingCard.appendChild(trendingCardBottom)
    trendingCard.classList.add('trending-card')

    trendingCardContainer.appendChild(trendingCard)
  }
 )}

async function fetchMarketData(apiUrl) {
  return fetch(apiUrl + 'coins/markets?vs_currency=usd', options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not okay');
      }
      return response.json();
    })
    .then(data => {
      const cryptoMarketData = data;
      return cryptoMarketData;
    })
    .catch(error => {
      console.error('Error fetching trending coins data:', error);
      throw error; // Re-throw the error for further handling
    });
}

//Building Table Row for our Dashboard

function createTableRow(crypto) {
  const tableRow = document.createElement('tr')
  tableRow.classList.add('table-row')

  // Colonne du rang
  const rankCell = document.createElement('td')
  rankCell.textContent = crypto.market_cap_rank
  rankCell.classList.add('item-cell')
  tableRow.appendChild(rankCell)

  // Colonne de l'image et du nom
  const nameAndImageCell = document.createElement('td')
  const image = document.createElement('img')
  image.src = crypto.image;
  nameAndImageCell.appendChild(image)
  nameAndImageCell.appendChild(document.createTextNode(` ${crypto.name}-${crypto.symbol.toUpperCase()}`))
  nameAndImageCell.classList.add('item-cell')
  tableRow.appendChild(nameAndImageCell)

  // Colonne du prix
  const priceCell = document.createElement('td')
  priceCell.textContent = `$${crypto.current_price.toLocaleString('en-US')}`
  priceCell.classList.add('item-cell')
  tableRow.appendChild(priceCell)

  // Colonne du pourcentage de changement de prix
  const priceChangeCell = document.createElement('td')
  priceChangeCell.textContent = `${crypto.price_change_percentage_24h.toFixed(1)}%`
  priceChangeCell.classList.add('item-cell')
  tableRow.appendChild(priceChangeCell)

  const pricePercentage = crypto.price_change_percentage_24h
    
    if (pricePercentage > 0) {
      priceChangeCell.classList.add('positive', 'text-positive')
      priceChangeCell.classList.remove('negative', 'text-negative')
    } else if (pricePercentage < 0) {
      priceChangeCell.classList.add('negative', 'text-negative')
      priceChangeCell.classList.remove('positive', 'text-positive')
    } else {
      priceChangeCell.classList.add('neutral', 'text-neutral')
    }

  // Colonne du volume total
  const volumeCell = document.createElement('td')
  volumeCell.textContent = `$${crypto.total_volume.toLocaleString('en-US')}`
  volumeCell.classList.add('item-cell')
  tableRow.appendChild(volumeCell)

  // Colonne de la capitalisation boursière
  const marketCapCell = document.createElement('td')
  marketCapCell.textContent = `$${crypto.market_cap.toLocaleString('en-US')}`
  marketCapCell.classList.add('item-cell')
  tableRow.appendChild(marketCapCell)

  // Colonne du graphique (à compléter avec votre bibliothèque de graphiques préférée)
  const graphCell = document.createElement('td')
  graphCell.classList.add('item-cell')
  // Ici, vous ajouteriez votre code pour créer le graphique
  // Par exemple, avec Chart.js:
  // const canvas = document.createElement('canvas');
  // graphCell.appendChild(canvas);
  // // ... Configuration de votre graphique Chart.js
  tableRow.appendChild(graphCell);

  return tableRow;
}

// Build Crypto Table Body

// Our Crypto Table Body target
const tbody = document.getElementById('crypto-table-body'); // Remplacez par l'ID de votre tbody

// Our creating and displaying function

async function fetchAndDisplayData() {
  try {
    // Récupérer les données depuis l'API
    cryptoMarketData = await fetchMarketData(baseUrl);

    // Sélectionner le tbody du tableau
    const tbody = document.getElementById('crypto-table-body');

    // Créer les lignes du tableau
    cryptoMarketData.forEach(crypto => {
      const row = createTableRow(crypto);
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  buildTrendingCard('.trending-card-container')
  fetchAndDisplayData()
})