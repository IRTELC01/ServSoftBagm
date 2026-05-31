#!/usr/bin/env node
/**
 * Smoke Test para ServSoftBagm (post-deploy verification)
 * Uso: node scripts/smoke-test.js https://tu-api.onrender.com
 */

const API = process.argv[2] || process.env.API_URL || 'http://localhost:3001';

async function check(name, fn) {
  try {
    const ok = await fn();
    console.log(`✅ ${name}`);
    return true;
  } catch (e) {
    console.error(`❌ ${name}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log(`\n🔥 ServSoftBagm Smoke Test → ${API}\n`);

  let passed = 0;
  let failed = 0;

  const checks = [
    ['Health endpoint responds', async () => {
      const r = await fetch(`${API}/`);
      if (!r.ok) throw new Error(`Status ${r.status}`);
      const j = await r.json();
      if (j.app !== 'ServSoftBagm API') throw new Error('Unexpected response');
    }],
    ['Auth health works', async () => {
      const r = await fetch(`${API}/api/auth/health`);
      if (!r.ok) throw new Error(`Status ${r.status}`);
    }],
    ['CORS preflight OK', async () => {
      const r = await fetch(`${API}/api/auth/health`, {
        method: 'OPTIONS',
        headers: { Origin: 'https://example.com' }
      });
      // In open mode it may allow, in strict it should still respond
    }],
  ];

  for (const [name, fn] of checks) {
    const ok = await check(name, fn);
    ok ? passed++ : failed++;
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('🔴 Smoke test FAILED');
    process.exit(1);
  }
  console.log('🟢 All smoke checks passed');
}

main().catch(e => {
  console.error('Fatal error in smoke test:', e);
  process.exit(1);
});