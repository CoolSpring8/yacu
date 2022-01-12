import { jest } from "@jest/globals";
import { $, $$ } from "../dom";

jest.spyOn(console, "warn").mockImplementation(() => {
  /** no_op */
});

describe("dom", () => {
  afterEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  test("$", () => {
    expect($("#foo.bar")).toBeUndefined();

    const element = createFooBarElement();
    document.body.append(element);

    expect($("#foo.bar")).toBe(element);
  });

  test("$$", () => {
    expect($$("#foo.bar")).toBeUndefined();

    const element = createFooBarElement();
    const element2 = createFooBarElement();
    document.body.append(element, element2);

    const result = $$("#foo.bar");

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result).toContain(element);
    expect(result).toContain(element2);
  });
});

function createFooBarElement() {
  const element = document.createElement("div");
  element.id = "foo";
  element.className = "bar";
  return element;
}
