(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MbtiData = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  // 原创自我观察题：基础四维各 6 题，扩展维度各 4 题。
  // 每轴左右方向各占一半；评分须读取 leftLetter / rightLetter。
  // A–O、C–H 是本站约定的扩展维度，不属于标准 MBTI 四维。
  var questions = [
    {
      "id": "ei-01",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "聚餐快散场了，大家提议再走走。你更想：",
      "left": "回家安静待会儿，给自己充充电",
      "right": "再一起走走，聊着还挺有精神"
    },
    {
      "id": "sn-01",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "追剧时，哪种内容更容易抓住你的注意：",
      "left": "人物的小动作、场景里的细节",
      "right": "这些线索在暗示什么后续"
    },
    {
      "id": "tf-01",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "朋友发来设计稿，有处你觉得要改。你更自然地：",
      "left": "先说理解他的想法，再提建议",
      "right": "先指出哪处不清楚，再解释原因"
    },
    {
      "id": "jp-01",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "和朋友约一次短途出游，你更喜欢：",
      "left": "定个大方向，沿路再选去哪儿",
      "right": "出发前列好想去的几个地方"
    },
    {
      "id": "ei-02",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "周末空出半天，做喜欢的事时你更想：",
      "left": "找个同好一起做，互相聊聊",
      "right": "一个人沉浸进去，按自己的节奏来"
    },
    {
      "id": "sn-02",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "第一次玩一款桌游，你更想先：",
      "left": "弄懂玩法之间怎么联系，再试试",
      "right": "看一回合怎么走，跟着试试"
    },
    {
      "id": "tf-02",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "两位朋友都想借同一件东西，你会先：",
      "left": "看看谁先约好、怎样轮流借",
      "right": "听听他们各自有什么急用"
    },
    {
      "id": "jp-02",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "难得有个没事的周末，你更喜欢：",
      "left": "前一天想好大概怎么过",
      "right": "醒来看看心情，再决定做什么"
    },
    {
      "id": "ei-03",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "脑中刚冒出一个点子，还没想清楚。你会：",
      "left": "先写下几笔，想顺了再聊",
      "right": "找个人聊着聊着，把想法捋顺"
    },
    {
      "id": "sn-03",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "朋友聊起一个你没去过的地方，你更想问：",
      "left": "街道和小店具体是什么样",
      "right": "住在那里，会过上怎样的生活"
    },
    {
      "id": "tf-03",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "一起准备小聚会，有人提议换个安排。你先想到：",
      "left": "大家对新安排各有什么感受",
      "right": "换了以后，时间能不能接得上"
    },
    {
      "id": "jp-03",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "想学做一道没做过的菜，你更习惯：",
      "left": "先做起来，边看步骤边调整",
      "right": "先看完整个过程，再动手做"
    },
    {
      "id": "ei-04",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "和朋友一起准备一顿饭，你更舒服的状态是：",
      "left": "一边忙一边聊，想到什么就说",
      "right": "先安静忙一会儿，告一段落再聊"
    },
    {
      "id": "sn-04",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "抬头看到一片特别的云，你更容易注意：",
      "left": "它像什么，会让人想到什么",
      "right": "颜色、形状和光照的变化"
    },
    {
      "id": "tf-04",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "朋友遇到一件不顺的事，想听你的看法。你先：",
      "left": "和他捋一捋事情卡在哪一步",
      "right": "问问他最难受的是哪一点"
    },
    {
      "id": "jp-04",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "晚上有几件小事要办，你通常：",
      "left": "先排个顺序，再一件件做",
      "right": "看眼下方便做什么，顺势安排"
    },
    {
      "id": "ei-05",
      "axis": "EI",
      "leftLetter": "I",
      "rightLetter": "E",
      "prompt": "连续两天的空闲时间都独自度过，你更可能觉得：",
      "left": "这样的节奏挺舒服，还能继续",
      "right": "想找人一起活动，换换状态"
    },
    {
      "id": "sn-05",
      "axis": "SN",
      "leftLetter": "S",
      "rightLetter": "N",
      "prompt": "向朋友讲一次出游，你更自然地：",
      "left": "讲一路遇到了什么有趣的事",
      "right": "讲这趟出游勾起的想法和联想"
    },
    {
      "id": "tf-05",
      "axis": "TF",
      "leftLetter": "F",
      "rightLetter": "T",
      "prompt": "看完一个有争议的故事结尾，你更想聊：",
      "left": "这个选择对每个人意味着什么",
      "right": "这个选择前后能不能说得通"
    },
    {
      "id": "jp-05",
      "axis": "JP",
      "leftLetter": "P",
      "rightLetter": "J",
      "prompt": "朋友约你下周见面，你更喜欢：",
      "left": "先约好哪天，细节临近再说",
      "right": "早点把时间、地点一起定下来"
    },
    {
      "id": "ei-06",
      "axis": "EI",
      "leftLetter": "E",
      "rightLetter": "I",
      "prompt": "刚看完一部有感触的电影，你更想：",
      "left": "找人交换一下观后感",
      "right": "先独自回味一阵"
    },
    {
      "id": "sn-06",
      "axis": "SN",
      "leftLetter": "N",
      "rightLetter": "S",
      "prompt": "刷到一个没见过的新词，你更想：",
      "left": "想想它和哪些熟悉的概念有关",
      "right": "找个例子，看看它怎么用"
    },
    {
      "id": "tf-06",
      "axis": "TF",
      "leftLetter": "T",
      "rightLetter": "F",
      "prompt": "朋友没守约，说这次有特殊情况。你更想先：",
      "left": "说清约定的原因，再谈怎么办",
      "right": "听听这次的难处，再谈怎么办"
    },
    {
      "id": "jp-06",
      "axis": "JP",
      "leftLetter": "J",
      "rightLetter": "P",
      "prompt": "想把一些照片做成小相册，你更想：",
      "left": "先定几个主题，再按主题挑照片",
      "right": "边挑边摆，慢慢决定做成什么样"
    },
    {
      "id": "ao-01",
      "axis": "AO",
      "leftLetter": "A",
      "rightLetter": "O",
      "prompt": "两部电影都想看，已经点开其中一部。你往往：",
      "left": "看进去就好，很少再想另一部",
      "right": "还会惦记另一部会不会更好看"
    },
    {
      "id": "ch-01",
      "axis": "CH",
      "leftLetter": "C",
      "rightLetter": "H",
      "prompt": "遇见一位好久不见、让你开心的熟人，你自然地：",
      "left": "微笑着打个招呼，喜悦比较含蓄",
      "right": "笑着热情招呼，让高兴流露出来"
    },
    {
      "id": "ao-02",
      "axis": "AO",
      "leftLetter": "O",
      "rightLetter": "A",
      "prompt": "两种饮品都想喝，点单前你已经偏向一种。你更常：",
      "left": "再比一比，确认哪种更想喝",
      "right": "就选这个，准备下单"
    },
    {
      "id": "ch-02",
      "axis": "CH",
      "leftLetter": "H",
      "rightLetter": "C",
      "prompt": "朋友为你准备了一个小惊喜，你更可能：",
      "left": "把有多开心、有多感动都说出来",
      "right": "认真说声谢谢，把感动留在心里"
    },
    {
      "id": "ao-03",
      "axis": "AO",
      "leftLetter": "A",
      "rightLetter": "O",
      "prompt": "群里请大家推荐一首歌，你已经选好一首。你会：",
      "left": "觉得这首不错，就发出去",
      "right": "还想比一比，有没有更合适的"
    },
    {
      "id": "ch-03",
      "axis": "CH",
      "leftLetter": "C",
      "rightLetter": "H",
      "prompt": "朋友发来一个你真心喜欢的小作品，你会：",
      "left": "发句简短认真的夸赞",
      "right": "热情地说出自己有多喜欢"
    },
    {
      "id": "ao-04",
      "axis": "AO",
      "leftLetter": "O",
      "rightLetter": "A",
      "prompt": "两款免费壁纸都喜欢，换好其中一款后，你通常：",
      "left": "又切回另一款，比较几次",
      "right": "先用这款，不再来回比较"
    },
    {
      "id": "ch-04",
      "axis": "CH",
      "leftLetter": "H",
      "rightLetter": "C",
      "prompt": "亲近的人和你分享好消息，你通常：",
      "left": "语气一下亮起来，和他一起开心",
      "right": "微笑着，认真说替他高兴"
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
