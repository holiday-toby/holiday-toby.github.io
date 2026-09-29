const test = require('node:test');
const assert = require('node:assert/strict');
const { scoreAnswers } = require('./mbti-scoring.js');
const { questions, axisMeta } = require('./mbti-data.js');

const basicAxes = ['EI', 'SN', 'TF', 'JP'];
const allAxes = [...basicAxes, 'AO', 'CH'];
const types = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];
const fixtureMeta = {
  EI: { leftLetter: 'I', rightLetter: 'E' },
  SN: { leftLetter: 'S', rightLetter: 'N' },
  TF: { leftLetter: 'F', rightLetter: 'T' },
  JP: { leftLetter: 'P', rightLetter: 'J' },
  AO: { leftLetter: 'A', rightLetter: 'O' },
  CH: { leftLetter: 'C', rightLetter: 'H' }
};
const fixtureQuestions = allAxes.flatMap((axis) => [
  { axis, ...fixtureMeta[axis] },
  { axis, leftLetter: fixtureMeta[axis].rightLetter, rightLetter: fixtureMeta[axis].leftLetter }
]);

function answersForType(bank, type, ao = 'A', ch = 'C') {
  const letters = { EI: type[0], SN: type[1], TF: type[2], JP: type[3], AO: ao, CH: ch };
  return bank.map((question) => {
    assert.ok([question.leftLetter, question.rightLetter].includes(letters[question.axis]));
    return question.leftLetter === letters[question.axis] ? -2 : 2;
  });
}

test('all-neutral answers remain balanced instead of defaulting to ENTJ', () => {
  const result = scoreAnswers(fixtureQuestions, Array(12).fill(0), fixtureMeta);

  assert.equal(result.complete, true);
  assert.equal(result.type, 'XXXX');
  assert.equal(result.extendedType, 'XXXX-X-X');
  assert.deepEqual(result.closeAxes, basicAxes);
  assert.deepEqual([...result.candidateTypes].sort(), [...types].sort());
  for (const axis of allAxes) {
    assert.deepEqual(result.axes[axis], {
      total: 0, max: 4, count: 2, letter: 'X',
      leftPercent: 50, rightPercent: 50, isClose: true
    });
  }
});

test('missing and invalid answers cannot silently become neutral answers', () => {
  const answers = [null, undefined, NaN, Infinity, -Infinity, '2', 3, -3, 0.5, true, 0, 2];
  const result = scoreAnswers(fixtureQuestions, answers, fixtureMeta);

  assert.equal(result.complete, false);
  assert.deepEqual(result.missingIndices, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(result.type, undefined);

  const omitted = scoreAnswers(fixtureQuestions, [], fixtureMeta);
  assert.equal(omitted.complete, false);
  assert.deepEqual(omitted.missingIndices, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
});

test('every integer on the five-point scale is a valid answer, including zero', () => {
  for (const value of [-2, -1, 0, 1, 2]) {
    assert.equal(scoreAnswers(fixtureQuestions, Array(12).fill(value), fixtureMeta).complete, true);
  }
});

test('reversing both the options and selected side preserves scores', () => {
  const answers = [2, -2, -2, 2, 1, -1, -1, 1, 2, -2, -2, 2];
  const reversed = fixtureQuestions.map((question) => ({
    ...question, leftLetter: question.rightLetter, rightLetter: question.leftLetter
  }));
  const original = scoreAnswers(fixtureQuestions, answers, fixtureMeta);
  const flipped = scoreAnswers(reversed, answers.map((answer) => -answer), fixtureMeta);

  assert.deepEqual(flipped, original);
  assert.equal(original.type, 'ESTP');
  assert.equal(original.extendedType, 'ESTP-O-C');
  assert.deepEqual(original.axes.EI, {
    total: 4, max: 4, count: 2, letter: 'E',
    leftPercent: 0, rightPercent: 100, isClose: false
  });
  assert.equal(original.axes.SN.total, -4);
  assert.equal(original.axes.SN.leftPercent, 100);
  assert.equal(original.axes.SN.rightPercent, 0);
  assert.equal(original.axes.TF.total, 2);
  assert.equal(original.axes.TF.leftPercent, 25);
  assert.equal(original.axes.TF.rightPercent, 75);
});

test('each axis uses its own question count for the maximum and percentage', () => {
  const bank = [
    ...fixtureQuestions,
    { axis: 'EI', leftLetter: 'I', rightLetter: 'E' },
    { axis: 'EI', leftLetter: 'E', rightLetter: 'I' }
  ];
  const answers = [2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 0, 0];
  const result = scoreAnswers(bank, answers, fixtureMeta);

  assert.deepEqual(result.axes.EI, {
    total: 4, max: 8, count: 4, letter: 'E',
    leftPercent: 25, rightPercent: 75, isClose: false
  });
  assert.equal(result.axes.SN.max, 4);
  assert.equal(result.axes.SN.count, 2);
  assert.equal(result.axes.SN.rightPercent, 100);
});

test('near-balanced axes offer both candidates but the 25 percent boundary does not', () => {
  const bank = [
    ...fixtureQuestions,
    { axis: 'EI', leftLetter: 'I', rightLetter: 'E' },
    { axis: 'EI', leftLetter: 'E', rightLetter: 'I' }
  ];
  const answers = [1, 0, -2, 2, 2, -2, 2, -2, -2, 2, -2, 2, 0, 0];
  const close = scoreAnswers(bank, answers, fixtureMeta);

  assert.equal(close.type, 'ESTJ');
  assert.equal(close.axes.EI.total, 1);
  assert.equal(close.axes.EI.max, 8);
  assert.equal(close.axes.EI.isClose, true);
  assert.deepEqual(close.closeAxes, ['EI']);
  assert.deepEqual([...close.candidateTypes].sort(), ['ESTJ', 'ISTJ']);

  answers[0] = 2;
  const boundary = scoreAnswers(bank, answers, fixtureMeta);
  assert.equal(boundary.axes.EI.isClose, false);
  assert.deepEqual(boundary.closeAxes, []);
  assert.deepEqual(boundary.candidateTypes, ['ESTJ']);

  answers[0] = 0;
  const tied = scoreAnswers(bank, answers, fixtureMeta);
  assert.equal(tied.type, 'XSTJ');
  assert.deepEqual([...tied.candidateTypes].sort(), ['ESTJ', 'ISTJ']);
});

test('real question bank produces all 16 basic types and four extensions each', () => {
  const results = new Set();
  for (const type of types) {
    for (const [ao, ch] of [['A', 'C'], ['A', 'H'], ['O', 'C'], ['O', 'H']]) {
      const result = scoreAnswers(questions, answersForType(questions, type, ao, ch), axisMeta);
      assert.equal(result.complete, true);
      assert.equal(result.type, type);
      assert.equal(result.extendedType, `${type}-${ao}-${ch}`);
      assert.deepEqual(result.closeAxes, []);
      assert.deepEqual(result.candidateTypes, [type]);
      for (const axis of allAxes) {
        assert.equal(Math.abs(result.axes[axis].total), result.axes[axis].max);
      }
      results.add(result.extendedType);
    }
  }
  assert.equal(results.size, 64);
});

test('changing only hidden dimensions leaves the four basic scores unchanged', () => {
  const ac = scoreAnswers(questions, answersForType(questions, 'INFP', 'A', 'C'), axisMeta);
  const oh = scoreAnswers(questions, answersForType(questions, 'INFP', 'O', 'H'), axisMeta);

  for (const axis of basicAxes) assert.deepEqual(ac.axes[axis], oh.axes[axis]);
  assert.equal(ac.type, 'INFP');
  assert.equal(oh.type, 'INFP');
  assert.equal(ac.extendedType, 'INFP-A-C');
  assert.equal(oh.extendedType, 'INFP-O-H');
  assert.deepEqual(ac.candidateTypes, oh.candidateTypes);

  const answers = answersForType(questions, 'INFP', 'A', 'C');
  questions.forEach((question, index) => {
    if (question.axis === 'AO' || question.axis === 'CH') answers[index] = 0;
  });
  const hiddenTies = scoreAnswers(questions, answers, axisMeta);
  assert.equal(hiddenTies.extendedType, 'INFP-X-X');
  assert.deepEqual(hiddenTies.closeAxes, []);
  assert.deepEqual(hiddenTies.candidateTypes, ['INFP']);
});

test('expanded bank keeps each dimension and question direction balanced', () => {
  assert.equal(questions.length, 64);
  assert.equal(questions.filter((question) => basicAxes.includes(question.axis)).length, 48);
  assert.equal(new Set(questions.map((question) => question.prompt)).size, 64);

  for (const axis of allAxes) {
    const bank = questions.filter((question) => question.axis === axis);
    const expectedCount = basicAxes.includes(axis) ? 12 : 8;
    assert.equal(bank.length, expectedCount, `${axis} question count`);
    assert.equal(bank.filter((question) => question.leftLetter === axisMeta[axis].leftLetter).length,
      expectedCount / 2, `${axis} option direction balance`);
    for (const question of bank) {
      assert.deepEqual([question.leftLetter, question.rightLetter].sort(),
        [axisMeta[axis].leftLetter, axisMeta[axis].rightLetter].sort());
      assert.ok(question.prompt && question.left && question.right, `${axis} has complete visible wording`);
    }
  }
  const neutral = scoreAnswers(questions, Array(64).fill(0), axisMeta);
  assert.equal(neutral.type, 'XXXX');
  for (const axis of basicAxes) assert.equal(neutral.axes[axis].max, 24);
  for (const axis of ['AO', 'CH']) assert.equal(neutral.axes[axis].max, 16);
});
