(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MbtiData = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  // 原创自我观察题：基础四维各 12 题，扩展维度各 8 题。
  // 每轴左右方向各占一半；评分须读取 leftLetter / rightLetter。
  // A–O、C–H 是本站约定的扩展维度，不属于标准 MBTI 四维。
  var questions = [
    {
      "id": "ei-01",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "结束一段需要持续与人互动的时间后，你通常更想：",
      "left": "独自待一会儿，让精力慢慢恢复",
      "right": "继续和熟悉的人相处，在互动中恢复精力"
    },
    {
      "id": "sn-01",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "初次了解一个陌生主题时，你更希望先看到：",
      "left": "具体事例和可以观察到的细节",
      "right": "整体框架和各部分之间的联系"
    },
    {
      "id": "tf-01",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "两种方案都可行，但会影响不同的人时，你更先衡量：",
      "left": "相关的人各自看重什么、会有什么感受",
      "right": "能否用一套一致的标准比较两种方案"
    },
    {
      "id": "jp-01",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "安排一个空闲的周末时，你更喜欢：",
      "left": "先留出时间，到时再决定具体做什么",
      "right": "提前确定想做的事和大致顺序"
    },
    {
      "id": "ei-02",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "学习一项新爱好时，哪种过程更让你投入：",
      "left": "和同伴一起尝试、交流",
      "right": "留出一段独自摸索的时间"
    },
    {
      "id": "sn-02",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "向别人介绍一段经历时，你更自然地讲述：",
      "left": "这段经历带来的联想和意义",
      "right": "当时发生的事情和具体过程"
    },
    {
      "id": "tf-02",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "朋友请你帮助分析一个选择时，你通常先问：",
      "left": "各个选项的理由和条件是什么",
      "right": "这件事对他本人有什么意义"
    },
    {
      "id": "jp-02",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "开始一项持续数周的任务时，你通常更喜欢：",
      "left": "先确定阶段和顺序，再开始推进",
      "right": "先尝试一部分，再逐渐形成安排"
    },
    {
      "id": "ei-03",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "有个想法还没理清时，你通常更习惯：",
      "left": "先在脑中或纸上整理，再与人讨论",
      "right": "先找人聊一聊，在交流中整理"
    },
    {
      "id": "sn-03",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "学习一个新概念时，哪种说明更容易吸引你：",
      "left": "它在实际情境中怎样使用",
      "right": "它与其他概念有什么联系"
    },
    {
      "id": "tf-03",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "合作中出现分歧，你更想先弄清：",
      "left": "各方的顾虑和重视的事情",
      "right": "各方判断所依据的事实与标准"
    },
    {
      "id": "jp-03",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "计划一次短途旅行时，你更希望：",
      "left": "只定主要方向，细节留到途中选择",
      "right": "先定主要行程，途中按需要调整"
    },
    {
      "id": "ei-04",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "和熟悉的人一起度过一整天后，你更可能：",
      "left": "仍想继续一起活动一会儿",
      "right": "想留出一段不需要互动的时间"
    },
    {
      "id": "sn-04",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "观察一个陌生的地方时，你首先容易注意到：",
      "left": "这个地方可能发生的故事和变化",
      "right": "眼前的布局、物品和具体特点"
    },
    {
      "id": "tf-04",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "为一个小组分配有限资源时，你更倾向先考虑：",
      "left": "对所有人都适用的分配原则",
      "right": "每个人的具体处境和需要"
    },
    {
      "id": "jp-04",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "几件日常事务都需要完成时，你更自然的做法是：",
      "left": "先列出顺序，再逐项处理",
      "right": "根据当时的情况决定先做哪一件"
    },
    {
      "id": "ei-05",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "一个没有必须安排的下午，你更容易被哪种活动吸引：",
      "left": "独自投入喜欢的事情",
      "right": "和别人一起做喜欢的事情"
    },
    {
      "id": "sn-05",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "阅读一篇内容丰富的文章后，你更容易记住：",
      "left": "文中出现的例子和具体信息",
      "right": "贯穿全文的主题和潜在含义"
    },
    {
      "id": "tf-05",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "评价一个已经完成的项目时，你更先关注：",
      "left": "参与者和使用者的实际感受",
      "right": "它是否达到事先约定的评价标准"
    },
    {
      "id": "jp-05",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "一个选择暂时不需要马上决定时，你更倾向：",
      "left": "保留几个可选方向，多看看再说",
      "right": "尽早确定一个方向，让事情有着落"
    },
    {
      "id": "ei-06",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "合作完成一项任务时，你更喜欢哪种交流节奏：",
      "left": "在推进过程中保持经常交流",
      "right": "先各自投入一段时间，再集中交流"
    },
    {
      "id": "sn-06",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "讨论一件将来可能做的事时，你更先想到：",
      "left": "它还可以延伸出哪些不同的可能",
      "right": "目前已有的条件和可参考的经验"
    },
    {
      "id": "tf-06",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "有人因特殊情况希望调整约定，你更自然的出发点是：",
      "left": "先看约定的依据，再判断是否调整",
      "right": "先理解他的处境，再看怎样调整"
    },
    {
      "id": "jp-06",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "与朋友约好一起做件事，你更喜欢：",
      "left": "提前把时间、地点和分工定下来",
      "right": "约定大概安排，临近时再敲定细节"
    },
    {
      "id": "ei-07",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "连续几天主要独自学习或工作后，你往往：",
      "left": "仍能享受这样的独处节奏",
      "right": "会想增加与人共同活动的时间"
    },
    {
      "id": "sn-07",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "接到一个开放的学习任务，你更想从哪里入手：",
      "left": "找几个实际案例，观察它们怎样运作",
      "right": "先构思一个解释它的概念框架"
    },
    {
      "id": "tf-07",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "给别人提改进意见时，你更常从哪方面组织内容：",
      "left": "怎样让建议贴合对方的感受和需要",
      "right": "怎样让建议的依据和推理更清楚"
    },
    {
      "id": "jp-07",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "学习一个内容较多的课程时，你更习惯：",
      "left": "按当前的兴趣和需要调整学习顺序",
      "right": "按事先定好的学习顺序推进"
    },
    {
      "id": "ei-08",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "刚看完一部很有感触的电影，你通常更想：",
      "left": "找人交换彼此的观感",
      "right": "先自己回味其中的内容"
    },
    {
      "id": "sn-08",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "向朋友推荐一本书时，你更容易从哪方面说起：",
      "left": "它提出了怎样的观点或新的视角",
      "right": "其中具体写了什么、有哪些片段"
    },
    {
      "id": "tf-08",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "当一个决定没有公认的最佳答案时，你更依赖：",
      "left": "不同理由比较起来是否站得住脚",
      "right": "它是否符合自己重视的价值"
    },
    {
      "id": "jp-08",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "事情进行到一半出现新的可选方案时，你更自然地：",
      "left": "先沿既定方向推进，再判断是否要改",
      "right": "重新打开选择，看看能否换条路线"
    },
    {
      "id": "ei-09",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "准备讨论一个自己熟悉的话题时，你更自然的方式是：",
      "left": "先整理好主要想法，再加入讨论",
      "right": "先进入讨论，让想法在交谈中展开"
    },
    {
      "id": "sn-09",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "比较几种做法时，你更自然地参考：",
      "left": "它们过去实际使用的情况",
      "right": "它们背后的思路和可延伸的方向"
    },
    {
      "id": "tf-09",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "在讨论中听到一个不同意见，你更先想理解：",
      "left": "对方为何在意这个立场",
      "right": "这个立场是怎样推导出来的"
    },
    {
      "id": "jp-09",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "一天没有外部时间要求时，你更舒服的状态是：",
      "left": "活动之间留有余地，随时切换",
      "right": "有大致的日程，知道下一步做什么"
    },
    {
      "id": "ei-10",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "专注做事一段时间后，哪种短暂休息更合心意：",
      "left": "找人聊聊或一起做点别的",
      "right": "独自散步或安静地换件事做"
    },
    {
      "id": "sn-10",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "看到一组相关信息时，你通常先关注：",
      "left": "这些信息组合起来暗示了什么",
      "right": "每条信息本身说了什么"
    },
    {
      "id": "tf-10",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "制定一项共同规则时，你更希望先讨论：",
      "left": "它的适用条件是否清晰、一致",
      "right": "它会怎样影响不同成员的体验"
    },
    {
      "id": "jp-10",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "为一项个人兴趣准备材料时，你更偏好：",
      "left": "先想好主要流程，再准备相应材料",
      "right": "先准备眼下要用的，之后按进展补充"
    },
    {
      "id": "ei-11",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "有两个同样感兴趣的活动可以参加，你通常更偏向：",
      "left": "可以按自己的节奏独立体验的活动",
      "right": "可以和其他参与者一同体验的活动"
    },
    {
      "id": "sn-11",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "构思一个小作品时，你更常从哪种素材出发：",
      "left": "生活中观察到的人、物或细节",
      "right": "脑海里的概念、象征或假设"
    },
    {
      "id": "tf-11",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "两种选择的成本和效果相近时，你更容易依据什么取舍：",
      "left": "哪种更符合自己和相关人的价值取向",
      "right": "哪种在比较标准下更具合理性"
    },
    {
      "id": "jp-11",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "面对一项可以用多种方式完成的任务，你更喜欢：",
      "left": "边做边挑选最适合当下的方式",
      "right": "先选好一种方式，再按它推进"
    },
    {
      "id": "ei-12",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "在一天的安排中，你通常希望：",
      "left": "有较多与他人交流或一起行动的时段",
      "right": "有较多不受互动打扰的独处时段"
    },
    {
      "id": "sn-12",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "别人描述一个尚未成形的想法时，你更想追问：",
      "left": "这个想法还可以发展成什么",
      "right": "能否举一个具体例子来说明"
    },
    {
      "id": "tf-12",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "回顾一次困难决定时，你更常反思：",
      "left": "当时使用的理由和标准是否一致",
      "right": "是否照顾到重要的价值和人的需要"
    },
    {
      "id": "jp-12",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "和别人共同推进一件长期的事，你更希望：",
      "left": "先约定稳定的节奏和分工",
      "right": "定期根据新情况调整节奏和分工"
    },
    {
      "id": "ao-01",
      "axis": "AO",
      "leftLetter": "A",
      "rightLetter": "O",
      "prompt": "两个日常选项都符合需要，差别也不大时，你通常：",
      "left": "选定其中一个后就能安心往下走",
      "right": "还会再比较一阵才更容易安心"
    },
    {
      "id": "ch-01",
      "axis": "CH",
      "leftLetter": "C",
      "rightLetter": "H",
      "prompt": "遇见一位很久没见、让你开心的熟人时，你更自然地：",
      "left": "用比较含蓄的招呼表达高兴",
      "right": "用明显的笑容和热情的言语表达高兴"
    },
    {
      "id": "ao-02",
      "axis": "AO",
      "leftLetter": "O",
      "rightLetter": "A",
      "prompt": "做出一个普通决定后，没有出现新信息，你更常：",
      "left": "回想其他选项，确认自己是否选得合适",
      "right": "认可当时的判断，较少回头重选"
    },
    {
      "id": "ch-02",
      "axis": "CH",
      "leftLetter": "H",
      "rightLetter": "C",
      "prompt": "收到一份让你感动的小礼物时，你更常：",
      "left": "让对方明显看到自己的感动和感谢",
      "right": "把感动放在心里，用简短的话表达感谢"
    },
    {
      "id": "ao-03",
      "axis": "AO",
      "leftLetter": "A",
      "rightLetter": "O",
      "prompt": "面对没有唯一正确答案的小选择时，你通常：",
      "left": "能够接受自己的取舍并做出选择",
      "right": "会在不同利弊之间来回权衡"
    },
    {
      "id": "ch-03",
      "axis": "CH",
      "leftLetter": "C",
      "rightLetter": "H",
      "prompt": "真心欣赏朋友做成的一件事时，你通常：",
      "left": "用平实、简洁的话肯定他",
      "right": "用热情、鲜明的话称赞他"
    },
    {
      "id": "ao-04",
      "axis": "AO",
      "leftLetter": "O",
      "rightLetter": "A",
      "prompt": "朋友对你已做的选择提出另一种看法，但没有新的事实时，你更容易：",
      "left": "重新比较两个选择，暂时难以定下来",
      "right": "听过之后仍对原来的选择保持笃定"
    },
    {
      "id": "ch-04",
      "axis": "CH",
      "leftLetter": "H",
      "rightLetter": "C",
      "prompt": "和信任的人分享一件开心的事时，你更自然的表达是：",
      "left": "语气和表情比较鲜明，把兴奋表现出来",
      "right": "语气和表情比较收敛，慢慢讲清楚"
    },
    {
      "id": "ao-05",
      "axis": "AO",
      "leftLetter": "A",
      "rightLetter": "O",
      "prompt": "一个选择难免要放弃某些好处时，你通常：",
      "left": "接受这次的取舍，继续往前做",
      "right": "还会想着被放弃的好处，再考虑一阵"
    },
    {
      "id": "ch-05",
      "axis": "CH",
      "leftLetter": "C",
      "rightLetter": "H",
      "prompt": "想让亲近的人知道你在意他时，你更习惯：",
      "left": "以含蓄的言语或细微的举动表达",
      "right": "直接说出关心，并明显地表达亲近"
    },
    {
      "id": "ao-06",
      "axis": "AO",
      "leftLetter": "O",
      "rightLetter": "A",
      "prompt": "对一个日常问题形成自己的意见后，你更常：",
      "left": "想再确认几次，才觉得可以确定",
      "right": "觉得目前的判断已经足够支持选择"
    },
    {
      "id": "ch-06",
      "axis": "CH",
      "leftLetter": "H",
      "rightLetter": "C",
      "prompt": "朋友遇到难处，你也很关心他时，你更自然地：",
      "left": "用温暖、鲜明的言语传达关心",
      "right": "用平和、克制的方式传达关心"
    },
    {
      "id": "ao-07",
      "axis": "AO",
      "leftLetter": "A",
      "rightLetter": "O",
      "prompt": "当你无法知道一次普通选择最后会怎样时，你更倾向：",
      "left": "接受这份不确定，作出当前的选择",
      "right": "继续权衡不同可能，再作出选择"
    },
    {
      "id": "ch-07",
      "axis": "CH",
      "leftLetter": "C",
      "rightLetter": "H",
      "prompt": "和熟悉的人一起看到一段有趣的内容，同样觉得好笑时，你更常：",
      "left": "微笑或轻声回应，反应比较收敛",
      "right": "明显地笑出来，让开心自然流露"
    },
    {
      "id": "ao-08",
      "axis": "AO",
      "leftLetter": "O",
      "rightLetter": "A",
      "prompt": "回看一件结果平常、没有明显对错的决定，你通常：",
      "left": "会琢磨换一个选择会不会更合适",
      "right": "能接受自己当时作出的选择"
    },
    {
      "id": "ch-08",
      "axis": "CH",
      "leftLetter": "H",
      "rightLetter": "C",
      "prompt": "有人认真帮助了你，你想向他道谢时，你更习惯：",
      "left": "把感谢和感动较充分地表达出来",
      "right": "用简洁、郑重的话表达谢意"
    }
  ];

  var scale = [
    {
      "value": -2,
      "label": "强烈偏向前一项",
      "strength": "strong"
    },
    {
      "value": -1,
      "label": "略微偏向前一项",
      "strength": "medium"
    },
    {
      "value": 0,
      "label": "中立或都差不多",
      "strength": "neutral"
    },
    {
      "value": 1,
      "label": "略微偏向后一项",
      "strength": "medium"
    },
    {
      "value": 2,
      "label": "强烈偏向后一项",
      "strength": "strong"
    }
  ];

  var axisMeta = {
    "EI": {
      "leftLetter": "I",
      "rightLetter": "E",
      "left": "I 内倾",
      "right": "E 外倾",
      "summary": "能量来源"
    },
    "SN": {
      "leftLetter": "S",
      "rightLetter": "N",
      "left": "S 实感",
      "right": "N 直觉",
      "summary": "信息获取"
    },
    "TF": {
      "leftLetter": "F",
      "rightLetter": "T",
      "left": "F 情感",
      "right": "T 思考",
      "summary": "决策方式"
    },
    "JP": {
      "leftLetter": "P",
      "rightLetter": "J",
      "left": "P 知觉",
      "right": "J 判断",
      "summary": "行动节奏"
    },
    "AO": {
      "leftLetter": "A",
      "rightLetter": "O",
      "left": "A 果断",
      "right": "O 审慎",
      "summary": "决断倾向"
    },
    "CH": {
      "leftLetter": "C",
      "rightLetter": "H",
      "left": "C 克制",
      "right": "H 热情",
      "summary": "情感表达"
    }
  };

  var suggestions = {
    ISTJ: {
      summary: "你偏好清晰规则、可靠交付和可验证的成果，适合在稳定系统中持续优化。",
      careers: ["后端开发", "测试工程师", "财务分析", "项目管理", "流程与质量管理"],
      environment: "职责边界清楚、评价标准明确、流程成熟且重视专业可信度的团队。",
      advice: ["把细致可靠转化为方法论，沉淀模板和标准。", "刻意练习跨团队表达，让成果更容易被看见。", "在稳定业务里选择有持续改进空间的岗位。"]
    },
    ISFJ: {
      summary: "你重视责任、支持和细节体验，擅长把复杂事务照顾得稳妥周到。",
      careers: ["客户成功", "人力资源", "运营支持", "教育培训", "医疗或公益服务"],
      environment: "协作友好、服务对象明确、能长期积累信任关系的组织。",
      advice: ["为自己的边界和优先级留出空间。", "把共情能力与数据记录结合，提升专业影响力。", "选择能看到具体帮助效果的工作。"]
    },
    INFJ: {
      summary: "你关注意义、洞察和长期影响，适合把人的需求转化为清晰方向。",
      careers: ["用户研究", "心理咨询", "内容策划", "产品策略", "教育与组织发展"],
      environment: "价值观清晰、允许深度思考、重视人的成长和长期主义的团队。",
      advice: ["把抽象洞察写成可执行方案。", "避免独自承担过多情绪劳动。", "选择能连接人文理解与系统设计的岗位。"]
    },
    INTJ: {
      summary: "你偏好战略、系统和长期规划，擅长为复杂问题设计高效路径。",
      careers: ["系统架构师", "数据科学家", "战略咨询", "研发管理", "产品规划"],
      environment: "目标有挑战、授权充分、重视独立判断和长期建设的环境。",
      advice: ["提前同步思考过程，减少别人跟不上节奏的成本。", "把远景拆成短周期验证。", "选择能持续解决复杂问题的赛道。"]
    },
    ISTP: {
      summary: "你冷静、务实、喜欢动手解决问题，适合处理真实系统中的技术难题。",
      careers: ["运维工程师", "安全工程师", "硬件工程", "自动化测试", "现场技术支持"],
      environment: "低冗余会议、强调实操、允许快速排障和独立判断的团队。",
      advice: ["把临场经验文档化，形成可复用资产。", "主动争取复杂系统的核心问题。", "补足长期规划，避免只被紧急任务牵引。"]
    },
    ISFP: {
      summary: "你敏感、真实、重视体验和审美，适合把个人感受转化为具体作品。",
      careers: ["视觉设计", "体验设计", "摄影与影像", "品牌内容", "手作与生活方式产品"],
      environment: "尊重个人表达、反馈具体、允许打磨细节和作品质量的空间。",
      advice: ["建立作品集，用成果替你说话。", "为创作流程设置轻量计划。", "选择能兼顾审美、体验和真实用户反馈的岗位。"]
    },
    INFP: {
      summary: "你重视价值感、想象力和个人表达，适合做有温度、有立场的创造工作。",
      careers: ["写作编辑", "品牌策划", "心理与成长咨询", "公益项目", "内容产品"],
      environment: "使命感明确、允许表达、尊重个体差异且不只看短期指标的环境。",
      advice: ["把理想拆成可交付的小作品。", "建立稳定输出节奏，减少只在灵感来时行动。", "寻找价值观与商业模式相容的团队。"]
    },
    INTP: {
      summary: "你喜欢模型、原理和独立探索，擅长拆解复杂概念并找到底层规律。",
      careers: ["算法工程师", "研究员", "技术专家", "数据建模", "开发工具工程师"],
      environment: "技术深度高、讨论理性、容许探索和低干扰专注的团队。",
      advice: ["用原型和文档把想法落地。", "给探索设置边界，避免无限优化。", "选择知识密度高、能持续学习的方向。"]
    },
    ESTP: {
      summary: "你行动快、适应强、喜欢即时反馈，适合在变化中捕捉机会。",
      careers: ["销售拓展", "创业项目", "增长运营", "活动执行", "应急与现场管理"],
      environment: "节奏快、目标直接、反馈即时且允许灵活应变的团队。",
      advice: ["把临场优势与复盘机制结合。", "在追求速度时守住风险底线。", "选择能直接面对市场或用户的岗位。"]
    },
    ESFP: {
      summary: "你热情、敏锐、擅长带动现场体验，适合连接人、内容和氛围。",
      careers: ["市场营销", "社群运营", "活动策划", "直播与内容运营", "客户关系"],
      environment: "人际互动多、反馈鲜活、鼓励表达和服务体验的工作场景。",
      advice: ["把感染力转化为稳定的运营方法。", "用数据补充直觉，提升决策质量。", "选择能持续接触用户和现场的方向。"]
    },
    ENFP: {
      summary: "你充满好奇和可能性，擅长激发创意、连接资源并推动新想法。",
      careers: ["创新产品经理", "品牌策划", "职业教练", "内容创作", "组织文化"],
      environment: "开放、多元、鼓励试验且能接触不同人的团队。",
      advice: ["为创意建立收敛机制。", "挑选一两个长期主题深挖。", "找能同时满足自由度和影响力的岗位。"]
    },
    ENTP: {
      summary: "你喜欢辩证思考、发现机会和挑战旧规则，适合从零到一的探索。",
      careers: ["产品经理", "创业者", "战略分析", "技术布道", "商业拓展"],
      environment: "问题开放、信息密度高、允许挑战假设并快速试错的团队。",
      advice: ["把聪明点子推进到可验证结果。", "在辩论前先确认共同目标。", "选择变化快且需要跨界思考的赛道。"]
    },
    ESTJ: {
      summary: "你目标明确、执行强、重视秩序和结果，适合带团队完成复杂交付。",
      careers: ["运营管理", "项目经理", "供应链管理", "销售管理", "业务负责人"],
      environment: "目标清晰、权责明确、强调效率和结果兑现的组织。",
      advice: ["给团队留出反馈和参与空间。", "从管理任务升级到管理系统。", "选择需要组织能力和决策魄力的岗位。"]
    },
    ESFJ: {
      summary: "你擅长协调关系、照顾体验和维护秩序，适合让团队与用户运转顺畅。",
      careers: ["人力资源", "客户成功", "培训管理", "行政运营", "医疗服务管理"],
      environment: "协作密集、重视服务质量、需要稳定维护关系的团队。",
      advice: ["用流程保护自己的精力。", "把人际洞察转化为制度和指标。", "选择能持续帮助具体人群的工作。"]
    },
    ENFJ: {
      summary: "你擅长鼓舞他人、组织共识和推动成长，适合承担面向人的领导角色。",
      careers: ["团队管理", "培训发展", "咨询顾问", "公共关系", "教育项目负责人"],
      environment: "使命感强、协作频繁、重视沟通和人才发展的组织。",
      advice: ["在照顾他人期待时保留自己的判断。", "用目标和数据支撑影响力。", "选择能带人成长、也能产生业务结果的岗位。"]
    },
    ENTJ: {
      summary: "你重视目标、效率和影响力，适合统筹资源并推动高难度目标落地。",
      careers: ["企业管理", "创业者", "战略负责人", "产品负责人", "投融资与咨询"],
      environment: "高目标、高授权、评价直接且能影响关键决策的环境。",
      advice: ["让强势推进配合倾听机制。", "把长期目标拆成可管理的节奏。", "选择有复杂资源协调和规模化空间的岗位。"]
    }
  };

  return {
    questions: questions,
    scale: scale,
    axisMeta: axisMeta,
    suggestions: suggestions
  };
});
