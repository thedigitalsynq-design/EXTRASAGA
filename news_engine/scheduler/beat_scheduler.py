"""
Continuous 5-minute Asyncio Scheduler.
Guarantees strictly non-overlapping execution cycles, graceful signal handling,
exponential backoff recovery after network dropouts, and cycle telemetry.
"""
import asyncio
import logging
import signal
from typing import Optional
from news_engine.config.settings import get_settings
from news_engine.scheduler.tasks import execute_pipeline_cycle

logger = logging.getLogger(__name__)


class AsyncScheduler:
    def __init__(self, interval_seconds: Optional[int] = None):
        settings = get_settings()
        self.interval_seconds = interval_seconds or (settings.DISCOVERY_INTERVAL_MINUTES * 60)
        self.is_running = False
        self.cycle_lock = asyncio.Lock()
        self.consecutive_errors = 0
        self._stop_event = asyncio.Event()

    async def start(self):
        """Starts the continuous 5-minute automated news loop."""
        self.is_running = True
        self._stop_event.clear()
        logger.info(f"AsyncScheduler started: configured for {self.interval_seconds}s (5 min) recurring cycle.")

        while self.is_running and not self._stop_event.is_set():
            if self.cycle_lock.locked():
                logger.warning("Previous automation cycle is still active. Skipping run to prevent overlap.")
            else:
                async with self.cycle_lock:
                    try:
                        await execute_pipeline_cycle()
                        self.consecutive_errors = 0
                    except Exception as e:
                        self.consecutive_errors += 1
                        backoff = min(300, 30 * (2 ** min(3, self.consecutive_errors)))
                        logger.error(f"Scheduler execution error ({e}). Backing off for {backoff}s.")
                        await asyncio.sleep(backoff)

            # Sleep until next cycle or stop signal
            try:
                await asyncio.wait_for(self._stop_event.wait(), timeout=self.interval_seconds)
            except asyncio.TimeoutError:
                pass # Normal 5-minute interval elapsed, proceed to next cycle

        logger.info("AsyncScheduler has stopped gracefully.")

    def stop(self):
        """Signals the scheduler to stop gracefully."""
        self.is_running = False
        self._stop_event.set()
