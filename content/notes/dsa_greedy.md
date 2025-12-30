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

### 3. 最大子序和

[LT.53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/description/)

当前和一旦变负就清零重开；一路过程中记下遇到过的最大值。
- 我们维护一个当前连续子数组的最大和 `curSum`，以及一个全局最大 `maxSum`
- 当 `curSum < 0` 时，它对后面的子数组只会产生负贡献，立刻丢掉，从当前元素重新开始
- 否则把当前元素接上，继续累加
- 遍历过程中不断更新 `maxSum`

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0]; // max sum so far
        int curSum = nums[0]; // current running subarray sum

        // start from the second element
        for (int i = 1; i < nums.length; i++) {
            // if sum so far becomes negative, drop it
            // restart from current this element
            curSum = Math.max(nums[i], curSum + nums[i]);
            // update global max
            maxSum = Math.max(curSum, maxSum);
        }

        return maxSum;
    }
}
// time: O(n)
// space: O(1)
```

### 4. 买卖股票的最佳时机 II

[LT.122. Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

只要今天价格高于昨天，就把这段正差价累加起来，因为每一段上升都可以视为一次独立的买入卖出盈利。

```
p[3] - p[0] = (p[3] - p[2]) + (p[2] - p[1]) + (p[1] - p[0])
              |  + take   |   |  - ignore |   |  + take   | 
              
```

```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length < 2) {
            return 0;
        }
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            profit += Math.max(prices[i] - prices[i - 1], 0);
        }
        return profit;
    }
}
// time: O(n)
// space: O(1)
```

### 5. 跳跃游戏

[LT.55. Jump Game](https://leetcode.com/problems/jump-game/description/)

从左到右维护当前能到达的最远位置，只要当前位置不超过这个最远值，并不断更新它，最后能覆盖到最后一个下标就成功。

```java
class Solution {
    public boolean canJump(int[] nums) {
        int max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (i > max) return false;
            max = Math.max(max, i + nums[i]);
            // optional pruning 
            if (max >= nums.length - 1) return true;
        }
        return true;
    }
}
// time: O(n)
// space: O(1)
```

### 6. 跳跃游戏II

用贪心按“覆盖区间”分层：在当前层内不断更新能到达的最远位置，走到层尽头时才 +1 跳，最终得到最少跳跃次数。

```java
class Solution {
    public int jump(int[] nums) {
        int jumps = 0;
        int curEnd = 0; // when you have to jump, the boundary
        int farthest = 0;
        // no need to jump at the last step
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            // when we reach the end of the current jump range
            // we must make another jump and extend the range
            if (i == curEnd) {
                jumps++;
                curEnd = farthest; // jump to the farthest
            }
        }
        return jumps;
    }
}

// time: O(n)
// space: O(1)
```
