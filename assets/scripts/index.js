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

function fetchTrendingCoinsData(apiUrl) {
  return fetch(apiUrl + 'search/trending')
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
/*
 async function showTrendingCoinsData () {
  const trendingCoinsData = await fetchTrendingCoinsData(baseUrl)
  console.log(trendingCoinsData)
 }

 showTrendingCoinsData()*/


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
    trendingCardPrice.textContent = `${(element.item.data.price).toFixed(2) + 'USD'}`
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

 document.addEventListener('DOMContentLoaded', () => {
  buildTrendingCard('.trending-card-container')
})