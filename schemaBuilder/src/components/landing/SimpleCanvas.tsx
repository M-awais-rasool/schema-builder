import { useEffect, useState, useRef } from "react";
import { Cardinality, tableColorStripHeight, tableFieldHeight, tableHeaderHeight, tableWidth } from "../../utils/constants";
import { calcPath } from "../../utils/calcPath";

function Table({ table, grab }: { table: any; grab: any; }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredField, setHoveredField] = useState(-1);
  const height =
    table.fields.length * tableFieldHeight +
    tableHeaderHeight +
    tableColorStripHeight;

  return (
    <foreignObject
      key={table.name}
      x={table.x}
      y={table.y}
      width={tableWidth}
      height={height}
      className="drop-shadow-xl rounded-lg cursor-move transition-all duration-200 hover:drop-shadow-2xl"
      onPointerDown={(e: any) => {
        // Required for onPointerLeave to trigger when a touch pointer leaves
        // https://stackoverflow.com/a/70976017/1137077
        e.target.releasePointerCapture(e.pointerId);

        if (!e.isPrimary) return;

        grab(e);
      }}
      onPointerEnter={(e) => e.isPrimary && setIsHovered(true)}
      onPointerLeave={(e) => e.isPrimary && setIsHovered(false)}
    >
      <div
        className={`border-2 transition-all duration-200 ${isHovered ? "border-dashed border-black scale-105" : "border-gray-300"
          } select-none rounded-lg w-full bg-white text-black shadow-lg`}
      >
        <div
          className={`h-[12px] w-full rounded-t-md transition-all duration-200 shadow-sm`}
          style={{ backgroundColor: table.color }}
        />
        <div className="font-bold h-[40px] flex justify-between items-center border-b border-gray-300 bg-gradient-to-r from-gray-900 to-black px-3 text-white shadow-sm">
          {table.name}
        </div>
        {table.fields.map((e: any, i: any) => (
          <div
            key={i}
            className={`${i === table.fields.length - 1 ? "" : "border-b border-gray-200"
              } h-[36px] px-2 py-1 flex justify-between transition-colors duration-150 ${hoveredField === i ? "bg-gray-50" : "bg-white"}`}
            onPointerEnter={(e) => e.isPrimary && setHoveredField(i)}
            onPointerLeave={(e) => e.isPrimary && setHoveredField(-1)}
            onPointerDown={(e: any) => {
              // Required for onPointerLeave to trigger when a touch pointer leaves
              // https://stackoverflow.com/a/70976017/1137077
              e.target.releasePointerCapture(e.pointerId);
            }}
          >
            <div className={`transition-colors duration-150 ${hoveredField === i ? "text-black" : "text-gray-800"}`}>
              <button
                className={`w-[9px] h-[9px] bg-black rounded-full me-2 transition-all duration-150`}
              />
              {e.name}
            </div>
            <div className="text-gray-500 text-sm">{e.type}</div>
          </div>
        ))}
      </div>
    </foreignObject>
  );
}

function Relationship({ relationship, tables }: any) {
  const pathRef = useRef<any>(null);
  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };

  let cardinalityStart = "1";
  let cardinalityEnd = "1";

  switch (relationship.cardinality) {
    case Cardinality.MANY_TO_ONE:
      cardinalityStart = "n";
      cardinalityEnd = "1";
      break;
    case Cardinality.ONE_TO_MANY:
      cardinalityStart = "1";
      cardinalityEnd = "n";
      break;
    case Cardinality.ONE_TO_ONE:
      cardinalityStart = "1";
      cardinalityEnd = "1";
      break;
    default:
      break;
  }

  const length = 32;

  const [refAquired, setRefAquired] = useState(false);
  useEffect(() => {
    setRefAquired(true);
  }, []);

  if (refAquired) {
    const pathLength = pathRef.current.getTotalLength();
    const point1 = pathRef.current.getPointAtLength(length);
    start = { x: point1.x, y: point1.y };
    const point2 = pathRef.current.getPointAtLength(pathLength - length);
    end = { x: point2.x, y: point2.y };
  }

  return (
    <g className="select-none">
      <path
        ref={pathRef}
        d={calcPath({
          startFieldIndex: relationship.startFieldId,
          endFieldIndex: relationship.endFieldId,
          startTable: {
            x: tables[relationship.startTableId].x,
            y: tables[relationship.startTableId].y,
          },
          endTable: {
            x: tables[relationship.endTableId].x,
            y: tables[relationship.endTableId].y,
          },
        })}
        stroke="#374151"
        fill="none"
        strokeWidth={2.5}
        className="transition-all duration-200 hover:stroke-black"
      />
      {pathRef.current && (
        <>
          <circle cx={start.x} cy={start.y} r="14" fill="#374151" className="transition-all duration-200 hover:fill-black" />
          <text
            x={start.x}
            y={start.y}
            fill="white"
            strokeWidth="0.5"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-sm font-medium"
          >
            {cardinalityStart}
          </text>
          <circle cx={end.x} cy={end.y} r="14" fill="#374151" className="transition-all duration-200 hover:fill-black" />
          <text
            x={end.x}
            y={end.y}
            fill="white"
            strokeWidth="0.5"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-sm font-medium"
          >
            {cardinalityEnd}
          </text>
        </>
      )}
    </g>
  );
}

export default function SimpleCanvas({ diagram, zoom }: any) {
  const [tables, setTables] = useState(diagram.tables);
  const [dragging, setDragging] = useState(-1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const grabTable = (e: any, id: any) => {
    setDragging(id);
    setOffset({
      x: e.clientX - tables[id].x,
      y: e.clientY - tables[id].y,
    });
  };

  const moveTable = (e: any) => {
    if (dragging !== -1) {
      const dx = e.clientX - offset.x;
      const dy = e.clientY - offset.y;
      setTables((prev: any) =>
        prev.map((table: any, i: any) =>
          i === dragging ? { ...table, x: dx, y: dy } : table,
        ),
      );
    }
  };

  const releaseTable = () => {
    setDragging(-1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <svg
      className="w-full h-full cursor-grab rounded-3xl bg-white transition-all duration-200"
      onPointerUp={(e) => e.isPrimary && releaseTable()}
      onPointerMove={(e) => e.isPrimary && moveTable(e)}
      onPointerLeave={(e) => e.isPrimary && releaseTable()}
    >
      <defs>
        <pattern
          id="pattern-circles"
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle
            id="pattern-circle"
            cx="4"
            cy="4"
            r="1"
            fill="#e5e7eb"
            className="transition-all duration-200"
          ></circle>
        </pattern>
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00000020"/>
        </filter>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#pattern-circles)"
      ></rect>
      <g
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
        filter="url(#drop-shadow)"
      >
        {diagram.relationships.map((r: any, i: any) => (
          <Relationship key={i} relationship={r} tables={tables} />
        ))}
        {tables.map((t: any, i: any) => (
          <Table key={i} table={t} grab={(e: any) => grabTable(e, i)} />
        ))}
      </g>
    </svg>
  );
}
