import { useEffect, useState } from "react";
import {
  fetchElectionStatuses,
  hasNECKey,
  type ElectionStatus,
} from "@/lib/nec";

interface State {
  data: ElectionStatus[];
  loading: boolean;
  error?: string;
  hasKey: boolean;
}

export function useElectionStatuses(): State {
  const [state, setState] = useState<State>({
    data: [],
    loading: hasNECKey(),
    hasKey: hasNECKey(),
  });

  useEffect(() => {
    if (!hasNECKey()) return;
    let cancelled = false;
    fetchElectionStatuses({ numOfRows: 100 })
      .then((res) => {
        if (cancelled) return;
        setState({ data: res.items, loading: false, hasKey: true });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setState({
          data: [],
          loading: false,
          hasKey: true,
          error: err.message,
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
