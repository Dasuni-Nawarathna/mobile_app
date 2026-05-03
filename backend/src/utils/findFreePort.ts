import net from 'net';

/**
 * Returns the first TCP port starting at `start` that can bind (released after probe).
 * Used in development when the preferred port is already taken (common on Windows with port 5000).
 */
export async function findFirstAvailablePort(
  start: number,
  maxAttempts = 24
): Promise<number> {
  const last = start + maxAttempts - 1;
  let port = start;

  while (port <= last) {
    const available = await new Promise<boolean>((resolve) => {
      const srv = net
        .createServer()
        .once('error', () => resolve(false))
        .once('listening', () => {
          srv.close(() => resolve(true));
        });
      srv.listen(port);
    });

    if (available) return port;

    console.warn(`⚠️  Port ${port} is already in use — trying ${port + 1}…`);
    port += 1;
  }

  throw new Error(`No free TCP port in range ${start}–${last}`);
}
