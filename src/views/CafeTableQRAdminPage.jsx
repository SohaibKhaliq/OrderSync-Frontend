import React, { useState, useEffect, useRef } from "react";
import Page from "../components/Page";
import { col } from "../localdb/LocalDB";
import { FRONTEND_DOMAIN } from "../config/config";
import QRCode from "qrcode";
import {
  IconDownload,
  IconPrinter,
  IconQrcode,
  IconSearch,
  IconTableAlias,
} from "@tabler/icons-react";
import { iconStroke } from "../config/config";

function groupByFloor(tables) {
  return tables.reduce((acc, t) => {
    const floor = t.floor || "General";
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(t);
    return acc;
  }, {});
}

export default function CafeTableQRAdminPage() {
  const [tables, setTables] = useState([]);
  const [qrUrls, setQrUrls] = useState({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // table for big-preview modal

  useEffect(() => {
    const loaded = col("store_tables");
    setTables(loaded);

    // Generate QR for all tables
    const generate = async () => {
      const map = {};
      for (const t of loaded) {
        const url = `${FRONTEND_DOMAIN}/table/${t.id}`;
        map[t.id] = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: { dark: "#111111", light: "#ffffff" },
        });
      }
      setQrUrls(map);
    };
    generate();
  }, []);

  const handleDownload = (table) => {
    const dataUrl = qrUrls[table.id];
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `table-qr-${table.title.replace(/\s+/g, "-")}.png`;
    link.click();
  };

  const handlePrintSingle = (table) => {
    const dataUrl = qrUrls[table.id];
    if (!dataUrl) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>QR — ${table.title}</title>
      <style>
        body { font-family: sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; }
        img { width:280px; height:280px; }
        h2 { margin: 12px 0 4px; font-size:1.5rem; }
        p  { margin:0; color:#555; font-size:.9rem; }
      </style></head>
      <body onload="window.print();window.close()">
        <img src="${dataUrl}" alt="QR" />
        <h2>${table.title}</h2>
        <p>${table.floor} · ${table.seating_capacity} seats</p>
        <p style="margin-top:8px;font-size:.75rem;color:#aaa">${FRONTEND_DOMAIN}/table/${table.id}</p>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrintAll = () => {
    const visibleTables = filtered;
    const items = visibleTables
      .map(
        (t) =>
          `<div class="card">
            <img src="${qrUrls[t.id] || ""}" alt="QR" />
            <h2>${t.title}</h2>
            <p>${t.floor} · ${t.seating_capacity} seats</p>
          </div>`,
      )
      .join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>All Table QR Codes</title>
      <style>
        body { font-family: sans-serif; margin: 20px; }
        .grid { display:flex; flex-wrap:wrap; gap:24px; }
        .card { display:flex; flex-direction:column; align-items:center; border:1px solid #eee; border-radius:12px; padding:16px; width:200px; }
        .card img { width:180px; height:180px; }
        .card h2 { margin:8px 0 2px; font-size:1rem; }
        .card p  { margin:0; color:#555; font-size:.75rem; text-align:center; }
      </style></head>
      <body onload="window.print();window.close()">
        <h1 style="margin-bottom:20px;">Table QR Codes</h1>
        <div class="grid">${items}</div>
      </body></html>
    `);
    win.document.close();
  };

  const filtered = tables.filter(
    (t) =>
      !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.floor?.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = groupByFloor(filtered);

  return (
    <Page className="px-6 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-restro-green-dark">
            Table QR Codes
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Print or download QR codes for each cafe table
          </p>
        </div>
        <button
          onClick={handlePrintAll}
          className="btn btn-sm btn-primary gap-2"
        >
          <IconPrinter size={16} stroke={iconStroke} /> Print All QR Codes
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <IconSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          stroke={iconStroke}
        />
        <input
          type="text"
          placeholder="Search tables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered input-sm w-full pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <IconTableAlias
            size={48}
            stroke={1}
            className="mx-auto mb-3 opacity-30"
          />
          <p className="text-lg font-medium">No tables found</p>
          <p className="text-sm">Add tables in Settings → Tables first</p>
        </div>
      ) : (
        Object.entries(grouped).map(([floor, floorTables]) => (
          <div key={floor} className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-restro-green-dark inline-block" />
              {floor}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {floorTables.map((table) => (
                <div
                  key={table.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
                >
                  {/* QR image */}
                  {qrUrls[table.id] ? (
                    <img
                      src={qrUrls[table.id]}
                      alt={`QR ${table.title}`}
                      className="w-28 h-28 rounded-lg cursor-pointer"
                      onClick={() => setSelected(table)}
                      title="Click to enlarge"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="loading loading-spinner loading-sm text-gray-300" />
                    </div>
                  )}

                  {/* Table info */}
                  <div className="text-center">
                    <p className="font-bold text-restro-green-dark">
                      {table.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {table.seating_capacity} seats
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleDownload(table)}
                      className="btn btn-xs btn-outline flex-1 gap-1"
                      title="Download PNG"
                    >
                      <IconDownload size={12} stroke={iconStroke} /> Save
                    </button>
                    <button
                      onClick={() => handlePrintSingle(table)}
                      className="btn btn-xs btn-outline flex-1 gap-1"
                      title="Print"
                    >
                      <IconPrinter size={12} stroke={iconStroke} /> Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* QR preview modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <IconQrcode
              size={28}
              className="text-restro-green-dark"
              stroke={iconStroke}
            />
            <img
              src={qrUrls[selected.id]}
              alt={selected.title}
              className="w-64 h-64 rounded-xl"
            />
            <div className="text-center">
              <h3 className="text-xl font-bold text-restro-green-dark">
                {selected.title}
              </h3>
              <p className="text-sm text-gray-400">
                {selected.floor} · {selected.seating_capacity} seats
              </p>
              <p className="text-xs text-gray-300 mt-1 break-all">
                {FRONTEND_DOMAIN}/table/{selected.id}
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => handleDownload(selected)}
                className="btn btn-sm btn-outline flex-1 gap-1"
              >
                <IconDownload size={14} stroke={iconStroke} /> Download
              </button>
              <button
                onClick={() => handlePrintSingle(selected)}
                className="btn btn-sm btn-primary flex-1 gap-1"
              >
                <IconPrinter size={14} stroke={iconStroke} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
