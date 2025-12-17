+++
title = "字符串"
description = "刷遍题 - 字符串"
date = 2025-12-16
updated = 2025-12-17

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

### 3. 替换数字

[KC.54. 替换数字](https://kamacoder.com/problempage.php?pid=1064)

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            String s = scanner.nextLine();
            StringBuilder sb = new StringBuilder();
            for (char c : s.toCharArray()) {
                if (c >= 'a' && c <= 'z') {
                    sb.append(c);
                } else {
                    sb.append("number");
                }
            }
            System.out.println(sb.toString());
        }
    }
}
// time: O(n)
// space: O(n)
```

### 4. 翻转字符串里的单词

[LT.151. Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/description/)

这里得注意用 `trim` 去掉字符串开头结尾的空字符，不然 `split` 开头会多一个空字符串。（虽然默认会丢弃结尾的空字符串）

```java
String s = "  hello world  "
s.split("\\s+");
// ["", "hello", "world"]
```

```java
class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) {
                sb.append(" ");
            }
        }
        return sb.toString();
    }
}
// time: O(n)
// space: O(n)
```

### 5. 右旋字符串

[KC.55. 右旋字符串](https://kamacoder.com/problempage.php?pid=1065)

`三次反转法`: 符串的旋转，本质都是把字符串分成两段，然后交换顺序。

适用于：
- 左旋 k（把前 k 个字符移到后面）
- 右旋 k（把后 k 个字符移到前面）

时间复杂度 O(n)，空间 O(1)。(如果字符串是可变的，否则依然是 O(1))

```
== 左旋 k ==

原始：
a b c d e f g

1. reverse whole
g f e d c b a

2. reverse the first n-k elements
g f e d c | b a
↓ ↓ ↓ ↓ ↓
c d e f g | b a

3. reverse the last k elements
c d e f g | b a
            ↓ ↓
c d e f g | a b
```

```
== 右旋 k ==

原始：
a b c d e f g

1. reverse whole
g f e d c b a

2. reverse the first k elements
g f | e d c b a
↓ ↓
f g | e d c b a

3. reverse the last n-k elements
f g | e d c b a
      ↓ ↓ ↓ ↓ ↓
f g | a b c d e
```

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int k = scanner.nextInt();
            String s = scanner.next();

            char[] arr = s.toCharArray();
            int n = arr.length;
            k %= n; // k might be longer than n

            reverse(arr, 0, n - 1);
            reverse(arr, 0, k - 1);
            reverse(arr, k, n - 1);
            System.out.println(new String(arr));
        }
    }

    private static void reverse(char[] arr, int l, int r) {
        while (l < r) {
            char tmp = arr[l];
            arr[l] = arr[r];
            arr[r] = tmp;
            l++;
            r--;
        }
    }
}

// time: O(n)
// space: O(n)
```

### 6. 实现strStr()

[LT.28. Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/description/)

KMP 算法，[代码随想录](https://programmercarl.com/0028.%E5%AE%9E%E7%8E%B0strStr.html#%E7%AE%97%E6%B3%95%E5%85%AC%E5%BC%80%E8%AF%BE) 里的讲解和动画演示都很好推荐看看。

**核心思想**：失败时不回退文本串，而是利用 `lps` 表回退模式串的位置，继续匹配。

**前缀**：从第一个字符开始，但不能包含最后一个字符的所有连续子串。

```
例："ababa" 的前缀(prefix)有：
     a 
     ab 
     aba 
     abab 
```

**后缀**: 以最后一个字符结束，但不能包含第一个字符的所有连续子串。

```
例："ababa" 的后缀(suffix)有：
      baba 
       aba 
        ba 
         a 
```

`lps`: Longest Prefix Suffix 即"最长前后缀"是 KMP 的核心概念。

```
lps[i] 表示：
pattern[0..i] 这个子串中，最长的 “相等前缀 = 相等后缀” 的长度。
```

例： pattern = "aabaa"

| i | 子串      | 最长相等前后缀 | lps[i] |
| - | ------- | ------- | ------ |
| 0 | "a"     | 无       | 0      |
| 1 | "aa"    | "a"     | 1      |
| 2 | "aab"   | 无       | 0      |
| 3 | "aaba"  | "a"     | 1      |
| 4 | "aabaa" | "aa"    | 2      |


```
lps = [0, 1, 0, 1, 2]
```

`lps` 表在实现中也经常被叫做 `next` 表。

```
text:    a a b a a b a a f a
pattern: a a b a a f
next:    0 1 0 1 2 0

text:    a a b a a b a a f a
                   i
pattern: a a b a a f
                   j
                   ^ first mismatch
next:    0 1 0 1 2 0

j = next[j - 1] = 2

text:    a a b a a b a a f a
                   i
pattern: a a b a a f
             j      
             ^ fallback to pattern[2]
               2 is the length of lsp,
               and also the next index to match
next:    0 1 0 1 2 0

i, j now match and proceed

text:    a a b a a b a a f a
                         i
pattern: a a b a a f
                   j
                   ^
next:    0 1 0 1 2 0

text:    a a b a a b a a f a
                           i
pattern: a a b a a f
                     j
                     ^ all matched
next:    0 1 0 1 2 0
```

```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) {
            return 0;
        }
        int n = haystack.length();
        int m = needle.length();
        int[] next = buildNext(needle);

        // i scans haystack forward
        // j points to needle, either move forward or fallback
        for (int i = 0, j = 0; i < n; i++) {
            while (j > 0 && needle.charAt(j) != haystack.charAt(i)) {
                j = next[j - 1];
            }
            if (needle.charAt(j) == haystack.charAt(i)) {
                j++;
            }
            if (j == m) {
                return i - m + 1; // match found
            }
        }
        return -1; // no match
    }

    // next[i] = length of lsp of p[0..i] (inclusive)
    private int[] buildNext(String p) {
        int m = p.length();
        int[] next = new int[m];
        // i scans the string, starting from 1 since lsp[0] = 0
        // j the length of current matched prefix
        for (int i = 1, j = 0; i < m; i++) {
            while (j > 0 && p.charAt(i) != p.charAt(j)) {
                j = next[j - 1];
            }
            if (p.charAt(i) == p.charAt(j)) {
                j++;
            }
            next[i] = j;
        }
        return next;
    }
}

// time: O(m + n)
// space: O(m)
```
