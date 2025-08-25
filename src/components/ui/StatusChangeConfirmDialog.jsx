import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

const StatusChangeConfirmDialog = ({ 
  isOpen, 
  onOpenChange, 
  statusValue, 
  onConfirm, 
  onCancel 
}) => {
  const getDialogContent = () => {
    switch (statusValue) {
      case "Won":
        return {
          title: "Confirm Status Change to Won",
          description: "Changing the Status to 'Won' will change the Stage to 'Closed Won' and Probability to 100%. Please confirm.",
          confirmText: "Confirm Won Status",
          cancelText: "Cancel"
        };
      case "Lost":
        return {
          title: "Confirm Status Change to Lost", 
          description: "Changing the Status to 'Lost' will change the Stage to 'Closed Lost' and Probability to 0%. Please confirm.",
          confirmText: "Confirm Lost Status",
          cancelText: "Cancel"
        };
      default:
        return {
          title: "Confirm Status Change",
          description: "Are you sure you want to change the status?",
          confirmText: "Confirm",
          cancelText: "Cancel"
        };
    }
  };

  const content = getDialogContent();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {content.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {content.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {content.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {content.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusChangeConfirmDialog; 