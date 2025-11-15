+++
title = "算道浅行"
description = "刷遍题"
date = 2025-11-09
updated = 2025-11-15

[taxonomies]
tags = ["algorithm"]

[extra]
toc = true
math = true
+++

## 引言

题还是得时常刷刷。时间一久，许多思路就淡了，手感也会生疏。

这次重新来一遍，参照的是[《代码随想录》](https://programmercarl.com/ke/bishi.html)的顺序。
之前那次是按照题号一路刷下来，虽然也学到了不少，但是体系松散，难以融会贯通。有些题只是记住了解法，却不太能灵活应用。

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

### 有序数组的平方

[#977. Square of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/description/)

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

### 长度最小的字数组

[#209. Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)

`滑动窗口`(`sliding window`)是数组与字符串题里常用的思想之一。滑动窗口维护一个动态区间`[left, right]`，
不断地扩展右边界来满足条件，再收缩左边界来优化结果。

常见于在连续序列中，寻找满足某种条件的最短/最长/固定长度区间。 `left`和`right`单调向前移动，因此大多能做到`O(n)`的时间复杂度。

```cpp
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int len = INT_MAX;
        int left = 0;
        int sum = 0;
        for (int right = 0; right < nums.size(); right++) {
            sum += nums[right];
            while (sum >= target) {
                len = min(len, right - left + 1);
                sum -= nums[left++];
            }
        }
        return len == INT_MAX ? 0 : len;
    }
};

// time: O(n)
// space: O(1)
```

[#904. Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/description/)

同样是`滑动窗口`的移动方式：
1. 右指针 `right` 一格一格前进 → 扩大窗口；
2. 左指针 `left` 有时连续前进多步 → 缩小窗口以恢复合法状态；
3. 每次扩张后都要判断“当前窗口是否合法”；
    - 不合法则继续收缩；
    - 合法则计算/更新答案。

```cpp
class Solution {
public:
    int totalFruit(vector<int>& fruits) {
        unordered_map<int, int> count;
        int left = 0;
        int sum = 0;

        for (int right = 0; right < fruits.size(); right++) {
            count[fruits[right]]++; // expand the window by adding current fruit
            while (count.size() > 2) { // shrink from left until window is valid
                if (--count[fruits[left]] == 0)
                    count.erase(fruits[left]);
                left++;
            }
            sum = max(sum, right - left + 1); // update result after window becomes valid
        }
        return sum;
    }
};

// time: O(n)
// space: O(1)
```

[#76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/)

`滑动窗口`配合计数：
1. `right` 扩张窗口加入字符，统计匹配数量 `matched`；
2. 当 `matched == need.size()` 说明窗口已包含全部字符；
3. 然后尝试收缩 `left` 以最短化， 每次收缩时更新最短区间；
3. 若窗口不再满足条件，继续右扩。

```cpp
class Solution {
public:
    string minWindow(string s, string t) {
        if (s.empty() || t.empty()) return "";

        unordered_map<char, int> need, window;
        for (char c : t) need[c]++;

        int left = 0, matched = 0;
        int minLen = INT_MAX, minStart = 0;

        for (int right = 0; right < s.size(); right++) {
            // expand from right
            char c = s[right];
            window[c]++;
            if (need.count(c) && need[c] == window[c])
                matched++;
            while (matched == need.size()) {
                int len = right - left + 1;
                if (len < minLen) {
                    minLen = len;
                    minStart = left;
                }

                // shrink from left
                char c = s[left];
                window[c]--;
                if (need.count(c) && need[c] > window[c])
                    matched--;
                left++;
            }
        }
        return minLen == INT_MAX ? "" : s.substr(minStart, minLen);
    }
};

// time: O(m + n), where m = len(s), n = len(t)
// space: O(m + n)
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

[#54. Spiral Matrix](https://leetcode.com/problems/spiral-matrix/description/)

与上一题基本相同，这次不是写而是读，也是要时常注意边界条件（是否会越界）。

```cpp
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return {};

        vector<int> res;
        int top = 0, bottom = matrix.size()-1;
        int left = 0, right = matrix[0].size()-1;

        while (top <= bottom && left <= right) {
            // 1. top row, left -> right
            for (int j = left; j <= right; j++)
                res.push_back(matrix[top][j]);
            top++;

            // 2. right column, top -> bottom
            for (int i = top; i <= bottom; i++)
                res.push_back(matrix[i][right]);
            right--;

            // 3. bottom row, right -> left
            if (top <= bottom) {
                for (int j = right; j >= left; j--)
                    res.push_back(matrix[bottom][j]);
                bottom--;
            }

            // 4. left column, bottom -> top
            if (left <= right) {
                for (int i = bottom; i >= top; i--)
                    res.push_back(matrix[i][left]);
                left++;
            }
        }
        return res;
    }
};
```

### 区间和

[#58. 区间和 - KamaCoder](https://kamacoder.com/problempage.php?pid=1070)

`前缀和`(`Prefix Sum` or `presum`)是一种通过“累计”预处理来实现快速区间求和的技巧。

对于数组 $nums=[a_0, a_1, a_2, \ldots, a_{n-1}]$
定义`前缀和数组` $p[i]$ 表示前`i`个数的总和。

即：
- `p[0] = 0`
- `p[1] = nums[0]`
- `p[2] = nums[0] + nums[1]`
- `p[3] = nums[0] + nums[1] + nums[2]`
- `p[i] = nums[0] + nums[1] + ... + nums[i-1]`

于是任意闭合区间`[l, r]`的和就可以写为：`sum(l, r) = p[r+1] - p[l]`。

前缀和有两种常见的写法（是否在前面多加一个零）。上述是第一种写法，区间求和公式比较自然。
特别在`l = 0`时`sum(0, r) = p[r+1] - p[0] = p[r+1]`。

而如果是第二种写法我们不在前面多加一个零, 此时`p[0] = nums[0]`。求和时就需要对`l = 0`单独判断了: `sum(l, r) = (l == 0 ? p[r] : p[r] - p[l-1])`。

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n, num, psum = 0; // presum so far
    cin >> n;
    vector<long long> p(n+1, 0); // presum array

    for (int i = 0; i < n; i++) {
        cin >> num;
        psum += num;
        p[i+1] = psum;
    }
    int a, b;
    while (cin >> a && cin >> b)
        cout << p[b+1] - p[a] << endl;
}

// time: O(n)
// space: O(n)
```

[#303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/description/)

同样也用`前缀和数组`。

```cpp
class NumArray {
public:
    NumArray(vector<int>& nums) {
        prefix.resize(nums.size()+1, 0);
        for (int i = 0; i < nums.size(); i++)
            prefix[i+1] = prefix[i] + nums[i];
    }
    
    int sumRange(int left, int right) {
        return prefix[right+1] - prefix[left];
    }
private:
    vector<int> prefix;
};

/**
 * Your NumArray object will be instantiated and called as such:
 * NumArray* obj = new NumArray(nums);
 * int param_1 = obj->sumRange(left,right);
 */

// time: O(n)
// space: O(n) = construct prefix sum array O(n) + range sum query O(1)
```

### 开发商购买土地

[#44. 开发商购买土地 - KamaCoder](https://kamacoder.com/problempage.php?pid=1044)

虽然没有直接构造二维`前缀和数组`，但本题依然体现了`前缀和`的思想。
通过提前计算每行、每列的总和，在两个方向上各自求一次`前缀和`，从而避免了重复累加，降低了复杂度。

```cpp
#include <iostream>
#include <vector>
#include <climits>
#include <cstdlib>
#include <algorithm>

using namespace std;

int main() {
    int m, n;
    cin >> m; // row
    cin >> n; // column
    long long sum = 0; // total sum

    vector<long long> rowSum(m, 0); // sum of each row
    vector<long long> colSum(n, 0); // sum of each column
    int num;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> num;
            sum += num;
            rowSum[i] += num;
            colSum[j] += num;
        }
    }

    long long diff = INT_MAX;
    long long psum = 0; // presum
    // cut horizontally
    for (int i = 0; i < m; i++) {
        psum += rowSum[i]; // area of company a
        long long other = sum - psum; // area of company b
        diff = min(diff, llabs(psum - other));
    }

    // cut vertically
    psum = 0; // reset
    for (int j = 0; j < n; j++) {
        psum += colSum[j]; // area of company a
        long long other = sum - psum; // area of company b
        diff = min(diff, llabs(psum - other));
    }

    cout << diff << endl;
}

// time: O(m x n)
// space: O(m + n)
```

## 链表

链表是一种由节点顺次连接而成的线性结构，每个节点保存数据和指向下一个节点的指针，因此不需要连续内存。它的主要优点是插入、删除某个已知位置的节点可以在 O(1) 时间完成，结构灵活、内存利用弹性高。缺点是无法随机访问，访问任意位置都必须从头依次遍历，缓存局部性差、整体速度通常不如数组。

链表常用于需要频繁插入删除的场景，比如实现队列、LRU 缓存内部的双向链、或操作系统中的任务调度队列。

```cpp
// node in a singly linked list
struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val{}, next{nullptr} {}
    ListNode(int x) : val{x}, next{nullptr} {}
    ListNode(int x, ListNode* next) : val{x}, next{next} {}
}
```

### 移除链表元素

[#203. Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/description/)

在删除链表节点时，如果删除的是头节点，需要单独处理 `head` 的更新。
如果删除的是中间节点，只需让前驱节点 `prev->next = cur->next`。为了避免对头节点特判，我们通常在 `head` 前加一个 `dummy` 节点，把所有删除操作统一成“删除某节点的下一节点”，这是链表中常用的技巧。

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode dummy;
        dummy.next = head;
        ListNode* cur = &dummy;

        while (cur->next) {
            if (cur->next->val == val) {
                cur->next = cur->next->next;
            } else {
                cur = cur->next;
            }
        }
        return dummy.next;
    }
};

// time: O(n)
// space: O(1)
```

LeetCode 环境下一般会省略 `delete`，真实工程需显式释放被删除的节点。

### 设计链表

[#707. Design Linked List](https://leetcode.com/problems/design-linked-list/description/)

插入或删除一个节点都必须先找到它的前驱节点。引入 `dummy node` 后，链表的头节点也拥有“前驱”，从而统一了所有位置的操作逻辑。`size` 则用于 `O(1)` 判断越界，使边界处理更简单可靠。以下是单链表的实现，省略了析构函数。

```cpp
class MyLinkedList {
private:
    struct ListNode {
        int val;
        ListNode* next;
        ListNode(int val) : val{val}, next{nullptr} {}
    };
    ListNode* dummy;
    int size;
public:
    MyLinkedList() {
        dummy = new ListNode(0);
        size = 0;
    }
    
    // time: O(n)
    int get(int index) {
        if (index < 0 || index >= size) return -1;
        ListNode* cur = dummy->next;
        while (index--) cur = cur->next;
        return cur->val;
    }
    
    // time: O(1)
    void addAtHead(int val) {
        addAtIndex(0, val);
    }
    
    // time: O(n)
    void addAtTail(int val) {
        addAtIndex(size, val);
    }
    
    // time: O(n)
    void addAtIndex(int index, int val) {
        // valid index range [0, size]
        // when index == 0: insert before head
        // when index == size: append at tail
        if (index < 0 || index > size) return;

        ListNode* prev = dummy;
        while (index--) prev = prev->next;

        ListNode* node = new ListNode(val);
        // insert before current node
        node->next = prev->next; 
        prev->next = node;
        size++;
    }
    
    // time: O(n)
    void deleteAtIndex(int index) {
        // valid index range [0 size)
        if (index < 0 || index >= size) return;

        ListNode* prev = dummy;
        while (index--) prev = prev->next;

        ListNode* cur = prev->next;
        prev->next = cur->next;
        delete cur;
        size--;
    }
};

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * MyLinkedList* obj = new MyLinkedList();
 * int param_1 = obj->get(index);
 * obj->addAtHead(val);
 * obj->addAtTail(val);
 * obj->addAtIndex(index,val);
 * obj->deleteAtIndex(index);
 */
```

### 翻转链表

```
# Reverse Linked List (A → B → C → D → NULL)
----------------------------------------------------
NULL   A → B → C → D → NULL
^      ^
prev   cur

----------------------------------------------------
NULL ← A    B → C → D → NULL
       ^    ^
       prev cur

----------------------------------------------------
NULL ← A ← B    C → D → NULL
           ^    ^
           prev cur

----------------------------------------------------
NULL ← A ← B ← C    D → NULL
               ^    ^
               prev cur

----------------------------------------------------
NULL ← A ← B ← C ← D      NULL
                   ^      ^
                   prev   curr
               (new head) (stop)
```

反转链表时，我们用 `prev` 指向已经反转好的前一节点，用 `cur` 指向当前处理的节点。每一步先保存 `cur` 的下一个节点避免链表断开，然后让 `cur->next` 指向 `prev` 完成指针反转，接着把 `prev` 移到 `cur`，`cur` 再移动到原来的下一个节点。这样 `prev` 不断向右推进、链表指针不断从右向左翻转，直到 `cur` 变为 `NULL`，此时 `prev` 就是整个链表反转后的新头节点。

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *prev = nullptr;
        while (head) {
            ListNode* next = head->next;
            head->next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
};

// time: O(n)
// space: O(1)
```

### 两两交换链表中的节点

[#24. Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/description/)

```
prev → first → second → next
```

1. 让 `first` 指向 `second` 之后的节点: `first → next`
2. 把 `second` 放到 `first` 前面: `second → first`
3. 把交换好的这一对接回链表: `prev → second`

```
curr → second → first → next
```

然后把 `prev` 前进到 `first`，继续下一对处理。先操作第一步以防链表结构断掉。

由于交换操作需要访问每一对节点的前驱，因此同样要使用 `dummy` 节点，使头节点也拥有统一的前驱。`prev` 始终指向已完成交换部分的最后一个节点，用来连接下一对将要交换的节点。

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        ListNode* dummy = new ListNode();
        dummy->next = head;
        ListNode* prev = dummy;

        while (prev->next && prev->next->next) {
            ListNode* first = prev->next;
            ListNode* second = first->next;
            first->next = second->next;
            second->next = first;
            prev->next = second;
            prev = first;
        }
        return dummy->next;
    }
};

// time: O(n)
// space: O(1)
```

### 删除链表的倒数第N个节点

[#19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/)

采用 `dummy` 节点 + `快慢指针`。让 `fast` 先走 `n` 步，形成间隔；然后让 `fast` 和 `slow` 一起走，当 `fast` 到达链表末尾时，`slow` 刚好停在目标节点的前一个位置。此时将 `slow->next` 指向下下个节点即可完成删除。使用 `dummy` 能统一处理删除头节点等情况，使逻辑更加简洁稳定。

```
dummy → 1 → 2 → 3 → 4 → 5, n = 2
^slow
^fast

1) fast moves n steps:
dummy → 1 → 2 → 3 → 4 → 5
^slow       ^fast

2) fast and slow move together until fast hits the end:
dummy → 1 → 2 → 3 → 4 → 5
                ^slow   ^fast

3) slow->next is the target, skip it:
dummy → 1 → 2 → 3 → 5
```

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* dummy = new ListNode();
        dummy->next = head;
        ListNode* slow = dummy;
        ListNode* fast = dummy;
        while (n--) fast = fast->next;
        while (fast->next) {
            fast = fast->next;
            slow = slow->next;
        }
        slow->next = slow->next->next;
        return dummy->next;
    }
};

// time: O(n)
// space: O(1)
```

### 链表相交

[#160. Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/description/)

`双指针交换走法`, 两人走一样长的路，必在交点相遇。

```
A: a1 → a2 → a3 → c1 → c2
B: b1 → b2 → b3 → b4 → c1 → c2
```

让两个指针：
- A 走完后去 B
- B 走完后去 A

最终路径：
```
pA: A → C → B
pB: B → C → A
```

两者走过的总长度都是`a + b + c` 若有交点则必在 c1 同步到达。
若无交点， 则都会走到 `nullptr`。

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        ListNode* curA = headA;
        ListNode* curB = headB;
        while (curA != curB) {
            curA = curA ? curA->next : headB;
            curB = curB ? curB->next : headA;
        }
        return curA;
    }
};

// time: O(m + n), where m = len(a), n = len(b)
// space: O(1)
```

### 环形链表II

[#142. Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/description/)

`Floyd判圈` (`弗洛伊德判环算法`或`Floyd Cycle Detection Algorithm`)


阶段一：用两个指针（`slow`、`fast`）检测链表是否有环：
- `slow` 每次走 1 步
- `fast` 每次走 2 步
    - 如果链表中没有环: `fast` 会先走到 `nullptr`，不会相遇
    - 如果链表中有环: `fast` 必然会追上 `slow`，最终两者会相遇

阶段二：寻找环入口
- 让一个指针从 `head` 出发
- 另一指针从相遇点出发
- 两者都每次走 1 步
- 最终相遇的位置就是环的入口

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        ListNode* fast = head;
        ListNode* slow = head;

        // ensure fast can safely move two steps
        while (fast && fast->next) {
            fast = fast->next->next;
            slow = slow->next;
            if (fast == slow) break;
        }

        if (!fast || !fast->next) {
            return nullptr;
        }

        slow = head;
        while (slow != fast) {
            slow = slow->next;
            fast = fast->next;
        }
        return slow;
    }
};

// time: O(n)
// space: O(1)
```

从 `slow` 的角度，它始终以 1 步/次向前移动。无环时 `slow` 最多走完整个链表一次；有环时 `slow` 到达环入口后在环内最多再走一圈就会被 `fast` 追上，而环长也不超过链表长度。因此 `slow` 的总步数始终在链表节点数量级内，整体时间复杂度为 `O(n)`。

## 哈希表

`哈希表`利用`哈希函数`把 `key` 映射到数组的某个位置，只要分布足够均匀，插入、删除、查找通常都能做到**平均** `O(1)`。

核心做法就是先把 `key` 哈希成一个下标，再用这个下标快速定位到对应的桶(`bucket`)，如果发生冲突则通过链表或开放寻址处理。只要负载因子不过高、冲突不集中，整体性能依然接近常数级，因此哈希表也成为工程和算法中使用最广泛的基础结构之一，C++ 的 `unordered_map` / `unordered_set` 就是典型实现。

| 操作         | 平均复杂度   | 最坏复杂度 | 说明            |
| ---------- | ------- | ----- | ------------- |
| 插入         | O(1)    | O(n)  | rehash 或大量冲突时 |
| 查找         | O(1)    | O(n)  | 所有元素落在一个桶里    |
| 删除         | O(1)    | O(n)  | 同查找一样         |
| 扩容（rehash） | armotized O(1) | O(n)  | 需要重分布全部 key   |

```cpp
// hash set
// stores unique elements. provides O(1) average-time lookup
unordered_set<int> set = {1, 2, 3, 5, 8};

// hash map
// key value mapping implemented with a hash table
unordered_map<string, int> freq = {
    {"key1", 1},
    {"key2", 3},
    {"key3", 2}
};

// perfect hash (array counting)
// when the key space is small and continuous (e.g. 'a' to 'z')
// an array can be used as a perfect hash table
// no collisions, fastest lookup
int cnt[26] = {0};
```

### 有效的字母异位词

[#242. Valid Anagram](https://leetcode.com/problems/valid-anagram/description/)

判断两个字符串是否由相同字符频次组成。最优方法是用大小为 26 的计数数组做频率差值，通过一次遍历解决，时间 `O(n)`、空间 `O(1)`。若字符集未知，则用哈希表。排序是最简单但不是最优的通用解法。

```cpp
class Solution {
public:
    bool isAnagram(string s, string t) {
        int cnt[26] = {0};
        for (char ch : s) cnt[ch - 'a']++;
        for (char ch : t) cnt[ch - 'a']--;
        for (int val : cnt) {
            if (val != 0) return false;
        }
        return true;
    }
};

// time: O(n)
// space: O(1)
```
