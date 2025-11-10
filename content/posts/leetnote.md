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
之前那次是按照题号一路刷下来，虽然也学到了不少，但是体系松散，难以融会贯通。有些题只是记住了
解法，却不太能灵活应用，理解还不够。

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

[704. Binary Search](https://leetcode.com/problems/binary-search/description/)

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

[35. Search Insert Position](https://leetcode.com/problems/search-insert-position/)
