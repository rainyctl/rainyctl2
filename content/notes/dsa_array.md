+++
title = "数组"
description = "刷遍题 - 数组"
date = 2025-12-13
updated = 2025-12-14

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

数组是一段在虚拟地址空间中连续存储、可通过索引直接访问的同类型元素集合。

## 题目

### 1. 二分查找

[LT.704. Binary Search](https://leetcode.com/problems/binary-search/description/)

搜索区间保持左闭右闭或左闭右开。

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}

// time: O(log n)
// space: O(1)
```

### 2. 移除元素

[LT.27. Remove Element](https://leetcode.com/problems/remove-element/description/)

```java
class Solution {
    public int removeElement(int[] nums, int val) {
        int i = 0;
        for (int j = 0; j < nums.length; j++) {
            if (nums[j] != val) {
                nums[i++] = nums[j];
            }
        }
        return i;
    }
}

// time: O(n)
// space: O(1)
```

### 3. 有序数组的平方

[LT.977. Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/description/)

双指针由两端到中间搜索当前最大的平方后的元素加入新数组。不太能做到 in-place.

```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int[] res = new int[nums.length];
        int i = 0, j = nums.length - 1;
        int k = nums.length - 1;

        while (i <= j) {
            int a = nums[i] * nums[i];
            int b = nums[j] * nums[j];
            if (a > b) {
                res[k--] = a;
                i++;
            } else {
                res[k--] = b;
                j--;
            }
        }

        return res;
    }
}

// time: O(n)
// space: O(n)
```

### 4. 长度最小的子数组

[LT.209. Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/)

维护一个窗口，扩展一次右边，持续收缩左边进行搜索。条件满足时更新最小长度。

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int sum = 0;
        int i = 0;
        int len = Integer.MAX_VALUE;
        for (int j = 0; j < nums.length; j++) {
            sum += nums[j];
            while (sum >= target) {
                len = Integer.min(len, j - i + 1);
                sum -= nums[i++];
            }
        }
        return len == Integer.MAX_VALUE ? 0 : len;
    }
}

// time: O(n)
// space: O(1)
```

### 5. 螺旋矩阵II

[LT.59. Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/description/)

在步骤 3、4 需要先判断还有没有必要再填充一次。避免同一行或列先被正向，然后又被反向填充。

```java
class Solution {
    public int[][] generateMatrix(int n) {
        int[][] res = new int[n][n];
        int left = 0, right = n - 1;
        int top = 0, bottom = n - 1;
        int k = 1;
        while (left <= right && top <= bottom) {
            // 1. left -> right
            for (int j = left; j <= right; j++) {
                res[top][j] = k++;
            }
            top++;
            // 2. top -> bottom
            for (int i = top; i <= bottom; i++) {
                res[i][right] = k++;
            }
            right--;
            // 3. right -> left if necessary
            if (top < bottom) {
                for (int j = right; j >= left; j--) {
                    res[bottom][j] = k++;
                }
                bottom--;
            }
            // 4. bottom -> top if necessary
            if (left < right) {
                for (int i = bottom; i >= top; i--) {
                    res[i][left] = k++;
                }
                left++;
            }
        }
        return res;
    }
}

// time: O(n x n)
// space: O(n x n)
```

### 6. 区间和

[KC.58. 区间和](https://kamacoder.com/problempage.php?pid=1070)

前缀和。

```
pre[0] = 0
pre[i] = Array[0] + Array[1] + ... + Array[i-1]
length: n + 1

sum(a, b) = pre[b + 1] - pre[a]
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        try (var scanner = new Scanner(System.in)) {
            int n = scanner.nextInt();
            int[] pre = new int[n + 1];
            
            for (int i = 1; i <= n; i++) {
                pre[i] = pre[i - 1] + scanner.nextInt();
            }
            
            while (scanner.hasNext()) {
                int a = scanner.nextInt();
                int b = scanner.nextInt();
                System.out.println(pre[b + 1] - pre[a]);
            }
        }
    }
}

// time: O(n)
// space: O(n)
```

### 7. 开发商购买土地

[KC.44. 开发商购买土地](https://kamacoder.com/problempage.php?pid=1044)

依然是前缀和的思想减少计算量。对空间进行了一些优化，因为有 total 我们不需要整合前缀和数组，只需要上一个前缀和就可以了。

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        try (var scanner = new Scanner(System.in)) {
            int n = scanner.nextInt(); // number of rows
            int m = scanner.nextInt(); // number of columns
            int[] rowSums = new int[n];
            int[] colSums = new int[m];
            int total = 0;

            for (int i = 0; i < n; i++) {
                for  (int j = 0; j < m; j++) {
                    int val =  scanner.nextInt();
                    rowSums[i] += val;
                    colSums[j] += val;
                    total += val;
                }
            }

            int pre = 0;
            int diff = Integer.MAX_VALUE;
            // cut by row
            for (int i = 0; i < n - 1; i++) {
                pre += rowSums[i];
                diff = Math.min(diff, Math.abs(total - pre - pre));
            }

            // but by column
            pre = 0;
            for (int j = 0; j < m - 1; j++) {
                pre += colSums[j];
                diff = Math.min(diff, Math.abs(total - pre - pre));
            }

            System.out.println(diff);
        }
    }
}

// time: O(n x m)
// space: O(n + m)
```
