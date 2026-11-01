"use client";

import React, { useState } from "react";
import {
  Terminal,
  Play,
  RotateCcw,
  Activity,
} from "lucide-react";

interface AppWorkspaceProps {
  appStatus: "ONLINE" | "STANDBY" | "MAINTENANCE";
  onToggleStatus: () => void;
}

export const AppWorkspace: React.FC<AppWorkspaceProps> = ({
  appStatus,
  onToggleStatus,
}) => {
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM_INIT] app.jevkayden.tech container initialized in STANDBY mode.",
    "[DOCKER_ENGINE] Microservice sandbox ready at port :3003 (isolated).",
    "[RTL_COMPILER] Vivado 2024.1 toolchain hooked to WebAssembly target.",
    "[STATUS] Node is currently idling to conserve edge resources.",
  ]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Micro-apps module toggles
  const [modules, setModules] = useState([
    {
      id: "riscv-sim",
      name: "RISC-V 32I Single-Cycle Visualizer",
      status: "ENABLED",
      desc: "Trực quan hóa luồng dữ liệu thanh ghi PC, ALU và Data Memory.",
    },
    {
      id: "vcd-viewer",
      name: "Digital Waveform VCD Analyzer",
      status: "ENABLED",
      desc: "Trình đọc biểu đồ xung sóng tín hiệu số từ file mô phỏng GTKWave.",
    },
    {
      id: "i2c-decoder",
      name: "I2C / SPI Packet Frame Decoder",
      status: "STANDBY",
      desc: "Phân tích khung truyền thông cảm biến từ bộ phân tích logic.",
    },
    {
      id: "asm-converter",
      name: "Hex-to-Binary Machine Code Disassembler",
      status: "ENABLED",
      desc: "Chuyển đổi mã máy hex sang tập lệnh ASM chuẩn RV32I.",
    },
  ]);

  const runSimulation = (type: string) => {
    setIsSimulating(true);
    const newLogs = [...logs, `[EXEC] User triggered test run: ${type}...`];
    setLogs(newLogs);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[SYNTHESIS] Parsing Verilog AST for pipeline modules... OK`,
        `[TIMING] Setup slack: +2.14ns, Hold slack: +0.48ns. TIMING MET.`,
        `[WASM_CONTAINER] Target built successfully. Exit code: 0 [SUCCESS].`,
      ]);
      setIsSimulating(false);
    }, 1200);
  };

  const clearLogs = () => {
    setLogs(["[LOG_CLEARED] Terminal buffer reset."]);
  };

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "ENABLED" ? "STANDBY" : "ENABLED" }
          : m
      )
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#ece7df] p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6 overflow-y-auto">
      {/* Node Status Banner */}
      <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-black text-zinc-500 uppercase">
              NODE 03 // APP LAB
            </span>
            <span
              className={`px-2 py-0.5 font-mono text-[10px] font-black border ${
                appStatus === "ONLINE"
                  ? "bg-emerald-100 text-emerald-950 border-emerald-600"
                  : "bg-amber-100 text-amber-950 border-amber-600"
              }`}
            >
              {appStatus}
            </span>
          </div>
          <h1 className="font-sans font-black text-xl sm:text-2xl uppercase text-black">
            APP.JEVKAYDEN.TECH // STANDBY COMPILER & MICRO-APPS
          </h1>
          <p className="font-sans text-xs text-zinc-600 mt-1 max-w-2xl leading-relaxed">
            Phòng thí nghiệm ứng dụng vi mạch và công cụ phần cứng nhúng. Khi ở chế độ STANDBY,
            khách truy cập ngoài web sẽ thấy màn hình mô phỏng CRT và hộp thoại thông báo.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleStatus}
          className={`px-4 py-2.5 font-mono text-xs font-black uppercase border-2 border-black cursor-pointer shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
            appStatus === "ONLINE"
              ? "bg-amber-300 hover:bg-amber-400 text-black"
              : "bg-emerald-400 hover:bg-emerald-300 text-black"
          }`}
        >
          {appStatus === "ONLINE" ? "CHUYỂN SANG STANDBY ⏸" : "KÍCH HOẠT ONLINE ▶"}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs select-none">
        <div className="p-3 bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000]">
          <span className="text-zinc-500 text-[10px] block font-bold">CONTAINER MEMORY:</span>
          <span className="text-sm font-black text-black">128 MB / 512 MB</span>
        </div>
        <div className="p-3 bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000]">
          <span className="text-zinc-500 text-[10px] block font-bold">WASM COMPILER:</span>
          <span className="text-sm font-black text-emerald-700">STANDBY V2.4</span>
        </div>
        <div className="p-3 bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000]">
          <span className="text-zinc-500 text-[10px] block font-bold">ACTIVE PORT:</span>
          <span className="text-sm font-black text-black">:3003 (ROUTED)</span>
        </div>
        <div className="p-3 bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000]">
          <span className="text-zinc-500 text-[10px] block font-bold">EDGE PING:</span>
          <span className="text-sm font-black text-black">18 ms (HANOI)</span>
        </div>
      </div>

      {/* Terminal Simulator Console */}
      <div className="bg-zinc-950 border-4 border-black shadow-[6px_6px_0px_0px_#000] text-emerald-400 font-mono text-xs overflow-hidden flex flex-col">
        {/* Terminal Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-2.5 flex items-center justify-between text-[11px] text-zinc-300">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">
              VIVADO & WASM SIMULATOR TERMINAL [LOGS]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => runSimulation("RTL_TESTBENCH")}
              disabled={isSimulating}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer text-[10px] disabled:opacity-50"
            >
              <Play className="w-2.5 h-2.5 text-emerald-400" />
              <span>TEST RTL</span>
            </button>
            <button
              type="button"
              onClick={() => runSimulation("WASM_BUILD")}
              disabled={isSimulating}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer text-[10px] disabled:opacity-50"
            >
              <Activity className="w-2.5 h-2.5 text-sky-400" />
              <span>BUILD WASM</span>
            </button>
            <button
              type="button"
              onClick={clearLogs}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 cursor-pointer text-[10px]"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>XÓA</span>
            </button>
          </div>
        </div>

        {/* Terminal Screen */}
        <div className="p-4 space-y-1.5 max-h-[220px] overflow-y-auto leading-relaxed select-text">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-zinc-600 select-none">&gt;</span>
              <span
                className={
                  log.includes("SUCCESS") || log.includes("OK")
                    ? "text-emerald-300 font-bold"
                    : log.includes("STANDBY")
                    ? "text-amber-300"
                    : "text-zinc-300"
                }
              >
                {log}
              </span>
            </div>
          ))}
          {isSimulating && (
            <div className="flex items-center gap-2 text-amber-300 animate-pulse">
              <span>&gt; Processing simulation vector matrix...</span>
            </div>
          )}
        </div>
      </div>

      {/* Micro-Apps Module Registry */}
      <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <div>
            <h2 className="font-sans font-black text-base uppercase text-black">
              DANH MỤC MICRO-APPS DỰ KIẾN (APP LAB REGISTRY)
            </h2>
            <p className="font-sans text-xs text-zinc-600 mt-0.5">
              Cấu hình các module phần cứng tương tác trong phòng thí nghiệm trực tuyến.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => (
            <div
              key={m.id}
              className="p-3.5 border-2 border-black bg-zinc-50 flex flex-col justify-between shadow-[2px_2px_0px_0px_#000]"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-sans font-bold text-sm text-black">{m.name}</h3>
                  <span
                    className={`px-2 py-0.5 font-mono text-[9px] font-black border ${
                      m.status === "ENABLED"
                        ? "bg-emerald-100 text-emerald-950 border-emerald-600"
                        : "bg-zinc-200 text-zinc-700 border-zinc-400"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <p className="font-sans text-xs text-zinc-600 leading-relaxed mb-3">{m.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleModule(m.id)}
                className="self-start px-2.5 py-1 text-[11px] font-mono font-bold border border-black bg-white hover:bg-zinc-100 cursor-pointer"
              >
                {m.status === "ENABLED" ? "CHUYỂN SANG TẠM DỪNG" : "KÍCH HOẠT LẠI"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
