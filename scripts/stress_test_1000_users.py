import asyncio
import time
import json
import statistics
import random

HOST = "127.0.0.1"
PORT = 3005
TOTAL_USERS = 1000
MAX_CONCURRENT_USERS = 250  # 250 concurrent active virtual users in flight at any microsecond

class VirtualUserSession:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.reader = None
        self.writer = None

    async def ensure_connection(self):
        if self.writer is None or self.writer.is_closing():
            self.reader, self.writer = await asyncio.wait_for(
                asyncio.open_connection(self.host, self.port), timeout=8.0
            )

    async def request(self, method, path, body=None, headers=None):
        if headers is None:
            headers = {}
        headers["Host"] = f"{self.host}:{self.port}"
        headers["Connection"] = "keep-alive"
        headers["User-Agent"] = "TaskPulse-StressVU/1.0"
        
        body_bytes = body.encode("utf-8") if isinstance(body, str) else (body or b"")
        if body_bytes:
            headers["Content-Type"] = "application/json"
            headers["Content-Length"] = str(len(body_bytes))

        req_lines = [f"{method} {path} HTTP/1.1"]
        for k, v in headers.items():
            req_lines.append(f"{k}: {v}")
        req_lines.append("")
        req_lines.append("")
        head_bytes = "\r\n".join(req_lines).encode("utf-8")
        full_packet = head_bytes + body_bytes

        start = time.perf_counter()
        status_code = None
        error = None

        try:
            await self.ensure_connection()
            self.writer.write(full_packet)
            await self.writer.drain()

            # Read response header
            header_data = b""
            while b"\r\n\r\n" not in header_data:
                chunk = await asyncio.wait_for(self.reader.read(2048), timeout=8.0)
                if not chunk:
                    break
                header_data += chunk

            if header_data:
                first_line = header_data.split(b"\r\n")[0].decode("latin-1", errors="ignore")
                parts = first_line.split(" ")
                if len(parts) >= 2 and parts[1].isdigit():
                    status_code = int(parts[1])

                # Parse Content-Length or Chunked to drain body from stream
                content_len = 0
                is_chunked = False
                for line in header_data.split(b"\r\n")[1:]:
                    if not line:
                        break
                    lower = line.lower()
                    if lower.startswith(b"content-length:"):
                        try:
                            content_len = int(line.split(b":", 1)[1].strip())
                        except Exception:
                            pass
                    elif lower.startswith(b"transfer-encoding:") and b"chunked" in lower:
                        is_chunked = True

                head_sep = header_data.find(b"\r\n\r\n")
                body_already_read = len(header_data) - (head_sep + 4)

                if content_len > 0:
                    remaining = content_len - body_already_read
                    while remaining > 0:
                        chunk = await asyncio.wait_for(self.reader.read(min(remaining, 4096)), timeout=5.0)
                        if not chunk:
                            break
                        remaining -= len(chunk)
                elif is_chunked:
                    # In keep-alive chunked, drain until terminal 0 chunk or reset connection
                    self.close()

        except Exception as e:
            error = f"{type(e).__name__}: {e}"
            status_code = 0
            self.close()

        elapsed_ms = (time.perf_counter() - start) * 1000.0
        return {
            "method": method,
            "path": path,
            "status": status_code,
            "latency_ms": elapsed_ms,
            "error": error
        }

    def close(self):
        if self.writer:
            try:
                self.writer.close()
            except Exception:
                pass
            self.writer = None
            self.reader = None

async def run_user_session(user_id, sem, stagger):
    await asyncio.sleep(stagger)
    async with sem:
        session = VirtualUserSession(HOST, PORT)
        results = []
        try:
            if user_id <= 500:
                # 500 Browsers: Landing -> Projects -> Login
                r1 = await session.request("GET", "/")
                results.append(r1)
                await asyncio.sleep(random.uniform(0.02, 0.08))

                r2 = await session.request("GET", "/api/projects")
                results.append(r2)
                await asyncio.sleep(random.uniform(0.02, 0.08))

                r3 = await session.request("GET", "/login")
                results.append(r3)

            elif user_id <= 850:
                # 350 Engineers: Load Tasks -> Toggle/Update -> Re-sync
                r1 = await session.request("GET", "/api/tasks")
                results.append(r1)
                await asyncio.sleep(random.uniform(0.02, 0.08))

                payload = json.dumps({
                    "id": f"task-stress-{user_id % 20}",
                    "title": f"Sprint item VU-{user_id}",
                    "status": "in_progress",
                    "progress": random.randint(20, 80)
                })
                r2 = await session.request("POST", "/api/tasks", body=payload)
                results.append(r2)
                await asyncio.sleep(random.uniform(0.02, 0.08))

                r3 = await session.request("GET", "/api/tasks")
                results.append(r3)

            else:
                # 150 Admins: Subscriptions -> Quote Submission -> Create Milestone
                r1 = await session.request("GET", "/api/subscriptions")
                results.append(r1)
                await asyncio.sleep(random.uniform(0.02, 0.08))

                quote_body = json.dumps({
                    "companyName": f"Enterprise Org {user_id}",
                    "contactName": f"Director {user_id}",
                    "contactEmail": f"director_{user_id}@cloudscale.io",
                    "teamSize": 75,
                    "estimatedSeats": 75,
                    "requirements": "SAML SSO, Audit Log, 99.99% SLA"
                })
                r2 = await session.request("POST", "/api/quotes", body=quote_body)
                results.append(r2)
                await asyncio.sleep(random.uniform(0.02, 0.08))

                task_body = json.dumps({
                    "id": f"admin-milestone-{user_id}",
                    "title": f"Security Review Sign-off {user_id}",
                    "status": "todo",
                    "priority": "critical"
                })
                r3 = await session.request("POST", "/api/tasks", body=task_body)
                results.append(r3)
        finally:
            session.close()

        return {"user_id": user_id, "requests": results}

async def main():
    print("=" * 60)
    print("      TASKPULSE 1,000 CONCURRENT USERS STRESS TEST (V2)")
    print(f"      Target Host:        http://{HOST}:{PORT}")
    print(f"      Virtual Users (VUs):{TOTAL_USERS}")
    print(f"      Active Socket Pool: {MAX_CONCURRENT_USERS} max concurrent VUs")
    print("=" * 60)

    sem = asyncio.Semaphore(MAX_CONCURRENT_USERS)
    wall_start = time.perf_counter()

    tasks = [
        run_user_session(uid + 1, sem, random.uniform(0.0, 2.5))
        for uid in range(TOTAL_USERS)
    ]

    print(f"[*] Ramping up {TOTAL_USERS} virtual users across 3 realistic personas...")
    user_results = await asyncio.gather(*tasks)
    total_time = time.perf_counter() - wall_start

    all_reqs = []
    for u in user_results:
        all_reqs.extend(u["requests"])

    total = len(all_reqs)
    success = [r for r in all_reqs if r["status"] in (200, 201, 204)]
    client_err = [r for r in all_reqs if 400 <= (r["status"] or 0) < 500]
    server_err = [r for r in all_reqs if (r["status"] or 0) >= 500 or r["status"] == 0]

    latencies = sorted([r["latency_ms"] for r in all_reqs])
    p50 = statistics.median(latencies) if latencies else 0
    p90 = latencies[int(len(latencies) * 0.90)] if latencies else 0
    p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0
    p99 = latencies[int(len(latencies) * 0.99)] if latencies else 0
    min_lat = min(latencies) if latencies else 0
    max_lat = max(latencies) if latencies else 0
    avg_lat = statistics.mean(latencies) if latencies else 0
    rps = total / total_time if total_time > 0 else 0

    print("\n" + "=" * 60)
    print("                    STRESS TEST REPORT                  ")
    print("=" * 60)
    print(f"  Test Duration:              {total_time:.2f} seconds")
    print(f"  Completed Virtual Users:    {len(user_results)} / {TOTAL_USERS} (100.0%)")
    print(f"  Total Requests Generated:   {total}")
    print(f"  Successful Requests (2xx):  {len(success)} ({len(success)/total*100:.1f}%)")
    print(f"  Client Errors (4xx):        {len(client_err)} ({len(client_err)/total*100:.1f}%)")
    print(f"  Server / Network Errors:    {len(server_err)} ({len(server_err)/total*100:.1f}%)")
    print(f"  Average Throughput:         {rps:.1f} req/sec")
    print("-" * 60)
    print("                    LATENCY PROFILE                     ")
    print("-" * 60)
    print(f"  Minimum Latency:            {min_lat:.2f} ms")
    print(f"  Average Latency:            {avg_lat:.2f} ms")
    print(f"  Median (p50):               {p50:.2f} ms")
    print(f"  90th Percentile (p90):      {p90:.2f} ms")
    print(f"  95th Percentile (p95):      {p95:.2f} ms")
    print(f"  99th Percentile (p99):      {p99:.2f} ms")
    print(f"  Max Latency:                {max_lat:.2f} ms")
    print("-" * 60)
    print("                PER-ENDPOINT BREAKDOWN                  ")
    print("-" * 60)

    by_ep = {}
    for r in all_reqs:
        key = f"{r['method']} {r['path']}"
        by_ep.setdefault(key, []).append(r)

    print(f"  {'Endpoint':<25} | {'Count':<6} | {'p50(ms)':<8} | {'p95(ms)':<8} | {'p99(ms)':<8} | {'Pass%':<6}")
    print(f"  {'-'*25}-+-{'-'*6}-+-{'-'*8}-+-{'-'*8}-+-{'-'*8}-+-{'-'*6}")
    for ep, reqs in sorted(by_ep.items()):
        elats = sorted([x["latency_ms"] for x in reqs])
        ep_p50 = statistics.median(elats)
        ep_p95 = elats[int(len(elats) * 0.95)]
        ep_p99 = elats[int(len(elats) * 0.99)]
        ep_pass = len([x for x in reqs if x["status"] in (200, 201, 204)])
        pass_pct = (ep_pass / len(reqs)) * 100
        print(f"  {ep:<25} | {len(reqs):<6} | {ep_p50:<8.1f} | {ep_p95:<8.1f} | {ep_p99:<8.1f} | {pass_pct:<5.1f}%")

    print("=" * 60 + "\n")

    summary = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_users": TOTAL_USERS,
        "total_requests": total,
        "duration_sec": round(total_time, 2),
        "rps": round(rps, 1),
        "success_rate_pct": round(len(success) / total * 100, 2),
        "latencies": {
            "min_ms": round(min_lat, 2),
            "avg_ms": round(avg_lat, 2),
            "p50_ms": round(p50, 2),
            "p90_ms": round(p90, 2),
            "p95_ms": round(p95, 2),
            "p99_ms": round(p99, 2),
            "max_ms": round(max_lat, 2),
        },
        "endpoints": {
            ep: {
                "count": len(reqs),
                "p50_ms": round(statistics.median([x["latency_ms"] for x in reqs]), 1),
                "p95_ms": round(sorted([x["latency_ms"] for x in reqs])[int(len(reqs) * 0.95)], 1),
                "p99_ms": round(sorted([x["latency_ms"] for x in reqs])[int(len(reqs) * 0.99)], 1),
                "pass_rate_pct": round(len([x for x in reqs if x["status"] in (200, 201, 204)]) / len(reqs) * 100, 1),
            }
            for ep, reqs in sorted(by_ep.items())
        }
    }

    with open("c:/Users/THINK PAD/Documents/antigravity/TaskPulse_Transfer_Package/codebase/stress_test_report_v2.json", "w") as f:
        json.dump(summary, f, indent=2)
    print("[✓] Report successfully written to stress_test_report_v2.json")

if __name__ == "__main__":
    asyncio.run(main())
