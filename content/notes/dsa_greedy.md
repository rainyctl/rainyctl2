+++
title = "贪心算法"
description = "刷遍题 - 贪心算法"
date = 2025-12-28
updated = 2025-12-28

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

贪心算法（`Greedy Algorithm`）是在每一步都作出当前看起来最优的选择（局部最优），希望最终得到全局最优解的方法。

它的特点是：
- 不回溯，不全局搜索
- 一次决策影响后续，但不重新考虑之前的选择
- 快、实现简单、但并非对所有问题都适用

贪心算法通过在每一步做出当前最优（局部最优）的选择来构建整体解，要求问题满足贪心选择性质与最优子结构。它通常以“排序 + 单次决策”的形式出现，优点是简单高效，缺点是只对结构良好的问题有效，不能解决可以试试`回溯`或`动态规划`。

## 题目

### 1. 分发饼干

[LT.455. Assign Cookies](https://leetcode.com/problems/assign-cookies/description/)

局部策略：
每次用当前能用的最小饼干去喂当前胃口最小的孩子。

```java
class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int i = 0; // pointer for children
        int j = 0; // pointer for cookies

        // try to assign cookies from smallest to largest
        while (i < g.length && j < s.length) {
            if (s[j] >= g[i]) {
                // current cookie can satisfy this child
                i++; // child is satisfied, move to the next child
            }
            // whether satisfied or not, this cookie is used/decided
            j++; // move to next cookie
        }
        // i is the number of children that got satisfied
        return i;
    }
}

// time - sort：O(n log n + m log m) (n = g.length, m = s.length)
// time - scan：O(n + m)
// space：O(1) if sort in-place
```

### 2. 摆动序列

[LT.376. Wiggle Subsequence](https://leetcode.com/problems/wiggle-subsequence/)

长度 = 方向变化次数 + 1

- 每发生一次“上升 ⇄ 下降”的切换，就新增了一个“拐点”
- 而拐点恰好就是摆动序列中必须保留的点
- 拐点数量 + 初始点 = wiggle 长度

```java
class Solution {
    public int wiggleMaxLength(int[] nums) {
        if (nums.length < 2) {
            return nums.length;
        }
        int prevDiff = 0;
        int count = 0;
        for (int i = 1; i < nums.length; i++) {
            int diff = nums[i] - nums[i - 1];
            // down/flat -> up or
            // up/flat -> down
            if ((diff > 0 && prevDiff <= 0) || (diff < 0 && prevDiff >= 0)) {
                count++;
                prevDiff = diff;
            }
        }
        // length = sign change + 1
        return count + 1;
    }
}
// time: O(n)
// space: O(1)
```
