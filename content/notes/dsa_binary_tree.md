+++
title = "二叉树"
description = "刷遍题 - 二叉树数组"
date = 2025-12-20
updated = 2025-12-20

[taxonomies]
tags = ["dsa"]

[extra]
toc = true
math = true
+++

## 引言

二叉树（`Binary Tree`）是每个节点最多只有两个子节点（`left`、`right`）的树结构。

```
      1
     / \
    2   3
```

```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode() {}

    TreeNode(int val) {
        this.val = val;
    }

    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```

二叉树有几种常见的分类：

### 满二叉树 Full Binary Tree

每个节点要么是 没有子节点，要么同时有 两个子节点。

```
        1
      /   \
     2     3
    / \   / \
   4  5  6   7
```

### 完全二叉树- Complete Binary Tree

除了最后一层外，其他层都必须是满的。
最后一层的节点从左向右连续排列，中间不能断。

```
        1
      /   \
     2     3
    / \   /
   4  5  6
```

### 二叉搜索树 - Binary Search Tree

对于任意一个节点：
- 左子树所有值 < 当前节点值
- 右子树所有值 > 当前节点值
- 左右子树本身也是 BST

```
        5
      /   \
     3     7
    / \   / \
   2  4  6   9
```

中序遍历（左→根→右）会得到严格递增序列：`[2, 3, 4, 5, 6, 7, 9]`。

### 堆- Heap

与之相关，我们说说堆这个概念。堆是建立在上述**完全二叉树**基础上的一个结构，再加上堆序性质（`Heap Property`）。

堆的两种常见形式：

**最大堆**（`Max-Heap`）：
- 每个节点都 ≥ 子节点
- 根节点是整个树的最大值

```
        10
      /    \
     8      7
    / \    /
   5   3  6
```

```java
import java.util.PriorityQueue;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        // 最大堆
        PriorityQueue<Integer> maxHeap =
                new PriorityQueue<>(Collections.reverseOrder());

        maxHeap.offer(3);
        maxHeap.offer(1);
        maxHeap.offer(5);

        // 输出：5 3 1
        while (!maxHeap.isEmpty()) {
            System.out.print(maxHeap.poll() + " ");
        }
    }
}
```

**最小堆**（`Min-Heap`）：
- 每个节点都 ≤ 子节点
- 根节点是整个树的最小值

```
        1
      /   \
     3     2
    / \   /
   7  6  4
```

```java
import java.util.PriorityQueue;

public class Main {
    public static void main(String[] args) {
        // 最小堆（默认）
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        minHeap.offer(3);
        minHeap.offer(1);
        minHeap.offer(5);

        // 输出：1 3 5
        while (!minHeap.isEmpty()) {
            System.out.print(minHeap.poll() + " ");
        }
    }
}
```

自定义对象的堆：

```java
PriorityQueue<TreeNode> pq = new PriorityQueue<>(
    (a, b) -> a.val - b.val   // 最小堆
);

PriorityQueue<TreeNode> pq = new PriorityQueue<>(
    (a, b) -> b.val - a.val   // 最大堆
);
```


### 顺序存储（数组）

完全二叉树与堆结构紧凑，没有空洞，所以非常适合用数组连续存储。

数组存储方式（从 0 开始）：

对某一节点 `i`：
- 左孩子：`2*i + 1`
- 右孩子：`2*i + 2`
- 父节点：`(i - 1) / 2`

```
        arr[0]=1
      /         \
 arr[1]=2     arr[2]=3
   /  \         /
 4    5       6

```

```
树结构
        1
      /   \
     3     2
    / \   /
   7  6  4

数组表示
index: 0 1 2 3 4 5 
value: 1 3 2 7 6 4
```

```java
int[] heap = {1, 3, 2, 7, 6, 4};

int i = 2;
int left = 2 * i + 1;
int right = 2 * i + 2;
int parent = (i - 1) / 2;
```

### 平衡二叉树 - Balanced BST

平衡树是一种在插入、删除后自动调整结构，使整棵树高度保持在 `O(log n)` 的二叉搜索树，从而保证查找、插入、删除等操作在`最坏`情况下仍能做到 `O(log n)`，其意义在于避免普通 BST 因数据顺序不佳而退化成链表。常用的实现方式主要有两类：如 `AVL Tree`，通过维护节点高度并在失衡时做旋转，实现非常严格的平衡、查找更快；以及 `Red-Black Tree`，通过颜色规则和较宽松的平衡要求，让插入/删除旋转更少、整体性能稳定，是实际工程（如 C++ `map`/`set`、Java `TreeMap`）中最常用的平衡树。平衡树也广泛用于实现数据库索引（如 `B+` 树）。


```
在二叉搜索树的基础上，额外限制：任何节点的左右子树高度差 ≤ 1

        4
      /   \
     2     6
    / \   / \
   1  3  5   7

```

- `TreeMap` / `TreeSet` 底层是红黑树
- 红黑树不追求最严格平衡，但保证 `O(log n)`
- 相比 AVL，红黑树插入/删除旋转更少

| 场景        | 更合适     |
| --------- | ------- |
| 查找极多、更新很少 | AVL     |
| 插入 / 删除频繁 | **红黑树** |
| 标准库实现     | **红黑树** |

## 题目

### 1. 二叉树的递归遍历

**前序遍历**：Root → Left → Right

[LT.144. Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/description/)


```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        dfs(root, res);
        return res;
    }

    private void dfs(TreeNode node, List<Integer> res) {
        if (node == null) {
            return;
        }
        res.add(node.val);
        dfs(node.left, res);
        dfs(node.right, res);
    }
}

// time: O(n)
// space: O(h) where h is the height of the tree
//             worst O(n), if balanced O(log n)
```

**后序遍历**：Left → Right → Root

[LT.145. Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/description/)

```java
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        dfs(root, res);
        return res;
    }

    private void dfs(TreeNode node, List<Integer> res) {
        if (node == null) {
            return;
        }
        dfs(node.left, res);
        dfs(node.right, res);
        res.add(node.val);
    }
}

// time: O(n)
// space: O(h)
```

**中序遍历**：Left → Root → Right 

[LT.94. Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/description/)

```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        dfs(root, res);
        return res;
    }

    private void dfs(TreeNode node, List<Integer> res) {
        if (node == null) {
            return;
        }
        dfs(node.left, res);
        res.add(node.val);
        dfs(node.right, res);
    }
}

// time: O(n)
// space: O(h)
```


### 2. 二叉树的迭代遍历

[LT.144. Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/description/)

**前序遍历**：Root → Left → Right

- 用栈模拟递归
- 先压右，再压左（这样出栈时先处理左）

```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            res.add(node.val);
            if (node.right != null) {
                stack.push(node.right);
            }
            if (node.left != null) {
                stack.push(node.left);
            }
        }
        return res;
    }
}

// time: O(n)
// space: O(n)
```
**后序遍历**：Left → Right → Root

[LT.145. Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/description/)

后序是“左右根”，不好直接用栈。做法是记录上一次访问的节点 prev，判断右子树是否已经处理过。

1. 一路向左入栈
2. 查看栈顶：
    - 若右子树存在且未访问 → 转向右子树
    - 否则 → 访问当前节点并出栈

```java
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root, prev = null;

        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { // keep going left
                stack.push(cur);
                cur = cur.left;
            }
            TreeNode node = stack.peek();
            if (node.right != null && node.right != prev) {
                cur = node.right; // go to unvisited right subtree
            } else {
                res.add(node.val); // left and right all visited
                prev = node;
                stack.pop();
            }
        }

        return res;
    }
}
// time: O(n)
// space: O(n)
```

**中序遍历**：Left → Root → Right 

[LT.94. Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/description/)

一路向左压栈，直到空；弹栈访问；转向右子树。

```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            // keep going left
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            // visit
            cur = stack.pop();
            res.add(cur.val);
            // go to the right subtree
            cur = cur.right;
        }
        return res;
    }
}

// time: O(n)
// space: O(n)
```
