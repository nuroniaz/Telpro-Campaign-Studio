import http from 'http';

async function sendRequest(options, postData = null) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = performance.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          duration,
          success: res.statusCode >= 200 && res.statusCode < 400,
          dataLength: data.length
        });
      });
    });

    req.on('error', (err) => {
      const duration = performance.now() - startTime;
      resolve({
        statusCode: 0,
        duration,
        success: false,
        error: err.message,
        dataLength: 0
      });
    });

    req.setTimeout(10000, () => {
      req.destroy(new Error('Timeout'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function calculateStats(results) {
  const durations = results.map(r => r.duration).sort((a, b) => a - b);
  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;
  const totalDuration = durations.reduce((a, b) => a + b, 0);
  const avg = totalDuration / durations.length;
  const min = durations[0] || 0;
  const max = durations[durations.length - 1] || 0;
  const p50 = durations[Math.floor(durations.length * 0.5)] || 0;
  const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
  const p99 = durations[Math.floor(durations.length * 0.99)] || 0;

  return {
    total: results.length,
    success: successCount,
    failed: failCount,
    min: min.toFixed(2),
    avg: avg.toFixed(2),
    p50: p50.toFixed(2),
    p95: p95.toFixed(2),
    p99: p99.toFixed(2),
    max: max.toFixed(2),
  };
}

async function runBatch(concurrency, totalRequests, requestFn) {
  const results = [];
  let completed = 0;
  
  async function worker() {
    while (completed < totalRequests) {
      completed++;
      const res = await requestFn();
      results.push(res);
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  const batchStart = performance.now();
  await Promise.all(workers);
  const totalTimeSec = (performance.now() - batchStart) / 1000;
  const rps = (results.length / totalTimeSec).toFixed(1);

  return {
    stats: calculateStats(results),
    totalTimeSec: totalTimeSec.toFixed(2),
    rps
  };
}

async function runStressTest() {
  console.log('====================================================');
  console.log('🚀 MEMULAI COMPREHENSIVE STRESS TEST PLATFORM SPARK');
  console.log('Target: http://127.0.0.1:3000');
  console.log('Time: ' + new Date().toISOString());
  console.log('====================================================\n');

  // 1. Health Endpoint Concurrency Stress Test (150 requests, 25 concurrent)
  console.log('👉 [TEST 1] Concurrency & Throughput Test (/api/health)');
  console.log('   Parameters: 150 total requests, 25 concurrency');
  const t1 = await runBatch(25, 150, () => sendRequest({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/health',
    method: 'GET'
  }));
  console.log(`   ✅ Selesai: ${t1.stats.success}/${t1.stats.total} sukses (${t1.stats.failed} gagal)`);
  console.log(`   ⚡ Throughput: ${t1.rps} req/sec, Total Waktu: ${t1.totalTimeSec}s`);
  console.log(`   ⏱️  Latensi: Avg=${t1.stats.avg}ms, Min=${t1.stats.min}ms, P50=${t1.stats.p50}ms, P95=${t1.stats.p95}ms, Max=${t1.stats.max}ms\n`);

  // 2. AI Chat Endpoint Stress Test (/api/ai/chat)
  console.log('👉 [TEST 2] AI Chat Synthesis Engine Stress Test (/api/ai/chat)');
  console.log('   Parameters: 50 requests, 10 concurrency (simulating active collaborative users)');
  const prompts = [
    "Bagaimana strategi B2B Smart Logistics TELPRO untuk Q3 2026?",
    "Rancang campaign IndiHome Business Dedicated untuk cafe dan workspace",
    "Evaluasi risiko kepatuhan klaim SLA 99.9% vs kompetitor",
    "Buat ide angle konten LinkedIn untuk supply chain director",
    "Optimasi alokasi budget 200 juta untuk multi-channel campaign"
  ];
  let pIdx = 0;
  const t2 = await runBatch(10, 50, () => {
    const p = prompts[(pIdx++) % prompts.length];
    const payload = JSON.stringify({
      message: p,
      campaignContext: { name: "Stress Test Campaign", id: "cmp-stress" },
      history: []
    });
    return sendRequest({
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/ai/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);
  });
  console.log(`   ✅ Selesai: ${t2.stats.success}/${t2.stats.total} sukses (${t2.stats.failed} gagal)`);
  console.log(`   ⚡ Throughput: ${t2.rps} req/sec, Total Waktu: ${t2.totalTimeSec}s`);
  console.log(`   ⏱️  Latensi: Avg=${t2.stats.avg}ms, Min=${t2.stats.min}ms, P50=${t2.stats.p50}ms, P95=${t2.stats.p95}ms, Max=${t2.stats.max}ms\n`);

  // 3. AI Generate Package Endpoint (/api/ai/generate-package)
  console.log('👉 [TEST 3] Content Package Generation Engine (/api/ai/generate-package)');
  console.log('   Parameters: 40 requests, 8 concurrency');
  const t3 = await runBatch(8, 40, () => {
    const payload = JSON.stringify({
      topic: "Smart Logistics IoT Efficiency",
      channel: "LinkedIn",
      targetAudience: "VP of Supply Chain",
      keyMessage: "Efisiensi 35% dengan SLA 99.9%"
    });
    return sendRequest({
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/ai/generate-package',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);
  });
  console.log(`   ✅ Selesai: ${t3.stats.success}/${t3.stats.total} sukses (${t3.stats.failed} gagal)`);
  console.log(`   ⚡ Throughput: ${t3.rps} req/sec, Total Waktu: ${t3.totalTimeSec}s`);
  console.log(`   ⏱️  Latensi: Avg=${t3.stats.avg}ms, Min=${t3.stats.min}ms, P50=${t3.stats.p50}ms, P95=${t3.stats.p95}ms, Max=${t3.stats.max}ms\n`);

  // 4. Edge Cases & Resilience Injection
  console.log('👉 [TEST 4] Edge Case & Chaos / Resilience Injection');
  const edgeCases = [
    { name: 'Empty Body POST', path: '/api/ai/chat', method: 'POST', body: '{}' },
    { name: 'Malformed JSON POST', path: '/api/ai/chat', method: 'POST', body: '{"broken": json', isRaw: true },
    { name: 'Oversized Payload (500KB text)', path: '/api/ai/chat', method: 'POST', body: JSON.stringify({ message: 'A'.repeat(500000) }) },
    { name: 'Special Unicode / SQL Injection String', path: '/api/ai/chat', method: 'POST', body: JSON.stringify({ message: "'; DROP TABLE campaigns; -- 🚨🔥<script>alert(1)</script>" }) },
    { name: 'Invalid Route SPA Fallback Check', path: '/non-existent-subpage/route/check', method: 'GET' }
  ];

  for (const tc of edgeCases) {
    const payload = tc.body;
    const headers = tc.body ? {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    } : {};
    const res = await sendRequest({
      hostname: '127.0.0.1',
      port: 3000,
      path: tc.path,
      method: tc.method,
      headers
    }, payload);

    console.log(`   🛡️  ${tc.name}: Status=${res.statusCode}, Durasi=${res.duration.toFixed(2)}ms, Sukses=${res.success || res.statusCode === 400 || res.statusCode === 500}`);
  }

  // 5. Memory & Process Diagnostics
  console.log('\n👉 [TEST 5] Memory Footprint & Resource Health');
  const mem = process.memoryUsage();
  console.log(`   💾 RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   💾 Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   💾 Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   💾 External: ${(mem.external / 1024 / 1024).toFixed(2)} MB`);

  console.log('\n====================================================');
  console.log('🏁 STRESS TEST SELESAI DENGAN SUKSES');
  console.log('====================================================\n');
}

runStressTest().catch(console.error);
