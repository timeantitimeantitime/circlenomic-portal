const daemon = require('./daemon');
const blockMonitor = require('./blockMonitor');
const ubi = require('./ubi');
const api = require('./api');
const config = require('./config');

async function main() {
  console.log('=== Circlenomic Portal v1.0.0 ===');
  console.log('Network Society Infrastructure');

  console.log('[1/4] Starting ravend daemon...');
  const startResult = await daemon.start();
  console.log(`  → ${startResult.status}`);

  console.log('[2/4] Starting block monitor...');
  blockMonitor.on('block', async (data) => {
    try {
      await ubi.processBlock(data);
    } catch (e) {
      console.error(`[main] UBI processing error: ${e.message}`);
    }
  });
  await blockMonitor.start();

  console.log('[3/4] Starting API server...');
  const server = api.listen(config.api.port, () => {
    console.log(`  → API running on http://localhost:${config.api.port}`);
  });

  console.log('[4/4] Circlenomic Portal ready!');
  console.log('');
  console.log('Addresses:');
  for (const [label, addr] of Object.entries(config.addresses)) {
    console.log(`  ${label}: ${addr}`);
  }
  console.log('');
  console.log('API Endpoints:');
  console.log(`  GET  /api/status       - System status`);
  console.log(`  GET  /api/blockchain   - Blockchain info`);
  console.log(`  GET  /api/balances     - Pool balances`);
  console.log(`  GET  /api/ubi/history  - UBI distribution history`);
  console.log(`  GET  /api/ubi/config   - UBI configuration`);
  console.log(`  POST /api/mine         - Mine blocks (regtest)`);
  console.log(`  GET  /api/education    - Education tasks`);
  console.log(`  GET  /api/governance   - Governance info`);
  console.log(`  GET  /api/marketplace  - Marketplace listings`);
  console.log('');

  const shutdown = async () => {
    console.log('\nShutting down...');
    blockMonitor.stop();
    server.close();
    await daemon.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
