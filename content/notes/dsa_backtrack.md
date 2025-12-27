+++
title = "回溯"
description = "刷遍题 - 回溯"
date = 2025-12-25
updated = 2025-12-26

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

溯：sù（四声），感谢 gpt 教我中文。

回溯（`Backtracking`）是在一棵隐式搜索树里试探性地做选择，每走一步都继续向下探索，如果发现当前路径不合法或走不通，就撤销这一步并回到上一个分叉点继续尝试其他选择。它本质上是带有“撤销操作”的深度优先搜索，用来穷举所有可能解。

关键思想:
1. 路径（`path`）：当前做出的选择（递归走过的路）。
2. 选择列表（`choices`）：当前状态还能做哪些选择。
3. 结束条件（`终点`）：达到某种合法结果时加入答案。

```java
void backtrack(List<Integer> path) {
    // 1. 结束条件
    if (满足结束条件) {
        ans.add(new ArrayList<>(path)); // 记得拷贝
        return;
    }
    // 2. 遍历「选择列表」
    for (选择 : 选择列表) {
        // 做选择
        path.add(选择);
        // 进入下一层递归
        backtrack(path);
        // 撤销选择
        path.remove(path.size() - 1);
    }
}
```

回溯是一种很慢的算法。之所以慢，是因为它要探索成倍增长的搜索空间，时间复杂度通常呈指数级，但在需要遍历所有可能解时，它依然是最直接、最清晰的做法。

## 题目

### 1. 组合问题

[LT.77. Combinations](https://leetcode.com/problems/combinations/description/)

```java
class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        backtrack(1, n, k, path, res);
        return res;
    }

    private void backtrack(int start, int n, int k,
                           List<Integer> path, List<List<Integer>> res) {
        if (path.size() == k) {
            res.add(new ArrayList<>(path));
            return;
        }

        int need = k - path.size();
        for (int i = start; i <= n - need + 1; i++) {
            path.add(i);
            backtrack(i + 1, n, k, path, res);
            path.removeLast();
        }
    }
}

// time: O(C(n, k) x k)
// space: O(C(n, k) x k)
```

### 2. 组合总和III

[LT.216. Combination Sum III](https://leetcode.com/problems/combination-sum-iii/description/)

```java
class Solution {
    public List<List<Integer>> combinationSum3(int k, int n) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        backtrack(k, n, 1, 0, path, res);
        return res;
    }

    private void backtrack(int k, int n,
                           int start, int sum,
                           List<Integer> path, List<List<Integer>> res) {
        if (path.size() == k) {
            if (sum == n) {
                res.add(new ArrayList<>(path));
            }
            return;
        }
        if (sum > n) {
            return;
        }
        int need = k - path.size();
        // use numbers from 1 to 9
        for (int i = start; i <= 9 - need + 1; i++) {
            path.add(i);
            backtrack(k, n, i + 1, sum + i, path, res);
            path.removeLast();
        }
    }
}

// time: O(C(9, k) x k)
// space: O(C(9, k) x k)
```

### 3. 电话号码的字母组合

[LT.17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/description/)

```java
class Solution {
    public List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (digits == null || digits.isEmpty()) {
            return res;
        }
        StringBuilder sb = new StringBuilder();
        String[] lettersMap = {"", "", "abc", "def", "ghi",
                               "jkl", "mno", "pqrs", "tuv", "wxyz"};
        backtrack(digits, 0, lettersMap, sb, res);
        return res;
    }

    private void backtrack(String digits, int index, String[] lettersMap,
                           StringBuilder sb, List<String> res) {
        if (index == digits.length()) {
            res.add(sb.toString());
            return;
        }

        String letters = lettersMap[digits.charAt(index) - '0'];
        for (char c : letters.toCharArray()) {
            sb.append(c);
            backtrack(digits, index + 1, lettersMap, sb, res);
            sb.setLength(sb.length() - 1);
        }
    }
}

// time: 3^n - 4^n
// space: O(n) for recursion stack
```

### 4. 组合总和

[LT.39. Combination Sum](https://leetcode.com/problems/combination-sum/description/)

```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        backtrack(candidates, target, 0, 0, path, res);
        return res;
    }

    private void backtrack(int[] candidates, int target,
                           int start, int sum,
                           List<Integer> path, List<List<Integer>> res) {
        if (sum == target) {
            res.add(new ArrayList<>(path));
            return;
        }
        if (sum > target) {
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            path.add(candidates[i]);
            backtrack(candidates, target, i, sum + candidates[i], path, res); // allow duplicate
            path.removeLast();
        }
    }
}
```

有种写法是先对 candidates 排序然后在循环中剪枝，实际测试中会慢一点。

### 5. 组合总和II

[LT.40. Combination Sum II](https://leetcode.com/problems/combination-sum-ii/description/)

- 先排序，然后用回溯枚举组合
- 为了避免结果重复，在“同一层循环”中跳过相同数字

```java
class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        Arrays.sort(candidates);
        backtrack(candidates, 0, target, path, res);
        return res;
    }

    private void backtrack(int[] candidates, int start, int remain,
                           List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            // prune
            if (remain - candidates[i] < 0) break;
            // same value used once in the same level
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            path.add(candidates[i]);
            // use i + 1 not start + 1, common mistake
            backtrack(candidates, i + 1, remain - candidates[i], path, res);
            path.removeLast();
        }
    }
}
```

### 6. 分割回文串

[LT.131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/description/)

用回溯枚举所有切割方案，只保留每一段都是回文串的路径。从 start index 开始，不断尝试 s[start…i] 作为一段；若是回文就加入当前路径并继续递归下去，到字符串末尾则收集结果；不是回文就直接跳过（剪枝）。

```java
class Solution {
    private List<List<String>> res = new ArrayList<>();
    private List<String> path = new ArrayList<>();

    public List<List<String>> partition(String s) {
        backtrack(s, 0);
        return res;
    }

    private void backtrack(String s, int start) {
        if (start == s.length()) {
            res.add(new ArrayList<>(path));
            return;
        }

        // try all possible cuts: s[start..i]
        for (int i = start; i < s.length(); i++) {
            // prune
            if (!isPalindrome(s, start, i)) continue;
            path.add(s.substring(start, i + 1));
            backtrack(s, i + 1);
            path.removeLast();
        }
    }

    private boolean isPalindrome(String s, int l, int r) {
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) return false;
            l++;
            r--;
        }
        return true;
    }
}
// time: O(n x 2^n)
// space: O(n) for recursion stack
```

### 7. 复原IP地址

[LT.93. Restore IP Addresses](https://leetcode.com/problems/restore-ip-addresses/description/)

```java
class Solution {
    private List<String> res = new ArrayList<>();
    private List<String> path = new ArrayList<>();

    public List<String> restoreIpAddresses(String s) {
        backtrack(s, 0);
        return res;
    }

    private void backtrack(String s, int start) {
        if (start == s.length()) {
            if (path.size() == 4) {
                res.add(String.join(".", path));
            }
            return;
        }
        // prune
        int remainSeg = 4 - path.size();
        int remainLen = s.length() - start;
        if (remainSeg > remainLen || remainLen > remainSeg * 3) {
            return;
        }

        for (int len = 1; len <= 3 && start + len <= s.length(); len++) {
            String seg = s.substring(start, start + len);
            if (!isValid(seg)) break; // the rest are longer thus also invalid
            path.add(seg);
            backtrack(s, start + len);
            path.removeLast();
        }
    }

    private boolean isValid(String s) {
        if (s.length() > 1 && s.charAt(0) == '0') return false;
        int val = Integer.valueOf(s);
        return val >= 0 && val <= 255;
    }
}

// time: O(1) at most 3^4 = 81 items
// space: O(1)
```

### 8. 子集

[LT.78. Subsets](https://leetcode.com/problems/subsets/)

- 经典「幂集」问题：给定无重复数组，返回所有子集。
- 在每个元素面前都有“要 / 不要”两个选择，自然形成一棵决策树 → 回溯。

```java
class Solution {
    private List<List<Integer>> res = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();

    public List<List<Integer>> subsets(int[] nums) {
        backtrack(nums, 0);
        return res;
    }

    private void backtrack(int[] nums, int start) {
        res.add(new ArrayList<>(path)); // add first
        if (start == nums.length) { // can omit, since for will end at the same time
            return;
        }
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1);
            path.removeLast();
        }
    }
}

// time: O(2^n x n)
// space: O(n) for recursion stack
```

### 9. 子集II

[LT.90. Subsets II](https://leetcode.com/problems/subsets-ii/description/)

```java
class Solution {
    private List<List<Integer>> res = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();

    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        backtrack(nums, 0);
        return res;
    }

    private void backtrack(int[] nums, int start) {
        res.add(new ArrayList<>(path)); // add first
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.add(nums[i]);
            backtrack(nums, i + 1);
            path.removeLast();
        }
    }
}
// time: O(2^n x n)
// space: O(n) for recursion stack
```

### 10. 递增子序列

[LT.491. Non-decreasing Subsequences](https://leetcode.com/problems/non-decreasing-subsequences/description/)

在每一层做选择的时候跳过重复的选项。

```
  {}       level 0
 / | \
 6 7  7    level 1
      ^
      dup
```

```java
class Solution {
    private List<List<Integer>> res = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();

    public List<List<Integer>> findSubsequences(int[] nums) {
        backtrack(nums, 0);
        return res;
    }
    
    private void backtrack(int[] nums, int start) {
        if (path.size() >= 2) {
            res.add(new ArrayList<>(path));
            // don't return here
        }
        if (start == nums.length) { // can be omit
            return;
        }

        Set<Integer> used = new HashSet<>();
        for (int i = start; i < nums.length; i++) {
            // skip duplicate choice at the same level
            if (used.contains(nums[i])) continue;
            // should be non-decreasing
            if (!path.isEmpty() && nums[i] < path.getLast()) continue;
            used.add(nums[i]);
            path.add(nums[i]);
            backtrack(nums, i + 1);
            path.removeLast();
        }
    }
}
```

### 11. 全排列

[LT.46. Permutations](https://leetcode.com/problems/permutations/)

和子集问题不同我们不再需要 start index 而是一个 used 数组来标记已经选择的元素。

```java
class Solution {
    private List<List<Integer>> res = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();

    public List<List<Integer>> permute(int[] nums) {
        boolean[] used = new boolean[nums.length];
        backtrack(nums, used);
        return res;
    }

    private void backtrack(int[] nums, boolean[] used) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            path.add(nums[i]);
            used[i] = true;
            backtrack(nums, used);
            path.removeLast();
            used[i] = false;
        }
    }
}
```

### 12. 全排列 II

[LT.47. Permutations II](https://leetcode.com/problems/permutations-ii/description/)

- 先排序，使相同元素相邻。
- 每一层循环中，如果` nums[i] == nums[i-1]` 且**前一个相同元素还没被使用**，说明这一层已经处理过“相同值”，继续会导致重复，跳过即可。

仅靠与上一个元素是否相同还不足以完成去重。是因为重复元素既可能出现在“同一层”，也可能出现在“不同层（不同分支）”。

```java
class Solution {
    private List<List<Integer>> res = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();

    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        boolean[] used = new boolean[nums.length];
        backtrack(nums, used);
        return res;
    }

    private void backtrack(int[] nums, boolean[] used) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            // used in previous level
            if (used[i]) continue;
            // same value used in the same level
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;
            path.add(nums[i]);
            used[i] = true;
            backtrack(nums, used);
            path.removeLast();
            used[i] = false;
        }
    }
}
```

### 13. N皇后

[LT.51. N-Queens](https://leetcode.com/problems/n-queens/description/)

类似于三个 used 数组加上 start index 去做搜索。对角线最长接近 2n 所以数组开 2n，row-col 会为负所以要平移。

```java
class Solution {
    List<List<String>> res = new ArrayList<>();
    private boolean[] cols;  // c
    private boolean[] diag1; // r - c + n
    private boolean[] diag2; // r + c

    public List<List<String>> solveNQueens(int n) {
        cols = new boolean[n];
        diag1 = new boolean[2 * n];
        diag2 = new boolean[2 * n];
        char[][] board = new char[n][n];
        for (char[] row : board) {
            Arrays.fill(row, '.');
        }
        backtrack(board, 0, n);
        return res;
    }

    private void backtrack(char[][] board, int row, int n) {
        if (row == n) {
            res.add(build(board));
            return;
        }

        for (int c = 0; c < n; c++) {
            int d1 = row - c + n;
            int d2 = row + c;
            if (cols[c] || diag1[d1] || diag2[d2]) continue;
            cols[c] = diag1[d1] = diag2[d2] = true;
            board[row][c] = 'Q';
            backtrack(board, row + 1, n);
            board[row][c] = '.';
            cols[c] = diag1[d1] = diag2[d2] = false;
        }
    }

    private List<String> build(char[][] board) {
        List<String> res = new ArrayList<>();
        for (char[] row : board) {
            res.add(new String(row));
        }
        return res;
    }
}
```

### 14. 解数独

[LT.37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver/description/)

之前做过的许多回溯题（如子集、排列、N皇后）是 一维递归走一个方向。本题的搜索树更“宽更深”：需要 遍历每个格子 `(r, c)` 并在每个格子处尝试数字，进行 “二维递归”。

- 若当前格是 `.`，就尝试放 1~9
- 只有当 行、列、3×3 宫格 同时不冲突时才继续递归

用 0~8 给九宫格编号：

```
0 1 2
3 4 5
6 7 8

idx = (r / 3) * 3 + c
```

```java
class Solution {
    private boolean[][] row = new boolean[9][10]; // row[r][d] used, d for digit
    private boolean[][] col = new boolean[9][10]; // col[c][d] used
    private boolean[][] box = new boolean[9][10]; // box[b][d] used, b for 3x3 box index

    public void solveSudoku(char[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] != '.') {
                    int d = board[r][c] - '0';
                    int b = getBoxIndex(r, c);
                    row[r][d] = col[c][d] = box[b][d] = true;
                }
            }
        }
        backtrack(board, 0, 0);
    }

    private boolean backtrack(char[][] board, int r, int c) {
        if (r == 9) {
            // done, all filled
            return true;
        }
        if (c == 9) {
            // move to next row, first col (0)
            return backtrack(board, r + 1, 0);
        }
        if (board[r][c] != '.') {
            // move to next col
            return backtrack(board, r, c + 1);
        }

        int b = getBoxIndex(r, c);
        for (int d = 1; d <= 9; d++) {
            if (row[r][d] || col[c][d] || box[b][d]) {
                continue; // try next number
            }
            row[r][d] = col[c][d] = box[b][d] = true;
            board[r][c] = (char) (d + '0');
            // move to next col
            if (backtrack(board, r, c + 1)) {
                return true;
            }
            row[r][d] = col[c][d] = box[b][d] = false;
            board[r][c] = '.';
        }
        // all numbers tried, nothing works
        return false;
    }

    // map to 3x3 box index
    private int getBoxIndex(int r, int c) {
        return (r / 3) * 3 + c / 3;
    }
}
```
