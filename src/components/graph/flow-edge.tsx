"use client";

import { getStraightPath, useInternalNode, type EdgeProps } from "@xyflow/react";

/**
 * Floating edge that connects node centers (radial layout friendly) and renders
 * an animated "capital flow" — a dashed line plus a particle traveling from
 * source to target, with width/opacity encoding flow size + highlight state.
 */
export function FlowEdge({ id, source, target, data }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) return null;

  const sx = (sourceNode.internals.positionAbsolute.x ?? 0) + (sourceNode.measured.width ?? 0) / 2;
  const sy = (sourceNode.internals.positionAbsolute.y ?? 0) + (sourceNode.measured.height ?? 0) / 2;
  const tx = (targetNode.internals.positionAbsolute.x ?? 0) + (targetNode.measured.width ?? 0) / 2;
  const ty = (targetNode.internals.positionAbsolute.y ?? 0) + (targetNode.measured.height ?? 0) / 2;

  const [edgePath] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty });

  const d = (data ?? {}) as {
    width?: number;
    color?: string;
    highlight?: boolean;
    dim?: boolean;
    flowType?: string;
    landmark?: boolean;
  };
  const color = d.color ?? "#5d6877";
  const width = d.width ?? 1;
  const highlight = d.highlight;
  const dim = d.dim;
  const landmark = d.landmark;
  const opacity = highlight ? 0.95 : dim ? 0.04 : landmark ? 0.55 : 0.22;
  const strokeW = highlight ? width + 0.8 : landmark ? width + 0.5 : width;

  return (
    <g style={{ opacity }} className="transition-opacity duration-300">
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={d.flowType === "value-chain" && !landmark ? "2 6" : undefined}
        style={
          highlight || landmark
            ? { filter: `drop-shadow(0 0 ${landmark ? 6 : 4}px ${color})` }
            : undefined
        }
      />
      {(highlight || landmark) && (
        <circle r={width + 1.6} fill={color}>
          <animateMotion dur="1.6s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </g>
  );
}
