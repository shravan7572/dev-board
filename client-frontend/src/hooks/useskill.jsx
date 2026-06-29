import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getskills, addskills, deleteskills } from "../api/skills";

export function useSkills(username) {
    return useQuery({
        queryKey: ["skills", username],
        queryFn: () => getskills(username),
        enabled: !!username,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}

export function useAddSkill(username) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addskills,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills", username] });
        },
    });
}

export function useDeleteSkill(username) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteskills,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills", username] });
        },
    });
}
