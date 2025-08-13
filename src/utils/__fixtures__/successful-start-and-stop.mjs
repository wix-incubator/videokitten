process.stderr.write(String.raw`Ready to be stopped\n`);

process.on('SIGINT', () => {
  console.log('Received SIGINT, exiting gracefully.');
  process.exit(0);
});

// Keep the process alive
setInterval(() => {}, 1000);
