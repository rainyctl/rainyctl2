+++
title = "哈希表"
description = "刷遍题 - 哈希表"
date = 2025-12-15
updated = 2025-12-15

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

哈希表是一种以空间换时间的数据结构，
在平均情况下，把「查找 / 插入 / 删除」的时间复杂度降到 `O(1)`。

## 题目

### 1. 有效的字母异位词

[LT.242. Valid Anagram](https://leetcode.com/problems/valid-anagram/description/)

这里字符集固定且很小，可以用数组代替 `HashMap`。

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); i++) {
            cnt[s.charAt(i) - 'a']++;
            cnt[t.charAt(i) - 'a']--;
        }
        for (int val : cnt) {
            if (val != 0) {
                return false;
            }
        }
        return true;
    }
}

// time: O(n)
// space: O(n)
```

### 2. 两个数组的交集

[LT.349. Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)

```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set = new HashSet<>();
        Set<Integer> res = new HashSet<>();
        for (int a : nums1) {
            set.add(a);
        }
        for (int b : nums2) {
            if (set.contains(b)) {
                res.add(b);
            }
        }
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
}

// time: O(m + n)
// space: O(n)
```

### 3. 快乐数

[LT.202. Happy Number](https://leetcode.com/problems/happy-number/description/)

```java
class Solution {
    public boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        while (n != 1 && !seen.contains(n)) {
            seen.add(n);
            n = getNextNumber(n);
        }
        return n == 1;
    }

    private int getNextNumber(int n) {
        int res = 0;
        while (n > 0) {
            int d = n % 10;
            res += d * d;
            n /= 10;
        }
        return res;
    }
}

// time: O(log n)
// space: O(log n)
```
