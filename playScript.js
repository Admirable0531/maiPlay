(async () => {
  const diffMap = {
    'music_basic_score_back': 'basic',
    'music_advanced_score_back': 'advanced',
    'music_expert_score_back': 'expert',
    'music_master_score_back': 'master',
    'music_remaster_score_back': 'remaster'
  };

  const blocks = [...document.querySelectorAll('div[class*="_score_back"]')];
  console.log("🎵 Found", blocks.length, "music blocks");

  for (const block of blocks) {
    const form = block.querySelector('form[action*="musicDetail"]');
    const idx = form?.querySelector('input[name="idx"]')?.value;
    if (!idx) continue;

    const classList = [...block.classList];
    const diffClass = classList.find(c => c.endsWith('_score_back'));
    const diffId = diffMap[diffClass] || 'master';

    try {
      const res = await fetch(`https://maimaidx-eng.com/maimai-mobile/record/musicDetail/?idx=${encodeURIComponent(idx)}`, {
        credentials: 'include'
      });

      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const targetDiv = doc.querySelector(`#${diffId}`);
      if (!targetDiv) continue;

      let playCount = 'N/A';
      let lastPlayed = 'N/A';
      const tds = targetDiv.querySelectorAll('td');
      for (let i = 0; i < tds.length; i++) {
        const text = tds[i].textContent.trim();
        if (text.includes("PLAY COUNT")) playCount = tds[i + 1]?.textContent.trim();
        if (text.includes("Last played date")) lastPlayed = tds[i + 1]?.textContent.trim();
      }

      const outer = document.createElement('div');
      outer.className = 't_l';
      outer.style.marginTop = '4px';

      const playCountDiv = document.createElement('div');
      playCountDiv.className = 'music_score_block w_120 d_ib t_r f_12';
      playCountDiv.textContent = `🕹️ ${playCount} plays`;

      const lastPlayedDiv = document.createElement('div');
      lastPlayedDiv.className = 'music_score_block w_310 m_r_0 d_ib t_r f_12';
      lastPlayedDiv.textContent = `📅 ${lastPlayed}`;

      outer.appendChild(playCountDiv);
      outer.appendChild(lastPlayedDiv);

      block.appendChild(outer);
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.error('❌ Error fetching for idx=', idx, e);
    }
  }
})();
