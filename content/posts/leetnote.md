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
