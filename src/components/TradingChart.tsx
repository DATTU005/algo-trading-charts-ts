import {
  createChart,
  Time,
  TimeChartOptions,
  DeepPartial,
  ColorType,
  AreaData,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";

interface DataItem {
  date: string;
  pnl: number;
  cumsum: number;
}

interface ReferenceDataItem {
  Start_Date: string;
  End_Date: string;
  isHighlighted?: boolean;
}

const TradingChart: React.FC<{
  data: DataItem[];
  referenceDate: ReferenceDataItem[];
}> = ({ data, referenceDate }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  useEffect(() => {
    let highlights: ReferenceDataItem[] = referenceDate.sort((a, b) => {
      return (
        new Date(a.Start_Date).getTime() - new Date(b.Start_Date).getTime()
      );
    });
    highlights.forEach((item, index) => {
      if (index % 2 === 0) {
        item.isHighlighted = true;
      }
    });

    if (chartContainerRef.current) {
      const chartOptions: DeepPartial<TimeChartOptions> = {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          fontFamily: "Poppins , sans-serif",
        },
        leftPriceScale: {
          visible: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        rightPriceScale: {
          visible: false,
        },
        width: 700,
        height: 300,
      };

      const chart = createChart(chartContainerRef.current, chartOptions);
      chartRef.current = chart;

      const newSeries = chart.addAreaSeries({
        lineColor: "#ff0400",
        topColor: "#f36361",
        bottomColor: "rgba(255, 41, 41, 0.052)",
        lineWidth: 2,
      });

      const chartData: AreaData<Time>[] = data.map((item) => {
        let referenceItem = highlights.find((highlightItem) => {
          return (
            new Date(item.date).getTime() >=
              new Date(highlightItem.Start_Date).getTime() &&
            new Date(item.date).getTime() <=
              new Date(highlightItem.End_Date).getTime()
          );
        });
        return {
          time: item.date,
          value: item.cumsum,
          lineColor:
            referenceItem?.isHighlighted === true ? "#66808080" : "#ff0400",

          bottomColor:
            referenceItem?.isHighlighted === true
              ? "#FFFFFF"
              : "rgba(255, 41, 41, 0.052)",
          topColor:
            referenceItem?.isHighlighted === true ? "#FFFFFF" : "#f36361",
        };
      });

      newSeries.setData(chartData);
      const watermark = document.createElement("div");
      watermark.style.position = "absolute";
      watermark.style.zIndex = "1";
      watermark.style.top = "80%";
      watermark.style.left = "100%";
      watermark.style.transform = "translate(-50%, -50%)";
      watermark.style.width = "200px";
      watermark.style.height = "100px";
      watermark.style.backgroundImage = `url("/logo_white.png")`;
      watermark.style.backgroundRepeat = "no-repeat";
      watermark.style.backgroundSize = "contain";
      watermark.style.opacity = "0.2";
      chartContainerRef.current.style.position = "relative";
      chartContainerRef.current.appendChild(watermark);

      const tooltip = document.createElement("div");

      tooltip.style.width = "100px";
      tooltip.style.height = "70px";
      tooltip.style.position = "absolute";
      tooltip.style.display = "none";
      tooltip.style.padding = "8px";
      tooltip.style.boxSizing = "border-box";
      tooltip.style.fontSize = "12px";
      tooltip.style.textAlign = "left";
      tooltip.style.zIndex = "1000";
      tooltip.style.top = "12px";
      tooltip.style.left = "12px";
      tooltip.style.pointerEvents = "none";
      tooltip.style.border = "1px solid";
      tooltip.style.borderRadius = "2px";
      tooltip.style.fontFamily = '"Poppins", sans-serif';
      tooltip.style.background = "black";
      tooltip.style.color = "white";
      tooltip.style.borderColor = "#2962FF";
      tooltip.classList.add("tooltip");
      chartContainerRef.current.appendChild(tooltip);

      chart.subscribeCrosshairMove((param) => {
        if (!param.time || param.point === undefined) {
          tooltip.style.display = "none";
          return;
        }

        const price = param.seriesData.get(newSeries);
        if (price === undefined) return;

        const timeString = param.time
          .toString()
          .replace("T", " ")
          .split(".")[0];

        tooltip.innerHTML = `
            </div>
              ${timeString}<div style="color: ${"white"}">
              value: ${price.value.toFixed(2)}
            </div>`;
        tooltip.style.display = "block";
        tooltip.style.left = `${param.point.x}px`;
        tooltip.style.top = `${param.point.y}px`;
      });

      return () => {
        chart.remove();
      };
    }
  }, [data, referenceDate]);

  return <div ref={chartContainerRef}></div>;
};

export default TradingChart;
