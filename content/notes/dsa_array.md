+++
title = "数组"
description = "刷遍题 - 数组"
date = 2025-12-13
updated = 2025-12-13

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

数组是一段在虚拟地址空间中连续存储、可通过索引直接访问的同类型元素集合。

## 题目

### 二分查找

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

### 移除元素

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

### 有序数组的平方

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

### 长度最小的子数组

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

### 螺旋矩阵II

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

