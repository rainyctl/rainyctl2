+++
title = "二叉树"
description = "刷遍题 - 二叉树数组"
date = 2025-12-20
updated = 2025-12-24

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

### 3. 二叉树层序遍历

[LT.102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/description/)

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) {
                    queue.add(node.left);
                }
                if (node.right != null) {
                    queue.add(node.right);
                }
            }
            res.add(level);
        }
        return res;
    }
}
// time: O(n)
// space: O(n)
```

[LT.107. Binary Tree Level Order Traversal II](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/description/)

```java
class Solution {
    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            res.add(level);
        }

        Collections.reverse(res);
        return res;
    }
}

// time: O(n)
// space: O(n)
```

[LT.199. Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/description/)

```java
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (i == size - 1) {
                    res.add(node.val);
                }
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
        }
        return res;
    }
}
```

[LT.637. Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/)

```java
class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int size = queue.size();
            long sum = 0;
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                sum += node.val;
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            res.add((double) sum / size);
        }
        return res;
    }
}

// time: O(n)
// space: O(n)
```

[LT.429. N-ary Tree Level Order Traversal](https://leetcode.com/problems/n-ary-tree-level-order-traversal/description/)

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

class Solution {
    public List<List<Integer>> levelOrder(Node root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        Queue<Node> queue = new ArrayDeque<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                Node node = queue.poll();
                level.add(node.val);
                if (node.children != null) {
                    for (Node child : node.children) {
                        queue.offer(child);
                    }
                }
            }
            res.add(level);
        }

        return res;
    }
}

// time: O(n)
// space: O(n)
```

[LT.515. Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row/description/)

```java
class Solution {
    public List<Integer> largestValues(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            int max = Integer.MIN_VALUE;
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                max = Math.max(max, node.val);
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            res.add(max);
        }
        return res;
    }
}

// time: O(n)
// space: O(n)
```

[LT.116. Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)

```java
class Solution {
    public Node connect(Node root) {
        if (root == null) {
            return root;
        }
        Queue<Node> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            Node pre = null;
            for (int i = 0; i < size; i++) {
                Node node = queue.poll();
                if (pre != null) {
                    pre.next = node;
                }
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
                pre = node;
            }
        }
        return root;
    }
}

// time: O(n)
// space: O(n)
```

这题其实有空间 O(1) 的遍历方式，利用已建立的 next 指针，逐层连接:
- 从最左节点开始，按层遍历（不需要队列）。
- 对于当前层的每个节点 `cur`：
    - 同一父节点内：`cur.left.next = cur.right`
    - 跨父节点：如果 `cur.next != null`，`cur.right.next = cur.next.left` 
- 用 `levelStart = levelStart.left` 下沉到下一层。

```java
class Solution {
    public Node connect(Node root) {
        if (root == null) {
            return root;
        }
        Node levelStart = root;
        while (levelStart.left != null) { // still child nodes to connect
            Node cur = levelStart;
            while (cur != null) {
                cur.left.next = cur.right;
                if (cur.next != null) {
                    cur.right.next = cur.next.left;
                }
                cur = cur.next;
            }
            levelStart = levelStart.left;
        }
        return root;
    }
}

// time: O(n)
// space: O(1)
```

[LT.117. Populating Next Right Pointers in Each Node II](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/description/)

利用已经建立好的 `next` 指针，像“链表”一样横向遍历当前层，同时构建下一层的 `next` 链表。dummy node 在这里也很有用，能简化实现。

- `cur`：当前层正在遍历的节点（沿 `next` 走）
- `dummy`：下一层的“虚拟头节点”
- `tail`：下一层链表的尾巴，用来不断接新节点

```java
class Solution {
    public Node connect(Node root) {
        if (root == null) {
            return root;
        }
        Node cur = root;
        while (cur != null) {
            Node dummy = new Node();
            Node tail = dummy;
            while (cur != null) { // current level
                if (cur.left != null) {
                    tail.next = cur.left;
                    tail = tail.next;
                }
                if (cur.right != null) {
                    tail.next = cur.right;
                    tail = tail.next;
                }
                cur = cur.next;
            }
            // go to next level
            cur = dummy.next;
        }
        return root;
    }
}

// time: O(n)
// space: O(1)
```

[LT.104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/description/)

- 树的高度 = 1 + max(左子树高度, 右子树高度)
- 空节点深度为 0
- 这是一个天然的 后序遍历 问题（先算左右，再算当前）

```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}

// time: O(n)
// space: O(h)
```

[LT.111. Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/description/)

```java
class Solution {
    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        int depth = 1;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (node.left == null && node.right == null) {
                    // leaf found
                    return depth;
                }
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            depth++;
        }
        return depth; // unreachable
    }
}
// time: O(n)
// space: O(n)
```

### 4. 翻转二叉树

[LT.226. Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/description/)

对每个节点：
- 递归翻转左子树
- 递归翻转右子树
- 交换当前节点的左右孩子

核心就在于后序遍历位置交换。

```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return root;
        }
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}
// time: O(n)
// space: O(h)
```

### 5. 对称二叉树

[LT.101. Symmetric Tree](https://leetcode.com/problems/symmetric-tree/description/)

```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) {
            return true;
        }
        return isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode t1, TreeNode t2) {
        if (t1 == null && t2 == null) {
            return true;
        }
        if (t1 == null || t2 == null) {
            return false;
        }
        if (t1.val != t2.val) {
            return false;
        }
        return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
    }
}

// time: O(n)
// space: O(h)
```

### 6. 二叉树的最大深度

[LT.104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/description/)

```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}

// time: O(n)
// space: O(h)
```

### 7. 二叉树的最小深度

[LT.111. Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/description/)

```java
class Solution {
    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        int depth = 1;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (node.left == null && node.right == null) {
                    // leaf found
                    return depth;
                }
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            depth++;
        }
        return depth; // unreachable
    }
}
// time: O(n)
// space: O(n)
```

### 8. 完全二叉树的节点个数

[LT.222. Count Complete Tree Nodes](https://leetcode.com/problems/count-complete-tree-nodes/description/)

最直接的是遍历节点来计算，以下是后序遍历：

```java
class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + countNodes(root.left) + countNodes(root.right);
    }
}

// time: O(n)
// space: O(log n)
```

我们可以利用完全二叉树的性质避免不必要的遍历所有节点：

若一棵子树最左路径深度 == 最右路径深度，则它是满二叉树，节点数可直接用公式计算。

- 分别沿着 `left.left...` 和 `right.right...` 计算左右深度
- 若深度相等：直接返回 $2^{height} - 1$
- 若不相等： 递归统计左右子树节点数，再加上当前根节点

**高度 vs 深度**

一个节点的 depth，指的是 从根节点到该节点的距离（边数或层数）。
- 根节点的 depth 通常定义为 0（有时也定义为 1，取决于约定）
- depth 是 “向上看” 的概念

```
        A        depth(A) = 0
       / \
      B   C      depth(B) = 1
     /
    D            depth(D) = 2

```

一个节点的 height，指的是 从该节点到最远叶子节点的距离。
- 叶子节点的 height = 0（或 1，取决于约定）
- height 是 “向下看” 的概念

```
        A        height(A) = 2
       / \
      B   C      height(B) = 1
     /
    D            height(D) = 0

```

```java
class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        TreeNode left = root.left;
        int leftHeight = 0; // the leftmost path
        while (left != null) {
            left = left.left;
            leftHeight++;
        }
        TreeNode right = root.right;
        int rightHeight = 0; // the rightmost path
        while (right != null) {
            right = right.right;
            rightHeight++;
        }
        if (leftHeight == rightHeight) { // perfect tree
            return (1 << (leftHeight + 1)) - 1;
        }

        return 1 + countNodes(root.left) + countNodes(root.right);
    }
}

// time: O(log n x log n)
// space: O(log n)
```

### 9. 平衡二叉树

[LT.110. Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/)

判断一棵二叉树是否平衡（任意节点左右子树高度差 ≤ 1）:

- 用 DFS 后序遍历：先算左右子树高度，再判断当前节点是否平衡。
- 一旦发现某个子树不平衡，直接返回 -1 作为“哨兵值”，一路向上剪枝，不用再算高度。

```java
class Solution {
    public boolean isBalanced(TreeNode root) {
        return height(root) != -1;
    }

    private int height(TreeNode node) {
        if (node == null) {
            return 0;
        }
        int lh = height(node.left);
        if (lh == -1) {
            return -1;
        }
        int rh = height(node.right);
        if (rh == -1) {
            return -1;
        }
        if (Math.abs(lh - rh) > 1) {
            return -1;
        }
        return 1 + Math.max(lh, rh);
    }
}

// time: O(n)
// space: O(h)
```

### 10. 二叉树所有路径

[LT.257. Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths/description/)

使用 `String` 每次修改会复制不需要回溯。

```java
class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        dfs(root, "", res);
        return res;
    }

    private void dfs(TreeNode node, String path, List<String> res) {
        if (node == null) {
            return;
        }
        path += node.val;
        // leaf node
        if (node.left == null && node.right == null) {
            res.add(path);
            return;
        }
        path += "->";
        dfs(node.left, path, res);
        dfs(node.right, path, res);
    }
}

// time: O(N + L)
// space: O(H + L)

// N: the number of nodes
// H: the height of tree
// L: the sum of length of all paths
```

或者使用 `StringBuilder` 加上回溯。

```java
class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> res = new ArrayList<>();
        if (root == null) {
            return res;
        }
        dfs(root, new StringBuilder(), res);
        return res;
    }

    public void dfs(TreeNode node, StringBuilder sb, List<String> res) {
        if (node == null) {
            return;
        }
        int len = sb.length();
        sb.append(node.val);
        if (node.left == null && node.right == null) {
            res.add(sb.toString());
        } else {
            sb.append("->");
            dfs(node.left, sb, res);
            dfs(node.right, sb, res);
        }
        sb.setLength(len); // backtrack
    }
}

// time: O(N + L)
// space: O(H + L) -> O(N + L)
```

### 11. 左叶子之和

[LT.404. Sum of Left Leaves](https://leetcode.com/problems/sum-of-left-leaves/description/)

如果某个节点的左孩子存在，且这个左孩子是叶子节点，就把它的值加入结果。

```
no left node
   1

one left node
   1
  /
 2
 ^

two left nodes
   1
  / \
 2   3
 ^  /
   4
   ^
```

```java
class Solution {
    public int sumOfLeftLeaves(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int sum = 0;
        if (root.left != null && root.left.left == null && root.left.right == null) {
            sum += root.left.val;
        }
        sum += sumOfLeftLeaves(root.left);
        sum += sumOfLeftLeaves(root.right);
        return sum;
    }
}
// time: O(n)
// space: O(h)
```

### 12. 找树左下角的值

[LT.513. Find Bottom Left Tree Value](https://leetcode.com/problems/find-bottom-left-tree-value/description/)

```java
class Solution {
    public int findBottomLeftValue(TreeNode root) {
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        int res = root.val;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (i == 0) {
                    res = node.val;
                }
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
        }
        return res;
    }
}

// time: O(n)
// space: O(n)
```

### 13. 路径总和

[LT.112. Path Sum](https://leetcode.com/problems/path-sum/description/)

```java
class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return false;
        }
        targetSum -= root.val;
        if (root.left == null && root.right == null) {
            return targetSum == 0;
        }
        return hasPathSum(root.left, targetSum) || hasPathSum(root.right, targetSum);
    }
}

// time: O(n)
// space: O(h)
```

### 14. 从中序与后序遍历序列构造二叉树

[LT.106. Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/description/)

```
postorder[postR]  → 当前子树的根
rootIdx - inL     → 左子树节点数 leftSize
leftSize 决定 postorder 的左右切分区间

inorder:    [ inL ........ rootIdx-1 | root | rootIdx+1 ........ inR ]
                       ← leftSize →

postorder:  [ postL .... postL+leftSize-1 | postL+leftSize .... postR-1 | root ]
                                                         ↑                ↑
                                                     right subtree     postR
```

```java
class Solution {
    // value -> index of inorder array
    private Map<Integer, Integer> indexMap = new HashMap<>();

    public TreeNode buildTree(int[] inorder, int[] postorder) {
        for (int i = 0; i < inorder.length; i++) {
            indexMap.put(inorder[i], i);
        }
        return buildTree(inorder, 0, inorder.length - 1,
                         postorder, 0, postorder.length - 1);
    }

    private TreeNode buildTree(
            int[] inorder, int inL, int inR,
            int[] postorder, int postL, int postR) {
        if (inL > inR) {
            return null;
        }
        int val = postorder[postR];
        TreeNode root = new TreeNode(val);
        int rootIdx = indexMap.get(val);
        int leftSize = rootIdx - inL;
        root.left = buildTree(inorder, inL, rootIdx - 1,
                              postorder, postL, postL + leftSize - 1);
        root.right = buildTree(inorder, rootIdx + 1, inR,
                               postorder, postL + leftSize, postR - 1);
        return root;
    }
}

// time: O(n)
// space: O(n)
```

### 15. 最大二叉树

[LT.654. Maximum Binary Tree](https://leetcode.com/problems/maximum-binary-tree/description/)

给你一个不重复的数组 nums：
- 根节点 = 数组最大值
- 左子树 = 最大值左边子数组递归构建
- 右子树 = 最大值右边子数组递归构建

维护一个单调栈，栈里的每个节点都在等右边第一个比它大的数。这样避免每个元素左右扫描导致 O(n^2) 。

栈内的状态：

- 从 top -> bottom: 值递增
- 栈顶 = 当前元素前面最小的节点，最可能连在左侧成为子节点
- 栈底 = 当前元素前最大的节点，最可能成为当前元素的父节点

```
当新元素 `x` 来了
- 如果比栈顶小：`stackTop.right = x`
- 如果比栈顶大： `pop` 栈顶，因为已经找到了右侧第一个比它大的 `x.left = pop`
```

```
nums
[3, 2, 1, 6, 0, 5]
 ^
stack
[] -> [3]
 
----------------------

nums
[3, 2, 1, 6, 0, 5]
    ^
stack
[3] -> [2, 3]

 3
  \
   2

----------------------

nums
[3, 2, 1, 6, 0, 5]
       ^
stack
[2, 3] -> [1, 2, 3]

 3
  \
   2
    \
     1

----------------------

nums
[3, 2, 1, 6, 0, 5]
          ^
stack
[1, 2, 3] -> [2, 3] pop
   
 3
  \
   2   6
    \ /
     1

[2, 3] -> [3] pop
   
 3   6
  \ /
   2    
    \  
     1

[3] -> [] pop

   6
  /
 3    
  \  
   2    
    \  
     1
[] -> [6] push

----------------------

nums
[3, 2, 1, 6, 0, 5]
             ^
   6
  / \
 3   0 
  \  
   2    
    \  
     1

[6] -> [0, 6]

----------------------

nums
[3, 2, 1, 6, 0, 5]
                ^

   6   5
  / \ /
 3   0 
  \  
   2    
    \  
     1

[0, 6] -> [6] pop

    6 
  /   \ 
 3     5 
  \   /
   2 0  
    \  
     1

[6]
```

```java
class Solution {
    public TreeNode constructMaximumBinaryTree(int[] nums) {
        // monotonic stack bottom -> top decreasing
        Deque<TreeNode> stack = new ArrayDeque<>();
        for (int x : nums) {
            TreeNode cur = new TreeNode(x);
            // pop smaller nodes: the last popped becomes cur.left
            while (!stack.isEmpty() && stack.peek().val < x) {
                cur.left = stack.pop();
            }
            // now stack top (if exists) is greater than cur:
            // it should take cur as its right child
            if (!stack.isEmpty()) {
                stack.peek().right = cur;
            }
            stack.push(cur);
        }

        // root is at the bottom of stack (last element in deque)
        return stack.peekLast();
    }
}

// time: O(n)
// space: O(n)
```

### 16. 合并二叉树

[LT.617. Merge Two Binary Trees](https://leetcode.com/problems/merge-two-binary-trees/description/)

```java
class Solution {
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        // can omit this check, covered by the latter 2
        if (root1 == null && root2 == null) {
            return null;
        }
        if (root1 == null) {
            return root2;
        }
        if (root2 == null) {
            return root1;
        }
        TreeNode root = new TreeNode(root1.val + root2.val);
        root.left = mergeTrees(root1.left, root2.left);
        root.right = mergeTrees(root1.right, root2.right);
        return root;
    }
}

// time: O(n)
// space: O(h)
```

### 17. 二叉搜索树中的搜索

[LT.700. Search in a Binary Search Tree](https://leetcode.com/problems/search-in-a-binary-search-tree/description/)

```java
class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null) {
            return null;
        }
        if (root.val == val) {
            return root;
        } else if (root.val < val) {
            return searchBST(root.right, val);
        } else {
            return searchBST(root.left, val);
        }
    }
}

// time: O(h)
// space: O(h)
```

### 18. 验证二叉搜索树

[LT.98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/description/)

- BST 的中序遍历结果必须是「严格递增」；
- 用一个 prev 记录上一个访问的值，只要当前值 <= prev，立刻判定不是 BST。


```java
class Solution {
    // last visited node
    private Integer prev = null;

    public boolean isValidBST(TreeNode root) {
        if (root == null) {
            return true;
        }
        // inorder traversal should be strictly increasing
        if (!isValidBST(root.left)) { // will update prev
            return false;
        }
        if (prev != null && prev >= root.val) {
            return false;
        }
        prev = root.val;
        return isValidBST(root.right);
    }
}
// time: O(n)
// space: O(h)
```

### 19. 二叉搜索树的最小绝对差

[LT.530. Minimum Absolute Difference in BST](https://leetcode.com/problems/minimum-absolute-difference-in-bst/description/)

```java
class Solution {
    private TreeNode prev = null; // last visited node
    private int minDiff = Integer.MAX_VALUE;

    public int getMinimumDifference(TreeNode root) {
        dfs(root);
        return minDiff;
    }
    // inorder traversal
    private void dfs(TreeNode node) {
        if (node == null) {
            return;
        }
        dfs(node.left);
        if (prev != null) {
            minDiff = Math.min(minDiff, node.val - prev.val);
        }
        prev = node;
        dfs(node.right);
    }
}
// time: O(n)
// space: O(h)
```

### 20. 二叉搜索树中的众数

[LT.501. Find Mode in Binary Search Tree](https://leetcode.com/problems/find-mode-in-binary-search-tree/description/)

```java
class Solution {
    private TreeNode pre = null; // last visited node
    private int count = 0; // the number of current values
    private int maxCount = 0;
    private List<Integer> res = new ArrayList<>();

    public int[] findMode(TreeNode root) {
        dfs(root);
        return res.stream().mapToInt(Integer::intValue).toArray();
    }

    // inorder traversal so that values are visited in increasing order
    // easy to count equal values (consequtive)
    private void dfs(TreeNode node) {
        if (node == null) {
            return;
        }
        // visit left subtree
        dfs(node.left);

        // visit current node
        if (pre == null || node.val != pre.val) {
            count = 1; // new value, reset count to 1
        } else { // same value
            count++;
        }

        if (count > maxCount) { // for the same value, this can be called multiple times in this implementation
            // new max found
            res.clear(); // clear previous
            res.add(node.val); // add new value
            maxCount = count; // update max
        } else if (count == maxCount) {
            // another mode with same count of the maxCount
            res.add(node.val); // just add it
        }
        pre = node;

        // visit right subtree
        dfs(node.right);
    }
}

// time: O(n)
// space: (n)
```

### 21. 二叉树的最近公共祖先

[LT.236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/)

其实和前面中序遍历的思想有点像。我们这里用后序遍历（左、右、中），根据左右子树的返回值（结果）来处理中间节点，实现了自底向上的搜索（处理）。

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || p == root || q == root) {
            return root;
        }
        // visit left subtree
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        // visit right subtree
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        // visit current
        // p, q found in different subtrees
        if (left != null && right != null) {
            return root;
        }
        // p, q found in the same subtree
        return left != null ? left : right;
    }
}
// time: O(n)
// space: O(h)
```

### 22. 二叉搜索树的最近公共祖先

[LT.235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/)

因为这是 二叉搜索树（BST）：
- 左子树所有值 < 根节点
- 右子树所有值 > 根节点
所以：
- 如果 p 和 q 都比当前节点值小 → 去左子树
- 如果 p 和 q 都比当前节点值大 → 去右子树
- 否则当前节点就是最近公共祖先
    - 意味着 p 和 q 分布在当前节点两侧
    - 或者有一个就是当前节点

```
           6
         /   \
        2     8
       / \   / \
      0  4  7  9
        / \
       3   5

p = 2, q = 8
2 < 6 < 8  → LCA = 6（第一次分叉点）
```

```java
class Solution {
    // p, q exists in the BST
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null) {
            return null;
        }
        if (p.val < root.val && q.val < root.val) {
            return lowestCommonAncestor(root.left, p, q);
        }
        if (p.val > root.val && q.val > root.val) {
            return lowestCommonAncestor(root.right, p, q);
        }
        // p < root < q or q < root < p
        return root;
    }
}
// time: O(h)
// space: O(h)
```

### 23. 二叉搜索树中的插入操作

[LT.701. Insert into a Binary Search Tree](https://leetcode.com/problems/insert-into-a-binary-search-tree/)

BST 的核心规则：
- 左子树所有值 < 当前节点
- 右子树所有值 > 当前节点

所以插入的思路就是：
- 比当前节点值小 → 去左子树
- 比当前节点值大 → 去右子树
- 直到遇到 `null`，就在这里新建节点挂上

不会影响已有结构，也不需要旋转或重排。

```java
class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) { // found the insert place
            return new TreeNode(val);
        }
        if (root.val < val) {
            root.right = insertIntoBST(root.right, val);
        } else {
            root.left = insertIntoBST(root.left, val);
        }
        return root;
    }
}
// time: O(h)
// space: O(h)
```

### 24. 删除二叉搜索树中的节点

[LT.450. Delete Node in a BST](https://leetcode.com/problems/delete-node-in-a-bst/description/)

删除节点的情况主要有三种：
1. 没有子节点：直接删除，返回 null。
2. 只有一个子节点：返回子节点替代被删除节点。
3. 有两个子节点：需要找到该节点的 后继节点（右子树中最小节点），用它的值替换当前节点值，然后在右子树中删除这个后继节点。


假设当前遍历节点是 `root`：
1. 如果 `key < root.val` → 去左子树递归删除
2. 如果 `key > root.val` → 去右子树递归删除
3. 如果 `key == root.val` → 找到要删除的节点：
    - 没有左子树：返回右子树
    - 没有右子树：返回左子树
    - 两个子树都存在：
        - 找右子树最小值（successor）
        - 把 successor 的值放到当前节点
        - 在右子树删除 successor 节点

```java
class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) {
            return null;
        }
        if (root.val < key) { // delete from the right subtree  
            root.right = deleteNode(root.right, key);
        } else if (root.val > key) { // delete from the left subtree
            root.left = deleteNode(root.left, key);
        } else { // delete current node
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            TreeNode successor = getMin(root.right);
            root.val = successor.val;
            root.right = deleteNode(root.right, successor.val);
        }
        return root;
    }

    private TreeNode getMin(TreeNode node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
}
// time: O(h)
// space: O(h)
```

### 25. 修剪二叉搜索树

[LT.669. Trim a Binary Search Tree](https://leetcode.com/problems/trim-a-binary-search-tree/description/)

利用 BST 性质：

- 如果 `root.val < low`：
`整棵左子树都 < root.val < low`，不可能有合法值，可以整棵丢掉。
这时答案一定在右子树：`return trimBST(root.right, low, high)`。
- 如果 `root.val > high`
`整棵右子树都 > root.val > high`，也不可能有合法值。
这时答案一定在 左子树：`return trimBST(root.left, low, high)`。
- 如果 `low <= root.val <= high`
当前节点应该留下，但是它的左右子树可能还包含不合法节点，
所以递归修剪。

```
        3
       / \
      0   4
       \
        2
       /
      1

[low, high] = [1, 3]

      3
     /
    2
   /
  1

```

```java
class Solutirn {
    public TreeNode trimBST(TreeNode root, int low, int high) {
        if (root == null) {
            return null;
        }
        if (root.val < low) {
            return trimBST(root.right, low, high);
        }
        if (root.val > high) {
            return trimBST(root.left, low, high);
        }
        // keep the current node
        root.left = trimBST(root.left, low, high);
        root.right = trimBST(root.right, low, high);
        return root;
    }
}
// time: O(n)
// space: O(h)
```

### 26. 将有序数组转换为二叉搜索树

[LT.108. Convert Sorted Array to Binary Search Tree](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/description/)

关注一下递归返回的结果是处理好的树（或子树），再此基础上逐步构建最终树。

有序数组 + BST + 要平衡
- 必然选择中间元素作为根节点。
- 左半数组递归构造左子树，右半数组递归构造右子树。

因为数组本来是升序：
- 中间元素左边 < root
- 中间元素右边 > root
- 又因为每次都取中点，所以天然接近平衡。

```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }

    private TreeNode build(int[] nums, int l, int r) {
        if (l > r) {
            return null;
        }
        int mid = l + (r - l) / 2;
        TreeNode node = new TreeNode(nums[mid]);
        node.left = build(nums, l, mid - 1);
        node.right = build(nums, mid + 1, r);
        return node;
    }
}
// time: O(n)
// space: O(log n) since it's a balanced tree
```

### 27. 把二叉搜索树转换为累加树

[LT.538. Convert BST to Greater Tree](https://leetcode.com/problems/convert-bst-to-greater-tree/description/)

观察一下那种遍历方式合适。发现如果我们从大到小遍历（右、中、左）就能保证当前访问到的节点，右侧节点都已经累加过。

```java
class Solution {
    private int sum = 0;
    public TreeNode convertBST(TreeNode root) {
        if (root == null) {
            return null;
        }
        // visit right subtree first
        convertBST(root.right);
        // visit current node
        root.val += sum;
        sum = root.val;
        convertBST(root.left);
        return root;
    }
}

// time: O(n)
// space: O(h)
```

### ##. 圣诞树

刚好写完二叉树这部分，明天就是圣诞节了。

```
                 *
                /@\
               /@@@\
              /@#@@@\
             /@@@#@@@\
            /@#@@@#@@@\
           /@@@#@@@#@@@\
          /@#@@@#@@@#@@@\
         /@@@@@@@@@@@@@@@\
               ||||
               ||||
            ==========

```
