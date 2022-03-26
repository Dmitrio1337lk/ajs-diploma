import { calcTileType } from "../utils";

describe("calcTileType", () => {
  test("top-left", () => {
    expect(calcTileType(0, 5)).toBe("top-left");
  });
  test("top-right", () => {
    expect(calcTileType(4, 5)).toBe("top-right");
  });
  test("top", () => {
    expect(calcTileType(3, 5)).toBe("top");
  });
  test("left", () => {
    expect(calcTileType(5, 5)).toBe("left");
  });
  test("center", () => {
    expect(calcTileType(6, 5)).toBe("center");
  });
  test("right", () => {
    expect(calcTileType(9, 5)).toBe("right");
  });
  test("bottom-left", () => {
    expect(calcTileType(20, 5)).toBe("bottom-left");
  });
  test("bottom", () => {
    expect(calcTileType(21, 5)).toBe("bottom");
  });
  test("bottom-right", () => {
    expect(calcTileType(24, 5)).toBe("bottom-right");
  });
});
