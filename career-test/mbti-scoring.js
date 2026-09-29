(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MbtiScoring = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var coreAxes = ["EI", "SN", "TF", "JP"];
  var extensionAxes = ["AO", "CH"];
  // A display heuristic, not an empirically calibrated confidence threshold.
  var closeThreshold = 0.25;

  function scoreAnswers(questions, answers, axisMeta) {
    var axes = {};
    var missingIndices = [];
    Object.keys(axisMeta).forEach(function (axis) {
      axes[axis] = { total: 0, max: 0, count: 0 };
    });

    questions.forEach(function (question, index) {
      var value = answers[index];
      var score = axes[question.axis];
      var meta = axisMeta[question.axis];
      score.max += 2;
      score.count += 1;
      if (!Number.isInteger(value) || value < -2 || value > 2) {
        missingIndices.push(index);
        return;
      }
      // Positive totals always point to the canonical right letter, even
      // when the two choices are reversed in the displayed question.
      var direction = question.rightLetter === meta.rightLetter ? 1 : -1;
      score.total += value * direction;
    });

    if (missingIndices.length) {
      return { complete: false, missingIndices: missingIndices };
    }

    Object.keys(axes).forEach(function (axis) {
      var score = axes[axis];
      var meta = axisMeta[axis];
      score.letter = score.total === 0 ? "X" : (score.total > 0 ? meta.rightLetter : meta.leftLetter);
      score.rightPercent = score.max ? Math.round((score.total + score.max) / (2 * score.max) * 100) : 50;
      score.leftPercent = 100 - score.rightPercent;
      score.isClose = score.max === 0 || Math.abs(score.total) / score.max < closeThreshold;
    });

    var type = coreAxes.map(function (axis) { return axes[axis].letter; }).join("");
    var candidateTypes = [""];
    coreAxes.forEach(function (axis) {
      var score = axes[axis];
      var letters = score.isClose ? [axisMeta[axis].leftLetter, axisMeta[axis].rightLetter] : [score.letter];
      var next = [];
      candidateTypes.forEach(function (prefix) {
        letters.forEach(function (letter) { next.push(prefix + letter); });
      });
      candidateTypes = next;
    });

    return {
      complete: true,
      type: type,
      extendedType: type + "-" + extensionAxes.map(function (axis) { return axes[axis].letter; }).join("-"),
      axes: axes,
      candidateTypes: candidateTypes,
      closeAxes: coreAxes.filter(function (axis) { return axes[axis].isClose; })
    };
  }

  return { scoreAnswers: scoreAnswers };
});
