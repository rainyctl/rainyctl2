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

function render() {
  if (!CalHeatmap) {
    console.warn("CalHeatmap not loaded");
    return;
  }

  const cal = new CalHeatmap({});
  cal.paint(
    {
      itemSelector: "#heartbeat",
      domain: {
        type: "month",
        gutter: 4,
        label: {
          text: (ts) => {
            const m = new Date(ts).getMonth();
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
      range: 5,
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
      theme: "dark",
    },
    [
      [
        Tooltip,
        {
          enabled: true,
          text: (ts, value) => {
            if (!value) return null;
            const str = new Date(ts).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            return `${str} ☕ x ${value}`;
          },
        },
      ],
      [
        CalendarLabel,
        {
          width: 30,
          textAlign: "start",
          text: () => ["一", "", "三", "", "五", "", "日"],
          padding: [25, 0, 0, 0],
        },
      ],
    ],
  );
}

render();
