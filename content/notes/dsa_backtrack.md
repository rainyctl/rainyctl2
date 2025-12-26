+++
title = "回溯"
description = "刷遍题 - 回溯"
date = 2025-12-25
updated = 2025-12-25

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
