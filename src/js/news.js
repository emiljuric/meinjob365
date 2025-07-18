document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/data/news.json');
  const news = await response.json();
  
  const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));
  renderNewsList(sortedNews);
});

function renderNewsList(news) {
  const container = document.getElementById('news-container');
  
  container.innerHTML = news.map(item => `
    <article class="news-card">
      <a href="${item.htmlFile}">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="news-content">
          <h3>${item.title}</h3>
          <time datetime="${item.date}">${formatDate(item.date)}</time>
          <p>${item.excerpt}</p>
          <span class="tags">${item.tags.join(' ')}</span>
        </div>
      </a>
    </article>
  `).join('');
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('de-DE', options);
}