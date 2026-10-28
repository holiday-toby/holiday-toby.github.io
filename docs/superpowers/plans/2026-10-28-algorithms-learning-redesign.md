# 算法地图入门内容与图示改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将算法地图的全部 7 页改成面向编程入门者、可跟随具体输入逐步理解的教程，加入已获认可的快排 GIF，并验证文字、图示与 Python 代码一致。

**Architecture:** 保留 Jekyll 页面与现有 URL，在 `css/cayman.css` 内补充仅作用于算法区的阅读和分步图样式。核心算法使用固定输入、可堆叠的 SVG 步骤图、状态表和可运行 Python；排序沿用本地 GIF 及生成器。验证工具从文章的代码块读取实际实现，避免维护另一套算法副本。

**Tech Stack:** Jekyll / Liquid、HTML、CSS、SVG、GIF、Python 3.9+ 标准库；GIF 生成工具使用 Pillow，网页运行不需要 Pillow 或新脚本。

## Global Constraints

以下约束取自已确认的设计文档 `docs/superpowers/specs/2026-10-28-algorithms-learning-redesign-design.md`：

- 保留现有 URL、站点布局和返回导航。
- 保留 Python 作为代码示例语言。
- 重做每个页面现有的 SVG 图；为目前只有概念清单、缺少关键过程图的主题补充图示。
- 不增加 JavaScript 交互、第三方图库或外部资源依赖；排序动图使用仓库内的 GIF 文件。
- 图示生成脚本放入 `tools/algorithms/`，其余改动限于算法地图与对应样式。
- GIF 同时配有文字步骤和静态过程说明，便于读者停下来阅读。
- 颜色表达状态变化时同时配文字或形状标记，不能只靠颜色传达信息。
- 图示包含简短标题和图注；为 SVG 提供可访问名称及必要描述。
- 在窄屏宽度下保持文字可读，允许步骤上下排列，不裁掉关键标签。
- 每页优先深入解释少量代表性算法；其余列表条目也需要明确用途和边界，但不要求每个名称都配一张完整流程图。

---

## 执行基线与文件职责

本计划只整理实施工作，勾选项在执行并获得相应结果后更新。

当前已存在且用户认可的工作产物：

- `algorithms/assets/quicksort-partition.gif`：1120×820、76 帧、29.3 秒、331683 字节，循环播放。
- `tools/algorithms/generate_quicksort_gif.py`：从真实递归轨迹生成上述 GIF，并校验分区、递归结果、基线和解码后的每一帧。
- 设计文档包含排序 GIF 的最新修订。保留这些未提交产物，后续与对应任务一并纳入提交。
- `docs/superpowers/plans/` 已有其他计划文件；逐文件暂存，不使用 `git add .` 或整体暂存该目录。

真正开始实现时先运行 `git status --short` 和 `bundle check`，提前确认文件状态与构建依赖。当前已知 gems 缺失，可用 `BUNDLE_PATH=/tmp/algorithms-bundle BUNDLE_FROZEN=true bundle install` 尝试准备锁定环境；完整构建与环境失败时的记录规则见 Task 9。此预检先于 Task 1，避免把缺依赖到最后才当作新发现。

| 文件 | 职责 / 所属任务 |
|---|---|
| `css/cayman.css` | 算法区图文间距、步骤卡片、SVG 标签与窄屏排版；Task 1 唯一维护者 |
| `tools/algorithms/check_examples.py` | 执行文章里的 Python 示例及边界；Task 1 建立完整用例 |
| `algorithms/basic.html` | 排序、二分及基础模式；Task 2 |
| `algorithms/assets/quicksort-partition.gif` | 已生成的排序动画；Task 2 |
| `algorithms/assets/quicksort-partition-static.svg` | 快排静态总过程及减少动态效果的替代图；Task 2 新建 |
| `tools/algorithms/generate_quicksort_gif.py` | 排序 GIF 的可重复生成与自校验；Task 2 接收既有文件 |
| `algorithms/data-structures.html` | 链表、树和图；Task 3 |
| `algorithms/thinking.html` | 分治、DP、贪心和回溯；Task 4 |
| `algorithms/engineering.html` | 缓存、字符串、判重与分布式路由；Task 5 |
| `algorithms/ai.html` | 向量检索、机器学习、Attention；Task 6 |
| `algorithms/index.html` | 问题特征到候选工具的总览及专题入口；Task 7 |
| `algorithms/learning-path.html` | 先修关系、练习和掌握证据；Task 8 |

依赖顺序：Task 1 → Task 2–6 可并行 → Task 7–8 可并行 → Task 9 总体验收。并行实施者各自只修改所分配的页面和素材；共同样式问题交给 Task 1 的维护者统一处理。

## 共用内容接口

每个核心算法单元顺序为：问题与输入 → 分步图 / 状态表 → 为什么成立 → Python 实现和输出 → 时间、空间、前提、边界。每个其余算法条目至少说明解决的问题、关键动作、复杂度的条件及局限。首次出现的英文术语同时给出中文含义。

文章代码块使用以下确切标识。示例完整定义函数或类，不引用未展示的节点类型、全局变量或第三方包。

| 页面选择参数 | `data-example` | 实现接口 |
|---|---|---|
| `basic` | `quicksort` | `quick_sort(nums) -> list`，新列表版，输入不变 |
| `basic` | `lower-bound` | `lower_bound(nums, target) -> int`，有序数组、左闭右开区间 |
| `data-structures` | `reverse-list` | `Node(value, next=None)`、`reverse_list(head) -> Node or None` |
| `data-structures` | `bfs` | `bfs(graph, start) -> list`，起点缺失抛 `ValueError` |
| `thinking` | `climb-stairs` | `climb_stairs(n) -> int`，整数 n≥0，f(0)=1，负数抛 `ValueError` |
| `thinking` | `permutations` | `permutations(nums) -> list[list]`，元素互异 |
| `engineering` | `lru` | `LRUCache(capacity)`、`get(key, default=None)`、`put(key, value)` |
| `ai` | `cosine-search` | `cosine_similarity(a,b)`、`search(query_vec,docs,top_k=3)`，返回 `(分数, 文档ID)` 列表 |
| `ai` | `linear-loss` | `predict_linear(x,weight,bias)`、`mse_loss(samples,weight,bias)` |
| `ai` | `attention` | `attention(query,keys,values) -> (weights, output)`，单查询的教学计算 |

总览页不保留伪装成通用分类器的 `choose_tool()`；学习路线不保留固定周数的 `weekly_plan()`。这两页以具体选择案例和检查点说明为主，不为凑代码而新增函数。

### Task 1: 共用图示样式与文章示例验证工具

**Files:** Modify `css/cayman.css` 的算法样式段；Create `tools/algorithms/check_examples.py`。

**Interfaces:** Consumes 现有 `.algorithm-page`、`.algorithm-section`、`.algorithm-visual`、`.algorithm-code`；Produces 本文规定的步骤卡片样式、SVG 文本类以及 CLI `python3 tools/algorithms/check_examples.py [页面参数]`。不带参数时检查全部 5 个代码页。

- [ ] **Step 1: 建立可堆叠的图示容器和明确的文字样式**

在现有算法样式段添加下列规则，替换原 `.algorithm-visual text` 的强制蓝色 / 15px 规则；深色节点内的字必须显式使用 `.visual-text-inverse`。保持选择器限定在算法区。

```css
.algorithm-page { min-width: 0; }
.algorithm-page .algorithm-figure { margin: 0; min-width: 0; }
.algorithm-page .algorithm-step-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.algorithm-page .algorithm-step-card { min-width: 0; }
.algorithm-page .algorithm-visual { padding: .75rem; }
.algorithm-page .algorithm-visual svg { display: block; width: 100%; height: auto; }
.algorithm-page .algorithm-visual text {
  fill: #18314d;
  font-family: inherit;
  font-size: 18px;
  font-weight: 600;
}
.algorithm-page .algorithm-visual .visual-text-inverse { fill: #fff; }
.algorithm-page .algorithm-visual .visual-text-muted { fill: #536c84; }
.algorithm-page .algorithm-figure figcaption { margin-top: .65rem; line-height: 1.6; }
.algorithm-page .algorithm-note { padding: .85rem 1rem; background: #f3f6fa; border-left: 3px solid #155799; }
.algorithm-page .algorithm-code { min-width: 0; max-width: 100%; }
.algorithm-page .algorithm-animation img { display: block; width: 100%; height: auto; }
@media screen and (max-width: 42em) {
  .algorithm-page .algorithm-step-grid { grid-template-columns: 1fr; }
}
```

每个独立步骤图优先使用约 `320` 宽的 viewBox，以实际显示时文字约 14px 以上为目标；用多张可堆叠的步骤图代替一张横向变长的图。状态表置于现有 `.algorithm-table-wrap`，代码块和宽表可局部横向滚动，页面本身不能溢出。

- [ ] **Step 2: 约定并展示完整图示结构**

所有 SVG 的 title/desc ID 在同一页面内唯一。非交互过程图使用 `role="img"`；总览的可点击 SVG 使用 `role="group"`，保留独立的 HTML 专题链接。参考此完整小图结构，不将完整讲解挤进 SVG 文本中：

```html
<figure class="algorithm-figure algorithm-step-card">
  <div class="algorithm-visual">
    <svg viewBox="0 0 320 120" role="img" aria-labelledby="basic-stop-title basic-stop-desc">
      <title id="basic-stop-title">二分查找结束时左右边界相等</title>
      <desc id="basic-stop-desc">left 和 right 都等于 1，因此返回下标 1，指向第一个大于等于 4 的位置。</desc>
      <rect class="visual-blue" x="18" y="25" width="284" height="54" rx="8"></rect>
      <text class="visual-text-inverse" x="160" y="59" text-anchor="middle">left = right = 1</text>
    </svg>
  </div>
  <figcaption>区间为空，返回下标 1；该位置是第一个大于等于目标值的位置。</figcaption>
</figure>
```

- [ ] **Step 3: 建立直接验证文章实现的工具**

将以下完整代码保存为 `tools/algorithms/check_examples.py`。它只执行本仓库中按接口表标识的教学代码，不抓取或执行外部网页。用例核对实际算法输出和边界，不做正文快照测试。

```python
#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]

class Examples(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.current = None
        self.buffer = []
        self.blocks = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "code" and "data-example" in attrs:
            self.current = attrs["data-example"]
            self.buffer = []

    def handle_data(self, data):
        if self.current is not None:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag == "code" and self.current is not None:
            if self.current in self.blocks:
                raise ValueError("duplicate example: " + self.current)
            self.blocks[self.current] = "".join(self.buffer)
            self.current = None

CASES = {
    "basic": {
        "quicksort": """
for values in ([], [1], [5,2,3,1,4], [3,3,1,2,3], [-2,0,-5]):
    original = values[:]
    assert quick_sort(values) == sorted(values)
    assert values == original
""",
        "lower-bound": """
for values, target, expected in [([],4,0), ([2,4,4,7,9],4,1),
        ([2,4,4,7,9],10,5), ([2,4,4,7,9],1,0), ([1,3,5],2,1)]:
    assert lower_bound(values,target) == expected
""",
    },
    "data-structures": {
        "reverse-list": """
assert reverse_list(None) is None
single = Node("only")
assert reverse_list(single) is single and single.next is None
nodes = [Node(value) for value in "ABCD"]
for a,b in zip(nodes,nodes[1:]):
    a.next = b
head = reverse_list(nodes[0])
for expected in reversed(nodes):
    assert head is expected
    head = head.next
assert head is None
""",
        "bfs": """
graph = {"A":["B","C"], "B":["A","D"], "C":["A","D"],
         "D":["B","C","E"], "E":["D"], "Z":[]}
assert bfs(graph,"A") == ["A","B","C","D","E"]
assert bfs({"A":[]},"A") == ["A"]
try:
    bfs({},"A")
except ValueError:
    pass
else:
    raise AssertionError("missing start must raise ValueError")
""",
    },
    "thinking": {
        "climb-stairs": """
assert [climb_stairs(i) for i in range(6)] == [1,1,2,3,5,8]
try:
    climb_stairs(-1)
except ValueError:
    pass
else:
    raise AssertionError("negative n must raise ValueError")
""",
        "permutations": """
values = [1,2,3]
result = permutations(values)
assert result == [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
assert values == [1,2,3]
assert permutations([]) == [[]]
""",
    },
    "engineering": {
        "lru": """
cache = LRUCache(3)
for key,value in [("A",1),("B",2),("C",3)]:
    cache.put(key,value)
assert cache.get("A") == 1
assert list(cache.data) == ["B","C","A"]
cache.put("D",4)
assert list(cache.data) == ["C","A","D"]
missing = object()
assert cache.get("B",missing) is missing
cache.put("C",None)
assert cache.get("C",missing) is None
assert list(cache.data) == ["A","D","C"]
single = LRUCache(1)
single.put("A",1); single.put("B",2)
assert single.get("A",missing) is missing and single.get("B") == 2
for capacity in [0,-1]:
    try:
        LRUCache(capacity)
    except ValueError:
        pass
    else:
        raise AssertionError("capacity must be positive")
""",
    },
    "ai": {
        "cosine-search": """
import math
assert math.isclose(cosine_similarity([1,0],[1,1]),1/math.sqrt(2))
docs = {"A":[1,0],"B":[1,1],"C":[0,1],"D":[-1,0]}
assert [doc for score,doc in search([1,0],docs,2)] == ["A","B"]
assert search([1,0],docs,0) == []
assert len(search([1,0],docs,10)) == 4
assert search([1,0],{},3) == []
assert [doc for score,doc in search([1,0],{"B":[1,0],"A":[1,0]},2)] == ["A","B"]
for a,b in [([0,0],[1,0]),([1],[1,0]),([],[])]:
    try:
        cosine_similarity(a,b)
    except ValueError:
        pass
    else:
        raise AssertionError("invalid vectors must raise ValueError")
try:
    search([1,0],docs,-1)
except ValueError:
    pass
else:
    raise AssertionError("negative k must raise ValueError")
""",
        "linear-loss": """
assert predict_linear(2,2,1) == 5
assert mse_loss([(1,3),(2,5)],2,1) == 0
assert mse_loss([(1,3),(2,5)],1,0) == 6.5
try:
    mse_loss([],2,1)
except ValueError:
    pass
else:
    raise AssertionError("empty samples must raise ValueError")
""",
        "attention": """
import math
weights,output = attention([1,0],[[1,0],[0,1]],[[2,0],[0,2]])
assert math.isclose(sum(weights),1)
assert math.isclose(weights[0],0.6697615493266569)
assert math.isclose(output[0],1.3395230986533138)
assert math.isclose(output[1],0.6604769013466862)
for q,k,v in [([],[[1]],[[1]]),([1],[],[]),
              ([1,0],[[1]],[[1]]),([1],[[1],[2]],[[1],[1,2]])]:
    try:
        attention(q,k,v)
    except ValueError:
        pass
    else:
        raise AssertionError("invalid attention shapes must raise ValueError")
""",
    },
}

def main():
    selected = sys.argv[1:] or list(CASES)
    failures = []
    for page in selected:
        if page not in CASES:
            raise SystemExit("unknown page: " + page)
        path = ROOT / "algorithms" / (page + ".html")
        parser = Examples()
        parser.feed(path.read_text())
        for name, checks in CASES[page].items():
            try:
                source = parser.blocks[name]
                namespace = {"__name__": "article_example"}
                exec(compile(source,str(path)+"#"+name,"exec"),namespace)
                exec(compile(checks,"checks:"+name,"exec"),namespace)
                print("PASS",page,name)
            except Exception as error:
                failures.append((page,name,error))
                print("FAIL",page,name,type(error).__name__,str(error))
    raise SystemExit(1 if failures else 0)

if __name__ == "__main__":
    main()
```

- [ ] **Step 4: 记录基线并提交共用工作**

先独立验证提取器确实解码 HTML 比较符号并能执行提取的代码：

```bash
python3 - <<'PY'
import runpy
module = runpy.run_path('tools/algorithms/check_examples.py')
parser = module['Examples']()
parser.feed('<pre><code data-example="sample">def smaller(a,b):\n    return a &lt; b</code></pre>')
scope = {}
exec(parser.blocks['sample'],scope)
assert scope['smaller'](1,2) is True
assert scope['smaller'](2,1) is False
print('PASS HTML entity extraction')
PY
```

执行 `python3 tools/algorithms/check_examples.py`。旧文章没有 `data-example` 标识，因此此时应报告待实现块缺失；这是接线基线，不作为算法行为测试已通过的证据。各页面完成后重复对应选择参数，最终全量检查才应全部通过。检查 CSS 差异没有影响非算法选择器。

```bash
git diff --check
git add css/cayman.css tools/algorithms/check_examples.py
git commit -m "Add algorithm lesson styles and example checks"
```

### Task 2: 基础算法与快排 GIF 接入

**Files:** Modify `algorithms/basic.html`；Create `algorithms/assets/quicksort-partition-static.svg`；接收既有 `algorithms/assets/quicksort-partition.gif`、`tools/algorithms/generate_quicksort_gif.py`。

**Interfaces:** Consumes Task 1 的样式与 `basic` 示例验证；Produces `quicksort`、`lower-bound` 两个代码块、GIF 图片及静态替代图。Liquid 资源路径统一为 `{{ site.baseurl }}/algorithms/assets/文件名`。

- [ ] **Step 1: 写清排序问题、分区过程与 GIF 说明**

固定样例 `[5,2,3,1,4]`。主调用基准为 3：小于区 `[2,1]`、等于区 `[3]`、大于区 `[5,4]`；左侧基准为 1，返回 `[1,2]`；右侧基准为 4，返回 `[4,5]`；最后拼接为 `[1,2,3,4,5]`。解释基准来自中间位置、移动表示复制到新列表、分区完成时两侧仍未有序、空列表与单元素直接返回。

添加以下图片结构和 3 条对应文字步骤。静态 SVG 按“原始输入 / 三个分区 / 两侧递归返回 / 最终结果”纵向排版，节点数字和基准与上述数据完全一致，含 title/desc；它同时是减少动态效果的替代内容。

```html
<figure class="algorithm-figure algorithm-animation">
  <a href="{{ site.baseurl }}/algorithms/assets/quicksort-partition.gif" aria-label="打开完整尺寸的快速排序动图">
    <picture>
      <source media="(prefers-reduced-motion: reduce)" srcset="{{ site.baseurl }}/algorithms/assets/quicksort-partition-static.svg">
      <img src="{{ site.baseurl }}/algorithms/assets/quicksort-partition.gif" width="1120" height="820" loading="lazy" alt="快速排序把 5、2、3、1、4 按基准 3 分区，递归排序左右列表后拼接为 1、2、3、4、5。">
    </picture>
  </a>
  <figcaption>约 29 秒循环演示。先按基准分区，再递归排序左右列表，最后拼接；下面的文字步骤可停下来阅读。</figcaption>
</figure>
```

- [ ] **Step 2: 让快排代码与 GIF 的单次扫描分区一致**

代码放入 `<code class="language-python" data-example="quicksort">`，HTML 中的比较符号正确转义。

```python
def quick_sort(nums):
    if len(nums) <= 1:
        return nums[:]
    pivot = nums[len(nums) // 2]
    less, equal, greater = [], [], []
    for value in nums:
        if value < pivot:
            less.append(value)
        elif value > pivot:
            greater.append(value)
        else:
            equal.append(value)
    return quick_sort(less) + equal + quick_sort(greater)
```

复杂度按这份实现标注：平均时间 O(n log n)、最坏 O(n²)；保留父帧分区列表时平均峰值辅助空间 O(n)、退化时可达 O(n²)，其中递归栈平均 O(log n)、最坏 O(n)。这是便于理解的新列表版本，不能套用经典原地分区版的空间或稳定性结论。补充归并排序合并时相等元素先取左侧才能保持稳定；完整堆排序与大小为 k 的堆解决 Top-K 分开解释。

- [ ] **Step 3: 重写二分，用明确区间与重复值演算**

输入 `[2,4,4,7,9]`，目标 4。图与表同步展示 `(left,right,mid)`：`(0,5,2)→right=2`、`(0,2,1)→right=1`、`(0,1,0)→left=1`，最后 `(1,1)` 返回下标 1。每一步标明 `[left,right)`，结束位置不是“必然找到相等元素”，而是第一个 `>= target` 的插入位置。

`data-example="lower-bound"` 使用以下实现，注明有序输入、时间 O(log n)、额外空间 O(1)，说明空数组、重复值和返回 n 的含义。

```python
def lower_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left
```

- [ ] **Step 4: 用具体用途补全其余基础模式**

保留普通二分、左右边界、二分答案；后者说明需要单调的可行性判定。HashMap/HashSet 用去重或计数解释平均 O(1) 依赖散列与冲突处理；滑动窗口说明需要可维护的窗口条件；快慢指针说明链表中两种移动速度；单调栈以寻找下一个更大值为例说明入栈、弹栈；队列解释 FIFO 与 BFS 的关系。每个条目给输入条件、动作、成本或成本取决于什么，不堆叠术语。

- [ ] **Step 5: 验证两个实际代码块与 GIF，提交该页**

```bash
python3 tools/algorithms/check_examples.py basic
python3 tools/algorithms/generate_quicksort_gif.py --output /tmp/quicksort-partition.gif --preview-dir /tmp/quicksort-review
git diff --check
git add algorithms/basic.html algorithms/assets/quicksort-partition.gif algorithms/assets/quicksort-partition-static.svg tools/algorithms/generate_quicksort_gif.py
git commit -m "Explain basic algorithms with quicksort animation and binary search trace"
```

预期：2 个文章代码块通过；生成器报告 22 个事件、9 个扫描值、4 个基线、76 帧、29.3 秒，并通过分区及逐帧解码断言。成品字节数可以随字体或 Pillow 编码变化，不以文件哈希或精确字节数作为行为测试。

### Task 3: 数据结构页的指针与队列过程

**Files:** Modify `algorithms/data-structures.html`。

**Interfaces:** Consumes Task 1 的步骤图样式与 `data-structures` 验证；Produces `reverse-list`、`bfs` 两个完整代码块，包含节点定义与含环图的正确遍历说明。

- [ ] **Step 1: 用分步图重写链表反转**

输入 `A→B→C→D→None`。每张图同时显示已反转前缀与未处理后缀，明确箭头方向；逐轮记录：

| 迭代前 prev / cur | 先保存 nxt | 重连 | 迭代后 prev / cur |
|---|---|---|---|
| None / A | B | A.next=None | A / B |
| A / B | C | B.next=A | B / C |
| B / C | D | C.next=B | C / D |
| C / D | None | D.next=C | D / None |

`data-example="reverse-list"` 使用下列自包含代码。说明输入是无环单链表、函数会修改原节点，返回新头 D；时间 O(n)、额外空间 O(1)。

```python
class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

def reverse_list(head):
    prev, cur = None, head
    while cur is not None:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev
```

- [ ] **Step 2: 用含环与共享邻居的图解释 BFS 的 seen**

固定邻接顺序：`A:[B,C]`、`B:[A,D]`、`C:[A,D]`、`D:[B,C,E]`、`E:[D]`。图中顶点用 A–E，距离层数另作标签，避免节点身份和距离混淆。逐步表展示处理 A/B/C/D/E 后队列分别是 `[B,C]`、`[C,D]`、`[D]`、`[E]`、`[]`；C 不会再次把 D 入队。标记发生在入队时。

`data-example="bfs"` 使用以下代码。邻接表覆盖全部顶点，起点不存在时抛 `ValueError`；返回值是顺序，不是假装包含距离。无权最短路径的层数另解释为 A=0、B/C=1、D=2、E=3；函数只遍历可达部分，邻接表时间 O(V+E)、空间 O(V)。

```python
from collections import deque

def bfs(graph, start):
    if start not in graph:
        raise ValueError("start must be a vertex")
    seen, queue, order = {start}, deque([start]), []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                queue.append(nxt)
    return order
```

- [ ] **Step 3: 补全链表、树和图的选择条件**

保留合并链表、快慢指针、环检测，说明访问/插入的前提；树的先中后序、BST、堆、Trie 以操作和用途区分。BST 的 O(log n) 要限定平衡情形，退化可到 O(n)；堆顶查询 O(1)、插入/弹出 O(log n)；Trie 查找与键长度有关。

图条目保留 DFS、Dijkstra、Floyd、拓扑排序、并查集：区分无权 BFS、非负边权 Dijkstra、全点对 Floyd；拓扑排序要求 DAG；并查集适合动态合并和连通性，不用于求一般最短路。复杂度写出采用的表示或优化条件，不写没有实现前提的统一成本。

- [ ] **Step 4: 验证节点身份、边界和遍历顺序，提交该页**

```bash
python3 tools/algorithms/check_examples.py data-structures
git diff --check
git add algorithms/data-structures.html
git commit -m "Teach linked list reversal and BFS with explicit state changes"
```

预期：2 个代码块通过，反转保留原节点身份、尾节点 next 为 None，含环图每个可达顶点只进入返回顺序一次，孤立点与非法起点符合说明。

### Task 4: 算法思想页的状态设计与撤销选择

**Files:** Modify `algorithms/thinking.html`。

**Interfaces:** Consumes Task 1 的步骤图样式与 `thinking` 验证；Produces `climb-stairs`、`permutations` 代码块，以及 DP 状态表、回溯过程图和贪心反例。

- [ ] **Step 1: 把抽象递归树换成可计算的分治过程**

用归并排序的 `[4,1,3,2]` 展示拆成 `[4,1]` / `[3,2]`，再到单元素，返回 `[1,4]` / `[2,3]`，合并为 `[1,2,3,4]`。解释停止条件、每次规模缩小、父调用等待子结果和合并动作。递归与分治分别说明；FFT 只作为进一步阅读的例子，不展开推导。

- [ ] **Step 2: 用爬楼梯解释计数状态、转移和滚动变量**

定义每次走 1 或 2 阶，整数 n≥0，f(0)=1 表示不迈步的空方案。到第 i 阶最后一步来自 i−1 或 i−2，两类方案互不重叠。表为 i=0..5、f(i)=[1,1,2,3,5,8]；画出滚动变量更新 `(1,1)→(1,2)→(2,3)→(3,5)→(5,8)`。这是计数 DP，讲解不只使用“最优子结构”一词。

`data-example="climb-stairs"`：

```python
def climb_stairs(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    if n <= 1:
        return 1
    prev, cur = 1, 1
    for i in range(2, n + 1):
        prev, cur = cur, prev + cur
    return cur
```

说明时间 O(n)、辅助空间 O(1)。背包、LIS、编辑距离、股票状态用小表说明各自状态在记什么、转移依赖什么；不同实现成本不同，避免把所有 DP 归为同一复杂度。

- [ ] **Step 3: 给回溯画出选择、保存副本和撤销**

互异输入 `[1,2,3]` 的结果顺序为 `[123,132,213,231,312,321]`。主图放大 `[1]→[1,2]→[1,2,3]`，返回后依次 `path.pop()`、`used[i]=False`，再试 `[1,3]→[1,3,2]`；其余分支用完整小树或结果表呈现。图中不能把“禁止重复使用同一索引”冒充其他问题约束剪枝。

`data-example="permutations"`：

```python
def permutations(nums):
    ans, path, used = [], [], [False] * len(nums)
    def dfs():
        if len(path) == len(nums):
            ans.append(path[:])
            return
        for i, value in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(value)
            dfs()
            path.pop()
            used[i] = False
    dfs()
    return ans
```

输入互异是此版本的前提，重复数值会产生重复排列；空输入返回 `[[]]`。完整生成并保存结果的时间和结果空间为 O(n·n!)，辅助路径、标记和递归栈为 O(n)。

- [ ] **Step 4: 用能算出的成功例与反例说明贪心**

区间选取使用半开区间 `[(1,3),(2,4),(3,5),(5,7)]`，允许首尾相接，按结束时间选择 `(1,3),(3,5),(5,7)`，解释最早结束为后续留出空间的交换直觉。反例：面额 `[1,3,4]` 凑 6，最大面额优先得到 `4+1+1`，而 `3+3` 更少。Huffman、最小生成树只写适用目标与为什么要证明策略；N 皇后、数独说明约束与剪枝作用。

- [ ] **Step 5: 验证计数边界与回溯输出，提交该页**

```bash
python3 tools/algorithms/check_examples.py thinking
git diff --check
git add algorithms/thinking.html
git commit -m "Explain DP state transitions greedy limits and backtracking undo"
```

预期：2 个代码块通过，n=0/1/5 和负数行为清楚，排列保存独立结果副本并覆盖所有六种结果。

### Task 5: 工程算法页的访问顺序、键迁移与误判

**Files:** Modify `algorithms/engineering.html`。

**Interfaces:** Consumes Task 1 的图示样式与 `engineering` 验证；Produces `lru` 代码块、LRU 连续状态图、一致性哈希前后对照及布隆过滤器的具体示例。

- [ ] **Step 1: 将 LRU 图改为真实容量和操作序列**

容量固定为 3，左端最久未使用、右端最近使用：

| 操作 | 返回 / 淘汰 | 操作后顺序 |
|---|---|---|
| put A=1、B=2、C=3 | — | A,B,C |
| get A | 返回 1 | B,C,A |
| put D=4 | 淘汰 B | C,A,D |
| get B | 未命中，顺序不变 | C,A,D |
| put C=30 | 更新已有键 | A,D,C |

画出命中移动、新增淘汰、未命中三个不同动作，不再用“旧 / 新”充当实际缓存条目。`data-example="lru"` 使用以下实现；容量前提为正整数。`get` 可传入独立哨兵对象区分缺失与缓存值 None。

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        self.capacity = capacity
        self.data = OrderedDict()

    def get(self, key, default=None):
        if key not in self.data:
            return default
        self.data.move_to_end(key)
        return self.data[key]

    def put(self, key, value):
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.capacity:
            self.data.popitem(last=False)
```

说明哈希表与双向顺序结构使操作通常 O(1)，存储 O(capacity)。LFU 说明频次最低优先，同频次需要额外规则，历史热点可能需要衰减；不要暗示此处实现了 LFU。

- [ ] **Step 2: 用前后两张图解释一致性哈希的迁移范围**

示意空间 `[0,100)` 沿数值增加方向顺时针，节点 A=20、B=50、C=80。键的初始归属为 10→A、30→B、45→B、60→C、90→A。新增 D=35 后，仅示例中的 30→D；45 仍在 B，90 仍需绕回 A。标出被迁移的区间 `(20,35]`，说明规则是找到第一个不小于键位置的节点，没有时绕回第一个。

补充虚拟节点改善分布；一致性哈希本身不提供复制或故障恢复。纠正现有 Redis Cluster 表述：它使用 16384 个哈希槽，不能直接当作这里的一致性哈希环实例。

- [ ] **Step 3: 给布隆过滤器和其余算法补足前提与限制**

布隆例子用 8 位、两个简化哈希结果：插入 cat 设置下标 1、5，位数组为 `[0,1,0,0,0,1,0,0]`；dog 也映射到 1、5，产生假阳性；fox 映射到 2、5，位 2 为 0，可排除。正结果仍查真实存储。明确这是只插入、参数一致且状态未损坏的标准过滤器，不可随意清位删除。

保留 KMP、Trie、AC 自动机、Rabin–Karp、B+ 树。KMP 解释单模式的前缀回退；Trie 解释按字符走路径；AC 解释多模式与失败链接、输出数影响成本；Rabin–Karp 解释滚动哈希与碰撞后核对原文。B+ 树说明多路节点降低索引高度、叶子支持范围扫描，是许多数据库索引的常见结构。成本注明字符串长度、输出数或存储模型，避免无条件结论。

- [ ] **Step 4: 验证缓存操作并逐行核对两种图例，提交该页**

```bash
python3 tools/algorithms/check_examples.py engineering
git diff --check
git add algorithms/engineering.html
git commit -m "Explain LRU eviction consistent hashing migration and Bloom limits"
```

预期：LRU 的命中、未命中、更新已有值、缓存 None、容量 1、非法容量均通过；一致性哈希的五个键归属与区间一致；布隆例子的位下标按从 0 开始解释。

### Task 6: AI 算法页的可计算检索与 Attention

**Files:** Modify `algorithms/ai.html`。

**Interfaces:** Consumes Task 1 的图示样式与 `ai` 验证；Produces `cosine-search`、`linear-loss`、`attention` 三个代码块，以及相似度与注意力权重的完整演算。

- [ ] **Step 1: 先用精确检索说明向量、度量和 Top-K**

输入查询 q=(1,0)，文档 A=(1,0)、B=(1,1)、C=(0,1)、D=(-1,0)。点积除以两向量范数，余弦分数分别为 1、1/√2≈0.7071、0、−1，Top-2 是 A、B。分步图依次显示向量、打分表和排序结果。说明分数是该表示和度量下的相似度，不是“事实正确率”。

`data-example="cosine-search"` 使用以下实现。输入为有限实数向量，文档 ID 为字符串；拒绝空向量、不同维数和零向量。k 为非负整数；k=0 返回空，k>N 返回全部；相同分数按文档 ID 升序，输出顺序为分数降序。

```python
import math

def cosine_similarity(a, b):
    if not a or len(a) != len(b):
        raise ValueError("vectors must have the same positive dimension")
    norm_a = math.sqrt(sum(x*x for x in a))
    norm_b = math.sqrt(sum(x*x for x in b))
    if norm_a == 0 or norm_b == 0:
        raise ValueError("zero vectors have no cosine similarity")
    return sum(x*y for x,y in zip(a,b)) / (norm_a*norm_b)

def search(query_vec, docs, top_k=3):
    if top_k < 0:
        raise ValueError("top_k must be nonnegative")
    cosine_similarity(query_vec, query_vec)
    scored = [(cosine_similarity(query_vec, vector), doc_id)
              for doc_id,vector in docs.items()]
    return sorted(scored, key=lambda row: (-row[0],row[1]))[:top_k]
```

此实现全量打分再排序，N 篇、d 维时为 O(Nd+N log N)，结果辅助空间 O(N)。它是精确基线；ANN 用与精确 Top-K 的交集解释 recall@k 及近似取舍。区分 Embedding 表示、HNSW 索引方法和 Faiss 检索库，不再并列成同类算法。

- [ ] **Step 2: 说明经典模型在做什么，解释预测与损失**

线性回归说明拟合数值关系，决策树说明特征阈值划分，XGBoost 说明组合提升树逐步修正目标，KMeans 说明按距离交替分配与更新中心以及需要选择 k。分别给输入、输出、目标和限制。成本与样本、特征、树规模或迭代数有关，不给脱离实现的固定复杂度。

`data-example="linear-loss"` 的代码只展示预测和损失，不宣称已经实现训练；用样本 `(1,3),(2,5)`、w=2、b=1 算得 MSE=0，w=1、b=0 算得 MSE=6.5。

```python
def predict_linear(x, weight, bias):
    return weight*x + bias

def mse_loss(samples, weight, bias):
    if not samples:
        raise ValueError("samples must not be empty")
    return sum((predict_linear(x,weight,bias)-y)**2 for x,y in samples) / len(samples)
```

- [ ] **Step 3: 增加 Attention 的数值过程，而不是只画模型方框**

使用一个查询 q=[1,0]，键 k1=[1,0]、k2=[0,1]，值 v1=[2,0]、v2=[0,2]。d_k=2，缩放分数为 `[1/√2,0]`，softmax 权重约 `[0.6698,0.3302]`，对 V 加权得到 `[1.3395,0.6605]`。图清楚区分 K 用于打分、V 用于加权；这是单查询教学计算，不是完整 Transformer。

`data-example="attention"`：

```python
import math

def attention(query, keys, values):
    if not query or not keys or len(keys) != len(values):
        raise ValueError("one value is required for each key")
    dk, dv = len(query), len(values[0])
    if dv == 0 or any(len(key) != dk for key in keys) or any(len(value) != dv for value in values):
        raise ValueError("inconsistent vector dimensions")
    logits = [sum(q*k for q,k in zip(query,key))/math.sqrt(dk) for key in keys]
    peak = max(logits)
    exps = [math.exp(score-peak) for score in logits]
    total = sum(exps)
    weights = [value/total for value in exps]
    output = [sum(weight*value[j] for weight,value in zip(weights,values)) for j in range(dv)]
    return weights, output
```

输入限有限实数，代码减去最大 logit 提高 softmax 的数值稳定性。说明真实 Q/K/V 来自学习到的投影，Self-Attention 的三者来自同一序列，位置表示提供顺序信息，注意力权重不能直接当作严格因果解释。单查询的成本随键数量与向量维度增长，不能把它等同于完整模型训练成本。

- [ ] **Step 4: 核对三个实际示例、浮点容差和错误输入，提交该页**

```bash
python3 tools/algorithms/check_examples.py ai
git diff --check
git add algorithms/ai.html
git commit -m "Teach exact vector retrieval and attention with numeric examples"
```

预期：3 个代码块通过，Top-K、并列分数、零向量、维数不符、负 k、空训练样本和 Attention 形状错误符合页面说明；显示的小数与计算结果在四位小数内一致。

### Task 7: 总览页同步成可检查前提的工具地图

**Files:** Modify `algorithms/index.html`。

**Interfaces:** Consumes Task 2–6 的最终术语、页面 URL 与共用图示类；Produces 6 个既有专题入口，以及“问题特征→候选工具→检查前提”的有方向图。总览不新增运行时算法。

- [ ] **Step 1: 用六个选择分支重做总览图，保留语义链接**

分支固定为：有序范围边界→二分；关系与最少边数→图/BFS；状态递推与重复子问题→DP；缓存容量与访问局部性→LRU；语义近邻→向量检索；尚缺先修知识→学习路线。各分支允许重叠，图注说明仍需检查输入前提与目标，不宣称自动选出唯一算法。含链接的 SVG 使用 group 角色、可访问名称和可聚焦链接；现有 6 个 HTML 入口继续作为等价导航。

```html
<nav class="algorithm-link-grid" aria-label="算法专题入口">
  <a href="{{ site.baseurl }}/algorithms/basic.html"><span>01</span><strong>基础算法</strong><small>排序、二分与基础模式</small></a>
  <a href="{{ site.baseurl }}/algorithms/data-structures.html"><span>02</span><strong>数据结构</strong><small>链表指针、树与图遍历</small></a>
  <a href="{{ site.baseurl }}/algorithms/thinking.html"><span>03</span><strong>算法思想</strong><small>分治、状态递推、选择与撤销</small></a>
  <a href="{{ site.baseurl }}/algorithms/engineering.html"><span>04</span><strong>工程算法</strong><small>缓存、字符串、判重与路由</small></a>
  <a href="{{ site.baseurl }}/algorithms/ai.html"><span>05</span><strong>AI 时代算法</strong><small>向量打分、检索与注意力</small></a>
  <a href="{{ site.baseurl }}/algorithms/learning-path.html"><span>06</span><strong>学习路线</strong><small>先修关系与掌握检查点</small></a>
</nav>
```

- [ ] **Step 2: 重写概览而不重复专题全文**

删除缺少类型与真实输入的 `choose_tool()`。保留排序对比、数据结构、算法思想、工程和 AI 的摘要；每段用一个问题连接到详细页。排序表保留冒泡、选择、插入、快排、归并、堆，注明平均/最坏或最佳条件；快排平均 O(n log n)、最坏 O(n²)，不再写“最常用”；堆排序与 Top-K 选择区别清楚。稳定性取决于具体实现，归并相等时先取左侧，经典原地快排与新列表教学版分开说明。

同步修正总览中的 Redis Cluster、布隆过滤器和 DP 适用条件，确保与 Task 4–6 一致。

- [ ] **Step 3: 核对每个分支可到达对应说明，提交总览**

逐个检查 6 个 HTML 入口和图中链接；图例与分支条件使用同一术语。生成站点后的路径与链接由 Task 9 统一验证。

```bash
git diff --check
git add algorithms/index.html
git commit -m "Connect algorithm overview to concrete problem conditions"
```

### Task 8: 学习路线改为阶段证据与具体练习

**Files:** Modify `algorithms/learning-path.html`。

**Interfaces:** Consumes Task 2–6 的实际样例与 6 个专题 URL；Produces 阶段先修关系、明确练习结果和不同方向的学习优先级，不提供固定周数排课函数。

- [ ] **Step 1: 用三段学习成果连接先修关系**

阶段一：数组/哈希/链表/栈队列/树/排序/二分；阶段二：DFS/BFS、递归、回溯、贪心、DP；阶段三：图、并查集、Trie、堆、线段树、位运算/状态压缩与工程应用。每段回答“先会什么→练什么→怎样判断掌握”，阶段图向下连接，允许因目标不同回看先修主题。

- [ ] **Step 2: 给出可以对照的学习者案例与检查点**

删除 `weekly_plan()` 及其固定周数承诺。用一个已懂数组、想理解缓存的读者串起“二分边界练习→链表指针→哈希与双向顺序→LRU”。提供以下结果作为自查依据：

| 检查点 | 可观察证据 |
|---|---|
| 基础 | 手算 `[2,4,4,7,9]` 查 4 返回 1，说明 `[left,right)`，给出空数组返回 0 |
| 结构 | 逐步把 A→B→C→D 反转为 D→C→B→A，指出保存 nxt 的时机 |
| 思想 | 手写 BFS 队列变化，算出 climb_stairs(5)=8，标出回溯撤销的两行代码 |
| 工程 | 容量 3 的缓存读 A 后再放 D，说明 B 为什么被淘汰，得到 C,A,D |
| AI | 手算 q=(1,0) 的检索结果 A、B，说明零向量为何不能直接算余弦 |

至少保留一条完整学习案例及其实际输入/结果，保证本页也有能跟随的具体过程。岗位方向保留后端、前端、AI、游戏开发，说明重点与使用场景，而非把岗位和固定算法清单画等号。

- [ ] **Step 3: 把练习链接到现有专题，提交学习路线**

所有跳转继续使用 Liquid baseurl，图与正文的阶段名称一致，返回地图的链接保留。

```html
<a href="{{ site.baseurl }}/algorithms/basic.html">练习二分边界</a>
<a href="{{ site.baseurl }}/algorithms/data-structures.html">跟踪链表指针</a>
<a href="{{ site.baseurl }}/algorithms/engineering.html">演算 LRU 淘汰</a>
```

```bash
git diff --check
git add algorithms/learning-path.html
git commit -m "Make algorithm learning milestones observable and actionable"
```

### Task 9: 全区内容、构建与桌面 / 窄屏验收

**Files:** 核对上述 7 页、`css/cayman.css`、`algorithms/assets/`、`tools/algorithms/`；在本计划中更新实际完成状态和验证记录。

**Interfaces:** Consumes Task 1–8 的全部产物；Produces 可运行示例、生成后的 7 个页面、本地 HTTP 预览和具体的验证结果。修正问题时回到所属任务的文件范围，重新运行受影响的检查。

- [ ] **Step 1: 复核预检结果并实际完成构建**

现有环境调查结果：Ruby 2.6.10、Bundler 2.4.22；`bundle check` 报告锁定 gems 缺失，`bundle exec jekyll --version` 报 `command not found: jekyll`。因此此前没有本地 Jekyll 构建成功的证据。Python 3.9.6 和 Pillow 11.3.0 可用。

先执行 `bundle check`。当前环境若仍缺依赖，将锁定依赖安装到临时目录并使用同一环境构建：

```bash
BUNDLE_PATH=/tmp/algorithms-bundle BUNDLE_FROZEN=true bundle install
BUNDLE_PATH=/tmp/algorithms-bundle BUNDLE_FROZEN=true bundle exec jekyll build --destination /tmp/algorithms-jekyll-site
```

若现有 Bundler 环境已经满足依赖，直接执行 `bundle exec jekyll build --destination /tmp/algorithms-jekyll-site` 即可。保留 `Gemfile`、`Gemfile.lock` 和 gemspec 的现有内容；若 Ruby 或平台不兼容，记录具体依赖错误与版本要求，使用已有兼容环境解决。环境未解决时继续完成示例和源文件检查，但将构建及依赖构建结果的检查明确记为未验证，不把任务整体标为验收通过。

开始执行前先记录 `git status --short`，保留其他未跟踪文件；可将已认可的设计修订和本计划逐文件提交。不要把其他历史计划纳入本次提交。

- [ ] **Step 2: 完成全部实际文章代码与动图验证**

```bash
python3 tools/algorithms/check_examples.py
python3 tools/algorithms/generate_quicksort_gif.py --output /tmp/quicksort-partition.gif --preview-dir /tmp/quicksort-review
```

预期：全部 10 个文章代码块通过；GIF 生成器的算法和解码断言全部通过。图表中的每一行状态与本计划的固定轨迹逐项核对；不是只看函数最终输出。若修改过 GIF 生成器的绘制或轨迹，同步重新生成仓库中的 GIF 并查看分区、子调用、末帧和移动中间帧。

- [ ] **Step 3: 检查生成后的路由、素材、内部片段和 SVG 名称**

构建成功后运行以下一次性脚本；它不写入仓库，不替代浏览器检查。

```bash
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import xml.etree.ElementTree as ET

site = Path('/tmp/algorithms-jekyll-site')
files = ['index.html','basic.html','data-structures.html','thinking.html',
         'engineering.html','ai.html','learning-path.html']

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.refs, self.svgs = set(), [], []
        self.article, self.headings = False, 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            assert a['id'] not in self.ids, ('duplicate id',a['id'])
            self.ids.add(a['id'])
        if tag == 'article' and 'algorithm-page' in a.get('class','').split():
            self.article = True
        if self.article:
            if tag == 'h1':
                self.headings += 1
            if tag == 'svg':
                self.svgs.append(a)
            self.refs.extend(a[k] for k in ['href','src'] if a.get(k))
            for entry in a.get('srcset','').split(','):
                if entry.strip():
                    self.refs.append(entry.strip().split()[0])
    def handle_endtag(self, tag):
        if tag == 'article':
            self.article = False

cache = {}
def parse(path):
    if path not in cache:
        p = Page()
        p.feed(path.read_text())
        cache[path] = p
    return cache[path]

for name in files:
    path = site / 'algorithms' / name
    assert path.is_file(), path
    content = path.read_text()
    assert '{{' not in content and '{%' not in content, path
    page = parse(path)
    assert page.headings == 1, (path,'article h1 count',page.headings)
    for svg in page.svgs:
        if svg.get('aria-hidden') == 'true':
            continue
        assert svg.get('role') in ['img','group'], (path,'SVG role')
        labels = svg.get('aria-labelledby','').split()
        assert svg.get('aria-label') or labels, (path,'SVG name')
        assert all(label in page.ids for label in labels), (path,labels)
    for svg_source in re.findall(r'<svg\b[\s\S]*?</svg>',content):
        ET.fromstring(svg_source)
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        local = unquote(url.path)
        target = site / local.lstrip('/') if local.startswith('/') else path.parent / local if local else path
        if target.is_dir():
            target = target / 'index.html'
        target = target.resolve()
        assert target.is_file(), (path,ref)
        if url.fragment:
            assert unquote(url.fragment) in parse(target).ids, (path,ref)
    print('PASS rendered page',name)

static_svg = site / 'algorithms/assets/quicksort-partition-static.svg'
ET.parse(static_svg)
assert (site / 'algorithms/assets/quicksort-partition.gif').is_file()
print('PASS sorting assets')
PY
```

预期：7 页均报告通过，排序素材存在，页面与素材链接不包含未渲染 Liquid。SVG 的可访问名称、ID 和 XML 均合法。若实际站点使用非空 baseurl，验证脚本的站点路径解析需按该前缀剥离后检查；本仓库当前 baseurl 为空。

- [ ] **Step 4: 从 HTTP 服务查看，而不是直接打开 Liquid 源文件**

使用满足依赖的同一 Bundler 环境启动服务：

```bash
BUNDLE_PATH=/tmp/algorithms-bundle BUNDLE_FROZEN=true bundle exec jekyll serve --host 127.0.0.1 --port 4000 --destination /tmp/algorithms-jekyll-site
```

若使用现成 Bundler 环境，省略两个临时环境变量。浏览器打开 `http://127.0.0.1:4000/algorithms/`。可以在另一个终端确认所有目标 URL：

```bash
for page in '' basic.html data-structures.html thinking.html engineering.html ai.html learning-path.html; do
  curl -fsS --max-time 10 "http://127.0.0.1:4000/algorithms/$page" -o /dev/null || exit 1
done
```

- [ ] **Step 5: 检查 7 页在桌面和手机宽度下的真实显示**

使用可用的浏览器控制工具查看 1280×900 与 390×844 两种视口，保存能显示关键图示的截图并实际查看。逐页确认：步骤顺序与图注相邻，箭头方向、数字、队列和指针标签不重叠或裁切；代码与表格可局部滚动；正文和步骤图无需横向拖动；深色节点上的文字保持对比度；独立图中文字实际显示约 14px 以上。

GIF 维持比例，允许点击打开完整尺寸；在手机上有独立的静态步骤文字，不依赖缩小后的 GIF 细字才能理解。启用“减少动态效果”的媒体偏好，确认 picture 选择静态 SVG；浏览器工具不支持该媒体模拟时，记录这一项仍需人工确认，不将源码检查写成真实显示检查已通过。

通过键盘检查总览专题入口和图中链接；每页返回地图的链接可用。仅在发现新问题或改动后重跑受影响的验证，避免无关全站测试。

- [ ] **Step 6: 按验收证据结束实施并记录状态**

```bash
git diff --check
git status --short
```

把已完成任务打勾，并记录文章示例检查、GIF 生成、Jekyll 构建、渲染页面检查和两种视口检查的实际命令、结果及仍未验证的事项。确认修改范围与文件职责表一致，提交本计划和设计修订时使用确切路径。交付源码、素材、本地 HTTP 预览地址和验证记录；构建或浏览器检查缺失时明确说明，不声称全部验收完成。

## 技术核对资料

在对应页面的进一步阅读处使用直接来源链接，核对正文确实支持所引用的断言：

- [Redis 官方：Scale with Redis Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)：Redis Cluster 的 16384 个哈希槽，以及它与一致性哈希环的区别。
- [Python 官方：OrderedDict objects](https://docs.python.org/3/library/collections.html#ordereddict-objects)：`move_to_end()` 与 `popitem(last=False)` 的顺序语义。
- [Faiss 官方文档](https://faiss.ai/)及[索引说明](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes)：区分库、穷举索引和 HNSW 索引；不要把文中纯 Python 精确搜索称为 ANN。
- [Attention Is All You Need 原论文，§3.2](https://papers.neurips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)：缩放点积、softmax、对 V 加权，以及 Self-Attention 的 Q/K/V 来源。

## 设计覆盖与执行顺序自查

| 已确认要求 | 实施位置 | 验证证据 |
|---|---|---|
| 全部 7 页重写、保留 URL 和导航 | Tasks 2–8 | Task 9 渲染路由与 HTTP 检查 |
| 以具体输入解释每一步 | Tasks 2–6 的固定轨迹；Task 8 学习者案例 | 图表逐行核对及实际文章代码 |
| 快排 GIF 与静态阅读支持 | Task 2 | 生成器分区/递归/解码断言、媒体偏好与窄屏查看 |
| 二分、链表、BFS、DP、回溯过程 | Tasks 2–4 | 文章中的实际函数与对应边界用例 |
| LRU、哈希环、布隆边界 | Task 5 | 缓存用例、五个键归属、8 位实例逐项核对 |
| 精确向量检索和 Attention | Task 6 | Top-K / 数值用例、形状和零向量检查 |
| 复杂度、正确性直觉与使用前提 | Tasks 2–7 | 对照实际实现与技术核对资料逐条审阅 |
| 可访问、对比度、手机可读 | Task 1 规范，Tasks 2–8 应用 | Task 9 SVG 名称与两种视口查看 |
| 不引入网页脚本或外部图库 | Tasks 1–8 | 差异审阅、资源与依赖范围检查 |
| 真实构建与诚实记录限制 | Task 9 | 构建及浏览器检查的实际输出与未验证项 |
