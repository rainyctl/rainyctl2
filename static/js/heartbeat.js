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
        start: new Date("2025-11-08"),
        highlight: [new Date()],
      },
      data: {
        source: "/data/heartbeat.json",
        type: "json",
        x: (item) => {
          // use current timezone with time
          const [y, m, d] = item.date.split("-").map(Number);
          const now = new Date();
          return new Date(
            y,
            m - 1,
            d,
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          );
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
            const str = new Date(ts).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            if (!value) return str;
            return `${str} (☕ x ${value})`;
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
