+++
title = "栈与队列"
description = "刷遍题 - 栈与队列"
date = 2025-12-19
updated = 2025-12-19

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

### Deque

[Java Deque Interface](https://docs.oracle.com/javase/8/docs/api/java/util/Deque.html)

| 操作          | Head（抛异常）       | Head（特殊值）       | Tail（抛异常）      | Tail（特殊值）      |
| ----------- | --------------- | --------------- | -------------- | -------------- |
| **Insert**  | `addFirst(e)`   | `offerFirst(e)` | `addLast(e)`   | `offerLast(e)` |
| **Remove**  | `removeFirst()` | `pollFirst()`   | `removeLast()` | `pollLast()`   |
| **Examine** | `getFirst()`    | `peekFirst()`   | `getLast()`    | `peekLast()`   |

- 抛异常：失败时抛 `NoSuchElementException`
- 特殊值：失败时返回 `null` 或 `false`

### 队列 FIFO

| Queue 方法    | 等价的 Deque 方法    |
| ----------- | --------------- |
| `add(e)`    | `addLast(e)`    |
| `offer(e)`  | `offerLast(e)`  |
| `remove()`  | `removeFirst()` |
| `poll()`    | `pollFirst()`   |
| `element()` | `getFirst()`    |
| `peek()`    | `peekFirst()`   |

- 尾部入队（Last）
- 头部出队（First）

### 栈 LIFO

| Stack 方法  | 等价的 Deque 方法    |
| --------- | --------------- |
| `push(e)` | `addFirst(e)`   |
| `pop()`   | `removeFirst()` |
| `peek()`  | `peekFirst()`   |

- 头部入栈 `push` (First)
- 头部出栈 `pop` (First)

## 题目

### 1. 用栈实现队列

[LT.232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/description/)

使用两个栈实现队列。

```java
class MyQueue {
    // use as stack
    private Deque<Integer> in = new ArrayDeque<>();
    private Deque<Integer> out = new ArrayDeque<>();

    public MyQueue() {

    }

    // O(1)
    public void push(int x) {
        in.push(x);
    }

    // O(n), armotized O(1)
    public int pop() {
        moveIfNeeded();
        return out.pop();
    }

    // O(n), armotized O(1)
    public int peek() {
        moveIfNeeded();
        return out.peek();
    }

    // O(1)
    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }

    private void moveIfNeeded() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) {
                out.push(in.pop());
            }
        }
    }
}
```

### 2. 用队列实现栈

[LT.225. Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/description/)

`push(x)` 先入队，然后把前面的元素依次出队再入队，让 `x` 转到队头（队头就是“栈顶”）。

```java
class MyStack {
    // use queue interface
    private Deque<Integer> queue = new ArrayDeque<>();

    public MyStack() {
        
    }
    
    // O(n)
    public void push(int x) {
        queue.offer(x);
        // rotate: move previous elements behind x
        for (int i = 0; i < queue.size() - 1; i++) {
            queue.offer(queue.poll());
        }
    }
    
    // O(1)
    public int pop() {
        return queue.poll();
    }
    
    // O(1)
    public int top() {
        return queue.peek();
    }
    
    // O(1)
    public boolean empty() {
        return queue.isEmpty();
    }
}
```

### 3. 有效的括号

[LT.20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/description/)

```java
class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') {
                stack.push(')');
            } else if (c == '{') {
                stack.push('}');
            } else if (c == '[') {
                stack.push(']');
            } else {
                if (stack.isEmpty() || stack.pop() != c) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}

// time: O(n)
// space: O(n)
```

### 4. 删除字符串中的所有相邻重复项

[LT.1047. Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/description/)

用栈去重，结果需要反转一下。

```java
class Solution {
    public String removeDuplicates(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            if (!stack.isEmpty() && stack.peek() == c) {
                stack.pop();
            } else {
                stack.push(c);
            }
        }

        StringBuilder sb = new StringBuilder();
        while (!stack.isEmpty()) {
            sb.append(stack.pop());
        }
        return sb.reverse().toString();
    }
}
// time: O(n)
// space: O(n)
```

### 5. 逆波兰表达式求值

[LT.150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/description/)

RPN 用栈求值，遇到运算符时先弹右操作数，再弹左操作数。

```java
class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String s : tokens) {
            if (isOp(s)) {
                int b = stack.pop(); // reverse order
                int a = stack.pop();
                stack.push(calc(a, b, s));
            } else {
                stack.push(Integer.parseInt(s));
            }
        }
        return stack.peek();
    }

    private boolean isOp(String s) {
        return s.length() == 1 && "+-*/".indexOf(s.charAt(0)) != -1;
    }

    private int calc(int a, int b, String op) {
        switch(op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return a / b;
            default: throw new IllegalArgumentException(op);
        }
    }
}

// time: O(n)
// space: O(n)
```

### 6. 滑动窗口最大值

[LT.239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/description/)

用一个单调递减的队列，只保留“仍有可能成为最大值”的元素下标。

当新元素进入时，队尾所有比它小的元素都会被淘汰，因为它们在当前和未来窗口中都不可能超过新元素；当窗口右移时，若队首下标已不在窗口范围内，则立刻移除。这样队首始终对应当前窗口的最大值，每个元素只进出队列一次，从而在线性时间内完成计算。

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        // a monotonic deque consists of indices
        // values are decresing from front to back
        // the front is the window maximum
        Deque<Integer> deque = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            // remove expired indices
            if (!deque.isEmpty() && deque.peekFirst() <= i - k) {
                deque.pollFirst();
            }
            // maintain monotonic decresing deque
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }
            // add current one
            deque.offerLast(i);

            // update result
            if (i >= k - 1) {
                res[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        return res;
    }
}

// time: O(n)
// space: O(n)
```
