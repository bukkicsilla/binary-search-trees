class Node {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(root = null) {
    this.root = root;
  }

  /** insert(val): insert a new node into the BST with value val.
   * Returns the tree. Uses iteration. */

  insert(val) {
    const newNode = new Node(val);
    if (this.root === null) {
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while (true) {
      if (val < current.val) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  /** insertRecursively(val): insert a new node into the BST with value val.
   * Returns the tree. Uses recursion. */

  insertRecursively(val) {
    this.root = this._insertRecursively(this.root, val);
    return this;
  }
  _insertRecursively(node, val) {
    if (node === null) {
      return new Node(val);
    }
    if (val < node.val) {
      node.left = this._insertRecursively(node.left, val);
    } else {
      node.right = this._insertRecursively(node.right, val);
    }
    return node;
  }

  /** find(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses iteration. */

  find(val) {
    let current = this.root;
    while (current) {
      if (val === current.val) return current;
      if (val < current.val) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return undefined;
  }

  /** findRecursively(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses recursion. */

  findRecursively(val, current = this.root) {
    if (current === null) return undefined;
    if (val < current.val) {
      if (current.left === null) return undefined;
      return this.findRecursively(val, current.left);
    } else if (val > current.val) {
      if (current.right === null) return undefined;
      return this.findRecursively(val, current.right);
    }
    return current;
  }

  /** dfsPreOrder(): Traverse the array using pre-order DFS.
   * Return an array of visited nodes. */

  dfsPreOrder() {
    let arr = [];
    let current = this.root;
    function traverse(node) {
      arr.push(node.val);
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
    }
    traverse(current);
    return arr;
  }

  /** dfsInOrder(): Traverse the array using in-order DFS.
   * Return an array of visited nodes. */

  dfsInOrder() {
    let arr = [];
    let current = this.root;
    function traverse(node) {
      if (node.left) traverse(node.left);
      arr.push(node.val);
      if (node.right) traverse(node.right);
    }
    traverse(current);
    return arr;
  }

  /** dfsPostOrder(): Traverse the array using post-order DFS.
   * Return an array of visited nodes. */

  dfsPostOrder() {
    let arr = [];
    let current = this.root;
    function traverse(node) {
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
      arr.push(node.val);
    }
    traverse(current);
    return arr;
  }

  /** bfs(): Traverse the array using BFS.
   * Return an array of visited nodes. */

  bfs() {
    const result = [];
    const queue = [];

    // Start with the root node
    if (this.root) {
      queue.push(this.root);
    }

    // While there are nodes to process
    while (queue.length > 0) {
      const currentNode = queue.shift(); // Dequeue the next node
      result.push(currentNode.val); // Visit the node

      // Enqueue the left child if it exists
      if (currentNode.left) {
        queue.push(currentNode.left);
      }

      // Enqueue the right child if it exists
      if (currentNode.right) {
        queue.push(currentNode.right);
      }
    }
    return result;
  }

  /** Further Study!
   * remove(val): Removes a node in the BST with the value val.
   * Returns the removed node. */

  remove(val) {
    let removedNode = null;
    this.root = this._removeRecursively(this.root, val, (node) => {
      removedNode = node;
    });
    return removedNode;
  }
  _removeRecursively(node, val, callback) {
    if (node === null) {
      return null;
    }

    if (val < node.val) {
      node.left = this._removeRecursively(node.left, val, callback);
    } else if (val > node.val) {
      node.right = this._removeRecursively(node.right, val, callback);
    } else {
      // Node with the value found, apply callback
      callback(node);

      // Node with only one child or no child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      // Node with two children: Get the in-order successor (smallest in the right subtree)
      let minNode = this._findMin(node.right);
      node.val = minNode.val;
      node.right = this._removeRecursively(node.right, minNode.val, () => {});
    }

    return node;
  }

  _findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  /** Further Study!
   * isBalanced(): Returns true if the BST is balanced, false otherwise. */

  isBalanced() {
    return this._checkBalance(this.root) !== -1;
  }
  _checkBalance(node) {
    if (node === null) {
      return 0; // A null tree is balanced with height 0
    }

    // Check the balance of left and right subtrees
    let leftHeight = this._checkBalance(node.left);
    if (leftHeight === -1) {
      return -1; // Left subtree is not balanced
    }

    let rightHeight = this._checkBalance(node.right);
    if (rightHeight === -1) {
      return -1; // Right subtree is not balanced
    }

    // If the difference in heights is more than 1, the tree is not balanced
    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1;
    }

    // Return the height of the tree
    return Math.max(leftHeight, rightHeight) + 1;
  }

  /** Further Study!
   * findSecondHighest(): Find the second highest value in the BST, if it exists.
   * Otherwise return undefined. */

  findSecondHighest() {
    if (
      this.root === null ||
      (this.root.left === null && this.root.right === null)
    ) {
      return undefined; // No second highest value if the tree is empty or has only one node
    }

    let current = this.root;
    let parent = null;

    // Traverse to the rightmost node to find the highest value
    while (current.right !== null) {
      parent = current;
      current = current.right;
    }

    // If the highest node has a left subtree, the second highest is the rightmost node of that subtree
    if (current.left !== null) {
      current = current.left;
      while (current.right !== null) {
        current = current.right;
      }
      return current.val;
    }

    // If the highest node does not have a left subtree, the parent is the second highest
    return parent.val;
  }
}

module.exports = BinarySearchTree;
