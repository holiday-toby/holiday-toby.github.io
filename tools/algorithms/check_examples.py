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
