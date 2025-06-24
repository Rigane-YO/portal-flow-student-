
// Re-export from the hooks folder to maintain backward compatibility
import * as useToastModule from "@/hooks/use-toast";

export const useToast = useToastModule.useToast;
export const toast = useToastModule.toast;
