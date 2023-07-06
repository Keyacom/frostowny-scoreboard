function finalZerosRegex(num, width) {
  return new RegExp('0{' + (num === 0 ? '0' : Math.max(num.toString().length, 0)) + '}$')
}

function numberSection(rec, width) {
  let { score, gold, silver, bronze } = rec

  let scoreZeros = '0'.repeat(width).replace(finalZerosRegex(score, width), '')

  let goldZeros = '00'.replace(finalZerosRegex(gold, 2), '')
  let silverZeros = '00'.replace(finalZerosRegex(silver, 2), '')
  let bronzeZeros = '00'.replace(finalZerosRegex(bronze, 2), '')

  return `${scoreZeros}<span class="hl">${score == 0 ? '' : score}</span>
  ${goldZeros}${gold == 0 ? '' : `<span class="g">${gold}</span>`} ${silverZeros}${silver == 0 ? '' : `<span class="s">${silver}</span>`} ${bronzeZeros}${bronze == 0 ? '' : `<span class="b">${bronze}</span>`}`
}

(async () => {
  let src = await fetch('data.csv').then(resp => resp.text())
  let recs = csv_parse_sync.parse(src, {
    columns: true,
    cast: true,
    skip_empty_lines: true,
  })
  let sb = $("#scoreboard")
  let entries = []
  let i = 0
  for (let rec of recs) {
    entries.push(`
    <div class="entry${rec.status === 'S' ? '' : ' eliminated'}">
      <div class="color" style="--col: ${rec.hex}">
        ${++i}<div class="triangle"></div>
      </div>
      <div class="info">
        <div class="names">${rec.color}
        ${rec.user}</div>
        <div class="numbers">${numberSection(rec, 8)}</div><div class="triangle"></div>
      </div>
    </div>
    `)
  }
  sb.innerHTML = entries.join('')
})();