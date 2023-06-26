// @generated by protoc-gen-es v1.2.1 with parameter "target=ts"
// @generated from file search_engine_people_parameters-v1.proto (package search_engine, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Keywords } from "./search_engine_companies_parameters-v1_pb.js";

/**
 * @generated from message search_engine.JobTitleScores
 */
export class JobTitleScores extends Message<JobTitleScores> {
  /**
   * @generated from field: optional float selectionThreshold = 1;
   */
  selectionThreshold?: number;

  /**
   * @generated from field: optional float exactMatchBonus = 2;
   */
  exactMatchBonus?: number;

  /**
   * @generated from field: optional float seniorityBonus = 3;
   */
  seniorityBonus?: number;

  /**
   * @generated from field: optional float departmentBonus = 4;
   */
  departmentBonus?: number;

  constructor(data?: PartialMessage<JobTitleScores>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "search_engine.JobTitleScores";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "selectionThreshold", kind: "scalar", T: 2 /* ScalarType.FLOAT */, opt: true },
    { no: 2, name: "exactMatchBonus", kind: "scalar", T: 2 /* ScalarType.FLOAT */, opt: true },
    { no: 3, name: "seniorityBonus", kind: "scalar", T: 2 /* ScalarType.FLOAT */, opt: true },
    { no: 4, name: "departmentBonus", kind: "scalar", T: 2 /* ScalarType.FLOAT */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): JobTitleScores {
    return new JobTitleScores().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): JobTitleScores {
    return new JobTitleScores().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): JobTitleScores {
    return new JobTitleScores().fromJsonString(jsonString, options);
  }

  static equals(a: JobTitleScores | PlainMessage<JobTitleScores> | undefined, b: JobTitleScores | PlainMessage<JobTitleScores> | undefined): boolean {
    return proto3.util.equals(JobTitleScores, a, b);
  }
}

/**
 * @generated from message search_engine.JobTitleFilter
 */
export class JobTitleFilter extends Message<JobTitleFilter> {
  /**
   * @generated from field: string jobTitle = 1;
   */
  jobTitle = "";

  /**
   * @generated from field: bool exactJobTitleMatch = 2;
   */
  exactJobTitleMatch = false;

  constructor(data?: PartialMessage<JobTitleFilter>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "search_engine.JobTitleFilter";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "jobTitle", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "exactJobTitleMatch", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): JobTitleFilter {
    return new JobTitleFilter().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): JobTitleFilter {
    return new JobTitleFilter().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): JobTitleFilter {
    return new JobTitleFilter().fromJsonString(jsonString, options);
  }

  static equals(a: JobTitleFilter | PlainMessage<JobTitleFilter> | undefined, b: JobTitleFilter | PlainMessage<JobTitleFilter> | undefined): boolean {
    return proto3.util.equals(JobTitleFilter, a, b);
  }
}

/**
 * @generated from message search_engine.PeopleFilters
 */
export class PeopleFilters extends Message<PeopleFilters> {
  /**
   * @generated from field: repeated string seniorities = 1;
   */
  seniorities: string[] = [];

  /**
   * @generated from field: repeated search_engine.JobTitleFilter jobTitleFilters = 2;
   */
  jobTitleFilters: JobTitleFilter[] = [];

  /**
   * @generated from field: repeated string departments = 3;
   */
  departments: string[] = [];

  /**
   * @generated from field: repeated string countries = 4;
   */
  countries: string[] = [];

  /**
   * @generated from field: repeated string includeIds = 5;
   */
  includeIds: string[] = [];

  /**
   * @generated from field: repeated string name = 6;
   */
  name: string[] = [];

  /**
   * @generated from field: optional search_engine.JobTitleScores jobTitleScores = 21;
   */
  jobTitleScores?: JobTitleScores;

  /**
   * @generated from field: repeated string notExists = 19;
   */
  notExists: string[] = [];

  /**
   * @generated from field: repeated string exists = 20;
   */
  exists: string[] = [];

  /**
   * @generated from field: repeated string excludeJobTitles = 26;
   */
  excludeJobTitles: string[] = [];

  /**
   * @generated from field: repeated string where = 18;
   */
  where: string[] = [];

  /**
   * @generated from field: bool verifiedEmail = 23;
   */
  verifiedEmail = false;

  /**
   * @generated from field: bool emailVerificationAttempted = 24;
   */
  emailVerificationAttempted = false;

  /**
   * @generated from field: bool emailVerificationNotAttempted = 25;
   */
  emailVerificationNotAttempted = false;

  /**
   * @generated from field: bool onePersonPerDomain = 27;
   */
  onePersonPerDomain = false;

  /**
   * @generated from field: optional search_engine.Keywords keywords = 28;
   */
  keywords?: Keywords;

  constructor(data?: PartialMessage<PeopleFilters>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "search_engine.PeopleFilters";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "seniorities", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: "jobTitleFilters", kind: "message", T: JobTitleFilter, repeated: true },
    { no: 3, name: "departments", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 4, name: "countries", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 5, name: "includeIds", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 21, name: "jobTitleScores", kind: "message", T: JobTitleScores, opt: true },
    { no: 19, name: "notExists", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 20, name: "exists", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 26, name: "excludeJobTitles", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 18, name: "where", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 23, name: "verifiedEmail", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 24, name: "emailVerificationAttempted", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 25, name: "emailVerificationNotAttempted", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 27, name: "onePersonPerDomain", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 28, name: "keywords", kind: "message", T: Keywords, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PeopleFilters {
    return new PeopleFilters().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PeopleFilters {
    return new PeopleFilters().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PeopleFilters {
    return new PeopleFilters().fromJsonString(jsonString, options);
  }

  static equals(a: PeopleFilters | PlainMessage<PeopleFilters> | undefined, b: PeopleFilters | PlainMessage<PeopleFilters> | undefined): boolean {
    return proto3.util.equals(PeopleFilters, a, b);
  }
}

