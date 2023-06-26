// @generated by protoc-gen-connect-es v0.10.1 with parameter "target=ts"
// @generated from file search_engine-v1.proto (package search_engine, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { AutoCompletionRequest, AutoCompletionResponse, CreatePointInTimeRequest, CreatePointInTimeResponse, DailyMigrateCompaniesParameters, DailyMigrateCompaniesResponse, DeleteOneCompanyRequest, DeleteOneCompanyResponse, DepartmentSizesRequest, DepartmentSizesResponse, GetCompaniesDistributionParameters, GetCompaniesDistributionResponse, GetCompanyRequest, GetCompanyResponse, GetDataFieldsRequest, GetDataFieldsResponse, GetPeopleEmailMetadataParameters, GetPeopleEmailMetadataResponse, JobTitleCountRequest, JobTitleCountResponse, KeywordMatchRequest, KeywordMatchResponse, MatchUsersRequest, MatchUsersResponse, MigrateCompaniesParameters, MigrateCompaniesResponse, MigrateOneCompanyRequest, MigrateOneCompanyResponse, MigratePeopleCountParameters, MigratePeopleCountResponse, MigratePeopleParameters, MigratePeopleResponse, PeopleCountRequest, PeopleCountResponse, PrepareSearchCompaniesResponse, RecrawlSearchResponse, SearchCompaniesParameters, SearchCompaniesResponse, SearchPeopleParameters, SearchPeopleResponse, UpdatePeopleDataRequest, UpdatePeopleDataResponse, VerifyEmailsRequest, VerifyEmailsResponse } from "./search_engine-v1_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service search_engine.SearchEngine
 */
export const SearchEngine = {
  typeName: "search_engine.SearchEngine",
  methods: {
    /**
     * @generated from rpc search_engine.SearchEngine.SearchPeople
     */
    searchPeople: {
      name: "SearchPeople",
      I: SearchPeopleParameters,
      O: SearchPeopleResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.SearchCompanies
     */
    searchCompanies: {
      name: "SearchCompanies",
      I: SearchCompaniesParameters,
      O: SearchCompaniesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.GetCompaniesDistribution
     */
    getCompaniesDistribution: {
      name: "GetCompaniesDistribution",
      I: GetCompaniesDistributionParameters,
      O: GetCompaniesDistributionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.PrepareSearchCompanies
     */
    prepareSearchCompanies: {
      name: "PrepareSearchCompanies",
      I: SearchCompaniesParameters,
      O: PrepareSearchCompaniesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.GetAutoCompletion
     */
    getAutoCompletion: {
      name: "GetAutoCompletion",
      I: AutoCompletionRequest,
      O: AutoCompletionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.GetCompany
     */
    getCompany: {
      name: "GetCompany",
      I: GetCompanyRequest,
      O: GetCompanyResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.VerifyEmails
     */
    verifyEmails: {
      name: "VerifyEmails",
      I: VerifyEmailsRequest,
      O: VerifyEmailsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.MatchKeyword
     */
    matchKeyword: {
      name: "MatchKeyword",
      I: KeywordMatchRequest,
      O: KeywordMatchResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.CreatePointInTime
     */
    createPointInTime: {
      name: "CreatePointInTime",
      I: CreatePointInTimeRequest,
      O: CreatePointInTimeResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.UpdatePeopleData
     */
    updatePeopleData: {
      name: "UpdatePeopleData",
      I: UpdatePeopleDataRequest,
      O: UpdatePeopleDataResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.JobTitleCount
     */
    jobTitleCount: {
      name: "JobTitleCount",
      I: JobTitleCountRequest,
      O: JobTitleCountResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.PeopleCount
     */
    peopleCount: {
      name: "PeopleCount",
      I: PeopleCountRequest,
      O: PeopleCountResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.RecrawlSearch
     */
    recrawlSearch: {
      name: "RecrawlSearch",
      I: SearchCompaniesParameters,
      O: RecrawlSearchResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.MigrateCompanies
     */
    migrateCompanies: {
      name: "MigrateCompanies",
      I: MigrateCompaniesParameters,
      O: MigrateCompaniesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.DailyMigrateCompanies
     */
    dailyMigrateCompanies: {
      name: "DailyMigrateCompanies",
      I: DailyMigrateCompaniesParameters,
      O: DailyMigrateCompaniesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.MigratePeople
     */
    migratePeople: {
      name: "MigratePeople",
      I: MigratePeopleParameters,
      O: MigratePeopleResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.MigratePeopleCount
     */
    migratePeopleCount: {
      name: "MigratePeopleCount",
      I: MigratePeopleCountParameters,
      O: MigratePeopleCountResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.GetPeopleEmailMetadata
     */
    getPeopleEmailMetadata: {
      name: "GetPeopleEmailMetadata",
      I: GetPeopleEmailMetadataParameters,
      O: GetPeopleEmailMetadataResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.DepartmentSizes
     */
    departmentSizes: {
      name: "DepartmentSizes",
      I: DepartmentSizesRequest,
      O: DepartmentSizesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.MatchUsers
     */
    matchUsers: {
      name: "MatchUsers",
      I: MatchUsersRequest,
      O: MatchUsersResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.MigrateOneCompany
     */
    migrateOneCompany: {
      name: "MigrateOneCompany",
      I: MigrateOneCompanyRequest,
      O: MigrateOneCompanyResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.DeleteOneCompany
     */
    deleteOneCompany: {
      name: "DeleteOneCompany",
      I: DeleteOneCompanyRequest,
      O: DeleteOneCompanyResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc search_engine.SearchEngine.GetDataFields
     */
    getDataFields: {
      name: "GetDataFields",
      I: GetDataFieldsRequest,
      O: GetDataFieldsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;
