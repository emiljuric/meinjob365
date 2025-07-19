document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load news data
    const response = await fetch('/data/news.json');
    if (!response.ok) throw new Error('Failed to load news data');
    
    const news = await response.json();
    if (!Array.isArray(news)) throw new Error('Invalid news data format');

    // Initial render
    const sortedNews = sortNews(news, 'recent');
    renderNewsList(sortedNews);
    
    // Setup search and filtering
    setupSearch(news);
    setupFilters(news);

  } catch (error) {
    console.error('Initialization error:', error);
    showErrorToUser();
  }
});

// News sorting function
function sortNews(news, sortBy) {
  const newsCopy = [...news];
  switch (sortBy) {
    case 'recent':
      return newsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'popular':
      return newsCopy.sort((a, b) => (b.views || 0) - (a.views || 0));
    default:
      return newsCopy;
  }
}

// Render news list
function renderNewsList(news) {
  const container = document.getElementById('news-container');
  if (!container) return;

  try {
    container.innerHTML = news.map(item => `
      <article class="news-card">
        <a href="${item.htmlFile || '#'}">
          <img src="${item.image || 'placeholder.jpg'}" 
               alt="${item.title || 'News image'}" 
               loading="lazy">
          <div class="news-content">
            <h3>${item.title || 'Untitled'}</h3>
            <time datetime="${item.date || ''}">
              ${item.date ? formatDate(item.date) : 'Date not available'}
            </time>
            <p>${item.excerpt || ''}</p>
            <span class="tags">
              ${(item.tags || []).join(' ')}
            </span>
          </div>
        </a>
      </article>
    `).join('');
  } catch (error) {
    console.error('Rendering error:', error);
    container.innerHTML = '<p>Error displaying news. Please try again later.</p>';
  }
}

// Search functionality
function setupSearch(allNews) {
  const searchInput = document.getElementById('search-news');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const searchTerm = (e.target.value || '').toLowerCase().trim();
    
    const filtered = allNews.filter(item => {
      const titleMatch = (item.title || '').toLowerCase().includes(searchTerm);
      const excerptMatch = (item.excerpt || '').toLowerCase().includes(searchTerm);
      const tagsMatch = (item.tags || []).some(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
      
      return titleMatch || excerptMatch || tagsMatch;
    });

    renderNewsList(filtered);
  });
}

// Filter buttons functionality
function setupFilters(allNews) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Sort and render
      const filtered = sortNews(allNews, btn.dataset.filter);
      renderNewsList(filtered);
    });
  });
}

// Date formatting helper
function formatDate(dateString) {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  } catch {
    return dateString; // Return raw string if date is invalid
  }
}

// Error display
function showErrorToUser() {
  const container = document.getElementById('news-container');
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <p>We couldn't load the news right now. Please refresh the page or try again later.</p>
        <button onclick="window.location.reload()">Refresh</button>
      </div>
    `;
  }
}