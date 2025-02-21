# Load Test Results

## Flow: User APIs

### 60 Seconds Metric Table: Performance metrics for 60-second test duration with varying arrival counts (50, 100, 150).

| Metric               | 50 Arrival Count (60s) | %       | 100 Arrival Count (60s) | %       | 150 Arrival Count (60s) | %       |
| -------------------- | ---------------------- | ------- | ----------------------- | ------- | ----------------------- | ------- |
| Total Requests       | 400                    | 100.00% | 800                     | 100.00% | 1,200                   | 100.00% |
| Successful (200+201) | 400 (350 + 50)         | 100.00% | 800 (700 + 100)         | 100.00% | 1,164 (1,032 + 132)     | 97.00%  |
| 4xx (Client Errors)  | 0                      | 0.00%   | 0                       | 0.00%   | 36                      | 3.00%   |
| 5xx (Server Errors)  | 0                      | 0.00%   | 0                       | 0.00%   | 0                       | 0.00%   |
| Timeouts             | 0                      | 0.00%   | 0                       | 0.00%   | 0                       | 0.00%   |
| Data Downloaded      | 206.8 KB               | -       | 413.6 KB                | -       | 621.876 KB              | -       |
| Request Rate         | 7/sec                  | -       | 13/sec                  | -       | 18/sec                  | -       |

---
