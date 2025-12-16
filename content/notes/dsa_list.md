+++
title = "链表"
description = "刷遍题 - 链表"
date = 2025-12-14
updated = 2025-12-15

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

链表是一种由节点顺次连接而成的线性结构，每个节点保存数据和指向下一个节点的指针，因此不需要连续内存。它的主要优点是插入、删除某个已知位置的节点可以在 O(1) 时间完成，结构灵活、内存利用弹性高。缺点是无法随机访问，访问任意位置都必须从头依次遍历，缓存局部性差、整体速度通常不如数组。

链表常用于需要频繁插入删除的场景，比如实现队列、LRU 缓存内部的双向链、或操作系统中的任务调度队列。

```java
public class ListNode {
    int val;
    ListNode next;

    ListNode() {}

    ListNode(int val) {
        this.val = val;
    }

    ListNode(int val, ListNode next) {
        this.val = val;
        this.next = next;
    }
}
```

## 题目

### 1. 移除链表元素

[LT.203. Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/description/)

我们需要 track 当前元素前一个元素，或者是当前元素下一个元素。使用 dummy node 可以统一对头节点的处理。

```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode cur = dummy;

        while (cur.next != null) {
            if (cur.next.val == val) {
                cur.next = cur.next.next; // skip
            } else {
                cur = cur.next; // move to next
            }
        }

        return dummy.next;
    }
}
// time: O(n)
// space: O(1)
```

### 2. 设计链表

[LT.707. Design Linked List](https://leetcode.com/problems/design-linked-list/description/)

从实现一个简单的但链表解决问题开始。我们也可以用双链表，或者 track 尾节点优化部分操作，但是状态越多实现起来就越复杂。在问题没有解决前，先试着用最简单直接的方式。

```java
class MyLinkedList {
    private ListNode dummy;
    private int length;

    public MyLinkedList() {
        this.dummy = new ListNode(0);
        this.length = 0;
    }
    
    // O(n)
    public int get(int index) {
        if (index < 0 || index >= length) {
            return -1;
        }
        ListNode cur = dummy.next;
        for (int i = 0; i < index; i++) {
            cur = cur.next;
        }
        return cur.val;
    }
    
    // O(1)
    public void addAtHead(int val) {
        addAtIndex(0, val);
    }
    
    // O(n)
    public void addAtTail(int val) {
        addAtIndex(length, val);
    }
    
    // O(n)
    public void addAtIndex(int index, int val) {
        if (index < 0 || index > length) {
            return;
        }
        ListNode prev = dummy;
        for (int i = 0; i < index; i++) {
            prev = prev.next;
        }
        ListNode node = new ListNode(val);
        node.next = prev.next;
        prev.next = node;
        length++;
    }
    
    // O(n)
    public void deleteAtIndex(int index) {
        if (index < 0 || index >= length) {
            return;
        }
        ListNode prev = dummy;
        for (int i = 0; i < index; i++) {
            prev = prev.next;
        }
        prev.next = prev.next.next;
        length--;
    }
}
```

### 3. 翻转链表

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

### 4. 两两交换链表中的节点

[LT.24. Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/description/)

```
from:
    prev → first → second → next

to:
    prev → second → first → next

then point prev to first and repeat
```

反向构建这个新链表可以避免使用 tmp 节点：
1. 让 `first` 指向 `second` 之后的节点: `first → next`
2. 把 `second` 放到 `first` 前面: `second → first → next`
3. 把交换好的这一对接回链表: `prev → second → first → next`

然后把 `prev` 前进到 `first`，继续下一对处理。先操作第一步以防链表结构断掉。

有 `prev` 的时候使用 `dummy` 节点可以简化对头节点的处理。

```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode first = prev.next;
            ListNode second = prev.next.next;
            ListNode next = second.next;
            // prev -> second -> first -> next
            // build it from tail to head so we don't need tmp nodes
            first.next = next;
            second.next = first;
            prev.next = second;
            prev = first;
        }
        return dummy.next;
    }
}

// time: O(n)
// space: O(1)
```

### 5. 删除链表的倒数第N个节点

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

### 6. 链表相交

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

### 7. 环形链表II

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
