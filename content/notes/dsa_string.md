+++
title = "字符串"
description = "刷遍题 - 字符串"
date = 2025-12-16
updated = 2025-12-16

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

```java
String s = "hello"
```

## 题目

### 1. 反转字符串

[LT.344. Reverse String](https://leetcode.com/problems/reverse-string/description/)

双指针从两端向中间移动，本地反转字符串（数组）。


```java
class Solution {
    public void reverseString(char[] s) {
        int l = 0, r = s.length - 1;
        while (l < r) {
            char tmp = s[l];
            s[l] = s[r];
            s[r] = tmp;
            l++;
            r--;
        }
    }
}

// time: O(n)
// space: O(1)
```

### 2. 反转字符串II

反转一个字符串（字符数组）的时候想到用双指针。
将问题分割成重复的子问题或者已解决的概念。

```java
class Solution {
    public String reverseStr(String s, int k) {
        char[] arr = s.toCharArray();
        for (int i = 0; i < arr.length; i += 2 * k) {
            int l = i;
            int r = Math.min(i + k - 1, arr.length - 1);
            while (l < r) {
                char tmp = arr[l];
                arr[l] = arr[r];
                arr[r] = tmp;
                l++;
                r--;
            }
        }
        return new String(arr);
    }
}

// time: O(n)
// space: O(n)
```
