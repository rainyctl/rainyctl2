const CN_MONTHS = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

const CN_DAY_OF_WEEK = ["一", "二", "三", "四", "五", "六", "日"];

let cal;

function render() {
  if (!CalHeatmap) {
    console.warn("CalHeatmap not loaded");
    return;
  }
  if (cal) {
    cal.destroy();
  }

  cal = new CalHeatmap({});
  cal.paint(
    {
      itemSelector: "#heartbeat",
      animationDuration: 0,
      domain: {
        type: "month",
        gutter: 4,
        label: {
          text: (ts) => {
            const m = new Date(ts).getUTCMonth();
            return CN_MONTHS[m];
          },
          textAlign: "start",
          position: "top",
        },
      },
      subDomain: {
        type: "ghDay",
        radius: 2,
        width: 11,
        height: 11,
        gutter: 4,
      },
      range: window.innerWidth < 468 ? 4 : window.innerWidth < 768 ? 6 : 8,
      scale: {
        color: {
          type: "linear",
          range: ["#e8f5e9", "#2e7d32"],
          domain: [0, 5],
        },
      },
      date: {
        start: Date.UTC(2025, 10, 8), // 2025-11-08
        highlight: [new Date()],
      },
      data: {
        source: "/data/heartbeat.json",
        type: "json",
        x: (item) => {
          return item.date; // '2025-11-08' as utc
        },
        y: (item) => {
          return item.coffee;
        },
      },
      theme: sessionStorage.getItem("theme") || "light",
    },
    [
      [
        Tooltip,
        {
          enabled: true,
          text: (ts, value) => {
            const dd = new Date(ts);
            const y = dd.getFullYear();
            const m = dd.getUTCMonth();
            const d = dd.getUTCDate();
            const w = dd.getDay();
            const dayOfWeek = CN_DAY_OF_WEEK[w];
            const st = `${y}年${m + 1}月${d}日 [${dayOfWeek}]`;
            if (!value) return st;
            return `${st} (☕  x ${value})`;
          },
        },
      ],
      ,
    ],
  );
}

render();

// watch for dark/light mode changes from theme script
const observer = new MutationObserver(() => {
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  console.log("theme changed to", theme, "→ rerender");
  render();
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"],
});
