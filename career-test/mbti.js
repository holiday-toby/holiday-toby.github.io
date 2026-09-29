(function () {
  "use strict";

  var form = document.getElementById("mbtiForm");
  if (!form || !window.MbtiData || !window.MbtiScoring) return;

  var questions = window.MbtiData.questions;
  var scale = window.MbtiData.scale;
  var axisMeta = window.MbtiData.axisMeta;
  var suggestions = window.MbtiData.suggestions;
  var pageSize = 8;
  var pageCount = Math.ceil(questions.length / pageSize);
  var currentPage = 0;
  var lastResultText = "";
  var fields;
  var submitButton = document.getElementById("submitMbti");
  var previousButton = document.getElementById("previousMbti");
  var nextButton = document.getElementById("nextMbti");
  var message = document.getElementById("mbtiMessage");
  var result = document.getElementById("mbtiResult");
  var copyMessage = document.getElementById("copyMbtiMessage");
  var pageTitle = document.getElementById("questionPageTitle");
  var coreAxes = ["EI", "SN", "TF", "JP"];
  var extensionAxes = ["AO", "CH"];
  var captions = ["明显偏前", "略偏前", "两者相近", "略偏后", "明显偏后"];
  var genericSuggestion = {
    summary: "部分维度尚未分化，暂不指定唯一的四字母类型。先结合具体场景观察自己，再参考相邻类型。",
    careers: ["从感兴趣的任务出发，安排一次小项目或岗位访谈", "对照实际技能、价值观和工作条件筛选方向"],
    environment: "记录哪些任务和协作方式让你投入、哪些让你疲惫，用真实体验选择工作环境。",
    advice: ["回想近半年不同场景中的自然反应。", "区分自己的偏好与岗位要求、熟练程度。", "间隔一段时间复测，比较临界维度的变化。"]
  };
  var extensionDescriptions = {
    A: "A 果断笃定：作出选择后较容易定下来并继续行动；也可留意何时需要重新评估。",
    O: "O 审慎易纠结：较常反复比较与复盘；可以为可逆的小决定设定思考时限。",
    C: "C 克制表达：倾向含蓄地传递关心与情绪；这不代表冷漠或缺乏感受。",
    H: "H 热情表达：倾向直接让对方感受到关心与情绪；这不代表更外向。"
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function renderQuestions() {
    form.innerHTML = questions.map(function (question, index) {
      var options = scale.map(function (option, optionIndex) {
        var optionLabel = option.value < 0 ? question.left : question.right;
        var accessibleLabel = option.value === 0 ? option.label : option.label + "：" + optionLabel;
        return '<label class="career-scale-option" data-value="' + option.value +
          '" data-strength="' + option.strength + '">' +
          '<input type="radio" name="q' + index + '" value="' + option.value +
          '" aria-label="' + escapeHtml(accessibleLabel) + '">' +
          '<span aria-hidden="true"></span><em class="career-scale-caption" aria-hidden="true">' +
          captions[optionIndex] + '</em></label>';
      }).join("");
      return '<fieldset class="career-question" data-axis="' + question.axis + '">' +
        '<legend><span>' + String(index + 1).padStart(2, "0") + '</span>' + escapeHtml(question.prompt) +
        '</legend><div class="career-choice-labels"><strong>' + escapeHtml(question.left) +
        '</strong><strong>' + escapeHtml(question.right) + '</strong></div>' +
        '<div class="career-scale">' + options + '</div></fieldset>';
    }).join("");
    fields = Array.from(form.querySelectorAll(".career-question"));
  }

  function readAnswers() {
    return questions.map(function (_, index) {
      var selected = form.querySelector('input[name="q' + index + '"]:checked');
      return selected ? Number(selected.value) : null;
    });
  }

  function updateProgress() {
    var answered = form.querySelectorAll("input:checked").length;
    document.getElementById("answeredCount").textContent = answered + " / " + questions.length;
    document.getElementById("careerProgressBar").style.width = Math.round(answered / questions.length * 100) + "%";
  }

  function showPage(page, moveFocus) {
    currentPage = page;
    fields.forEach(function (field, index) {
      field.hidden = Math.floor(index / pageSize) !== currentPage;
    });
    var isExtension = extensionAxes.indexOf(questions[page * pageSize].axis) !== -1;
    pageTitle.textContent = (isExtension ? "隐藏人格 · 扩展观察" : "基础偏好") +
      " · 第 " + (page + 1) + " / " + pageCount + " 组";
    document.getElementById("questionPageHint").textContent = isExtension ?
      "最后 16 题分别观察 A–O 决策笃定度与 C–H 情感表达，独立计分，不改变基础四字母。" :
      "按近半年大多数时候的自然反应作答，不必选择理想中的自己。每组 8 题，可以返回修改。";
    previousButton.disabled = page === 0;
    nextButton.hidden = page === pageCount - 1;
    submitButton.hidden = page !== pageCount - 1;
    nextButton.textContent = page === 5 ? "进入隐藏人格测试" : "下一组";
    if (moveFocus) {
      pageTitle.focus({ preventScroll: true });
      pageTitle.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function highlightMissing(indices) {
    fields.forEach(function (field, index) {
      field.classList.toggle("is-missing", indices.indexOf(index) !== -1);
    });
    if (!indices.length) return;
    showPage(Math.floor(indices[0] / pageSize), false);
    message.textContent = "还有 " + indices.length + " 题未选择，请补齐后继续。";
    var missingField = fields[indices[0]];
    missingField.querySelector("input").focus({ preventScroll: true });
    missingField.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function axisDescription(axis, score) {
    var meta = axisMeta[axis];
    var tendency = score.letter === "X" ? "未分化（两侧平分）" :
      (score.isClose ? "接近中间，略偏 " : "本次倾向 ") + score.letter;
    return meta.summary + "：" + tendency + "；" + meta.left + " " + score.leftPercent +
      "% / " + meta.right + " " + score.rightPercent + "%";
  }

  function renderAxes(axes, data, target) {
    document.getElementById(target).innerHTML = axes.map(function (axis) {
      var meta = axisMeta[axis];
      var score = data.axes[axis];
      return '<div class="career-axis-card"><div><strong>' + meta.summary +
        '</strong><span>' + meta.left + ' / ' + meta.right + '</span></div>' +
        '<div class="career-axis-meter" aria-hidden="true"><span style="left:' + score.rightPercent +
        '%"></span></div><p>' + axisDescription(axis, score) + '</p></div>';
    }).join("");
  }

  function renderList(id, items) {
    document.getElementById(id).innerHTML = items.map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("");
  }

  function renderResult(data) {
    var suggestion = suggestions[data.type] || genericSuggestion;
    var caution = data.closeAxes.length ?
      "接近中间的维度：" + data.closeAxes.join("、") + "。当前字母仅供参考，请结合相邻类型和生活中的例子理解自己。" :
      "本次四维作答有一定方向，仍需结合生活中的例子确认偏好；结果不能决定你的能力或职业。";
    var neighbors = data.closeAxes.length ? "可对照的相邻类型（不分排名）：" + data.candidateTypes.join("、") : "";
    var extensionSummary = extensionAxes.map(function (axis) {
      var score = data.axes[axis];
      if (score.letter === "X") return axisMeta[axis].summary + "两侧平分，后缀 X 表示尚未分化。";
      if (score.isClose) return axisMeta[axis].summary + "接近中间，后缀 " + score.letter +
        " 仅表示本次略偏这一侧，可同时表现出两侧特点。";
      return extensionDescriptions[score.letter];
    }).join(" ");

    document.getElementById("resultTitle").textContent = "你的四维倾向：" + data.type;
    document.getElementById("resultTypeBadge").textContent = data.extendedType;
    document.getElementById("resultSummary").textContent = suggestion.summary;
    document.getElementById("resultCaution").textContent = caution;
    document.getElementById("neighborTypes").textContent = neighbors;
    document.getElementById("neighborTypes").hidden = !neighbors;
    document.getElementById("extensionSummary").textContent = extensionSummary;
    renderAxes(coreAxes, data, "axisGrid");
    renderAxes(extensionAxes, data, "extensionGrid");
    renderList("careerList", suggestion.careers);
    document.getElementById("careerEnvironment").textContent = suggestion.environment;
    renderList("careerAdvice", suggestion.advice);

    lastResultText = [
      "本站性格偏好自测：" + data.extendedType,
      "四维倾向：" + data.type,
      suggestion.summary,
      caution,
      neighbors,
      coreAxes.map(function (axis) { return axisDescription(axis, data.axes[axis]); }).join("\n"),
      "隐藏人格扩展（非官方 MBTI 维度）：",
      extensionAxes.map(function (axis) { return axisDescription(axis, data.axes[axis]); }).join("\n"),
      extensionSummary,
      "适合探索的职业：" + suggestion.careers.join("、"),
      "工作环境：" + suggestion.environment,
      "发展建议：" + suggestion.advice.join("；"),
      "X 表示平分、尚未分化。百分比为本次作答倾向分，不是准确率。本站原创自测未经标准化信效度验证，结果仅供自我观察和职业探索。"
    ].filter(Boolean).join("\n");
    result.hidden = false;
    copyMessage.textContent = "";
    message.textContent = "结果已生成。修改答案后需重新生成。";
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function invalidateResult() {
    result.hidden = true;
    lastResultText = "";
    copyMessage.textContent = "";
  }

  function resetForm() {
    form.reset();
    invalidateResult();
    message.textContent = "";
    fields.forEach(function (field) { field.classList.remove("is-missing"); });
    updateProgress();
    showPage(0, true);
  }

  function fallbackCopy(text) {
    var helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    var copied = false;
    try { copied = document.execCommand("copy"); } catch (_) { copied = false; }
    document.body.removeChild(helper);
    document.getElementById("copyMbtiResult").focus({ preventScroll: true });
    return copied;
  }

  renderQuestions();
  updateProgress();
  showPage(0, false);

  form.addEventListener("submit", function (event) { event.preventDefault(); });
  form.addEventListener("change", function (event) {
    var fieldset = event.target.closest(".career-question");
    if (!fieldset) return;
    var hadResult = !result.hidden;
    fieldset.classList.remove("is-missing");
    invalidateResult();
    message.textContent = hadResult ? "答案已修改，请到最后一组重新生成结果。" : "";
    updateProgress();
  });

  previousButton.addEventListener("click", function () {
    if (currentPage > 0) {
      message.textContent = "";
      showPage(currentPage - 1, true);
    }
  });

  nextButton.addEventListener("click", function () {
    var answers = readAnswers();
    var missing = [];
    for (var index = currentPage * pageSize; index < Math.min((currentPage + 1) * pageSize, questions.length); index++) {
      if (answers[index] === null) missing.push(index);
    }
    highlightMissing(missing);
    if (missing.length) return;
    message.textContent = "";
    if (currentPage < pageCount - 1) showPage(currentPage + 1, true);
  });

  submitButton.addEventListener("click", function () {
    var data = window.MbtiScoring.scoreAnswers(questions, readAnswers(), axisMeta);
    highlightMissing(data.complete ? [] : data.missingIndices);
    if (data.complete) renderResult(data);
  });

  document.getElementById("resetMbti").addEventListener("click", resetForm);
  document.getElementById("copyMbtiResult").addEventListener("click", async function () {
    if (!lastResultText) return;
    var textToCopy = lastResultText;
    var copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        copied = true;
      }
    } catch (_) { copied = false; }
    if (!copied) copied = fallbackCopy(textToCopy);
    if (textToCopy === lastResultText) {
      copyMessage.textContent = copied ? "结果已复制。" : "复制未成功，请手动选择结果文字复制。";
    }
  });
})();
