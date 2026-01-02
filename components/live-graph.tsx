"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card } from "@/components/ui/card"
import { Activity } from "lucide-react"

interface DataPoint {
  time: string
  calls: number
}

export function LiveGraph() {
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    const initialData: DataPoint[] = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 2000).toLocaleTimeString('en-US', { hour12: false }),
      calls: 0,
    }))
    setData(initialData)

    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)]
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          calls: 0,
        })
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const currentCalls = data[data.length - 1]?.calls || 0
  const avgCalls = Math.round(data.reduce((sum, d) => sum + d.calls, 0) / data.length)

  const axisColor = "#666666"
  const gridColor = "#e5e7eb"

  return (
    <Card className="glass-card theme-hover p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Live API Activity</h3>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1"
          >
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-primary">Live</span>
          </motion.div>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Current: </span>
            <span className="font-semibold text-foreground">{currentCalls} calls/sec</span>
          </div>
          <div>
            <span className="text-muted-foreground">Avg: </span>
            <span className="font-semibold text-foreground">{avgCalls} calls/sec</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke={axisColor}
              fontSize={12}
              tickLine={{ stroke: axisColor }}
              axisLine={{ stroke: axisColor, strokeWidth: 1 }}
              tick={{ fill: axisColor }}
              interval={1}
            />
            <YAxis
              stroke={axisColor}
              fontSize={12}
              tickLine={{ stroke: axisColor }}
              axisLine={{ stroke: axisColor, strokeWidth: 1 }}
              tick={{ fill: axisColor }}
              domain={[0, 21]}
              ticks={[0, 3, 6, 9, 12, 15, 18, 21]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#1f2937" }}
              itemStyle={{ color: "#ef4444" }}
            />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, fill: "#ef4444" }}
              fill="url(#colorCalls)"
              isAnimationActive={true}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
