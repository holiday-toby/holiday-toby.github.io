(function () {
  var questions = [
    {
      axis: "EI",
      leftLetter: "I",
      rightLetter: "E",
      prompt: "进入一个新团队时，你更自然的反应是：",
      left: "先观察节奏，熟悉后再表达",
      right: "主动寒暄，快速建立连接"
    },
    {
      axis: "SN",
      leftLetter: "S",
      rightLetter: "N",
      prompt: "面对一个陌生项目，你更先关注：",
      left: "已有资料、限制条件和执行步骤",
      right: "整体可能性、长期价值和新思路"
    },
    {
      axis: "TF",
      leftLetter: "F",
      rightLetter: "T",
      prompt: "做重要决定时，你更依赖：",
      left: "人的感受、关系影响和价值感",
      right: "证据、逻辑和可衡量结果"
    },
    {
      axis: "JP",
      leftLetter: "P",
      rightLetter: "J",
      prompt: "安排一周工作时，你更喜欢：",
      left: "保留弹性，根据变化调整",
      right: "提前排好计划并逐项推进"
    },
    {
      axis: "EI",
      leftLetter: "I",
      rightLetter: "E",
      prompt: "高强度工作后，你通常通过什么恢复能量：",
      left: "独处、阅读、散步或安静整理",
      right: "聊天、聚会、运动或参与活动"
    },
    {
      axis: "SN",
      leftLetter: "S",
      rightLetter: "N",
      prompt: "学习新技能时，你更偏好：",
      left: "按教程一步步练习，先掌握基本操作",
      right: "先理解概念框架，再尝试创造性应用"
    },
    {
      axis: "TF",
      leftLetter: "F",
      rightLetter: "T",
      prompt: "团队出现分歧时，你会优先处理：",
      left: "各方情绪、信任和合作氛围",
      right: "问题定义、事实差异和决策标准"
    },
    {
      axis: "JP",
      leftLetter: "P",
      rightLetter: "J",
      prompt: "临近截止日期时，你更常见的状态是：",
      left: "在压力下集中爆发，边做边调整",
      right: "按里程碑推进，尽量提前收尾"
    },
    {
      axis: "EI",
      leftLetter: "I",
      rightLetter: "E",
      prompt: "会议中你更舒服的表达方式是：",
      left: "先听完整，再给出整理后的观点",
      right: "边讨论边碰撞想法，现场完善观点"
    },
    {
      axis: "SN",
      leftLetter: "S",
      rightLetter: "N",
      prompt: "你评价一个方案时，更看重：",
      left: "是否可靠、可执行、风险清晰",
      right: "是否有想象空间和突破机会"
    },
    {
      axis: "TF",
      leftLetter: "F",
      rightLetter: "T",
      prompt: "给别人反馈时，你更倾向：",
      left: "先照顾感受，再慢慢指出问题",
      right: "直接指出关键问题和改进路径"
    },
    {
      axis: "JP",
      leftLetter: "P",
      rightLetter: "J",
      prompt: "面对旅行或周末安排，你更喜欢：",
      left: "大致有方向，现场再决定细节",
      right: "提前订好路线、时间和备选方案"
    },
    {
      axis: "EI",
      leftLetter: "I",
      rightLetter: "E",
      prompt: "需要想出点子时，你通常更有效的是：",
      left: "自己先写下来，再拿出来讨论",
      right: "和别人即时交流，在互动里冒出想法"
    },
    {
      axis: "SN",
      leftLetter: "S",
      rightLetter: "N",
      prompt: "处理复杂信息时，你更容易记住：",
      left: "具体数据、案例和操作细节",
      right: "模式、隐喻和背后的趋势"
    },
    {
      axis: "TF",
      leftLetter: "F",
      rightLetter: "T",
      prompt: "如果必须做一个不受欢迎的决定，你更关注：",
      left: "怎样让相关的人被尊重和理解",
      right: "怎样让决定公平、一致且有效"
    },
    {
      axis: "JP",
      leftLetter: "P",
      rightLetter: "J",
      prompt: "你的工作台或资料系统更像：",
      left: "按当前灵感和任务自然堆放",
      right: "有分类、命名和固定位置"
    },
    {
      axis: "EI",
      leftLetter: "I",
      rightLetter: "E",
      prompt: "参加行业活动时，你更可能：",
      left: "深聊少数几个人，获得高质量信息",
      right: "认识更多人，扩大机会和连接"
    },
    {
      axis: "SN",
      leftLetter: "S",
      rightLetter: "N",
      prompt: "你更愿意接手哪类任务：",
      left: "目标明确、标准清楚、需要稳定交付",
      right: "边界开放、需要探索、允许试错"
    },
    {
      axis: "TF",
      leftLetter: "F",
      rightLetter: "T",
      prompt: "选择职业方向时，你更在意：",
      left: "是否符合热情、价值观和帮助他人",
      right: "是否有成长曲线、回报和竞争优势"
    },
    {
      axis: "JP",
      leftLetter: "P",
      rightLetter: "J",
      prompt: "当计划被突然打断时，你通常：",
      left: "很快切换，看看新情况能带来什么",
      right: "先评估影响，再重新安排顺序"
    },
    {
      axis: "EI",
      leftLetter: "I",
      rightLetter: "E",
      prompt: "你更常被别人评价为：",
      left: "沉稳、专注、需要空间",
      right: "热情、外向、带动气氛"
    },
    {
      axis: "SN",
      leftLetter: "S",
      rightLetter: "N",
      prompt: "解决问题时，你更相信：",
      left: "被验证过的方法和现实反馈",
      right: "直觉判断和重新定义问题的能力"
    },
    {
      axis: "TF",
      leftLetter: "F",
      rightLetter: "T",
      prompt: "你更容易被哪类工作成就打动：",
      left: "改善了人的体验、关系或幸福感",
      right: "提升了效率、质量或商业结果"
    },
    {
      axis: "JP",
      leftLetter: "P",
      rightLetter: "J",
      prompt: "开始一个长期目标时，你更需要：",
      left: "足够自由度，边探索边形成路径",
      right: "清晰计划，阶段目标和检查点"
    }
  ];

  var scale = [
    { value: -2, label: "强烈偏向前一项", strength: "strong" },
    { value: -1, label: "略微偏向前一项", strength: "medium" },
    { value: 0, label: "中立或都差不多", strength: "neutral" },
    { value: 1, label: "略微偏向后一项", strength: "medium" },
    { value: 2, label: "强烈偏向后一项", strength: "strong" }
  ];

  var axisMeta = {
    EI: {
      left: "I 内倾",
      right: "E 外倾",
      summary: "能量来源"
    },
    SN: {
      left: "S 实感",
      right: "N 直觉",
      summary: "信息获取"
    },
    TF: {
      left: "F 情感",
      right: "T 思考",
      summary: "决策方式"
    },
    JP: {
      left: "P 知觉",
      right: "J 判断",
      summary: "行动节奏"
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

  var form = document.getElementById("mbtiForm");
  var submitButton = document.getElementById("submitMbti");
  var resetButton = document.getElementById("resetMbti");
  var copyButton = document.getElementById("copyMbtiResult");
  var message = document.getElementById("mbtiMessage");
  var answeredCount = document.getElementById("answeredCount");
  var progressBar = document.getElementById("careerProgressBar");
  var result = document.getElementById("mbtiResult");
  var resultTitle = document.getElementById("resultTitle");
  var resultSummary = document.getElementById("resultSummary");
  var resultTypeBadge = document.getElementById("resultTypeBadge");
  var axisGrid = document.getElementById("axisGrid");
  var careerList = document.getElementById("careerList");
  var careerEnvironment = document.getElementById("careerEnvironment");
  var careerAdvice = document.getElementById("careerAdvice");
  var lastResultText = "";

  if (!form) {
    return;
  }

  function renderQuestions() {
    form.innerHTML = questions
      .map(function (question, index) {
        var options = scale
          .map(function (option) {
            return (
              '<label class="career-scale-option" data-value="' +
              option.value +
              '" data-strength="' +
              option.strength +
              '">' +
              '<input type="radio" name="q' +
              index +
              '" value="' +
              option.value +
              '" aria-label="' +
              option.label +
              '">' +
              '<span aria-hidden="true"></span>' +
              "</label>"
            );
          })
          .join("");

        return (
          '<fieldset class="career-question" data-axis="' +
          question.axis +
          '">' +
          "<legend><span>" +
          String(index + 1).padStart(2, "0") +
          "</span>" +
          question.prompt +
          "</legend>" +
          '<div class="career-choice-labels">' +
          "<strong>" +
          question.left +
          "</strong>" +
          "<strong>" +
          question.right +
          "</strong>" +
          "</div>" +
          '<div class="career-scale">' +
          options +
          "</div>" +
          "</fieldset>"
        );
      })
      .join("");
  }

  function updateProgress() {
    var answered = form.querySelectorAll("input:checked").length;
    var percent = Math.round((answered / questions.length) * 100);
    answeredCount.textContent = answered + " / " + questions.length;
    progressBar.style.width = percent + "%";
  }

  function collectResult() {
    var totals = { EI: 0, SN: 0, TF: 0, JP: 0 };
    var maxByAxis = { EI: 0, SN: 0, TF: 0, JP: 0 };
    var missingIndex = -1;

    questions.forEach(function (question, index) {
      var selected = form.querySelector('input[name="q' + index + '"]:checked');
      var fieldset = form.querySelectorAll(".career-question")[index];
      fieldset.classList.remove("is-missing");
      maxByAxis[question.axis] += 2;

      if (!selected) {
        if (missingIndex === -1) {
          missingIndex = index;
        }
        fieldset.classList.add("is-missing");
        return;
      }

      totals[question.axis] += Number(selected.value);
    });

    if (missingIndex !== -1) {
      return {
        complete: false,
        missingIndex: missingIndex
      };
    }

    var type =
      (totals.EI >= 0 ? "E" : "I") +
      (totals.SN >= 0 ? "N" : "S") +
      (totals.TF >= 0 ? "T" : "F") +
      (totals.JP >= 0 ? "J" : "P");

    return {
      complete: true,
      type: type,
      totals: totals,
      maxByAxis: maxByAxis
    };
  }

  function axisLetter(axis, total) {
    var meta = axisMeta[axis];
    var leftLetter = meta.left.charAt(0);
    var rightLetter = meta.right.charAt(0);
    return total >= 0 ? rightLetter : leftLetter;
  }

  function axisStrength(total, max) {
    var percent = Math.round((Math.abs(total) / max) * 100);
    if (percent < 24) {
      return "偏好较平衡";
    }
    if (percent < 55) {
      return "偏好中等";
    }
    return "偏好明显";
  }

  function renderResult(data) {
    var suggestion = suggestions[data.type];
    var axes = ["EI", "SN", "TF", "JP"];

    resultTitle.textContent = "你的倾向：" + data.type;
    resultTypeBadge.textContent = data.type;
    resultSummary.textContent = suggestion.summary;

    axisGrid.innerHTML = axes
      .map(function (axis) {
        var meta = axisMeta[axis];
        var total = data.totals[axis];
        var max = data.maxByAxis[axis];
        var barLeft = Math.round(((total + max) / (max * 2)) * 100);
        var favored = axisLetter(axis, total);
        return (
          '<div class="career-axis-card">' +
          "<div>" +
          "<strong>" +
          meta.summary +
          "</strong>" +
          "<span>" +
          meta.left +
          " / " +
          meta.right +
          "</span>" +
          "</div>" +
          '<div class="career-axis-meter"><span style="left:' +
          barLeft +
          '%"></span></div>' +
          "<p>" +
          favored +
          "：" +
          axisStrength(total, max) +
          "</p>" +
          "</div>"
        );
      })
      .join("");

    careerList.innerHTML = suggestion.careers
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");
    careerEnvironment.textContent = suggestion.environment;
    careerAdvice.innerHTML = suggestion.advice
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");

    lastResultText =
      "MBTI 倾向：" +
      data.type +
      "\n" +
      suggestion.summary +
      "\n适合探索的职业：" +
      suggestion.careers.join("、") +
      "\n工作环境：" +
      suggestion.environment +
      "\n发展建议：" +
      suggestion.advice.join("；");

    result.hidden = false;
    message.textContent = "结果已生成。";
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetForm() {
    form.reset();
    result.hidden = true;
    lastResultText = "";
    message.textContent = "";
    form.querySelectorAll(".career-question").forEach(function (field) {
      field.classList.remove("is-missing");
    });
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderQuestions();
  updateProgress();

  form.addEventListener("change", function (event) {
    var fieldset = event.target.closest(".career-question");
    if (fieldset) {
      fieldset.classList.remove("is-missing");
    }
    message.textContent = "";
    updateProgress();
  });

  submitButton.addEventListener("click", function () {
    var data = collectResult();
    if (!data.complete) {
      message.textContent = "还有题目没有选择，请补齐后再生成结果。";
      var missingField = form.querySelectorAll(".career-question")[data.missingIndex];
      missingField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    renderResult(data);
  });

  resetButton.addEventListener("click", resetForm);

  copyButton.addEventListener("click", function () {
    if (!lastResultText) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastResultText).then(function () {
        message.textContent = "结果已复制。";
      });
      return;
    }

    var helper = document.createElement("textarea");
    helper.value = lastResultText;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    document.body.removeChild(helper);
    message.textContent = "结果已复制。";
  });
})();
