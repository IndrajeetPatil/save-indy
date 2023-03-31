import questions from "../scripts/questions-db.js";

describe("questions in the database are as expected", () => {
  it("there are no duplicates", () => {
    const questionsSet = new Set(questions.map((item) => item.question));
    expect(questionsSet.size).toBe(questions.length);
  });
});
