"use strict";

var swaggerMethods = require("../"),
    swaggerSchema = require("swagger-schema-official/schema"),
    httpMethods = require("methods"),
    expect = require("chai").expect;

describe("swagger-methods", function () {
  it("should be a non-empty array", function () {
    expect(swaggerMethods).to.be.an("array").with.length.above(0);
  });

  it("should be all lowercase strings", function () {
    swaggerMethods.forEach(function (method) {
      expect(method).to.be.a("string").and.equal(method.toLowerCase());
    });
  });

  it("should only have valid HTTP methods", function () {
    swaggerMethods.forEach(function (method) {
      expect(httpMethods).to.include(method);
    });
  });

  it("should match the Swagger 2.0 schema", function () {
    // "pathItem" is the Swagger object that defines the allowed HTTP methods
    // (see https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#path-item-object)
    var pathItemProps = swaggerSchema.definitions.pathItem.properties;

    // We only care about the "operation" properties
    // (see https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#operationObject)
    var operations = Object.keys(pathItemProps).filter(function (key) {
      var pathItemProp = pathItemProps[key];
      return pathItemProp.$ref === "#/definitions/operation";
    });

    expect(swaggerMethods).to.have.same.members(operations);
  });
});
