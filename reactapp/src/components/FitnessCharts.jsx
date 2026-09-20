import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Flame, 
  Star, 
  Utensils, 
  LineChart, 
  Calendar, 
  CheckCircle, 
  Zap 
} from 'lucide-react';

export const GoalBarChart = ({ entries = [] }) => {
  if (!entries || entries.length === 0) return null;

  const maxVal = Math.max(...entries.map(e => Math.max(e.targetAmount || 1, e.achievedAmount || 0)), 10);

  return (
    <div className="content-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#1F1B1A" /> Goal Completion Breakdown
          </h3>
          <p style={{ fontSize: '13px', color: '#6B5E5B', marginTop: '2px' }}>Target vs Achieved Metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12.8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#A3E635', borderRadius: '3px' }}></span> Achieved
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '3px' }}></span> Target
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {entries.map((entry) => {
          const achievedPct = Math.min(100, Math.round((entry.achievedAmount / (entry.targetAmount || 1)) * 100));
          const achievedWidth = `${(entry.achievedAmount / maxVal) * 100}%`;
          const targetWidth = `${(entry.targetAmount / maxVal) * 100}%`;

          return (
            <div key={entry.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.6px', fontWeight: '600' }}>
                <span>{entry.goalType}</span>
                <span style={{ color: achievedPct >= 100 ? '#10B981' : '#1F1B1A' }}>
                  {entry.achievedAmount} / {entry.targetAmount} ({achievedPct}%)
                </span>
              </div>
              
              <div style={{ position: 'relative', height: '20px', backgroundColor: '#F3F4F6', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: targetWidth,
                    backgroundColor: '#E5E7EB',
                    borderRadius: '10px',
                    transition: 'width 0.5s ease-out'
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: achievedWidth,
                    background: achievedPct >= 100 
                      ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)' 
                      : 'linear-gradient(90deg, #A3E635 0%, #84CC16 100%)',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(163, 230, 53, 0.3)',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ProgressTrendGraph = ({ entries = [] }) => {
  const points = [
    { label: 'Sep 01', value: 35 },
    { label: 'Sep 05', value: 50 },
    { label: 'Sep 09', value: 68 },
    { label: 'Sep 12', value: 75 },
    { label: 'Sep 16', value: 88 },
  ];

  const svgWidth = 500;
  const svgHeight = 180;
  const padding = 30;

  const maxVal = 100;
  const minVal = 0;

  const getX = (index) => padding + (index * (svgWidth - 2 * padding)) / (points.length - 1);
  const getY = (val) => svgHeight - padding - ((val - minVal) * (svgHeight - 2 * padding)) / (maxVal - minVal);

  const polylinePoints = points.map((p, i) => `${getX(i)},${getY(p.value)}`).join(' ');
  const areaPoints = `${getX(0)},${svgHeight - padding} ${polylinePoints} ${getX(points.length - 1)},${svgHeight - padding}`;

  return (
    <div className="content-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#10B981" /> Progress Trend & Consistency
          </h3>
          <p style={{ fontSize: '13px', color: '#6B5E5B', marginTop: '2px' }}>Weekly goal completion rate (%)</p>
        </div>
        <span className="tag tag-active" style={{ fontSize: '12.8px', padding: '4px 12px' }}>+14.2% Growth</span>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', minWidth: '350px' }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A3E635" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#A3E635" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((level) => (
            <g key={level}>
              <line
                x1={padding}
                y1={getY(level)}
                x2={svgWidth - padding}
                y2={getY(level)}
                stroke="#E5E7EB"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text x={10} y={getY(level) + 4} fontSize="10" fill="#9CA3AF">
                {level}%
              </text>
            </g>
          ))}

          <polygon points={areaPoints} fill="url(#areaGradient)" />

          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={getX(i)}
                cy={getY(p.value)}
                r="6"
                fill="#FFFFFF"
                stroke="#10B981"
                strokeWidth="3"
                style={{ cursor: 'pointer' }}
              />
              <text
                x={getX(i)}
                y={svgHeight - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#6B5E5B"
                fontWeight="500"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const GoalDonutChart = ({ entries = [] }) => {
  const completed = entries.filter(e => (e.achievedAmount || 0) >= (e.targetAmount || 1)).length;
  const inProgress = entries.length - completed;
  const total = entries.length || 1;
  const completedPct = Math.round((completed / total) * 100);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completedPct / 100) * circumference;

  return (
    <div className="content-card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h3 className="card-title" style={{ fontSize: '18px', width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Target size={18} color="#A3E635" /> Goal Milestone Distribution
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#F3F4F6"
              strokeWidth="14"
              fill="transparent"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#A3E635"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#1F1B1A' }}>{completedPct}%</span>
            <span style={{ fontSize: '11px', color: '#6B5E5B', fontWeight: '600', textTransform: 'uppercase' }}>Completed</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '14px', height: '14px', backgroundColor: '#A3E635', borderRadius: '4px' }}></div>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Achieved Goals: <strong>{completed}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '14px', height: '14px', backgroundColor: '#F3F4F6', borderRadius: '4px', border: '1px solid #D1D5DB' }}></div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#6B5E5B' }}>In Progress: <strong>{inProgress}</strong></span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '13px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={15} color="#FF5500" fill="#FF5500" /> Overall Goal Completion Status
          </div>
        </div>
      </div>
    </div>
  );
};

// Premium Feature: Calorie Expenditure & Burn Energy Breakdown
export const CalorieBurnChart = () => {
  const categories = [
    { name: 'Strength Training', kcal: 510, pct: 35, color: '#3B82F6' },
    { name: 'Cardio & Running', kcal: 420, pct: 28, color: '#10B981' },
    { name: 'HIIT Fat Burner', kcal: 350, pct: 24, color: '#F59E0B' },
    { name: 'Active Recovery', kcal: 180, pct: 13, color: '#8B5CF6' }
  ];

  return (
    <div className="content-card" style={{ marginBottom: '24px', borderLeft: '4px solid #3B82F6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#3B82F6" /> Calorie Burn & Energy Expenditure Breakdown
          </h3>
          <p style={{ fontSize: '13px', color: '#6B5E5B', marginTop: '2px' }}>PRO Premium Expenditure Analysis</p>
        </div>
        <span className="tag" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={12} color="#1D4ED8" fill="#1D4ED8" /> PRO METRIC
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {categories.map((cat, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.6px', fontWeight: '600' }}>
              <span>{cat.name}</span>
              <span style={{ color: cat.color }}>{cat.kcal} kcal ({cat.pct}%)</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#F3F4F6', height: '14px', borderRadius: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${cat.pct}%`,
                  height: '100%',
                  backgroundColor: cat.color,
                  borderRadius: '8px',
                  transition: 'width 0.6s ease-out'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Premium Feature: Macronutrient Balance Donut & Ideal Ratios
export const MacroBreakdownChart = () => {
  const macros = [
    { label: 'Carbohydrates (45%)', grams: '210g', color: '#F59E0B' },
    { label: 'Proteins (35%)', grams: '165g', color: '#10B981' },
    { label: 'Fats (20%)', grams: '42g', color: '#EC4899' }
  ];

  return (
    <div className="content-card" style={{ marginBottom: '24px', borderLeft: '4px solid #10B981' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={18} color="#10B981" /> Macronutrient Ratio & Nutrient Optimization
          </h3>
          <p style={{ fontSize: '13px', color: '#6B5E5B', marginTop: '2px' }}>PRO Nutrition Balance Breakdown</p>
        </div>
        <span className="tag" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={12} color="#065F46" fill="#065F46" /> PRO METRIC
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {macros.map((m, idx) => (
          <div key={idx} style={{ backgroundColor: '#FAF8F7', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB', borderTop: `4px solid ${m.color}` }}>
            <span style={{ fontSize: '12px', color: '#6B5E5B', fontWeight: '600', textTransform: 'uppercase' }}>{m.label}</span>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1F1B1A', marginTop: '4px' }}>{m.grams}</div>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>Optimal Balance</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// User Requested Axis Line Graph with Arrows, Grid & Interactive Dynamic Tooltip
export const AxisLineGraph = ({ entries, data }) => {
  const [hoveredPoint, setHoveredPoint] = React.useState(null);

  const defaultPoints = [
    { label: '2021', date: '2021-05-10', goalType: 'RUN', value: 25, target: 30, pct: 83 },
    { label: '2022', date: '2022-08-14', goalType: 'WATER', value: 40, target: 50, pct: 80 },
    { label: '2023', date: '2023-01-20', goalType: 'WEIGHT_LOSS', value: 40, target: 70, pct: 57 },
    { label: '2024', date: '2024-04-12', goalType: 'STEPS', value: 50, target: 60, pct: 83 },
    { label: '2025', date: '2025-09-01', goalType: 'MUSCLE_GAIN', value: 40, target: 50, pct: 80 },
    { label: '2026', date: '2026-09-16', goalType: 'CALORIES', value: 70, target: 75, pct: 93 },
  ];

  let points = [];
  if (entries && entries.length > 0) {
    points = entries.map((e, idx) => {
      const val = Number(e.achievedAmount) || 0;
      const target = Number(e.targetAmount) || 100;
      const pct = target > 0 ? Math.min(100, Math.round((val / target) * 100)) : 0;
      return {
        label: e.date ? (e.date.length > 5 ? e.date.substring(5) : e.date) : `P${idx + 1}`,
        date: e.date || '2026-09-16',
        goalType: e.goalType || 'FITNESS',
        value: val,
        target: target,
        pct: pct
      };
    });
  } else if (data && data.length > 0) {
    points = data.map((d, i) => ({
      label: d.label || `P${i + 1}`,
      date: d.date || d.label || '2026-09-16',
      goalType: d.goalType || 'METRIC',
      value: Number(d.value) || 0,
      target: Number(d.target) || 100,
      pct: d.pct || 80
    }));
  } else {
    points = defaultPoints;
  }

  const width = 600;
  const height = 320;
  const margin = { top: 45, right: 40, bottom: 65, left: 55 };

  const values = points.map(p => p.value);
  const rawMax = Math.max(...values, 10);
  const rawMin = Math.min(...values, 0);

  const maxVal = Math.ceil(rawMax * 1.15) || 100;
  const minVal = Math.floor(rawMin * 0.8) || 0;

  const step = Math.ceil((maxVal - minVal) / 4) || 10;
  const yTicks = [
    minVal,
    minVal + step,
    minVal + step * 2,
    minVal + step * 3,
    minVal + step * 4
  ];

  const getX = (index) => margin.left + (index * (width - margin.left - margin.right)) / Math.max(1, points.length - 1);
  const getY = (val) => height - margin.bottom - ((val - minVal) * (height - margin.top - margin.bottom)) / Math.max(1, maxVal - minVal);

  const linePoints = points.map((p, i) => `${getX(i)},${getY(p.value)}`).join(' ');

  const highestPoint = points.reduce((prev, current) => (prev.value > current.value ? prev : current), points[0]);

  return (
    <div className="content-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#10B981" /> Progress Trend (Value vs Date)
          </h3>
          <p style={{ fontSize: '13px', color: '#6B5E5B', marginTop: '2px' }}>
            Y-Axis: Metric Value | X-Axis: Check-in Date (Hover nodes for details)
          </p>
        </div>
        <span className="tag tag-active" style={{ fontSize: '12.8px', padding: '4px 12px' }}>
          Peak Output: {highestPoint?.value || 0}
        </span>
      </div>


      <div style={{ width: '100%', overflowX: 'auto', textAlign: 'center', position: 'relative' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', maxWidth: '650px', height: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '10px' }}
        >
          <defs>
            {/* Arrowhead marker for Y and X axis */}
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#4B5563" />
            </marker>

            {/* Line Gradient */}
            <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#359E9E" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={margin.left}
                y1={getY(tick)}
                x2={width - margin.right + 10}
                y2={getY(tick)}
                stroke="#E5E7EB"
                strokeWidth="1.5"
              />
              <text x={margin.left - 12} y={getY(tick) + 4} textAnchor="end" fontSize="11" fill="#6B5E5B" fontWeight="600">
                {tick}
              </text>
            </g>
          ))}

          {/* Vertical Gridlines */}
          {points.map((p, i) => (
            <line
              key={i}
              x1={getX(i)}
              y1={margin.top - 10}
              x2={getX(i)}
              y2={height - margin.bottom}
              stroke="#E5E7EB"
              strokeWidth="1.5"
            />
          ))}

          {/* Main X Axis with Arrow */}
          <line
            x1={margin.left - 10}
            y1={height - margin.bottom}
            x2={width - margin.right + 25}
            y2={height - margin.bottom}
            stroke="#4B5563"
            strokeWidth="3"
            markerEnd="url(#arrow)"
          />

          {/* Main Y Axis with Arrow */}
          <line
            x1={margin.left}
            y1={height - margin.bottom + 10}
            x2={margin.left}
            y2={margin.top - 25}
            stroke="#4B5563"
            strokeWidth="3"
            markerEnd="url(#arrow)"
          />

          {/* Hover Crosshair / Vertical Guideline */}
          {hoveredPoint !== null && points[hoveredPoint] && (
            <line
              x1={getX(hoveredPoint)}
              y1={margin.top - 10}
              x2={getX(hoveredPoint)}
              y2={height - margin.bottom}
              stroke="#359E9E"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Connecting Data Line */}
          <polyline
            fill="none"
            stroke="url(#trendGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints}
          />

          {/* Circular Data Nodes & Axis Labels */}
          {points.map((p, i) => {
            const isHovered = hoveredPoint === i;
            const cx = getX(i);
            const cy = getY(p.value);

            return (
              <g key={i}>
                {/* Node Outer Halo on Hover */}
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="#359E9E"
                    fillOpacity="0.3"
                    stroke="#359E9E"
                    strokeWidth="2"
                  />
                )}

                {/* Visible Data Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? "8" : "6.5"}
                  fill="#FFFFFF"
                  stroke={isHovered ? "#10B981" : "#359E9E"}
                  strokeWidth={isHovered ? "4.5" : "3.5"}
                  style={{ transition: 'all 0.2s ease-in-out', cursor: 'pointer' }}
                />

                {/* Angled Labels on X-axis */}
                <text
                  x={cx}
                  y={height - margin.bottom + 24}
                  textAnchor="end"
                  fontSize="12"
                  fill={isHovered ? "#10B981" : "#4B5563"}
                  fontWeight={isHovered ? "800" : "700"}
                  transform={`rotate(-45, ${cx}, ${height - margin.bottom + 24})`}
                >
                  {p.label}
                </text>

                {/* Invisible Larger Hitbox for Smooth Hover Interaction */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="18"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}

          {/* Dynamic Floating Tooltip Box */}
          {hoveredPoint !== null && points[hoveredPoint] && (() => {
            const p = points[hoveredPoint];
            const px = getX(hoveredPoint);
            const py = getY(p.value);

            // Calculate Tooltip position (flip down if too close to top)
            const boxWidth = 165;
            const boxHeight = 72;
            let boxX = px - boxWidth / 2;
            if (boxX < 10) boxX = 10;
            if (boxX + boxWidth > width - 10) boxX = width - boxWidth - 10;

            let boxY = py - boxHeight - 14;
            if (boxY < 10) boxY = py + 16;

            return (
              <g style={{ pointerEvents: 'none', transition: 'all 0.15s ease-out' }}>
                {/* Tooltip Background Card */}
                <rect
                  x={boxX}
                  y={boxY}
                  width={boxWidth}
                  height={boxHeight}
                  rx="8"
                  ry="8"
                  fill="#1F1B1A"
                  fillOpacity="0.95"
                  stroke="#359E9E"
                  strokeWidth="1.5"
                />

                {/* Tooltip Header / Date */}
                <text x={boxX + 12} y={boxY + 18} fontSize="11" fill="#A3E635" fontWeight="700">
                  Date: {p.date}
                </text>

                {/* Goal Type */}
                <text x={boxX + 12} y={boxY + 34} fontSize="12" fill="#FFFFFF" fontWeight="700">
                  Goal: {p.goalType}
                </text>

                {/* Value Achieved / Target */}
                <text x={boxX + 12} y={boxY + 49} fontSize="11" fill="#E5E7EB" fontWeight="600">
                  Progress: {p.value} / {p.target} ({p.pct}%)
                </text>

                {/* Status Indicator */}
                <text x={boxX + 12} y={boxY + 63} fontSize="10" fill={p.pct >= 100 ? "#10B981" : "#F59E0B"} fontWeight="700">
                  {p.pct >= 100 ? 'Target Achieved' : 'Active Goal'}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

// Progress Trend Bar Chart: Value vs Date cleanly aligned
export const ProgressValueVsDateChart = ({ logs = [] }) => {
  const displayLogs = (logs && logs.length > 0) ? logs : [
    { id: 401, date: '2026-09-01', progressValue: 78.5, notes: 'Initial weight measurement' },
    { id: 402, date: '2026-09-08', progressValue: 77.2, notes: 'First week progress - energy levels high' },
    { id: 403, date: '2026-09-12', progressValue: 76.0, notes: 'Hydration and cardio paying off' },
    { id: 404, date: '2026-09-16', progressValue: 75.1, notes: 'Approaching milestone target!' }
  ];

  const values = displayLogs.map(l => Number(l.progressValue) || 0);
  const scaleMax = Math.max(...values, 100);

  return (
    <div className="content-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#10B981" /> Progress Trend (Value vs Date)
          </h3>
          <p style={{ fontSize: '13px', color: '#6B5E5B', marginTop: '2px' }}>
            Metric values tracked by date check-in with aligned progress indicators
          </p>
        </div>
        <span className="tag tag-active" style={{ fontSize: '12px', padding: '4px 12px', fontWeight: '700' }}>
          Value vs Date
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayLogs.map((log, idx) => {
          const val = Number(log.progressValue) || 0;
          const pct = Math.min(100, Math.max(2, (val / scaleMax) * 100));
          const dateStr = log.date || 'N/A';

          return (
            <div key={log.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '600' }}>
                <span style={{ color: '#1F1B1A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#6B5E5B" /> <span>{dateStr}</span>
                </span>
                <span style={{ color: '#10B981', fontWeight: '800', fontSize: '15px' }}>
                  Value: <span style={{ color: '#1F1B1A' }}>{val}</span>
                </span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#F3F4F6', height: '18px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: '#10B981',
                    borderRadius: '5px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


