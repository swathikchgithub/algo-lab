import type { Question } from "@/lib/types";

// Section 8: Graphs — Patterns 8.1 BFS and 8.2 DFS / Backtracking
export const graphsQuestions: Question[] = [
  {
    id: "number-of-islands",
    title: "Number of Islands",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "Given a 2D grid of '1' (land) and '0' (water), count the number of islands. An island is land connected horizontally or vertically.",
    examples: [
      {
        input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        output: "2",
        explanation: "The top-left blob is one island, the bottom-right cell is another.",
      },
      { input: 'grid = [["1","1","1"],["0","1","0"],["1","1","1"]]', output: "1" },
    ],
    constraints: ["1 <= m, n <= 300", "grid[i][j] is '0' or '1'"],
    eli5:
      "It's a map of dry patches in the ocean. Step on one dry square and flood-fill everything you can walk to — that whole patch is one island. Count how many fresh patches you start.",
    hints: [
      "Each time you find an unvisited land cell, that's a new island.",
      "From that cell, BFS/DFS to all connected land and mark it visited so you don't recount it.",
      "Sinking visited land in-place (set to '0') avoids a separate visited set.",
    ],
    approach:
      "Scan every cell. On an unvisited '1', increment the count and BFS outward, sinking each reached land cell to '0' so it's never revisited.",
    solutions: {
      python: `from collections import deque

def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                q = deque([(r, c)])
                grid[r][c] = '0'  # sink on enqueue
                while q:
                    x, y = q.popleft()
                    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == '1':
                            grid[nx][ny] = '0'
                            q.append((nx, ny))
    return count`,
      java: `import java.util.*;

class Solution {
    public int numIslands(char[][] grid) {
        if (grid.length == 0) return 0;
        int rows = grid.length, cols = grid[0].length;
        int count = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    Queue<int[]> q = new ArrayDeque<>();
                    q.offer(new int[]{r, c});
                    grid[r][c] = '0'; // sink on enqueue
                    while (!q.isEmpty()) {
                        int[] cell = q.poll();
                        int x = cell[0], y = cell[1];
                        for (int[] d : dirs) {
                            int nx = x + d[0], ny = y + d[1];
                            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] == '1') {
                                grid[nx][ny] = '0';
                                q.offer(new int[]{nx, ny});
                            }
                        }
                    }
                }
            }
        }
        return count;
    }
}`,
    },
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(min(m,n)) for the BFS queue",
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    leetcodeSlug: "number-of-islands",
  },
  {
    id: "max-area-of-island",
    title: "Max Area of Island",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "Given a binary grid, return the area (number of cells) of the largest island. Return 0 if there is none.",
    examples: [
      {
        input: "grid = [[0,1,0],[1,1,1],[0,1,0]]",
        output: "5",
        explanation: "The plus-shaped island has 5 cells.",
      },
      { input: "grid = [[0,0,0],[0,0,0]]", output: "0" },
    ],
    constraints: ["1 <= m, n <= 50", "grid[i][j] is 0 or 1"],
    eli5:
      "Same as counting islands, but instead of just tallying them you measure each patch's size by counting every square you flood, and remember the biggest.",
    hints: [
      "Flood-fill each island, counting cells as you go.",
      "Sink visited cells to 0 so they aren't counted twice.",
      "Track the maximum area across all flood-fills.",
    ],
    approach:
      "For each unvisited land cell, BFS the whole island, counting cells and sinking them. Keep the largest count seen.",
    solutions: {
      python: `from collections import deque

def max_area_of_island(grid):
    rows, cols = len(grid), len(grid[0])
    best = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                area = 0
                q = deque([(r, c)])
                grid[r][c] = 0
                while q:
                    x, y = q.popleft()
                    area += 1
                    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 1:
                            grid[nx][ny] = 0
                            q.append((nx, ny))
                best = max(best, area)
    return best`,
      java: `import java.util.*;

class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        int best = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1) {
                    int area = 0;
                    Queue<int[]> q = new ArrayDeque<>();
                    q.offer(new int[]{r, c});
                    grid[r][c] = 0;
                    while (!q.isEmpty()) {
                        int[] cell = q.poll();
                        int x = cell[0], y = cell[1];
                        area++;
                        for (int[] d : dirs) {
                            int nx = x + d[0], ny = y + d[1];
                            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] == 1) {
                                grid[nx][ny] = 0;
                                q.offer(new int[]{nx, ny});
                            }
                        }
                    }
                    best = Math.max(best, area);
                }
            }
        }
        return best;
    }
}`,
    },
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n) worst case for the queue",
    companies: ["Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "max-area-of-island",
  },
  {
    id: "flood-fill",
    title: "Flood Fill",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Easy",
    description:
      "Given an image grid, a starting pixel (sr, sc), and a new color, repaint the starting pixel and all 4-directionally connected pixels of the same original color.",
    examples: [
      {
        input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
        output: "[[2,2,2],[2,2,0],[2,0,1]]",
        explanation: "All pixels connected to (1,1) that shared color 1 become 2.",
      },
      { input: "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0", output: "[[0,0,0],[0,0,0]]" },
    ],
    constraints: ["1 <= m, n <= 50", "0 <= color, image[i][j] < 2^16", "0 <= sr < m", "0 <= sc < n"],
    eli5:
      "Like the paint-bucket tool. Click a pixel and the color spreads to every touching pixel of the same shade until it hits a different color.",
    hints: [
      "Remember the original color of the start pixel before you overwrite it.",
      "BFS/DFS to neighbors that still match the original color.",
      "If the new color equals the original, return early to avoid an infinite loop.",
    ],
    approach:
      "Record the start color. If it already equals the new color, return unchanged. Otherwise BFS from the start, repainting each matching neighbor.",
    solutions: {
      python: `from collections import deque

def flood_fill(image, sr, sc, color):
    start = image[sr][sc]
    if start == color:
        return image  # nothing to do; avoids infinite loop
    rows, cols = len(image), len(image[0])
    q = deque([(sr, sc)])
    image[sr][sc] = color
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols and image[nx][ny] == start:
                image[nx][ny] = color
                q.append((nx, ny))
    return image`,
      java: `import java.util.*;

class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int start = image[sr][sc];
        if (start == color) return image; // avoids infinite loop
        int rows = image.length, cols = image[0].length;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{sr, sc});
        image[sr][sc] = color;
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int x = cell[0], y = cell[1];
            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1];
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && image[nx][ny] == start) {
                    image[nx][ny] = color;
                    q.offer(new int[]{nx, ny});
                }
            }
        }
        return image;
    }
}`,
    },
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n) worst case for the queue",
    companies: ["Amazon", "Microsoft"],
    leetcodeSlug: "flood-fill",
  },
  {
    id: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "Given a grid of heights, water flows from a cell to neighbors of equal or lower height. The Pacific borders the top and left edges; the Atlantic borders the bottom and right. Return all cells from which water can reach BOTH oceans.",
    examples: [
      {
        input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
      },
      { input: "heights = [[1]]", output: "[[0,0]]" },
    ],
    constraints: ["1 <= m, n <= 200", "0 <= heights[i][j] <= 10^5"],
    eli5:
      "Instead of asking 'can this raindrop roll downhill to the sea?', flip it: start at the ocean edges and walk UPHILL. Any cell both oceans can climb to is a cell that drains to both.",
    hints: [
      "Brute force from every cell is wasteful — reverse the flow.",
      "BFS inward from Pacific edges (uphill or flat) to mark all Pacific-reachable cells, same for Atlantic.",
      "The answer is the intersection of the two reachable sets.",
    ],
    approach:
      "Run a multi-source BFS from each ocean's border cells, moving only to neighbors of equal or greater height (reverse flow). Cells reachable from both BFS runs are the answer.",
    solutions: {
      python: `from collections import deque

def pacific_atlantic(heights):
    rows, cols = len(heights), len(heights[0])

    def bfs(starts):
        seen = set(starts)
        q = deque(starts)
        while q:
            x, y = q.popleft()
            for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                nx, ny = x + dx, y + dy
                if (0 <= nx < rows and 0 <= ny < cols and (nx, ny) not in seen
                        and heights[nx][ny] >= heights[x][y]):  # uphill / flat
                    seen.add((nx, ny))
                    q.append((nx, ny))
        return seen

    pacific = [(r, 0) for r in range(rows)] + [(0, c) for c in range(cols)]
    atlantic = [(r, cols - 1) for r in range(rows)] + [(rows - 1, c) for c in range(cols)]
    return [list(cell) for cell in bfs(pacific) & bfs(atlantic)]`,
      java: `import java.util.*;

class Solution {
    private int rows, cols;
    private int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        rows = heights.length;
        cols = heights[0].length;

        List<int[]> pac = new ArrayList<>(), atl = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            pac.add(new int[]{r, 0});
            atl.add(new int[]{r, cols - 1});
        }
        for (int c = 0; c < cols; c++) {
            pac.add(new int[]{0, c});
            atl.add(new int[]{rows - 1, c});
        }

        boolean[][] a = bfs(heights, pac), b = bfs(heights, atl);
        List<List<Integer>> res = new ArrayList<>();
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (a[r][c] && b[r][c]) res.add(Arrays.asList(r, c));
        return res;
    }

    private boolean[][] bfs(int[][] heights, List<int[]> starts) {
        boolean[][] seen = new boolean[rows][cols];
        Queue<int[]> q = new ArrayDeque<>();
        for (int[] s : starts) {
            seen[s[0]][s[1]] = true;
            q.offer(s);
        }
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int x = cell[0], y = cell[1];
            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1];
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && !seen[nx][ny]
                        && heights[nx][ny] >= heights[x][y]) { // uphill / flat
                    seen[nx][ny] = true;
                    q.offer(new int[]{nx, ny});
                }
            }
        }
        return seen;
    }
}`,
    },
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    companies: ["Amazon", "Google", "Meta"],
    leetcodeSlug: "pacific-atlantic-water-flow",
  },
  {
    id: "01-matrix",
    title: "01 Matrix",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "Given a binary matrix, return a matrix where each cell holds its distance to the nearest 0 (4-directionally).",
    examples: [
      { input: "mat = [[0,0,0],[0,1,0],[0,0,0]]", output: "[[0,0,0],[0,1,0],[0,0,0]]" },
      {
        input: "mat = [[0,0,0],[0,1,0],[1,1,1]]",
        output: "[[0,0,0],[0,1,0],[1,2,1]]",
      },
    ],
    constraints: ["1 <= m, n <= 10^4", "1 <= m * n <= 10^4", "mat[i][j] is 0 or 1"],
    eli5:
      "Imagine every 0 is a water source and they all start flooding at the same time. The number written on a square is which 'second' the water arrived — distance from the nearest source.",
    hints: [
      "Don't BFS from every 1 separately — that's slow.",
      "Seed the queue with ALL zeros at once (multi-source BFS), distance 0.",
      "First time you reach a 1, that's its shortest distance; mark and enqueue.",
    ],
    approach:
      "Multi-source BFS: enqueue every 0 with distance 0 and mark all 1s as unknown. Pop in layers; the first visit to any cell is its nearest-zero distance.",
    solutions: {
      python: `from collections import deque

def update_matrix(mat):
    rows, cols = len(mat), len(mat[0])
    dist = [[-1] * cols for _ in range(rows)]
    q = deque()
    for r in range(rows):
        for c in range(cols):
            if mat[r][c] == 0:
                dist[r][c] = 0
                q.append((r, c))  # seed every source at once
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols and dist[nx][ny] == -1:
                dist[nx][ny] = dist[x][y] + 1
                q.append((nx, ny))
    return dist`,
      java: `import java.util.*;

class Solution {
    public int[][] updateMatrix(int[][] mat) {
        int rows = mat.length, cols = mat[0].length;
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, -1);
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        Queue<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (mat[r][c] == 0) {
                    dist[r][c] = 0;
                    q.offer(new int[]{r, c}); // seed all sources
                }
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int x = cell[0], y = cell[1];
            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1];
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && dist[nx][ny] == -1) {
                    dist[nx][ny] = dist[x][y] + 1;
                    q.offer(new int[]{nx, ny});
                }
            }
        }
        return dist;
    }
}`,
    },
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    companies: ["Amazon", "Google", "Meta"],
    leetcodeSlug: "01-matrix",
  },
  {
    id: "rotting-oranges",
    title: "Rotting Oranges",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "In a grid, 0 = empty, 1 = fresh orange, 2 = rotten. Each minute, a rotten orange rots its 4-directional fresh neighbors. Return the minutes until no fresh orange remains, or -1 if impossible.",
    examples: [
      { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
      {
        input: "grid = [[2,1,1],[0,1,1],[1,0,1]]",
        output: "-1",
        explanation: "The bottom-left fresh orange is never reached.",
      },
      { input: "grid = [[0,2]]", output: "0" },
    ],
    constraints: ["1 <= m, n <= 10", "grid[i][j] is 0, 1, or 2"],
    eli5:
      "All the rotten oranges spread their rot at the same time, one ring of neighbors per minute. Count the minutes until the rot reaches everyone — or report -1 if someone is stranded.",
    hints: [
      "All initially-rotten oranges spread simultaneously — multi-source BFS by level.",
      "Each BFS layer is one minute; track fresh count.",
      "If fresh oranges remain after BFS ends, return -1.",
    ],
    approach:
      "Seed the queue with all rotten oranges and count fresh ones. BFS level by level, decrementing fresh as you rot each. Minutes = number of full layers; if any fresh remains, return -1.",
    solutions: {
      python: `from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: q.append((r, c))
            elif grid[r][c] == 1: fresh += 1
    minutes = 0
    while q and fresh:
        for _ in range(len(q)):  # process one minute's worth
            x, y = q.popleft()
            for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 1:
                    grid[nx][ny] = 2
                    fresh -= 1
                    q.append((nx, ny))
        minutes += 1
    return -1 if fresh else minutes`,
      java: `import java.util.*;

class Solution {
    public int orangesRotting(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        Queue<int[]> q = new ArrayDeque<>();
        int fresh = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) q.offer(new int[]{r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        int minutes = 0;
        while (!q.isEmpty() && fresh > 0) {
            int size = q.size(); // one minute's worth
            for (int i = 0; i < size; i++) {
                int[] cell = q.poll();
                int x = cell[0], y = cell[1];
                for (int[] d : dirs) {
                    int nx = x + d[0], ny = y + d[1];
                    if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] == 1) {
                        grid[nx][ny] = 2;
                        fresh--;
                        q.offer(new int[]{nx, ny});
                    }
                }
            }
            minutes++;
        }
        return fresh > 0 ? -1 : minutes;
    }
}`,
    },
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeSlug: "rotting-oranges",
  },
  {
    id: "walls-and-gates",
    title: "Walls and Gates",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "A grid has -1 (wall), 0 (gate), and INF (2^31 - 1, empty room). Fill each empty room with the distance to its nearest gate; leave INF if unreachable.",
    examples: [
      {
        input:
          "rooms = [[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]]",
        output: "[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]",
      },
      { input: "rooms = [[-1]]", output: "[[-1]]" },
    ],
    constraints: ["1 <= m, n <= 250", "rooms[i][j] is -1, 0, or 2^31 - 1"],
    eli5:
      "Every gate opens at the same moment and people walk out into the building. The number in each room is how many steps from the closest gate — walls block the way.",
    hints: [
      "BFS from each room is slow; flip it and BFS from the gates.",
      "Seed the queue with every gate (distance 0) at once.",
      "Only overwrite empty rooms (still INF); skip walls and already-filled rooms.",
    ],
    approach:
      "Multi-source BFS from all gates simultaneously. Each unvisited empty room gets its parent's distance + 1; walls are never entered, so unreachable rooms stay INF.",
    solutions: {
      python: `from collections import deque

INF = 2**31 - 1

def walls_and_gates(rooms):
    rows, cols = len(rooms), len(rooms[0])
    q = deque()
    for r in range(rows):
        for c in range(cols):
            if rooms[r][c] == 0:
                q.append((r, c))  # all gates seed the BFS
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols and rooms[nx][ny] == INF:
                rooms[nx][ny] = rooms[x][y] + 1
                q.append((nx, ny))`,
      java: `import java.util.*;

class Solution {
    public void wallsAndGates(int[][] rooms) {
        int INF = Integer.MAX_VALUE; // 2^31 - 1
        int rows = rooms.length, cols = rooms[0].length;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        Queue<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (rooms[r][c] == 0) q.offer(new int[]{r, c}); // seed all gates
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int x = cell[0], y = cell[1];
            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1];
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && rooms[nx][ny] == INF) {
                    rooms[nx][ny] = rooms[x][y] + 1;
                    q.offer(new int[]{nx, ny});
                }
            }
        }
    }
}`,
    },
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    companies: ["Meta", "Google", "Amazon"],
    leetcodeSlug: "walls-and-gates",
  },
  {
    id: "shortest-path-in-binary-matrix",
    title: "Shortest Path in Binary Matrix",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "Given an n x n binary grid, find the length of the shortest clear path from top-left to bottom-right moving in 8 directions through 0-cells. Return -1 if none.",
    examples: [
      { input: "grid = [[0,1],[1,0]]", output: "2" },
      { input: "grid = [[0,0,0],[1,1,0],[1,1,0]]", output: "4" },
      { input: "grid = [[1,0,0],[1,1,0],[1,1,0]]", output: "-1", explanation: "Start cell is blocked." },
    ],
    constraints: ["1 <= n <= 100", "grid[i][j] is 0 or 1"],
    eli5:
      "You're in a maze where you can step to any of the 8 squares around you, but only onto open floor. BFS spreads out one ripple at a time, so the first time it touches the exit is the shortest route.",
    hints: [
      "Unweighted shortest path on a grid means BFS.",
      "Movement is 8-directional, so use all 8 neighbor offsets.",
      "If start or end is blocked, immediately return -1.",
    ],
    approach:
      "BFS from (0,0) counting path length (cells visited). Mark cells visited by setting them to 1. The first time you dequeue the bottom-right cell, return its distance.",
    solutions: {
      python: `from collections import deque

def shortest_path_binary_matrix(grid):
    n = len(grid)
    if grid[0][0] or grid[n-1][n-1]:
        return -1
    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    q = deque([(0, 0, 1)])  # (row, col, path length)
    grid[0][0] = 1  # mark visited
    while q:
        x, y, d = q.popleft()
        if x == n - 1 and y == n - 1:
            return d
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < n and grid[nx][ny] == 0:
                grid[nx][ny] = 1
                q.append((nx, ny, d + 1))
    return -1`,
      java: `import java.util.*;

class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] == 1 || grid[n - 1][n - 1] == 1) return -1;
        int[][] dirs = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1}, {0, 1}, {1, -1}, {1, 0}, {1, 1}};
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0, 1}); // {row, col, path length}
        grid[0][0] = 1; // mark visited
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int x = cell[0], y = cell[1], d = cell[2];
            if (x == n - 1 && y == n - 1) return d;
            for (int[] dir : dirs) {
                int nx = x + dir[0], ny = y + dir[1];
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && grid[nx][ny] == 0) {
                    grid[nx][ny] = 1;
                    q.offer(new int[]{nx, ny, d + 1});
                }
            }
        }
        return -1;
    }
}`,
    },
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n^2)",
    companies: ["Amazon", "Google", "Apple"],
    leetcodeSlug: "shortest-path-in-binary-matrix",
  },
  {
    id: "snakes-and-ladders",
    title: "Snakes and Ladders",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "Given an n x n boomstrophedon-numbered board (label 1 at bottom-left), find the fewest dice moves from square 1 to square n*n. A cell value != -1 is a snake/ladder destination. Return -1 if unreachable.",
    examples: [
      {
        input:
          "board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]",
        output: "4",
      },
      { input: "board = [[-1,-1],[-1,3]]", output: "1" },
    ],
    constraints: ["n == board.length == board[i].length", "2 <= n <= 20", "board[i][j] is -1 or in [1, n*n]"],
    eli5:
      "It's the board game: roll the die (1-6), land somewhere, and if it's a ladder or snake you teleport. BFS finds the smallest number of rolls to reach the final square.",
    hints: [
      "Treat each square as a node; from square s you can move to s+1..s+6.",
      "Convert a 1-based label to (row, col) on the zigzag board to read snakes/ladders.",
      "BFS layers count dice rolls; follow a snake/ladder destination if present.",
    ],
    approach:
      "Flatten the boustrophedon board into label->destination. BFS over labels from 1; for each, try the next 6 dice values, jumping to a snake/ladder target when set. First time you reach n*n is the answer.",
    solutions: {
      python: `from collections import deque

def snakes_and_ladders(board):
    n = len(board)

    def get(label):  # 1-based label -> board value
        r, c = divmod(label - 1, n)
        row = n - 1 - r
        col = c if r % 2 == 0 else n - 1 - c  # zigzag
        return board[row][col]

    target = n * n
    visited = [False] * (target + 1)
    q = deque([(1, 0)])  # (label, moves)
    visited[1] = True
    while q:
        label, moves = q.popleft()
        if label == target:
            return moves
        for nxt in range(label + 1, min(label + 6, target) + 1):
            dest = get(nxt)
            if dest != -1:
                nxt = dest  # snake or ladder
            if not visited[nxt]:
                visited[nxt] = True
                q.append((nxt, moves + 1))
    return -1`,
      java: `import java.util.*;

class Solution {
    private int n;
    private int[][] board;

    public int snakesAndLadders(int[][] board) {
        this.board = board;
        this.n = board.length;
        int target = n * n;
        boolean[] visited = new boolean[target + 1];
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{1, 0}); // {label, moves}
        visited[1] = true;
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int label = cur[0], moves = cur[1];
            if (label == target) return moves;
            for (int nxt = label + 1; nxt <= Math.min(label + 6, target); nxt++) {
                int dest = get(nxt);
                int node = dest != -1 ? dest : nxt; // snake or ladder
                if (!visited[node]) {
                    visited[node] = true;
                    q.offer(new int[]{node, moves + 1});
                }
            }
        }
        return -1;
    }

    private int get(int label) { // 1-based label -> board value
        int r = (label - 1) / n, c = (label - 1) % n;
        int row = n - 1 - r;
        int col = r % 2 == 0 ? c : n - 1 - c; // zigzag
        return board[row][col];
    }
}`,
    },
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n^2)",
    companies: ["Amazon", "Google"],
    leetcodeSlug: "snakes-and-ladders",
  },
  {
    id: "open-the-lock",
    title: "Open the Lock",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "A lock has 4 wheels (0-9), starting at '0000'. Each move turns one wheel one slot. Given a list of deadends that jam the lock, return the fewest moves to reach the target, or -1 if impossible.",
    examples: [
      {
        input: 'deadends = ["0201","0101","0102","1212","2002"], target = "0202"',
        output: "6",
      },
      { input: 'deadends = ["8888"], target = "0009"', output: "1" },
      { input: 'deadends = ["0000"], target = "8888"', output: "-1" },
    ],
    constraints: [
      "1 <= deadends.length <= 500",
      "deadends[i].length == 4",
      "target.length == 4",
      "target will not be in the deadend list",
    ],
    eli5:
      "Each lock combination is a room; you can step to any combo that's one click away on a single wheel. BFS finds the fewest clicks to the target while avoiding the jammed combos.",
    hints: [
      "Each state is a 4-digit string; neighbors differ by ±1 on one wheel (with 0/9 wrap).",
      "Treat deadends as already-visited so BFS never enters them.",
      "Standard BFS gives the minimum number of moves.",
    ],
    approach:
      "BFS from '0000'. For each state, generate 8 neighbors (each wheel up/down with wraparound). Skip deadends and visited states. Return the level on which target is reached.",
    solutions: {
      python: `from collections import deque

def open_lock(deadends, target):
    dead = set(deadends)
    if '0000' in dead:
        return -1
    if target == '0000':
        return 0
    visited = {'0000'}
    q = deque([('0000', 0)])
    while q:
        state, moves = q.popleft()
        for i in range(4):
            d = int(state[i])
            for nd in ((d + 1) % 10, (d - 1) % 10):  # wrap 0..9
                nxt = state[:i] + str(nd) + state[i+1:]
                if nxt == target:
                    return moves + 1
                if nxt not in dead and nxt not in visited:
                    visited.add(nxt)
                    q.append((nxt, moves + 1))
    return -1`,
      java: `import java.util.*;

class Solution {
    public int openLock(String[] deadends, String target) {
        Set<String> dead = new HashSet<>(Arrays.asList(deadends));
        if (dead.contains("0000")) return -1;
        if (target.equals("0000")) return 0;
        Set<String> visited = new HashSet<>();
        visited.add("0000");
        Queue<String> q = new ArrayDeque<>();
        q.offer("0000");
        int moves = 0;
        while (!q.isEmpty()) {
            int size = q.size(); // one BFS level = one move
            for (int s = 0; s < size; s++) {
                String state = q.poll();
                for (int i = 0; i < 4; i++) {
                    int d = state.charAt(i) - '0';
                    for (int nd : new int[]{(d + 1) % 10, (d + 9) % 10}) { // up / down with wrap
                        String nxt = state.substring(0, i) + nd + state.substring(i + 1);
                        if (nxt.equals(target)) return moves + 1;
                        if (!dead.contains(nxt) && !visited.contains(nxt)) {
                            visited.add(nxt);
                            q.offer(nxt);
                        }
                    }
                }
            }
            moves++;
        }
        return -1;
    }
}`,
    },
    timeComplexity: "O(10^4 * 8) states and transitions",
    spaceComplexity: "O(10^4)",
    companies: ["Amazon", "Google", "Uber"],
    leetcodeSlug: "open-the-lock",
  },
  {
    id: "word-ladder",
    title: "Word Ladder",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Hard",
    description:
      "Given beginWord, endWord, and a wordList, return the length of the shortest transformation sequence (each step changes one letter, and every intermediate word must be in the list). Return 0 if none.",
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: "5",
        explanation: "hit -> hot -> dot -> dog -> cog (5 words).",
      },
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: "0",
        explanation: "endWord 'cog' is not in the list.",
      },
    ],
    constraints: [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
      "All words are lowercase and the same length",
    ],
    eli5:
      "You change one letter at a time to morph one word into another, and every step must be a real word in the dictionary. BFS finds the shortest chain of words.",
    hints: [
      "Each word is a node; edges connect words differing by exactly one letter.",
      "Building edges by trying all 26 letters at each position is faster than comparing all pairs.",
      "BFS from beginWord; the level at which you reach endWord is the answer.",
    ],
    approach:
      "Put the word list in a set. BFS from beginWord; for each word, generate every one-letter variant, and if it's in the set, enqueue it (removing it to mark visited). Return the level when endWord appears.",
    solutions: {
      python: `from collections import deque
import string

def ladder_length(beginWord, endWord, wordList):
    words = set(wordList)
    if endWord not in words:
        return 0
    q = deque([(beginWord, 1)])
    while q:
        word, steps = q.popleft()
        if word == endWord:
            return steps
        for i in range(len(word)):
            for ch in string.ascii_lowercase:
                nxt = word[:i] + ch + word[i+1:]
                if nxt in words:
                    words.remove(nxt)  # mark visited
                    q.append((nxt, steps + 1))
    return 0`,
      java: `import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> words = new HashSet<>(wordList);
        if (!words.contains(endWord)) return 0;
        Queue<String> q = new ArrayDeque<>();
        q.offer(beginWord);
        int steps = 1;
        while (!q.isEmpty()) {
            int size = q.size(); // one BFS level
            for (int s = 0; s < size; s++) {
                String word = q.poll();
                if (word.equals(endWord)) return steps;
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char orig = chars[i];
                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        chars[i] = ch;
                        String nxt = new String(chars);
                        if (words.contains(nxt)) {
                            words.remove(nxt); // mark visited
                            q.offer(nxt);
                        }
                    }
                    chars[i] = orig;
                }
            }
            steps++;
        }
        return 0;
    }
}`,
    },
    timeComplexity: "O(N * L * 26) where N = words, L = word length",
    spaceComplexity: "O(N * L)",
    companies: ["Amazon", "Google", "Meta", "LinkedIn"],
    leetcodeSlug: "word-ladder",
  },
  {
    id: "word-ladder-ii",
    title: "Word Ladder II",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Hard",
    description:
      "Given beginWord, endWord, and a wordList, return ALL shortest transformation sequences from beginWord to endWord, each as a list of words. Return an empty list if none exist.",
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]',
      },
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: "[]",
      },
    ],
    constraints: [
      "1 <= beginWord.length <= 5",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 500",
      "All words are lowercase and the same length",
    ],
    eli5:
      "Like Word Ladder, but you must list EVERY shortest path, not just its length. First find how far each word is from the start (BFS), then walk those distances backward to draw every shortest chain.",
    hints: [
      "Plain BFS gives the length; reconstructing all paths needs the parent links.",
      "BFS level by level, recording for each word the set of predecessors that first reached it.",
      "Once endWord is found at its level, DFS backward over the parent map to enumerate every path.",
    ],
    approach:
      "BFS layer by layer to compute each word's parents (only edges that decrease distance). Stop expanding once endWord is found at the current level. Then DFS from endWord backward through the parent map, building paths and reversing them.",
    solutions: {
      python: `from collections import deque, defaultdict
import string

def find_ladders(beginWord, endWord, wordList):
    words = set(wordList)
    if endWord not in words:
        return []
    parents = defaultdict(set)  # word -> set of predecessors
    level = {beginWord}
    found = False
    while level and not found:
        next_level = defaultdict(set)
        # remove this level's words so we only move forward
        words -= level
        for word in level:
            for i in range(len(word)):
                for ch in string.ascii_lowercase:
                    nxt = word[:i] + ch + word[i+1:]
                    if nxt in words:
                        next_level[nxt].add(word)
                        if nxt == endWord:
                            found = True
        for w, ps in next_level.items():
            parents[w] |= ps
        level = set(next_level.keys())

    if not found:
        return []

    res = []
    def backtrack(word, path):
        if word == beginWord:
            res.append([beginWord] + path[::-1])  # path built backward
            return
        for p in parents[word]:
            backtrack(p, path + [word])
    backtrack(endWord, [])
    return res`,
      java: `import java.util.*;

class Solution {
    private String beginWord;
    private Map<String, Set<String>> parents = new HashMap<>(); // word -> predecessors
    private List<List<String>> res = new ArrayList<>();

    public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
        this.beginWord = beginWord;
        Set<String> words = new HashSet<>(wordList);
        if (!words.contains(endWord)) return res;

        Set<String> level = new HashSet<>();
        level.add(beginWord);
        boolean found = false;

        while (!level.isEmpty() && !found) {
            words.removeAll(level); // only move forward
            Map<String, Set<String>> nextLevel = new HashMap<>();
            for (String word : level) {
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char orig = chars[i];
                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        chars[i] = ch;
                        String nxt = new String(chars);
                        if (words.contains(nxt)) {
                            nextLevel.computeIfAbsent(nxt, k -> new HashSet<>()).add(word);
                            if (nxt.equals(endWord)) found = true;
                        }
                    }
                    chars[i] = orig;
                }
            }
            for (Map.Entry<String, Set<String>> e : nextLevel.entrySet())
                parents.computeIfAbsent(e.getKey(), k -> new HashSet<>()).addAll(e.getValue());
            level = nextLevel.keySet();
        }

        if (!found) return res;

        backtrack(endWord, new ArrayList<>());
        return res;
    }

    private void backtrack(String word, List<String> path) {
        if (word.equals(beginWord)) {
            List<String> full = new ArrayList<>();
            full.add(beginWord);
            for (int i = path.size() - 1; i >= 0; i--) full.add(path.get(i)); // built backward
            res.add(full);
            return;
        }
        for (String p : parents.get(word)) {
            path.add(word);
            backtrack(p, path);
            path.remove(path.size() - 1);
        }
    }
}`,
    },
    timeComplexity: "O(N * L * 26) for BFS plus output size for path reconstruction",
    spaceComplexity: "O(N * L)",
    companies: ["Amazon", "Google", "Meta"],
    leetcodeSlug: "word-ladder-ii",
  },
  {
    id: "minimum-knight-moves",
    title: "Minimum Knight Moves",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Medium",
    description:
      "On an infinite chessboard, a knight starts at (0,0). Return the minimum number of knight moves to reach (x, y).",
    examples: [
      { input: "x = 2, y = 1", output: "1" },
      { input: "x = 5, y = 5", output: "4" },
    ],
    constraints: ["-300 <= x, y <= 300", "0 <= |x| + |y| <= 300"],
    eli5:
      "A chess knight hops in L-shapes. BFS tries every L-hop ring by ring outward; the first ring that lands on the target tells you the fewest hops.",
    hints: [
      "Unweighted shortest path = BFS over the 8 knight moves.",
      "The board is infinite, so use a visited set keyed by coordinates.",
      "By symmetry you can work in the first quadrant: use abs(x), abs(y).",
    ],
    approach:
      "Fold the target into the first quadrant by absolute value. BFS from (0,0) over the 8 knight offsets, tracking visited cells. Return the level on which (|x|,|y|) is reached.",
    solutions: {
      python: `from collections import deque

def min_knight_moves(x, y):
    x, y = abs(x), abs(y)  # symmetry
    moves = [(1,2),(2,1),(-1,2),(-2,1),(1,-2),(2,-1),(-1,-2),(-2,-1)]
    q = deque([(0, 0, 0)])  # (col, row, steps)
    visited = {(0, 0)}
    while q:
        cx, cy, steps = q.popleft()
        if cx == x and cy == y:
            return steps
        for dx, dy in moves:
            nx, ny = cx + dx, cy + dy
            # small negative buffer keeps paths that dip below 0 valid
            if (nx, ny) not in visited and nx >= -2 and ny >= -2:
                visited.add((nx, ny))
                q.append((nx, ny, steps + 1))
    return -1`,
      java: `import java.util.*;

class Solution {
    public int minKnightMoves(int x, int y) {
        x = Math.abs(x); y = Math.abs(y); // symmetry
        int[][] moves = {{1, 2}, {2, 1}, {-1, 2}, {-2, 1}, {1, -2}, {2, -1}, {-1, -2}, {-2, -1}};
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0, 0}); // {col, row, steps}
        Set<String> visited = new HashSet<>();
        visited.add("0,0");
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int cx = cur[0], cy = cur[1], steps = cur[2];
            if (cx == x && cy == y) return steps;
            for (int[] m : moves) {
                int nx = cx + m[0], ny = cy + m[1];
                String key = nx + "," + ny;
                // small negative buffer keeps valid dipping paths
                if (!visited.contains(key) && nx >= -2 && ny >= -2) {
                    visited.add(key);
                    q.offer(new int[]{nx, ny, steps + 1});
                }
            }
        }
        return -1;
    }
}`,
    },
    timeComplexity: "O(max(x,y)^2)",
    spaceComplexity: "O(max(x,y)^2)",
    companies: ["Amazon", "Google", "Uber"],
    leetcodeSlug: "minimum-knight-moves",
  },
  {
    id: "bus-routes",
    title: "Bus Routes",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Hard",
    description:
      "routes[i] is the list of stops the i-th bus loops through. Starting at stop 'source', return the fewest buses you must ride to reach stop 'target'. Return -1 if impossible.",
    examples: [
      { input: "routes = [[1,2,7],[3,6,7]], source = 1, target = 6", output: "2" },
      { input: "routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12", output: "-1" },
    ],
    constraints: [
      "1 <= routes.length <= 500",
      "1 <= sum(routes[i].length) <= 10^5",
      "0 <= routes[i][j] < 10^6",
      "0 <= source, target < 10^6",
    ],
    eli5:
      "Think of buses, not stops, as the things you 'visit'. Each bus you board is one step. BFS over buses finds the fewest transfers from your stop to the destination.",
    hints: [
      "BFS over buses (routes), not individual stops — each hop is one bus ridden.",
      "Build stop -> list of buses that serve it.",
      "From the source stop, board every bus serving it; from each bus, reach all its stops and the new buses there.",
    ],
    approach:
      "Map each stop to the buses serving it. BFS starting from all buses at the source stop. For each bus, scan its stops: if target is among them, return the current bus count; otherwise enqueue unvisited buses reachable from those stops.",
    solutions: {
      python: `from collections import deque, defaultdict

def num_buses_to_destination(routes, source, target):
    if source == target:
        return 0
    stop_to_buses = defaultdict(list)
    for bus, stops in enumerate(routes):
        for s in stops:
            stop_to_buses[s].append(bus)

    visited_bus = set()
    q = deque()
    for bus in stop_to_buses[source]:
        visited_bus.add(bus)
        q.append((bus, 1))  # (bus, buses ridden)

    while q:
        bus, count = q.popleft()
        for stop in routes[bus]:
            if stop == target:
                return count
            for nb in stop_to_buses[stop]:
                if nb not in visited_bus:
                    visited_bus.add(nb)
                    q.append((nb, count + 1))
    return -1`,
      java: `import java.util.*;

class Solution {
    public int numBusesToDestination(int[][] routes, int source, int target) {
        if (source == target) return 0;
        Map<Integer, List<Integer>> stopToBuses = new HashMap<>();
        for (int bus = 0; bus < routes.length; bus++)
            for (int s : routes[bus])
                stopToBuses.computeIfAbsent(s, k -> new ArrayList<>()).add(bus);

        Set<Integer> visitedBus = new HashSet<>();
        Queue<int[]> q = new ArrayDeque<>();
        for (int bus : stopToBuses.getOrDefault(source, Collections.emptyList())) {
            visitedBus.add(bus);
            q.offer(new int[]{bus, 1}); // {bus, buses ridden}
        }

        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int bus = cur[0], count = cur[1];
            for (int stop : routes[bus]) {
                if (stop == target) return count;
                for (int nb : stopToBuses.getOrDefault(stop, Collections.emptyList())) {
                    if (!visitedBus.contains(nb)) {
                        visitedBus.add(nb);
                        q.offer(new int[]{nb, count + 1});
                    }
                }
            }
        }
        return -1;
    }
}`,
    },
    timeComplexity: "O(sum of route lengths)",
    spaceComplexity: "O(sum of route lengths)",
    companies: ["Amazon", "Google", "Uber"],
    leetcodeSlug: "bus-routes",
  },
  {
    id: "cut-off-trees-for-golf-event",
    title: "Cut Off Trees for Golf Event",
    section: "Graphs",
    pattern: "bfs",
    difficulty: "Hard",
    description:
      "In a forest grid (0 = blocked, 1 = walkable, >1 = tree of that height), starting at (0,0) you must cut every tree in strictly increasing height order, walking 4-directionally. Return the total steps, or -1 if any tree is unreachable.",
    examples: [
      { input: "forest = [[1,2,3],[0,0,4],[7,6,5]]", output: "6" },
      { input: "forest = [[1,2,3],[0,0,0],[7,6,5]]", output: "-1", explanation: "Trees on the bottom row are blocked off." },
      { input: "forest = [[2,3,4],[0,0,5],[8,7,6]]", output: "6" },
    ],
    constraints: [
      "1 <= m, n <= 50",
      "0 <= forest[i][j] <= 10^9",
      "Heights of trees are distinct",
    ],
    eli5:
      "You must chop trees from shortest to tallest. Between each pair, BFS finds the fewest walking steps. Add them all up — if any tree is walled off, the whole job is impossible.",
    hints: [
      "Trees must be cut shortest-first, so sort their positions by height.",
      "The total is the sum of shortest paths between consecutive trees (and from start to the first).",
      "Each leg is an unweighted shortest path → BFS. If any leg is unreachable, return -1.",
    ],
    approach:
      "Collect all tree cells and sort by height. Starting at (0,0), BFS to each next tree in order, accumulating steps. If any BFS can't reach the target, return -1.",
    solutions: {
      python: `from collections import deque

def cut_off_tree(forest):
    rows, cols = len(forest), len(forest[0])
    trees = sorted((forest[r][c], r, c)
                   for r in range(rows) for c in range(cols)
                   if forest[r][c] > 1)

    def bfs(sr, sc, tr, tc):
        if (sr, sc) == (tr, tc):
            return 0
        seen = {(sr, sc)}
        q = deque([(sr, sc, 0)])
        while q:
            x, y, d = q.popleft()
            for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                nx, ny = x + dx, y + dy
                if (0 <= nx < rows and 0 <= ny < cols
                        and forest[nx][ny] != 0 and (nx, ny) not in seen):
                    if nx == tr and ny == tc:
                        return d + 1
                    seen.add((nx, ny))
                    q.append((nx, ny, d + 1))
        return -1

    total = 0
    sr, sc = 0, 0
    for _, tr, tc in trees:
        steps = bfs(sr, sc, tr, tc)
        if steps == -1:
            return -1
        total += steps
        sr, sc = tr, tc
    return total`,
      java: `import java.util.*;

class Solution {
    private int rows, cols;
    private int[][] forest;
    private int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public int cutOffTree(List<List<Integer>> forestList) {
        rows = forestList.size();
        cols = forestList.get(0).size();
        forest = new int[rows][cols];
        List<int[]> trees = new ArrayList<>();
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) {
                forest[r][c] = forestList.get(r).get(c);
                if (forest[r][c] > 1) trees.add(new int[]{forest[r][c], r, c});
            }
        trees.sort((a, b) -> Integer.compare(a[0], b[0]));

        int total = 0, sr = 0, sc = 0;
        for (int[] tree : trees) {
            int steps = bfs(sr, sc, tree[1], tree[2]);
            if (steps == -1) return -1;
            total += steps;
            sr = tree[1];
            sc = tree[2];
        }
        return total;
    }

    private int bfs(int sr, int sc, int tr, int tc) {
        if (sr == tr && sc == tc) return 0;
        boolean[][] seen = new boolean[rows][cols];
        seen[sr][sc] = true;
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{sr, sc, 0});
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int x = cur[0], y = cur[1], d = cur[2];
            for (int[] dir : dirs) {
                int nx = x + dir[0], ny = y + dir[1];
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols
                        && forest[nx][ny] != 0 && !seen[nx][ny]) {
                    if (nx == tr && ny == tc) return d + 1;
                    seen[nx][ny] = true;
                    q.offer(new int[]{nx, ny, d + 1});
                }
            }
        }
        return -1;
    }
}`,
    },
    timeComplexity: "O(t * m * n) where t = number of trees",
    spaceComplexity: "O(m*n)",
    companies: ["Amazon", "Google"],
    leetcodeSlug: "cut-off-trees-for-golf-event",
  },
  {
    id: "clone-graph",
    title: "Clone Graph",
    section: "Graphs",
    pattern: "dfs-backtracking",
    difficulty: "Medium",
    description:
      "Given a reference to a node in a connected undirected graph (each node has a val and a list of neighbors), return a deep copy (clone) of the graph.",
    examples: [
      {
        input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        output: "[[2,4],[1,3],[2,4],[1,3]]",
        explanation: "A 4-node graph is cloned with identical structure.",
      },
      { input: "adjList = [[]]", output: "[[]]", explanation: "Single node with no neighbors." },
      { input: "adjList = []", output: "[]", explanation: "Empty graph." },
    ],
    constraints: [
      "0 <= number of nodes <= 100",
      "1 <= Node.val <= 100, all unique",
      "No repeated edges, no self-loops, graph is connected",
    ],
    eli5:
      "You're photocopying a web of friends. Each time you meet a new friend you make their copy and remember it, so when you loop back you reuse the same copy instead of making endless duplicates.",
    hints: [
      "You need a map from original node -> its clone to avoid copying the same node twice.",
      "DFS: clone the current node, then recursively clone and attach each neighbor.",
      "Check the map first; if a node is already cloned, return that clone (handles cycles).",
    ],
    approach:
      "DFS with a visited map keyed by original node. On first visit, create the clone and store it, then recurse into neighbors, appending each neighbor's clone. Returning the stored clone on revisits breaks cycles.",
    solutions: {
      python: `# class Node:
#     def __init__(self, val=0, neighbors=None):
#         self.val = val
#         self.neighbors = neighbors or []

def clone_graph(node):
    if not node:
        return None
    clones = {}  # original -> clone

    def dfs(cur):
        if cur in clones:
            return clones[cur]  # already cloned -> reuse (handles cycles)
        copy = Node(cur.val)
        clones[cur] = copy
        for nb in cur.neighbors:
            copy.neighbors.append(dfs(nb))
        return copy

    return dfs(node)`,
      java: `import java.util.*;

/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> neighbors;
    public Node() { val = 0; neighbors = new ArrayList<>(); }
    public Node(int _val) { val = _val; neighbors = new ArrayList<>(); }
    public Node(int _val, ArrayList<Node> _neighbors) { val = _val; neighbors = _neighbors; }
}
*/

class Solution {
    private Map<Node, Node> clones = new HashMap<>(); // original -> clone

    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (clones.containsKey(node)) return clones.get(node); // reuse (handles cycles)
        Node copy = new Node(node.val);
        clones.put(node, copy);
        for (Node nb : node.neighbors) {
            copy.neighbors.add(cloneGraph(nb));
        }
        return copy;
    }
}`,
    },
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    companies: ["Meta", "Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "clone-graph",
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    section: "Graphs",
    pattern: "dfs-backtracking",
    difficulty: "Medium",
    description:
      "There are numCourses courses labeled 0..numCourses-1. prerequisites[i] = [a, b] means you must take b before a. Return true if you can finish all courses (i.e., the dependency graph has no cycle).",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take 0 then 1." },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "0 and 1 depend on each other — a cycle.",
      },
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "All prerequisite pairs are distinct",
    ],
    eli5:
      "Courses unlock other courses. You can finish them all only if there's no circular 'A needs B, B needs A' trap. DFS walks the chain and flags any course it's still in the middle of visiting.",
    hints: [
      "This is cycle detection in a directed graph.",
      "DFS with three states per node: unvisited, in-progress (on the stack), done.",
      "If you ever revisit an in-progress node, there's a cycle → return false.",
    ],
    approach:
      "Build an adjacency list. DFS each node tracking states (0 unvisited, 1 visiting, 2 done). Hitting a 'visiting' node means a back edge / cycle. If no cycle is found, all courses can be finished.",
    solutions: {
      python: `def can_finish(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        graph[b].append(a)  # b -> a (take b before a)

    state = [0] * numCourses  # 0 = unvisited, 1 = visiting, 2 = done

    def has_cycle(node):
        if state[node] == 1:
            return True   # back edge -> cycle
        if state[node] == 2:
            return False  # already cleared
        state[node] = 1
        for nxt in graph[node]:
            if has_cycle(nxt):
                return True
        state[node] = 2
        return False

    return not any(has_cycle(i) for i in range(numCourses))`,
      java: `import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private int[] state; // 0 unvisited, 1 visiting, 2 done

    public boolean canFinish(int numCourses, int[][] prerequisites) {
        graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        for (int[] pre : prerequisites) graph.get(pre[1]).add(pre[0]); // b -> a

        state = new int[numCourses];
        for (int i = 0; i < numCourses; i++) {
            if (hasCycle(i)) return false;
        }
        return true;
    }

    private boolean hasCycle(int node) {
        if (state[node] == 1) return true;  // back edge -> cycle
        if (state[node] == 2) return false; // already cleared
        state[node] = 1;
        for (int nxt : graph.get(node)) {
            if (hasCycle(nxt)) return true;
        }
        state[node] = 2;
        return false;
    }
}`,
    },
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    companies: ["Amazon", "Google", "Meta", "Microsoft"],
    leetcodeSlug: "course-schedule",
  },
];
