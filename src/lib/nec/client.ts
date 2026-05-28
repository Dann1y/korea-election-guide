// 공통 fetch wrapper.
// 모든 NEC OpenAPI는 동일 base 사용. 차이점은 service/method path.
// 응답 형식도 표준: { response: { header, body: { items: { item: [] }, ... } } }

export const NEC_BASE = "https://apis.data.go.kr/9760000";

export interface NECError {
  code: string;
  message: string;
}

export interface NECListResponse<T> {
  items: T[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}

interface FetchArgs {
  service: string; // e.g. "CommonCodeService"
  method: string; // e.g. "getCommonSgCodeList"
  serviceKey: string;
  params?: Record<string, string | number | undefined>;
}

export async function necFetch<T>(args: FetchArgs): Promise<NECListResponse<T>> {
  const url = new URL(`${NEC_BASE}/${args.service}/${args.method}`);
  url.searchParams.set("ServiceKey", args.serviceKey);
  url.searchParams.set("resultType", "json");
  for (const [k, v] of Object.entries(args.params ?? {})) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`NEC ${args.service} HTTP ${res.status}`);
  }
  const json = await res.json();

  // 공공데이터포털 표준 에러 응답
  if (json?.OpenAPI_ServiceResponse) {
    const reason =
      json.OpenAPI_ServiceResponse?.cmmMsgHeader?.returnAuthMsg ?? "UNKNOWN";
    throw new Error(`NEC ${args.service} auth error: ${reason}`);
  }
  // 제공기관 에러
  if (json?.result?.code && String(json.result.code).startsWith("ERROR-")) {
    throw new Error(`NEC ${args.service} error: ${json.result.message}`);
  }

  const header = json?.response?.header;
  const body = json?.response?.body ?? {};
  if (
    header?.resultCode &&
    header.resultCode !== "INFO-00" &&
    header.resultCode !== "00"
  ) {
    throw new Error(
      `NEC ${args.service} ${header.resultCode}: ${header.resultMsg}`,
    );
  }

  const raw = body?.items?.item;
  const items: T[] = !raw ? [] : Array.isArray(raw) ? raw : [raw];

  return {
    items,
    totalCount: Number(body.totalCount ?? items.length),
    pageNo: Number(body.pageNo ?? 1),
    numOfRows: Number(body.numOfRows ?? items.length),
  };
}

// 환경변수에서 키 읽기 + 빈 키 가드
export function getKey(envName: string): string | undefined {
  const env = import.meta.env as unknown as Record<string, string | undefined>;
  const v = env[envName];
  return v && v.trim() ? v.trim() : undefined;
}
