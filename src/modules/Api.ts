/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerAsyncUpdateEmissionCalculationResponse {
  calculation_result?: number;
  request_id?: number;
}

export interface HandlerCreateStageRequest {
  description?: string;
  first_dimension_const: number;
  first_dimension_name: string;
  second_dimension_const: number;
  second_dimension_name: string;
  title: string;
}

export interface HandlerLoginRequest {
  password: string;
  username: string;
}

export interface HandlerLoginResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  user?: HandlerUserInfo;
}

export interface HandlerRefreshTokenRequest {
  refresh_token: string;
}

export interface HandlerRegisterRequest {
  password: string;
  role?: string;
  username: string;
}

export interface HandlerStageRequestDetailResponse {
  calculationResult?: number;
  created_at?: string;
  id?: number;
  product_name?: string;
  stage_request_to_stages?: HandlerStageRequestToStageDetailResponse[];
  status?: number;
}

export interface HandlerStageRequestInfoResponse {
  item_count?: number;
  request_id?: number;
}

export interface HandlerStageRequestToStageDetailResponse {
  first_dimension_const?: number;
  first_dimension_name?: string;
  image_url?: string;
  input_field_1?: number;
  input_field_2?: number;
  second_dimension_const?: number;
  second_dimension_name?: string;
  stage_id?: number;
  stage_title?: string;
}

export interface HandlerStageResponse {
  description?: string;
  first_dimension_const?: number;
  first_dimension_name?: string;
  id?: number;
  image_url?: string;
  second_dimension_const?: number;
  second_dimension_name?: string;
  title?: string;
}

export interface HandlerStagesFilterResponse {
  id?: number;
  image_url?: string;
  title?: string;
}

export interface HandlerStagesRequestsFilterResponse {
  calculationResult?: number;
  closedAt?: string;
  createdAt?: string;
  formedAt?: string;
  id?: number;
  moderatorID?: number;
  productName?: string;
  status?: number;
  userID?: number;
  username?: string;
}

export interface HandlerUpdateProfileRequest {
  password?: string;
  username?: string;
}

export interface HandlerUpdateStageRequest {
  description?: string;
  first_dimension_const?: number;
  first_dimension_name?: string;
  second_dimension_const?: number;
  second_dimension_name?: string;
  title?: string;
}

export interface HandlerUpdateStageRequestResponse {
  product_name?: string;
}

export interface HandlerUpdateStageToRequestConnection {
  input_field_1?: number;
  input_field_2?: number;
}

export interface HandlerUserInfo {
  id?: number;
  role?: string;
  username?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title IAD Backend API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @externalDocs https://swagger.io/resources/open-api/
 * @contact API Support <support@iad.example.com> (https://github.com/your-org/iad-backend)
 *
 * This is the backend API for IAD (Information and Analytical Data) system.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  stageRequestStages = {
    /**
     * @description Update stage connection details in a stage request
     *
     * @tags stage-request-stages
     * @name StagesUpdate
     * @summary Update stage in request
     * @request PUT:/stage-request-stages/{requestId}/stages/{stageId}
     * @secure
     */
    stagesUpdate: (
      requestId: number,
      stageId: number,
      request: HandlerUpdateStageToRequestConnection,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stage-request-stages/${requestId}/stages/${stageId}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove a stage from a stage request
     *
     * @tags stage-request-stages
     * @name StagesDelete
     * @summary Remove stage from request
     * @request DELETE:/stage-request-stages/{requestId}/stages/{stageId}
     * @secure
     */
    stagesDelete: (
      requestId: number,
      stageId: number,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stage-request-stages/${requestId}/stages/${stageId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  stageRequests = {
    /**
     * @description Get a list of stage requests with optional filtering
     *
     * @tags stage-requests
     * @name StageRequestsList
     * @summary Get stage requests
     * @request GET:/stage-requests
     * @secure
     */
    stageRequestsList: (
      query?: {
        /** Filter by status */
        status?: number;
        /** Filter by date from (YYYY-MM-DD) */
        date_from?: string;
        /** Filter by date to (YYYY-MM-DD) */
        date_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerStagesRequestsFilterResponse[], Record<string, any>>({
        path: `/stage-requests`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the emission calculation result for a stage request (called by external calculation service)
     *
     * @tags stage-requests
     * @name AsyncUpdateCalculationUpdate
     * @summary Asynchronously update emission calculation result
     * @request PUT:/stage-requests/asyncUpdateCalculation
     */
    asyncUpdateCalculationUpdate: (
      request: HandlerAsyncUpdateEmissionCalculationResponse,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stage-requests/asyncUpdateCalculation`,
        method: "PUT",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get information about current user's draft request
     *
     * @tags stage-requests
     * @name StageRequestInfoList
     * @summary Get draft request info
     * @request GET:/stage-requests/stageRequestInfo
     * @secure
     */
    stageRequestInfoList: (params: RequestParams = {}) =>
      this.request<HandlerStageRequestInfoResponse, Record<string, any>>({
        path: `/stage-requests/stageRequestInfo`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get detailed information about a specific stage request
     *
     * @tags stage-requests
     * @name StageRequestsDetail
     * @summary Get stage request by ID
     * @request GET:/stage-requests/{id}
     * @secure
     */
    stageRequestsDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerStageRequestDetailResponse, Record<string, any>>({
        path: `/stage-requests/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing stage request
     *
     * @tags stage-requests
     * @name StageRequestsUpdate
     * @summary Update stage request
     * @request PUT:/stage-requests/{id}
     * @secure
     */
    stageRequestsUpdate: (
      id: number,
      request: HandlerUpdateStageRequestResponse,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stage-requests/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a stage request
     *
     * @tags stage-requests
     * @name StageRequestsDelete
     * @summary Delete stage request
     * @request DELETE:/stage-requests/{id}
     * @secure
     */
    stageRequestsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stage-requests/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Form a draft stage request into a submitted request
     *
     * @tags stage-requests
     * @name FormUpdate
     * @summary Form stage request
     * @request PUT:/stage-requests/{id}/form
     * @secure
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stage-requests/${id}/form`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Reject a stage request (moderator action)
     *
     * @tags stage-requests
     * @name RejectUpdate
     * @summary Reject stage request
     * @request PUT:/stage-requests/{id}/reject
     * @secure
     */
    rejectUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stage-requests/${id}/reject`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Resolve a stage request (moderator action)
     *
     * @tags stage-requests
     * @name ResolveUpdate
     * @summary Resolve stage request
     * @request PUT:/stage-requests/{id}/resolve
     * @secure
     */
    resolveUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stage-requests/${id}/resolve`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  stages = {
    /**
     * No description
     *
     * @name StagesList
     * @request GET:/stages
     */
    stagesList: (params: RequestParams = {}) =>
      this.request<HandlerStagesFilterResponse[], Record<string, any>>({
        path: `/stages`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Create a new stage with the provided data
     *
     * @tags stages
     * @name StagesCreate
     * @summary Create a new stage
     * @request POST:/stages
     * @secure
     */
    stagesCreate: (
      request: HandlerCreateStageRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stages`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name StagesDetail
     * @request GET:/stages/{id}
     */
    stagesDetail: (id: string, params: RequestParams = {}) =>
      this.request<HandlerStageResponse, Record<string, any>>({
        path: `/stages/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Update an existing stage with new data
     *
     * @tags stages
     * @name StagesUpdate
     * @summary Update stage
     * @request PUT:/stages/{id}
     * @secure
     */
    stagesUpdate: (
      id: number,
      request: HandlerUpdateStageRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stages/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a stage by ID
     *
     * @tags stages
     * @name StagesDelete
     * @summary Delete stage
     * @request DELETE:/stages/{id}
     * @secure
     */
    stagesDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stages/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add a stage to the current user's draft request
     *
     * @tags stages
     * @name AddToRequestCreate
     * @summary Add stage to draft request
     * @request POST:/stages/{id}/add-to-request
     * @secure
     */
    addToRequestCreate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stages/${id}/add-to-request`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload and attach an image to a stage
     *
     * @tags stages
     * @name ImageCreate
     * @summary Add image to stage
     * @request POST:/stages/{id}/image
     * @secure
     */
    imageCreate: (
      id: number,
      data: {
        /** Stage image file */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stages/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Authenticate user and return JWT tokens
     *
     * @tags users
     * @name LoginCreate
     * @summary User login
     * @request POST:/users/login
     */
    loginCreate: (request: HandlerLoginRequest, params: RequestParams = {}) =>
      this.request<HandlerLoginResponse, Record<string, any>>({
        path: `/users/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout user (token invalidation)
     *
     * @tags users
     * @name LogoutCreate
     * @summary User logout
     * @request POST:/users/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/users/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get current user's profile information
     *
     * @tags users
     * @name ProfileList
     * @summary Get user profile
     * @request GET:/users/profile
     * @secure
     */
    profileList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/users/profile`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update current user's profile information
     *
     * @tags users
     * @name ProfileUpdate
     * @summary Update user profile
     * @request PUT:/users/profile
     * @secure
     */
    profileUpdate: (
      request: HandlerUpdateProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/users/profile`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get new access token using refresh token
     *
     * @tags users
     * @name RefreshCreate
     * @summary Refresh access token
     * @request POST:/users/refresh
     */
    refreshCreate: (
      request: HandlerRefreshTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerLoginResponse, Record<string, any>>({
        path: `/users/refresh`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new user account and automatically login
     *
     * @tags users
     * @name RegisterCreate
     * @summary Register a new user
     * @request POST:/users/register
     */
    registerCreate: (
      request: HandlerRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerLoginResponse, Record<string, any>>({
        path: `/users/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
