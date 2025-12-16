+++
title = "哈希表"
description = "刷遍题 - 哈希表"
date = 2025-12-15
updated = 2025-12-16

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

### 4. 两数之和

[LT.1. Two Sum](https://leetcode.com/problems/two-sum/description/)

梦开始的地方。

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // value -> index
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (map.containsKey(need)) {
                return new int[]{map.get(need), i};
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}

// time: O(n)
// space: O(n)
```

### 5. 四数相加II

[LT.454. 4Sum II](https://leetcode.com/problems/4sum-ii/description/)

数组长度 n ≤ 200 时，四重循环是 n⁴ ≈ 1.6e9，必然超时。
常用优化是把四个数组拆成两组：先枚举 A+B 的所有和并计数，再在 C+D 中查找对应的相反数。这样把 O(n⁴) 降为 O(n²)，n²=4×10⁴，轻松通过。这是典型的 k-sum 降维技巧。

```java
class Solution {
    public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
        // sum -> freq
        Map<Integer, Integer> map = new HashMap<>();
        for (int a : nums1) {
            for (int b : nums2) {
                map.merge(a + b, 1, Integer::sum);
            }
        }
        int res = 0;
        for (int c : nums3) {
            for (int d : nums4) {
                int need = 0 - (c + d);
                if (map.containsKey(need)) {
                    res += map.get(need);
                }
            }
        }
        return res;
    }
}

// time: O(n^2)
// space: O(n^2)
```

### 6. 赎金信

[LT.383. Ransom Note](https://leetcode.com/problems/ransom-note/description/)

可以以 `ransomNote` 为主，也可以以 `magazine` 为主（更简洁）。

```java
// solution 1 (recommend)
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] cnt = new int[26];
        for (char c : magazine.toCharArray()) {
            cnt[c - 'a']++;
        }
        for (char c : ransomNote.toCharArray()) {
            if (--cnt[c - 'a'] < 0) {
                return false;
            }
        }
        return true;
    }
}

// time: O(n + m)
// space: O(1)
```

```java
// solution 2
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        // char -> freq
        Map<Character, Integer> map = new HashMap<>();
        for (int i = 0; i < ransomNote.length(); i++) {
            map.merge(ransomNote.charAt(i), 1, Integer::sum);
        }
        for (int i = 0; i < magazine.length(); i++) {
            map.computeIfPresent(magazine.charAt(i), (_, v) -> v - 1);
        }
        for (int freq : map.values()) {
            if (freq > 0) {
                return false;
            }
        }
        return true;
    }
}

// time: O(n + m)
// space: O(1)
```
