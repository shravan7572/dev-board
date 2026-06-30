import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getreaction, addreaction } from "../api/reaction";

export function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem("devboard_visitor_id");
    if (!visitorId) {
        visitorId = "vis_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("devboard_visitor_id", visitorId);
    }
    return visitorId;
}

export function useReactions(username) {
    const visitorId = getOrCreateVisitorId();
    return useQuery({
        queryKey: ["reactions", username, visitorId],
        queryFn: () => getreaction(username, visitorId),
        enabled: !!username,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}

export function useToggleReaction(username) {
    const queryClient = useQueryClient();
    const visitorId = getOrCreateVisitorId();
    return useMutation({
        mutationFn: (type) => addreaction(username, type, visitorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reactions", username] });
        },
    });
}
