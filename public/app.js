const submitBtn = document.getElementById("submit");
const textArea = document.getElementById("text");
const entriesDiv = document.getElementById("entries");
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

submitBtn.onclick = async () => {
  const text = textArea.value.trim();
  if (!text) return;

  await fetch("/add-entry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  textArea.value = "";
  await loadEntries();
  await loadGraph();
};

async function loadEntries() {
  const res = await fetch("/entries");
  const entries = await res.json();

  entriesDiv.innerHTML = "";

  Object.values(entries)
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach(entry => {
      const div = document.createElement("div");
      div.className = "entry";
      div.innerHTML = `
        <strong>${new Date(entry.timestamp).toLocaleString()}</strong><br>
        Anxiety: ${entry.anxiety}/10<br>
        ${entry.summary}
      `;
      entriesDiv.appendChild(div);
    });
}

async function loadGraph() {
  const res = await fetch("/graph");
  const points = await res.json();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (points.length === 0) return;

  const maxX = Math.max(...points.map(p => p.timestamp));
  const minX = Math.min(...points.map(p => p.timestamp));

  ctx.beginPath();

  points.forEach((p, i) => {
    const x = ((p.timestamp - minX) / (maxX - minX || 1)) * canvas.width;
    const y = canvas.height - (p.anxiety / 10) * canvas.height;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}

// Initial load
loadEntries();
loadGraph();
