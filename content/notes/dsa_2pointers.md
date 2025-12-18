+++
title = "双指针"
description = "刷遍题 - 双指针"
date = 2025-12-17
updated = 2025-12-17

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

很多题目在 [数组](/notes/dsa-array)，[字符串](/notes/dsa-string) 和 [链表](/notes/dsa-list) 中已经出现过。

## 题目

### 1. 移除元素

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

### 2. 反转字符串

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

### 5. 翻转链表

[LT.206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)

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

[动画演示 - 代码随想录](https://file1.kamacoder.com/i/algo/206.%E7%BF%BB%E8%BD%AC%E9%93%BE%E8%A1%A8.gif)

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;

        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }

        return prev; // reversed head
    }
}

// time: O(n)
// space: O(1)
```

### 6. 表的倒数第N个节点

[LT.19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/)

```
dummy -> 1 -> 2 -> 3 -> 4
 f,s               ^
n = 2 (remove 3)

fast 先走 n+1 = 3 步

dummy -> 1 -> 2 -> 3 -> 4
  s                f

同步移动直至 fast 越界

dummy -> 1 -> 2 -> 3 -> 4
         s              f
dummy -> 1 -> 2 -> 3 -> 4 -> NULL
              s               f

删除 slow 后一个节点
```

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode fast = dummy;
        ListNode slow = dummy;

        // move fast n + 1 steps ahead
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        // move both pointers until fast reaches null
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        // slow is right before the node to remove
        slow.next = slow.next.next;

        return dummy.next;
    }
}

// time: O(n)
// space: O(1)
```

### 7. 链表相交

[LT.160. Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/)

先对齐剩余长度，再同步前进，首次相同即交点。

若两条链表相交，则从交点到尾部的长度必然相同。
先分别计算两条链表的长度，让较长的链表先前进长度差，使两指针到尾部的剩余长度一致；随后同步向前遍历，第一个指向同一节点的位置即为交点，若无则同时到达 `null`。

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        int lenA = getLength(headA);
        int lenB = getLength(headB);
        if (lenA > lenB) {
            int gap = lenA - lenB;
            while (gap-- > 0) {
                headA = headA.next;
            }
        } else {
            int gap = lenB - lenA;
            while (gap-- > 0) {
                headB = headB.next;
            }
        }
        while (headA != null && headB != null) {
            if (headA == headB) {
                return headA;
            }
            headA = headA.next;
            headB = headB.next;
        }

        return null;
    }

    private int getLength(ListNode node) {
        int len = 0;
        while (node != null) {
            len++;
            node = node.next;
        }
        return len;
    }
}

// time: O(m + n)
// space: O(1)
```

### 8. 环形链表II

[LT.142. Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/description/)

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

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode fast = head;
        ListNode slow = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            // find cycle
            if (slow == fast) {
                ListNode p1 = head;
                ListNode p2 = fast;
                while (p1 != p2) {
                    p1 = p1.next;
                    p2 = p2.next;
                }
                return p1; // cycle entry
            }
        }
        return null;
    }
}

// time: O(n)
// space: O(1)
```

### 9. 三数之和

对数组先进行排序有助于去重。看看对 `i`, `l`, 和 `r` 去重具体是怎么实现的。

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        int n = nums.length;
        for (int i = 0; i < n - 2; i++) {
            if (nums[i] > 0) {
                break; // nothing possible
            }
            // skip duplicated i
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            int l = i + 1;
            int r = n - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    // skip duplicated l
                    while (l < r && nums[l + 1] == nums[l]) {
                        l++;
                    }
                    // skip duplicated r
                    while (l < r && nums[r - 1] == nums[r]) {
                        r--;
                    }
                    // move to new value
                    l++;
                    r--;
                } else if (sum < 0) {
                    l++;
                } else {
                    r--;
                }
            }
        }

        return res;
    }
}

// time: O(n^2)
// space: O(1) not consider output
```
