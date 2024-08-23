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

