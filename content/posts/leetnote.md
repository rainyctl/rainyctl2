+++
title = "算道浅行"
description = "刷遍题"
date = 2025-11-09

[taxonomies]
tags = ["algorithm"]

[extra]
toc = true
+++

## 引言

题还是得时常刷刷。时间一久，许多思路就淡了，手感也会生疏。

这次重新来一遍，参照的是[《代码随想录》](https://programmercarl.com/ke/bishi.html)的顺序。
之前那次是按照题号一路刷下来，虽然也学到了不少，但是体系松散，难以融会贯通。有些题只是记住了解法，却不太能灵活应用，理解还不够。

于是想再刷一遍，理清思路，补全结构，也让手感回来一些。

## 数组

数组是一段在虚拟地址空间中连续存储、可通过索引直接访问的同类型元素集合。

```cpp
int arr[5] = {1, 2, 3, 4, 5};
```

### 二分查找

写二分查找时常见两种写法，主要区别在于搜索区间的开闭方式：
一种是左闭右闭 `[left, right]`，另一种是左闭右开 `[left, right)`。

不同的区间定义会影响在更新子区间时的处理方式，因此保持区间定义的一致性非常重要。
如果采用左闭右闭，就要始终维持这一不变式（invariant）。

对我来说，第一种写法更自然一些。

[#704. Binary Search](https://leetcode.com/problems/binary-search/description/)

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        // both ends inclusive
        int left = 0, right = nums.size() - 1;
        // valid range
        while (left <= right) {
            // prevent overflow
            int mid = left + (right - left) / 2;
            // updated range is still inclusive at both ends
            if (nums[mid] == target)
                return mid;
            else if (nums[mid] > target)
                right = mid - 1;
            else
                left = mid + 1;
        }
        return -1;
    }
};

// time: O(log n)
// space: O(1)
```

[#35. Search Insert Position](https://leetcode.com/problems/search-insert-position/)

也来看看循环结束的状态。以闭合区间的写法 `[left, right]`, 在循环结束时如果`target`存在, `left`会最终指向这个`target`。如果`target`不存在，`left`会最终指向第一个大于`target`的元素（即插入点）。

```
Example: nums = [1, 3, 5, 6], target = 4
Final state after loop:
nums:   [ 1,   3,   5,   6 ]
index:    0    1    2    3
               ↑    ↑
             right  left
right → last element < target  (nums[1] = 3)
left  → first element >= target (nums[2] = 5, insertion position)
```

换言之，当循环结束时：
- `right`指向最后一个<`target`的元素
- `left` 指向第一个≥ `target` 的元素
- `left > right`, `left = right + 1`
- `left` 即插入位置

```
... [ right ]  |  [ left ] ...
       < t           ≥ t
```

```cpp
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0, right = nums.size()-1;
        while (left <= right) {
            int mid = left + (right - left)/2;
            if (nums[mid] == target)
                return mid;
            else if (nums[mid] > target)
                right = mid - 1;
            else
                left = mid + 1;
        }
        return left;
    }
};

// time: O(log n)
// space: O(1)
```

[#34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

如果数组中的元素不唯一，我们最终会找到的是一个区间，而不是单一索引。 思路基本相同，只是在遇到相等元素时，
取决于我们如何更新搜索范围（向左还是向右继续查找）， 从而决定我们找到的是左边界还是右边界。

```cpp
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        if (nums.empty()) return {-1, -1};

        int left = findLeft(nums, target);
        if (left == -1) return {-1, -1};

        int right = findRight(nums, target);
        return {left, right};
    }
private:
    int findLeft(vector<int>& nums, int target) {
        int res = -1;
        int left = 0, right = nums.size()-1;
        while (left <= right) {
            int mid = left + (right-left)/2;
            if (nums[mid] == target) {
                // found one, keep searching left
                res = mid;
                right = mid - 1;
            } else if (nums[mid] > target) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return res;
    }

    int findRight(vector<int>& nums, int target) {
        int res = -1;
        int left = 0, right = nums.size()-1;
        while (left <= right) {
            int mid = left + (right-right)/2;
            if (nums[mid] == target) {
                // found one, keep searching right
                res = mid;
                left = mid + 1;
            } else if (nums[mid] > target) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return res;
    }
};

// time: O(log n)
// space: O(1)
```

[#69. Sqrt(x)](https://leetcode.com/problems/sqrtx/description/)

这次我们需要向下取整，也即是找下边界`right`。

```
... [ right ]  |  [ left ] ...
       < t           ≥ t
```

相等的情况（如果存在）经常需要单独处理，所以具体一点是这样的。

```
... [ right ]  mid  [ left ] ...
       < t      =     > t
```

```cpp
// for x < 2, sqrt(x) equals x itself
// for x >=2, search range is [1, x/2] (inclusive)
class Solution {
public:
    int mySqrt(int x) {
        if (x < 2) return x;

        int left = 1, right = x/2;
        while (left <= right) {
            long mid = (left + right) / 2;
            long sqrt = mid * mid;
            if (sqrt == x)
                return mid;
            else if (sqrt > x)
                right = mid - 1;
            else
                left = mid + 1;
        }
        return right;
    }
};

// time: O(log n)
// space: O(1)
```

[#367. Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/description/)

这题与`sqrt(x)`基本相同。

```cpp
class Solution {
public:
    bool isPerfectSquare(int num) {
        if (num < 2) return true;

        int left = 1, right = num/2;
        while (left <= right) {
            long mid = (left + right)/2;
            long sqrt = mid * mid;
            if (sqrt == num)
                return true;
            else if (sqrt > num)
                right = mid - 1;
            else
                left = mid + 1;
        }
        return false;
    }
};

// time: O(log n)
// space: O(1)
```

### 移除元素

[#27. Remove Element](https://leetcode.com/problems/remove-element/)

这里用到了`双指针`。 双指针是一种常用的遍历与操作序列的技巧，通过同时维护两个下标或指针在数组或链表上移动，以更高效的解决问题。常见于去重、分区、反转、查找区间等场景。根据用途不同，又可分为`快慢指针`(一个遍历，一个构建或判断) 和`左右指针`(从两端向中间收缩)两种常见形式。

```cpp
// i: next position for valid element
// j: next element to check
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int i = 0;
        for (int j = 0; j < nums.size(); j++) {
            if (nums[j] != val)nums[i++] = nums[j];
        }
        return i;
    }
}

// time: O(n)
// space: O(1)
```

[#26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/)

这次用快慢指针来做本地去重，两个指针根据应用场景含义发生了变化，但是大致处理结构相同。

```cpp
// i: last unique element
// j: next element to check
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int i = 0;
        for (int j = 1; j < nums.size(); j++) {
            if (nums[j] != nums[i]) nums[++i] = nums[j];
        }
        return i + 1;
    }
};

// time: O(n)
// space: O(1)
```

[#283. Move Zeros](https://leetcode.com/problems/move-zeroes/description/)

同样的技巧，可以观察到操作后元素的相对位置是保持不变的，将剩余元素置零即可。

```cpp
// i: next position for valid element
// j: next element to check
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
       int i = 0;
       for (int j = 0; j < nums.size(); j++) {
        if (nums[j] != 0) nums[i++] = nums[j];
       }
       for (; i < nums.size(); i++) nums[i] = 0;
    }
};

// time: O(n)
// space: O(1)
```

[#844. Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/description/)

`逆向双指针`结合`跳过逻辑`：

这里指针不是从前往后扫描，而是从后往前。这在处理删除、退格、合并排序结果、字符串等对齐场景非常常见。

同时代码中通过跳过逻辑(skip logic)，用计数器来跳过被退格的字符。这种控制结构本质上是在双指针基础上加上了`状态机`逻辑，常见于带有“无效区段”或“需过滤元素”的问题。

代码层面我们也可以把它总结为`双指针`加`嵌套跳过循环`(two pointers with inner skip loop)。这种写法有几个特点：

1. 外层 `while (i >= 0 || j >= 0)` 同步推进两个指针。
2. 内层 `while` 用于跳过特定状态（这里是退格后的字符）。
3. 退出内层循环后，比较两边的有效字符。

```cpp
class Solution {
public:
    bool backspaceCompare(string s, string t) {
        int i = s.size() - 1, skipI = 0;
        int j = t.size() - 1, skipJ = 0;

        while (i >= 0 || j >=0) {
            // find next valid character in s
            while (i >= 0) {
                if (s[i] == '#') {
                    skipI++; i--;
                } else if (skipI) {
                    i--; skipI--;
                } else break;
            }
            // find next valid character in t
            while (j >= 0) {
                if (t[j] == '#') {
                    skipJ++; j--;
                } else if (skipJ) {
                    j--; skipJ--;
                } else break;
            }

            // compare current character
            if (i >=0 && j >= 0 && s[i] != t[j]) return false;
            // if one string is exhausted but the other isn't
            if ((i >= 0) != (j >= 0)) return false;
            // now either both i and j point to the same character, or both are out of bounds

            // move both points to the next position
            i--; j--;
        }

        return true;
    }
};

// time: O(m + n) where m = len(s), n = len(t)
// space: O(1)
```

算法层面没有显示判断`i < 0 && j < 0`返回`true`的情况，但逻辑上是隐式判断了。只要有一个指针还在范围内，就继续循环。 当两个指针都小于 0（即 `i < 0 && j < 0`）时，循环退出并返回`true`。

[#997. Square of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/description/)

双指针从两端向中间靠拢：平方后负数会变大，因此平方后最大值一定在两端。

```cpp
class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int i = 0, j = nums.size() - 1;
        vector<int> res(nums.size());
        int k = res.size() - 1;
        while (i <= j) {
            long left = nums[i] * nums[i];
            long right = nums[j] * nums[j];
            if (left > right) {
                res[k--] = left;
                i++;
            } else {
                res[k--] = right;
                j--;
            }
        }
        return res;
    }
};

// time: O(n)
// space: O(n)
```

### 螺旋矩阵II

[#59. Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/description/)

一道模拟过程的题目。模拟生成矩阵的过程时，可以很自然地分成四个方向依次遍历。
每一轮循环填充一层“外圈”。在开始每轮循环前，要先想清楚当前的边界是否仍然有效。

每一轮的填充顺序为：
1. 从左到右，填充当前最上方一行；
2. 从上到下，填充当前最右侧一列；
3. 从右到左，填充当前最下方一行；
4. 从下到上，填充当前最左侧一列。

当进入循环时，我们已经确保 `left <= right` 且 `top <= bottom`，
因此第 1、2 步总是在边界内可以安全执行。
但在执行完它们后，我们更新了边界：`top++`, `right--`。
此时再进入第 3、4 步前，就需要重新检查是否仍在有效范围内。
这一步实际上是为了避免在 `n` 为奇数时中心点被重复填充或越界。

对于二维矩阵，通常约定：
- `i` 表示行索引，从上到下增加；
- `j` 表示列索引，从左到右增加。

```cpp
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        vector<vector<int>> res(n, vector<int>(n));

        int left = 0, right = n - 1;
        int top = 0, bottom = n - 1;
        int num = 1;
        
        while (left <= right && top <= bottom) {
            // 1. fill top row (left -> right)
            for (int j = left; j <= right; j++)
                res[top][j] = num++;
            top++;

            // 2. fill right column (top -> bottom) 
            for (int i = top; i <= bottom; i++)
                res[i][right] = num++;
            right--;

            // 3. fill bottom row (right -> left), if still within bounds
            if (top <= bottom) {
                for (int j = right; j >= left; j--)
                    res[bottom][j] = num++;
                bottom--;
            }
            
            // 4. fill left column (bottom -> top), if still within bounds
            if (left <= right) {
                for (int i = bottom; i >= top; i--)
                    res[i][left] = num++;
                left++;
            }
        }
        return res;
    }
};

// time: O(n^2)
// space: O(n^2)
```
