// if the module has no dependencies, the above pattern can be simplified to
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.DoublyLinkedList = factory();
    }
}(this, function() {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    // 双向链表 young 2015/11/04
    var DoublyLinkedList = function(){
    	this.length = 0;
        this.head = null; //头指针
        this.end = null; //尾指针
        /**
         * 为了实现像素差逐帧动画优化递增或者递减查找
         * 有时候会进行一些有规律的递增或者递减的查找操作，在进行这些有规律的递增或递减查找操作时如果能从上一次的位置开始操作，效率会更高
         */
        this.memory = {
            pointer: null,
            no: null
        };
    }
    //加入节点
    DoublyLinkedList.prototype.push = function(value) {
        //如果头指针为空，则当前节点既是头部节点也是尾部节点
        if (!this.head) {
            this.head = {
                value: value,
                previous: null,
                next: null
            };
            this.end = this.head;
        } else {
            var node = {
                value: value,
                previous: this.end, //当前节点的前指针指向尾部节点
                next: null
            }
            this.end.next = node; //尾部节点的后指针指向当前节点
            this.end = node; //尾指针指向当前节点
        }
        this.length++;
    };
    //返回元素个数
    DoublyLinkedList.prototype.size = function() {
        return this.length;
    };
    //判断是否为空
    DoublyLinkedList.prototype.isEmpty = function() {
        return this.length === 0;
    };
    /**
     * 获得某个位置的节点
     * @param  {[type]} index  [位置]
     * @param  {[type]} memory [是否采用记忆查找]
     */
    DoublyLinkedList.prototype.get = function(index, memory) {
        var node;
        var i;
        if (index < 0 || index >= this.length) {
            node = null;
        } else {
            if (memory && this.memory.pointer) { //进行一些有规律的递增或者递减的查找操作
                node = this.memory.pointer;
                if (index < this.memory.no) {
                    for (i = this.memory.no; i > index; i--) {
                        node = node.previous;
                    }
                } else if (index > this.memory.no) {
                    for (i = this.memory.no; i < index; i++) {
                        node = node.next;
                    }
                } else {
                    //查找的节点既是当前memory节点
                }
            } else { //普通查找
                if (index <= this.length / 2) { //正向查找
                    node = this.head;
                    for (i = 0; i < index; i++) {
                        node = node.next;
                    }
                } else { //反向查找
                    node = this.end;
                    for (i = this.length - 1; i > index; i--) {
                        node = node.previous;
                    }
                }
            }
            this.memory.pointer = node; //更新记录信息
            this.memory.no = index;
        }
        return node;
    };
    //获得第一个节点
    DoublyLinkedList.prototype.getHead = function() {
        return this.get(0);
    };
    //获得最后一个节点
    DoublyLinkedList.prototype.getEnd = function() {
        return this.get(this.length - 1);
    };
    /**
     * 将某个节点插入到index位置之前
     * @param  {[type]} index  [位置]
     * @param  {[type]} value  [值]
     * @param  {[type]} memory [是否采用记忆查找]
     */
    DoublyLinkedList.prototype.insert = function(index, value, memory) {
        var node = {
            value: value,
            previous: null,
            next: null
        };
        var indexNode;
        if (index < 0 || index >= this.length) {
            node = null
        } else {
            if (index === 0) {
                node.next = this.head;
                this.head = node;
            } else {
                indexNode = this.get(index, memory);
                node.next = indexNode;
                node.previous = indexNode.previous;
                indexNode.previous.next = node;
                indexNode.previous = node;
                this.memory.pointer = node; //更新记忆信息
                this.memory.no = index;
            }
            this.length++;
        }
        return node;
    };
    /**
     * 删除某个位置的节点
     * @param  {[type]} index  [位置]
     * @param  {[type]} memory [是否采用记忆查找]
     */
    DoublyLinkedList.prototype.del = function(index, memory) {
        var node;
        if (index < 0 || index >= this.length) {
            node = null;
        } else {
            node = this.get(index, memory);
            if (node) {
                var pre = node.previous;
                var next = node.next;
                if (!pre && !next) { //前指针和后指针都不存在，即清空链表
                    this.head = null;
                    this.end = null;
                    this.memory.pointer = null;
                    this.memory.no = null;
                } else if (pre && !next) { //存在前指针不存在后指针，即删除尾部节点
                    node.previous = null;
                    pre.next = null;
                    this.end = pre;
                    if (memory) {
                        this.memory.pointer = this.end;
                        this.memory.no = index - 1;
                    }
                } else if (!pre && next) { //不存在前指针存在后指针，即删除头部节点
                    node.next = null;
                    next.previous = null;
                    this.head = next;
                    if (memory) {
                        this.memory.pointer = this.head;
                        this.memory.no = index;
                    }
                } else {
                    node.previous = null;
                    node.next = null;
                    pre.next = next;
                    next.previous = pre;
                    if (memory) {
                        this.memory.pointer = next;
                        this.memory.no = index;
                    }
                }
                this.length--;
            }
        }
        return node;
    };
    return DoublyLinkedList;
}));
