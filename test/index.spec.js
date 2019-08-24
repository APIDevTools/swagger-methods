"use strict";

const swaggerMethods = require("../");
const swaggerSchema = require("swagger-schema-official/schema");
const httpMethods = require("methods");
const { expect } = require("chai");

describe("swagger-methods", () => {
  it("should be a non-empty array", () => {
    expect(swaggerMethods).to.be.an("array").with.length.above(0);
  });

  it("should be all lowercase strings", () => {
    swaggerMethods.forEach(function (method) {
      expect(method).to.be.a("string").and.equal(method.toLowerCase());
    });
  });

  it("should only have valid HTTP methods", () => {
    swaggerMethods.forEach(function (method) {
      expect(httpMethods).to.include(method);
    });
  });

  it("should match the Swagger 2.0 schema", () => {
    // "pathItem" is the Swagger object that defines the allowed HTTP methods
    // (see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#path-item-object)
    let pathItemProps = swaggerSchema.definitions.pathItem.properties;

    // We only care about the "operation" properties
    // (see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operationObject)
    let operations = Object.keys(pathItemProps).filter(function (key) {
      let pathItemProp = pathItemProps[key];
      return pathItemProp.$ref === "#/definitions/operation";
    });

    expect(swaggerMethods).to.have.same.members(operations);
  });
});
