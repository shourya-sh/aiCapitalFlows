"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  type Edge,
  type Node,
  type OnNodesChange,
} from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { EntityNode } from "./entity-node";
import { FlowEdge } from "./flow-edge";
import { CopilotPanel } from "./copilot-panel";
import { SECTOR_LIST } from "@/lib/sectors";
import { getEntityDetail } from "@/lib/data/detail";
import { landmarkKey, landmarkLabel, landmarksForTier } from "@/lib/data/landmark-deals";
import {
  filterGraphByComplexity,
  type MapComplexity,
} from "@/lib/metrics/graph-complexity";
import type { GraphEdge, GraphNode } from "@/lib/metrics/graph";
import type { Sector } from "@/lib/types";
import { cn } from "@/lib/utils";

const nodeTypes = { entity: EntityNode };
const MemoFlowEdge = memo(FlowEdge);
const edgeTypes = { flow: MemoFlowEdge };

interface NetworkGraphProps {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  complexity: MapComplexity;
  onGraphStats?: (stats: {
    visibleNodes: number;
    visibleEdges: number;
    totalNodes: number;
    totalEdges: number;
  }) => void;
}

function InnerGraph({ graphNodes, graphEdges, complexity, onGraphStats }: NetworkGraphProps) {
  const filtered = useMemo(
    () => filterGraphByComplexity(graphNodes, graphEdges, complexity),
    [graphNodes, graphEdges, complexity]
  );
  const landmarkKeys = useMemo(() => landmarksForTier(complexity), [complexity]);

  useEffect(() => {
    onGraphStats?.({
      visibleNodes: filtered.stats.nodeCount,
      visibleEdges: filtered.stats.edgeCount,
      totalNodes: filtered.stats.totalNodes,
      totalEdges: filtered.stats.totalEdges,
    });
  }, [filtered.stats, onGraphStats]);

  const colorById = useMemo(
    () => new Map(filtered.nodes.map((n) => [n.id, n.color])),
    [filtered.nodes]
  );
  const metaById = useMemo(
    () => new Map(filtered.nodes.map((n) => [n.id, { sector: n.sector, label: n.name }])),
    [filtered.nodes]
  );

  const [search, setSearch] = useState("");
  const [activeSectors, setActiveSectors] = useState<Set<Sector>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const neighbors = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const set = new Set<string>();
    for (const e of filtered.edges) {
      if (e.source === selectedId) set.add(e.target);
      if (e.target === selectedId) set.add(e.source);
    }
    return set;
  }, [selectedId, filtered.edges]);

  const q = search.trim().toLowerCase();
  const sectorActive = useCallback(
    (s: Sector) => activeSectors.size === 0 || activeSectors.has(s),
    [activeSectors]
  );
  const baseVisible = useCallback(
    (n: { sector: Sector; label: string }) =>
      sectorActive(n.sector) && (q ? n.label.toLowerCase().includes(q) : true),
    [sectorActive, q]
  );

  const displayNodes: Node[] = useMemo(
    () =>
      filtered.nodes.map((n) => {
        let dim = false;
        let highlight = false;
        const isSelected = n.id === selectedId;
        if (selectedId) {
          const inFocus = isSelected || neighbors.has(n.id);
          dim = !inFocus;
          highlight = inFocus && !isSelected;
        } else {
          const visible = baseVisible({ sector: n.sector, label: n.name });
          dim = !visible;
          highlight = !!q && visible;
        }
        return {
          id: n.id,
          type: "entity",
          position: { x: n.x, y: n.y },
          data: {
            label: n.name,
            color: n.color,
            size: n.size,
            sector: n.sector,
            logo: n.logo,
            logoFallback: n.logoFallback,
            dim,
            highlight,
            selected: isSelected,
          },
          draggable: true,
        };
      }),
    [filtered.nodes, selectedId, neighbors, baseVisible, q]
  );

  const displayEdges: Edge[] = useMemo(
    () =>
      filtered.edges.map((e) => {
        let hidden = false;
        let highlight = false;
        let dim = false;
        if (selectedId) {
          const connected = e.source === selectedId || e.target === selectedId;
          hidden = !connected;
          highlight = connected;
        } else {
          const sNode = metaById.get(e.source);
          const tNode = metaById.get(e.target);
          const ends = sNode && tNode ? baseVisible(sNode) && baseVisible(tNode) : true;
          hidden = !ends;
          dim = !!q;
        }
        const isLandmark = landmarkKeys.has(landmarkKey(e.source, e.target));
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: "flow",
          hidden,
          data: {
            width: e.width,
            color: isLandmark ? "#f5b301" : colorById.get(e.source) ?? "#5d6877",
            flowType: e.type,
            highlight,
            dim: dim && !isLandmark,
            landmark: isLandmark,
            landmarkLabel: isLandmark ? landmarkLabel(e.source, e.target) : undefined,
          },
        };
      }),
    [filtered.edges, selectedId, metaById, baseVisible, colorById, q, landmarkKeys]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(displayNodes);

  // Sync layout positions when complexity changes; preserve user drags otherwise.
  const onNodesChangeWrapped: OnNodesChange = useCallback(
    (changes) => onNodesChange(changes),
    [onNodesChange]
  );

  useEffect(() => {
    setNodes(displayNodes);
  }, [displayNodes, setNodes]);

  const toggleSector = useCallback((s: Sector) => {
    setActiveSectors((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }, []);

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedId(node.id);
  }, []);

  const detail = selectedId ? getEntityDetail(selectedId) : null;
  const showMiniMap = complexity !== "complete";

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={displayEdges}
        onNodesChange={onNodesChangeWrapped}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedId(null)}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 0.95 }}
        minZoom={0.08}
        maxZoom={2.5}
        onlyRenderVisibleElements
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "flow" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(255,255,255,0.05)" />
        <Controls className="!bottom-6 !left-6" showInteractive={false} />
        {showMiniMap && (
          <MiniMap
            pannable
            zoomable
            className="!bottom-6 !right-6"
            maskColor="rgba(6,8,13,0.7)"
            nodeColor={(n) => (n.data as { color?: string }).color ?? "#38bdf8"}
            nodeStrokeWidth={0}
          />
        )}
      </ReactFlow>

      {/* Top controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className="glass-strong flex items-center gap-2 rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-muted-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entities…"
              className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-2 sm:w-56"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-2 hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {(activeSectors.size > 0 || search || selectedId) && (
            <button
              onClick={() => {
                setActiveSectors(new Set());
                setSearch("");
                setSelectedId(null);
              }}
              className="glass-strong rounded-xl px-3 py-2 text-xs font-medium text-muted hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>

        <div className="pointer-events-auto flex max-w-2xl flex-wrap gap-1.5">
          {SECTOR_LIST.map((s) => {
            const active = activeSectors.size === 0 || activeSectors.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSector(s.id)}
                className={cn(
                  "glass flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all",
                  active ? "opacity-100" : "opacity-40"
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ x: 460, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 460, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute right-0 top-0 z-20 h-full w-full max-w-[440px] border-l border-[var(--border-strong)] bg-[var(--background-elevated)]/95 backdrop-blur-2xl"
          >
            <CopilotPanel detail={detail} onSelect={(id) => setSelectedId(id)} onClose={() => setSelectedId(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NetworkGraph(props: NetworkGraphProps) {
  return (
    <ReactFlowProvider>
      <InnerGraph {...props} />
    </ReactFlowProvider>
  );
}
