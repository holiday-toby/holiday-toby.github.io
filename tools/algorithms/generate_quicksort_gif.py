#!/usr/bin/env python3
"""Render an algorithm-driven quicksort explainer (requires Pillow).

Run from the repository root:
    python3 tools/algorithms/generate_quicksort_gif.py

Use --font /path/to/a/CJK-font.ttf if automatic font discovery fails.
The animation describes a new-list implementation, not in-place swaps.
"""

from __future__ import annotations

import argparse
from collections import Counter
from copy import deepcopy
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont


WIDTH, HEIGHT = 1120, 820
INPUT = [5, 2, 3, 1, 4]
COLORS = {
    "bg": "#f1f5fa", "white": "#ffffff", "ink": "#18314d",
    "muted": "#536c84", "line": "#d6e1eb", "soft": "#eef3f8",
    "less": "#2563b6", "less_bg": "#e8f1ff",
    "equal": "#7451b8", "equal_bg": "#f1eafd",
    "greater": "#af4f32", "greater_bg": "#fff0e9",
    "active": "#b4770d", "active_bg": "#fff3d6",
    "done": "#197448", "done_bg": "#e8f5ed",
    "faded": "#b6c1cd",
}
GROUPS = ("less", "equal", "greater")


@dataclass
class Event:
    kind: str
    call: str
    nums: list[int]
    phase: int
    message: str
    tree: dict
    pivot: int | None = None
    buckets: dict[str, list[int]] = field(default_factory=dict)
    index: int = -1
    group: str | None = None
    result: list[int] = field(default_factory=list)
    parts: list[list[int]] = field(default_factory=list)


def make_trace() -> list[Event]:
    """Every visible state is emitted by the same recursive algorithm."""
    events: list[Event] = []
    tree = {
        "root": {"values": INPUT[:], "status": "active"},
        "left": {"values": None, "status": "waiting"},
        "right": {"values": None, "status": "waiting"},
    }

    def emit(kind, call, nums, phase, message, **kwargs):
        events.append(Event(kind, call, nums[:], phase, message,
                            deepcopy(tree), **deepcopy(kwargs)))

    def sort(nums: list[int], call: str) -> list[int]:
        if len(nums) <= 1:
            emit("base", call, nums, 2,
                 f"长度 {len(nums)} ≤ 1，直接返回 {nums}；不需要分区。",
                 result=nums[:])
            return nums[:]

        phase = 1 if call == "root" else 2
        if call in tree:
            tree[call]["status"] = "active"
        pivot = nums[len(nums) // 2]
        buckets = {group: [] for group in GROUPS}
        emit("choose", call, nums, phase,
             f"取中间位置的元素：下标 {len(nums) // 2}，基准 pivot = {pivot}。",
             pivot=pivot, buckets=buckets)
        for index, value in enumerate(nums):
            group = "less" if value < pivot else "greater" if value > pivot else "equal"
            relation = {"less": "<", "equal": "=", "greater": ">"}[group]
            label = {"less": "小于区", "equal": "等于区", "greater": "大于区"}[group]
            emit("scan", call, nums, phase,
                 f"{value} {relation} {pivot}：把 {value} 复制到{label}，输入列表保持不变。",
                 pivot=pivot, buckets=buckets, index=index, group=group)
            buckets[group].append(value)

        assert Counter(sum(buckets.values(), [])) == Counter(nums)
        assert all(x < pivot for x in buckets["less"])
        assert all(x == pivot for x in buckets["equal"])
        assert all(x > pivot for x in buckets["greater"])
        if call == "root":
            tree["left"]["values"] = buckets["less"][:]
            tree["right"]["values"] = buckets["greater"][:]
        emit("partition", call, nums, phase,
             "分区完成。左右列表内部还没排好，接着分别递归处理。",
             pivot=pivot, buckets=buckets)

        left_call = "left" if call == "root" else call + ".L"
        right_call = "right" if call == "root" else call + ".R"
        left = sort(buckets["less"], left_call)
        right = sort(buckets["greater"], right_call)
        result = left + buckets["equal"] + right
        assert result == sorted(nums)
        if call in tree:
            tree[call] = {"values": result[:], "status": "done"}
        message = "拼接：已排好的左侧 + 等于区 + 已排好的右侧。"
        if call == "root":
            message = "得到 [1, 2, 3, 4, 5]。本轮结束，停留后重新演示原始输入。"
        emit("concat", call, nums, 3 if call == "root" else 2, message,
             pivot=pivot, buckets=buckets, result=result,
             parts=[left, buckets["equal"], right])
        return result

    assert sort(INPUT, "root") == [1, 2, 3, 4, 5]
    assert sum(e.kind == "scan" for e in events) == 9
    assert sum(e.kind == "base" for e in events) == 4
    return events


def font_file(preferred: str | None) -> str:
    candidates = [preferred] if preferred else []
    candidates += [
        "/Library/Fonts/Arial Unicode.ttf",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return candidate
    raise SystemExit("No Chinese font found; use --font /path/to/font.ttf")


class Renderer:
    def __init__(self, font_path: str):
        self.fonts = {size: ImageFont.truetype(font_path, size)
                      for size in [15, 16, 17, 18, 19, 20, 21, 22, 24, 28, 30, 32, 34]}
        digit_path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
        self.digit = ImageFont.truetype(digit_path if Path(digit_path).is_file()
                                        else font_path, 32)

    def text(self, draw, xy, value, size=20, fill="ink", anchor=None):
        draw.text(xy, str(value), font=self.fonts[size],
                  fill=COLORS.get(fill, fill), anchor=anchor)

    def box(self, draw, bounds, fill="white", outline=None, width=1, radius=14):
        draw.rounded_rectangle(bounds, radius=radius,
                               fill=COLORS.get(fill, fill),
                               outline=COLORS.get(outline, outline), width=width)

    def wrapped(self, draw, xy, text, size, max_width, fill="ink", line_height=32):
        line, y = "", xy[1]
        for char in text:
            if draw.textlength(line + char, font=self.fonts[size]) > max_width:
                self.text(draw, (xy[0], y), line, size, fill)
                line, y = char, y + line_height
            else:
                line += char
        self.text(draw, (xy[0], y), line, size, fill)

    def chip(self, draw, center, value, group="soft", active=False, faded=False, small=False):
        width, height = (56, 53) if small else (76, 68)
        x, y = center
        fill = "soft" if faded else group + "_bg" if group in GROUPS or group == "done" else group
        outline = "active" if active else group if group in GROUPS or group == "done" else "line"
        self.box(draw, (x-width/2, y-height/2, x+width/2, y+height/2),
                 fill, outline, 3 if active else 2, 11)
        draw.text((x, y-1), str(value), font=self.digit,
                  fill=COLORS["faded" if faded else "ink"], anchor="mm")

    def tree(self, draw, event):
        self.box(draw, (826, 184, 1088, 640), outline="line")
        self.text(draw, (847, 202), "递归调用", 21)
        self.text(draw, (847, 233), "父调用等待子调用返回", 16, "muted")
        draw.line((850, 326, 850, 518), fill=COLORS["line"], width=2)
        for key, y, title in [("root", 267, "主数组"),
                              ("left", 380, "左侧：小于 3"),
                              ("right", 493, "右侧：大于 3")]:
            state = event.tree[key]
            status = state["status"]
            if key != "root":
                draw.line((850, y+30, 863, y+30), fill=COLORS["line"], width=2)
            x = 842 if key == "root" else 863
            fill = "done_bg" if status == "done" else "active_bg" if status == "active" else "soft"
            self.box(draw, (x, y, 1071, y+80), fill,
                     "done" if status == "done" else "active" if status == "active" else "line", 2, 9)
            self.text(draw, (x+12, y+9), title, 17)
            value = "分区后产生" if state["values"] is None else str(state["values"])
            self.text(draw, (x+12, y+40), value, 18)
            label = {"waiting": "待处理", "active": "处理中", "done": "已返回"}[status]
            self.text(draw, (1058, y+11), label, 15,
                      "done" if status == "done" else "muted", "ra")
        self.text(draw, (846, 599), "等于区 [3] 无需再递归", 17, "equal")

    @staticmethod
    def call_label(call):
        names = {"root": "主数组", "left": "左侧子问题 [2, 1]",
                 "right": "右侧子问题 [5, 4]"}
        if call in names:
            return names[call]
        return ("左侧" if call.startswith("left") else "右侧") + "的递归基线"

    def base(self, event):
        image = Image.new("RGB", (WIDTH, HEIGHT), COLORS["bg"])
        draw = ImageDraw.Draw(image)
        self.text(draw, (34, 19), "ALGORITHM 01  /  QUICK SORT", 16, "muted")
        self.text(draw, (34, 49), "快速排序：先分区，再递归", 34)
        self.box(draw, (960, 29, 1088, 65), "white", "line", radius=18)
        self.text(draw, (1024, 47), "GIF 循环演示", 16, "muted", "mm")
        self.text(draw, (36, 98), "输入 [5, 2, 3, 1, 4]  ·  中间位置元素作基准  ·  新建分区列表", 19, "muted")
        for i, title in enumerate(["1  扫描分区", "2  递归处理左右两侧", "3  拼接有序结果"], 1):
            x = 34 + (i-1)*355
            active = i == event.phase
            self.box(draw, (x, 137, x+342, 171), "ink" if active else "white", radius=10)
            self.text(draw, (x+171, 154), title, 18, "white" if active else "muted", "mm")
        self.box(draw, (32, 184, 807, 640), outline="line")
        self.text(draw, (53, 203), "当前处理：" + self.call_label(event.call), 21)
        self.tree(draw, event)
        self.box(draw, (32, 659, 1088, 782), "white", "line")
        self.text(draw, (53, 675), {"choose": "选择基准", "scan": "扫描一个元素",
                  "partition": "检查分区", "base": "递归停止条件", "concat": "递归返回并拼接"}[event.kind], 17, "muted")
        self.wrapped(draw, (53, 707), event.message, 22, 1010, line_height=30)
        self.text(draw, (34, 793), "方块移动表示复制进新列表；这份实现不在原数组中交换元素。", 16, "muted")
        return image, draw

    def array(self, draw, event, placed=False, show_hint=True):
        count = len(event.nums)
        centers = [(420+(i-(count-1)/2)*100, 302) for i in range(count)]
        self.text(draw, (53, 249), "nums", 17, "muted")
        if event.pivot is not None:
            self.text(draw, (781, 249), f"pivot = {event.pivot}", 18, "equal", "ra")
        for i, (value, center) in enumerate(zip(event.nums, centers)):
            scanned = (i < event.index or (placed and i <= event.index)
                       or event.kind == "partition")
            active = event.kind == "scan" and i == event.index and not placed
            pivot = i == count//2
            group = "equal" if pivot else "soft"
            self.chip(draw, center, value, group, active=active, faded=scanned)
            self.text(draw, (center[0], 348), f"下标 {i}", 15, "muted", "mm")
        if count and show_hint:
            self.text(draw, (420, 377), "中间位置的数作基准，不是求数值的中位数。", 17, "muted", "mm")
        return centers

    def buckets(self, draw, event, placed=False):
        buckets = deepcopy(event.buckets)
        if placed:
            buckets[event.group].append(event.nums[event.index])
        positions = {}
        for i, group in enumerate(GROUPS):
            x = 53+i*245
            self.box(draw, (x, 409, x+229, 610), group+"_bg", group, radius=12)
            name = {"less": "小于区", "equal": "等于区", "greater": "大于区"}[group]
            relation = {"less": "<", "equal": "=", "greater": ">"}[group]
            self.text(draw, (x+114, 435), name, 21, group, "mm")
            self.text(draw, (x+114, 466), f"value {relation} {event.pivot}", 17, group, "mm")
            values = buckets[group]
            expected_count = sum(
                (value < event.pivot if group == "less" else
                 value > event.pivot if group == "greater" else
                 value == event.pivot) for value in event.nums)
            for j, value in enumerate(values):
                center = (x+114+(j-(expected_count-1)/2)*68, 528)
                self.chip(draw, center, value, group, small=True)
            if not values:
                self.text(draw, (x+114, 530), "[ ]", 28, "muted", "mm")
            self.text(draw, (x+114, 586), "无需再递归" if group == "equal" else "分区后继续递归", 16, group, "mm")
            # Destination must match the layout after this value has arrived.
            destination_index = len(event.buckets[group])
            positions[group] = (x+114+(destination_index-(expected_count-1)/2)*68, 528)
        return positions

    def render(self, event, motion=None, placed=False):
        image, draw = self.base(event)
        if event.kind == "concat":
            for i, (group, values) in enumerate(zip(GROUPS, event.parts)):
                x = 53+i*245
                self.box(draw, (x, 278, x+229, 393), group+"_bg", group, radius=12)
                label = ["已排好的左侧", "等于区", "已排好的右侧"][i]
                self.text(draw, (x+114, 306), label, 19, group, "mm")
                self.text(draw, (x+114, 350), str(values), 24, "ink", "mm")
                if i < 2:
                    self.text(draw, (x+237, 350), "+", 22, "muted", "mm")
            draw.line((420, 412, 420, 447), fill=COLORS["done"], width=4)
            draw.polygon([(411, 440), (429, 440), (420, 452)], fill=COLORS["done"])
            self.text(draw, (420, 477), "返回完整有序列表", 20, "done", "mm")
            n = len(event.result)
            for i, value in enumerate(event.result):
                self.chip(draw, (420+(i-(n-1)/2)*93, 546), value, "done")
        elif event.kind == "base":
            self.text(draw, (420, 280), f"当前列表：{event.nums}", 30, "ink", "mm")
            self.box(draw, (165, 344, 675, 445), "done_bg", "done", 2)
            self.text(draw, (420, 374), f"长度 {len(event.nums)} ≤ 1", 28, "done", "mm")
            self.text(draw, (420, 415), "已经有序，直接返回", 24, "done", "mm")
            self.text(draw, (420, 519), f"返回 {event.result}", 30, "ink", "mm")
            self.text(draw, (420, 578), "空列表和单元素列表都是递归的停止条件。", 18, "muted", "mm")
        else:
            centers = self.array(draw, event, placed, show_hint=motion is None)
            destinations = self.buckets(draw, event, placed)
            if motion is not None:
                start, end = centers[event.index], destinations[event.group]
                t = motion*motion*(3-2*motion)
                # Travel through the gap above the buckets, not over the
                # label of a different bucket during a cross-column move.
                u = 1-t
                x = u**3*start[0] + 3*u*u*t*start[0] + 3*u*t*t*end[0] + t**3*end[0]
                y = u**3*start[1] + 3*u*u*t*375 + 3*u*t*t*375 + t**3*end[1]
                self.chip(draw, (x, y), event.nums[event.index], event.group,
                          active=True, small=True)
        return image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    root = Path(__file__).resolve().parents[2]
    parser.add_argument("--output", type=Path,
                        default=root / "algorithms/assets/quicksort-partition.gif")
    parser.add_argument("--preview-dir", type=Path)
    parser.add_argument("--font")
    args = parser.parse_args()
    events = make_trace()
    renderer = Renderer(font_file(args.font))
    frames, durations = [], []
    keyframes = []
    for event in events:
        frame = renderer.render(event)
        if event.kind == "scan":
            frames.append(frame); durations.append(450)
            for t in [0.16, 0.33, 0.5, 0.67, 0.84]:
                frames.append(renderer.render(event, motion=t)); durations.append(60)
            frames.append(renderer.render(event, placed=True)); durations.append(450)
        else:
            frames.append(frame)
            durations.append({"choose": 1200, "partition": 1500,
                              "base": 950, "concat": 1300}[event.kind])
            if event.kind == "concat" and event.call == "root":
                durations[-1] = 4000
            keyframes.append((event, frame))
    # One shared palette prevents flat colors from changing between frames.
    palette_source = Image.new("RGB", (WIDTH, HEIGHT*len(keyframes)), COLORS["bg"])
    for i, (_, frame) in enumerate(keyframes):
        palette_source.paste(frame, (0, i*HEIGHT))
    palette = palette_source.quantize(colors=128)
    indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    indexed[0].save(args.output, save_all=True, append_images=indexed[1:],
                    duration=durations, loop=0, disposal=1, optimize=True)
    # Decode the finished GIF: check timing and ensure no moving-chip trails.
    with Image.open(args.output) as gif:
        assert gif.size == (WIDTH, HEIGHT) and gif.info["loop"] == 0
        assert gif.n_frames == len(indexed)
        decoded_duration = 0
        for i, reference in enumerate(indexed):
            gif.seek(i)
            assert ImageChops.difference(gif.convert("RGB"), reference.convert("RGB")).getbbox() is None
            decoded_duration += gif.info["duration"]
        assert decoded_duration == sum(durations)
    if args.preview_dir:
        args.preview_dir.mkdir(parents=True, exist_ok=True)
        for event, frame in keyframes:
            if event.kind in ("partition", "concat"):
                frame.save(args.preview_dir / f"{event.call}-{event.kind}.png")
        # The middle of a moving chip is useful for checking geometry.
        first_scan = next(e for e in events if e.kind == "scan")
        renderer.render(first_scan, motion=0.5).save(args.preview_dir / "motion.png")
    print(f"Trace verified: {len(events)} events, 9 scanned values, 4 base cases")
    print(f"GIF: {args.output} ({args.output.stat().st_size:,} bytes)")
    print(f"Frames: {len(frames)}, duration: {sum(durations)/1000:.1f}s, {WIDTH}×{HEIGHT}")


if __name__ == "__main__":
    main()
