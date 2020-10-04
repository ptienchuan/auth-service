import faker from "faker";
import { extractObject } from "@/libs/utilities";

describe("Lib Utilities", () => {
  test("Function extractObject()", () => {
    const originalObject = {
      name: faker.random.word(),
      isActive: true,
      age: faker.random.number(30),
      description: faker.random.word(),
    };
    let extractedObject = extractObject(originalObject, ["name", "isActive"]);
    expect(extractedObject).toEqual({
      name: originalObject.name,
      isActive: originalObject.isActive,
    });

    extractedObject = extractObject(originalObject, [
      "name",
      "isActive",
      "age",
      "description",
    ]);
    expect(extractedObject).toEqual(originalObject);
  });
});
