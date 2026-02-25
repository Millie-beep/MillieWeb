const fs = require('fs');
const html = fs.readFileSync('I:/millieproject/trending.html', 'utf8');

const articleRegex = /<article[^>]*Box-row[^>]*>([\s\S]*?)<\/article>/g;
const repos = [];
let match;

while ((match = articleRegex.exec(html)) !== null) {
  const article = match[1];

  // repo: look for /owner/repo pattern in h2
  const h2Match = article.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  let repo = '';
  if (h2Match) {
    const linkMatch = h2Match[1].match(/href="\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)"/);
    if (linkMatch) repo = linkMatch[1];
  }

  // description
  const descMatch = article.match(/class="col-9 color-fg-muted[^"]*"[^>]*>([\s\S]*?)<\/p>/);
  const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  // language
  const langMatch = article.match(/itemprop="programmingLanguage"[^>]*>([^<]+)<\/span>/);
  const lang = langMatch ? langMatch[1].trim() : '';

  // stars today
  const todayMatch = article.match(/float-sm-right[^>]*>([\s\S]*?)<\/span>/);
  const today = todayMatch ? todayMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  if (repo && repo.includes('/')) repos.push({ repo, lang, today, desc });
}

repos.slice(0, 25).forEach((r, i) => {
  console.log((i + 1) + '. ' + r.repo + ' | ' + (r.lang || 'N/A') + ' | ' + r.today + ' | ' + r.desc.slice(0, 80));
});
