import React, { useState, useMemo } from 'react';
import { Network, RotateCcw } from 'lucide-react';

export const IpSubnetCalculator: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.150');
  const [cidr, setCidr] = useState<number>(24);

  const calculations = useMemo(() => {
    // Validate IPv4
    const parts = ipAddress.split('.').map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return {
        isValid: false,
        message: 'Địa chỉ IP không hợp lệ. Vui lòng nhập định dạng 4 octet IPv4 (0-255).'
      };
    }

    const ipNum = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
    const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcardNum = (~maskNum) >>> 0;

    const netNum = (ipNum & maskNum) >>> 0;
    const bcastNum = (netNum | wildcardNum) >>> 0;

    const numToIp = (num: number) => {
      return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
      ].join('.');
    };

    const numToBinary = (num: number) => {
      return [
        ((num >>> 24) & 255).toString(2).padStart(8, '0'),
        ((num >>> 16) & 255).toString(2).padStart(8, '0'),
        ((num >>> 8) & 255).toString(2).padStart(8, '0'),
        (num & 255).toString(2).padStart(8, '0')
      ].join('.');
    };

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

    const firstUsable = cidr >= 31 ? netNum : netNum + 1;
    const lastUsable = cidr >= 31 ? bcastNum : bcastNum - 1;

    // IP Class
    let ipClass = 'Class C';
    if (parts[0] < 128) ipClass = 'Class A';
    else if (parts[0] < 192) ipClass = 'Class B';
    else if (parts[0] < 224) ipClass = 'Class C';
    else if (parts[0] < 240) ipClass = 'Class D (Multicast)';
    else ipClass = 'Class E (Experimental)';

    return {
      isValid: true,
      networkAddress: numToIp(netNum),
      broadcastAddress: numToIp(bcastNum),
      subnetMask: numToIp(maskNum),
      wildcardMask: numToIp(wildcardNum),
      firstUsableIp: numToIp(firstUsable),
      lastUsableIp: numToIp(lastUsable),
      totalHosts,
      usableHosts,
      ipClass,
      binaryIp: numToBinary(ipNum),
      binaryMask: numToBinary(maskNum)
    };
  }, [ipAddress, cidr]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">IP Subnet Calculator – Tính Toán Chia Mạng Con IPv4</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính địa chỉ mạng (Network ID), Broadcast, Subnet Mask, dải IP khả dụng và số host</p>
          </div>
        </div>
        <button
          id="subnet-reset-btn"
          onClick={() => { setIpAddress('192.168.1.150'); setCidr(24); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Địa chỉ IP & Tiền tố CIDR</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Địa chỉ IPv4</label>
            <input
              id="subnet-ip"
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value.trim())}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: 192.168.1.1"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Mặt nạ mạng con (CIDR Prefix)</span>
              <span className="text-blue-400 font-bold font-mono">/{cidr}</span>
            </div>
            <input
              id="subnet-cidr-slider"
              type="range"
              min={1}
              max={32}
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <select
              id="subnet-cidr-select"
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="w-full mt-2 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Array.from({ length: 32 }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c}>/{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {!calculations.isValid ? (
            <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm">
              {calculations.message}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Địa chỉ mạng (Network)</span>
                  <span className="text-lg font-bold text-blue-400 font-mono">{calculations.networkAddress}</span>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Quảng bá (Broadcast)</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">{calculations.broadcastAddress}</span>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Subnet Mask</span>
                  <span className="text-lg font-bold text-white font-mono">{calculations.subnetMask}</span>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Số Host sử dụng được</span>
                  <span className="text-lg font-bold text-white font-sans tabular-nums">
                    {calculations.usableHosts.toLocaleString()} / {calculations.totalHosts.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Dải IP khả dụng:</span>
                  <span className="font-mono text-white font-semibold">
                    {calculations.firstUsableIp} - {calculations.lastUsableIp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lớp địa chỉ (Class):</span>
                  <span className="font-mono text-white font-semibold">{calculations.ipClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wildcard Mask:</span>
                  <span className="font-mono text-white font-semibold">{calculations.wildcardMask}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
